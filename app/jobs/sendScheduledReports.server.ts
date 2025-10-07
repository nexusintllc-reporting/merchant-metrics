import { Session } from "@shopify/shopify-api";
import { StoreEmailSettings } from "../models/StoreEmailSettings.server";
import { AnalyticsCollector } from "../services/analyticsCollector.server";
import { AnalyticsEmailService } from "../services/emailService.server";

export async function sendScheduledReports(session: Session) {
  // This will be called by Shopify for each shop
  console.log('⏰ Background job started for:', session.shop);
  
  // Your existing email logic here
  const settings = await StoreEmailSettings.get(session.shop);
  if (!settings?.scheduleEnabled) return;
  
  const collector = new AnalyticsCollector(session);
  const analyticsData = await collector.collectDailyAnalytics();
  
  const emailService = new AnalyticsEmailService(session.shop);
  await emailService.sendDailyAnalytics(analyticsData);
}