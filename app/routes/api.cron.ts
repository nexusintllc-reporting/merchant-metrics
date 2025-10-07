import { ActionFunction } from "@remix-run/node";
import prisma from "../db.server";
import { getValidSession, getOfflineSession } from "../utils/sessionManager.server";
import { AnalyticsCollector } from "../services/analyticsCollector.server";
import { AnalyticsEmailService } from "../services/emailService.server";

// Track emails sent in this execution
let sentInThisRun = new Set<string>();

export const action: ActionFunction = async ({ request }) => {
  // Security check
  if (request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  console.log('🕒 Vercel Cron: Running scheduled reports...');

  try {
    const shops = await prisma.storeEmailSettings.findMany({
      where: { enabled: true, scheduleEnabled: true },
    });

    console.log(`📊 Checking ${shops.length} shops for scheduled reports`);

    let sentCount = 0;

    for (const store of shops) {
      const shop = store.shop;

      if (!shouldSendReportNow(store)) continue;
      if (sentInThisRun.has(shop)) continue;

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

        sentInThisRun.add(shop);
        console.log(`✅ EMAIL SENT: ${shop}`);
        sentCount++;

      } catch (error: any) {
        console.error(`❌ Failed ${shop}:`, error.message);
      }
    }

    console.log(`📈 Sent ${sentCount} emails this run`);
    
    return new Response(JSON.stringify({ 
      success: true, 
      sent: sentCount,
      message: `Processed ${shops.length} shops, sent ${sentCount} emails`
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('❌ Vercel Cron failed:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

function shouldSendReportNow(store: any): boolean {
  try {
    const now = new Date();
    const shop = store.shop;

    // Current time in Central Time
    const currentCT = new Date(now.toLocaleString("en-US", { timeZone: "America/Chicago" }));

    // Total minutes since midnight
    const currentTotalMinutes = currentCT.getHours() * 60 + currentCT.getMinutes();

    // Parse scheduled time
    const [scheduledHours, scheduledMinutes] = store.scheduleTime.split(":").map(Number);
    const scheduledTotalMinutes = scheduledHours * 60 + scheduledMinutes;

    // Send if current time is within ±1 minute of schedule
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