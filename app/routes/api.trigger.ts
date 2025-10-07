import { ActionFunction } from "@remix-run/node";
import prisma from "../db.server";
import { getValidSession, getOfflineSession } from "../utils/sessionManager.server";
import { AnalyticsCollector } from "../services/analyticsCollector.server";
import { AnalyticsEmailService } from "../services/emailService.server";

export const action: ActionFunction = async ({ request }) => {
  if (request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  console.log('🔧 Manual trigger - bypassing schedule check');

  try {
    const shops = await prisma.storeEmailSettings.findMany({
      where: { enabled: true, scheduleEnabled: true },
    });

    let sentCount = 0;

    for (const store of shops) {
      try {
        const session = await getValidSession(store.shop) || await getOfflineSession(store.shop);
        if (!session) {
          console.log(`❌ No session for: ${store.shop}`);
          continue;
        }

        const collector = new AnalyticsCollector(session);
        const analyticsData = await collector.collectDailyAnalytics();
        
        if (analyticsData.ordersLoaded === 0) {
          console.log(`📭 No data for: ${store.shop}`);
          continue;
        }

        const emailService = new AnalyticsEmailService(store.shop);
        await emailService.sendDailyAnalytics(analyticsData);

        console.log(`✅ Manual email sent: ${store.shop}`);
        sentCount++;

      } catch (error) {
        console.error(`❌ Manual failed: ${store.shop}`, error);
      }
    }

    console.log(`📈 Manual sent count: ${sentCount}`);
    
    return new Response(JSON.stringify({ 
      success: true, 
      sent: sentCount,
      message: `Manually sent ${sentCount} emails`
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('❌ Manual trigger failed:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};