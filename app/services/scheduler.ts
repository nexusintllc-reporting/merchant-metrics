import cron from 'node-cron';
import prisma from '../db.server';
import { getValidSession, getOfflineSession } from '../utils/sessionManager.server';
import { AnalyticsCollector } from './analyticsCollector.server';
import { AnalyticsEmailService } from './emailService.server';

// ----------------------------
// Track emails sent today to prevent duplicates
// ----------------------------
const sentToday = new Set<string>();

// ----------------------------
// Reset sent tracking daily at midnight
// ----------------------------
cron.schedule('0 0 * * *', () => {
  sentToday.clear();
  console.log('🔄 Reset daily email tracking');
});

// ----------------------------
// Check if it's time to send report (±1 minute tolerance)
// ----------------------------
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
    if (sentToday.has(todayKey)) return false;

    // Send if current time is within ±1 minute of schedule
    const diff = Math.abs(currentTotalMinutes - scheduledTotalMinutes);
    if (diff <= 1) {
      sentToday.add(todayKey);
      console.log(`✅ SCHEDULE MATCH - Will send to ${shop}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`❌ Error checking schedule for ${store.shop}:`, error);
    return false;
  }
}

// ----------------------------
// Process scheduled reports
// ----------------------------
async function processScheduledReports() {
  const now = new Date();
  console.log(`\n⏰ SCHEDULER RUN at ${now.toLocaleTimeString()} CT`);

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
    return { sent: sentCount };

  } catch (error: any) {
    console.error('❌ Scheduler error:', error);
    return { sent: 0 };
  }
}

// ----------------------------
// Cron schedule: check every minute
// ----------------------------
cron.schedule('* * * * *', processScheduledReports);
console.log('⏰ Scheduler running: checking every minute');

// ----------------------------
// Manual trigger (bypass daily tracking)
// ----------------------------
export async function triggerScheduledReports() {
  console.log('🔧 Manual trigger - bypassing daily limit');

  const shops = await prisma.storeEmailSettings.findMany({
    where: { enabled: true, scheduleEnabled: true },
  });

  let sentCount = 0;

  for (const store of shops) {
    try {
      const session = await getValidSession(store.shop) || await getOfflineSession(store.shop);
      if (!session) continue;

      const collector = new AnalyticsCollector(session);
      const analyticsData = await collector.collectDailyAnalytics();
      if (analyticsData.ordersLoaded === 0) continue;

      const emailService = new AnalyticsEmailService(store.shop);
      await emailService.sendDailyAnalytics(analyticsData);

      console.log(`✅ Manual email sent: ${store.shop}`);
      sentCount++;

    } catch (error) {
      console.error(`❌ Manual failed: ${store.shop}`, error);
    }
  }

  console.log(`📈 Manual sent count: ${sentCount}`);
  return { sent: sentCount };
}

