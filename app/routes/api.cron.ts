import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import prisma from "../db.server";
import { getValidSession, getOfflineSession } from "../utils/sessionManager.server";
import { AnalyticsCollector } from "../services/analyticsCollector.server";
import { AnalyticsEmailService } from "../services/emailService.server";

// TEMPORARY: Use storeEmailSettings for tracking (no schema changes needed)
async function hasSentToday(shop: string, scheduleTime: string): Promise<boolean> {
  try {
    const store = await prisma.storeEmailSettings.findUnique({
      where: { shop }
    });
    
    if (!store) return false;
    
    const lastUpdated = store.updatedAt;
    const today = new Date();
    
    return lastUpdated.toDateString() === today.toDateString();
  } catch (error) {
    console.error(`❌ Error checking last sent for ${shop}:`, error);
    return false;
  }
}

async function logEmailSent(shop: string, scheduleTime: string): Promise<void> {
  try {
    await prisma.storeEmailSettings.update({
      where: { shop },
      data: {
        fromName: { set: undefined }
      }
    });
    console.log(`📝 Logged email sent for ${shop} at ${scheduleTime}`);
  } catch (error) {
    console.error(`❌ Error logging email for ${shop}:`, error);
  }
}

async function shouldSendReportNow(store: any): Promise<boolean> {
  try {
    const now = new Date();
    const shop = store.shop;

    const currentCT = new Date(now.toLocaleString("en-US", { timeZone: "America/Chicago" }));
    const currentTotalMinutes = currentCT.getHours() * 60 + currentCT.getMinutes();

    const [scheduledHours, scheduledMinutes] = store.scheduleTime.split(":").map(Number);
    const scheduledTotalMinutes = scheduledHours * 60 + scheduledMinutes;

    const alreadySent = await hasSentToday(shop, store.scheduleTime);
    if (alreadySent) {
      console.log(`⏭️ Already sent today: ${shop}`);
      return false;
    }

    const diff = Math.abs(currentTotalMinutes - scheduledTotalMinutes);
    if (diff <= 1) {
      console.log(`✅ SCHEDULE MATCH - Will send to ${shop}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`❌ Error checking schedule for ${store.shop}:`, error);
    return false;
  }
}

async function processScheduledReports() {
  const now = new Date();
  console.log(`\n⏰ VERCEL CRON RUN at ${now.toLocaleTimeString()} CT`);

  try {
    const shops = await prisma.storeEmailSettings.findMany({
      where: { enabled: true, scheduleEnabled: true },
    });

    console.log(`📊 Checking ${shops.length} shops`);
    let sentCount = 0;

    for (const store of shops) {
      const shop = store.shop;
      if (!(await shouldSendReportNow(store))) continue;

      console.log(`🎯 PROCESSING: ${shop} at ${store.scheduleTime}`);

      try {
        const session = await getValidSession(shop) || await getOfflineSession(shop);
        if (!session) {
          console.log(`❌ No session for: ${shop}`);
          continue;
        }

        const collector = new AnalyticsCollector(session);
        const analyticsData = await collector.collectDailyAnalytics();

        if (analyticsData.ordersLoaded === 0) {
          console.log(`📭 No data for: ${shop}`);
          continue;
        }

        const emailService = new AnalyticsEmailService(shop);
        await emailService.sendDailyAnalytics(analyticsData);
        await logEmailSent(shop, store.scheduleTime);

        console.log(`✅ EMAIL SENT: ${shop}`);
        sentCount++;

      } catch (error: any) {
        console.error(`❌ Failed ${shop}:`, error.message);
      }
    }

    console.log(`📈 Sent ${sentCount} emails this run`);
    return { sent: sentCount, totalShops: shops.length };

  } catch (error: any) {
    console.error('❌ Vercel cron error:', error);
    return { sent: 0, totalShops: 0, error: error.message };
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  const authHeader = request.headers.get('Authorization');
  const expectedSecret = `Bearer ${process.env.CRON_SECRET}`;
  
  if (authHeader !== expectedSecret) {
    console.log('❌ Unauthorized cron attempt');
    return new Response('Unauthorized', { status: 401 });
  }

  console.log('🔐 Authorized cron request received');
  const result = await processScheduledReports();

  return json({
    success: true,
    message: 'Vercel cron job completed',
    timestamp: new Date().toISOString(),
    ...result
  });
}