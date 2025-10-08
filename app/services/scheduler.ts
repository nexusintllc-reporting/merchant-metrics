import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import prisma from "../db.server";
import { getValidSession, getOfflineSession } from "../utils/sessionManager.server";
import { AnalyticsCollector } from "../services/analyticsCollector.server";
import { AnalyticsEmailService } from "../services/emailService.server";

// In-memory tracking for Vercel serverless (will reset on cold starts)
let sentToday: Set<string> | null = null;

function getSentTodaySet(): Set<string> {
  if (!sentToday) {
    sentToday = new Set<string>();
  }
  return sentToday;
}

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

    // Unique key for today
    const todayKey = `${shop}-${store.scheduleTime}-${currentCT.toDateString()}`;

    // Already sent today? Skip
    if (getSentTodaySet().has(todayKey)) return false;

    // Send if current time is within ±1 minute of schedule
    const diff = Math.abs(currentTotalMinutes - scheduledTotalMinutes);
    if (diff <= 1) {
      getSentTodaySet().add(todayKey);
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

      if (!shouldSendReportNow(store)) continue;

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
  // Verify cron secret for authentication
  const authHeader = request.headers.get('Authorization');
  const expectedSecret = `Bearer ${process.env.CRON_SECRET}`;
  
  if (authHeader !== expectedSecret) {
    console.log('❌ Unauthorized cron attempt');
    return new Response('Unauthorized', { status: 401 });
  }

  console.log('🔐 Authorized cron request received');

  // Process the scheduled reports
  const result = await processScheduledReports();

  return json({
    success: true,
    message: 'Vercel cron job completed',
    timestamp: new Date().toISOString(),
    ...result
  });
}

// Manual trigger endpoint (optional)
export async function action({ request }: LoaderFunctionArgs) {
  const authHeader = request.headers.get('Authorization');
  const expectedSecret = `Bearer ${process.env.CRON_SECRET}`;
  
  if (authHeader !== expectedSecret) {
    return new Response('Unauthorized', { status: 401 });
  }

  console.log('🔧 Manual trigger via Vercel cron');
  
  const result = await processScheduledReports();
  
  return json({
    success: true,
    message: 'Manual trigger completed',
    timestamp: new Date().toISOString(),
    ...result
  });
}