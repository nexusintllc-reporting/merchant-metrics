// import { Session } from "@shopify/shopify-api";
// import { StoreEmailSettings } from "../models/StoreEmailSettings.server";
// import { AnalyticsCollector } from "../services/analyticsCollector.server";
// import { AnalyticsEmailService } from "../services/emailService.server";

// export async function sendScheduledReports(session: Session) {
//   // This will be called by Shopify for each shop
//   console.log('⏰ Background job started for:', session.shop);
  
//   // Your existing email logic here
//   const settings = await StoreEmailSettings.get(session.shop);
//   if (!settings?.scheduleEnabled) return;
  
//   const collector = new AnalyticsCollector(session);
//   const analyticsData = await collector.collectDailyAnalytics();
  
//   const emailService = new AnalyticsEmailService(session.shop);
//   await emailService.sendDailyAnalytics(analyticsData);
// }
import { Session } from "@shopify/shopify-api";
import { StoreEmailSettings } from "../models/StoreEmailSettings.server";
import { AnalyticsCollector } from "../services/analyticsCollector.server";
import { AnalyticsEmailService } from "../services/emailService.server";

export async function sendScheduledReports(session: Session) {
  try {
    console.log('⏰ Background job started for:', session.shop);
    
    // Get store settings
    const settings = await StoreEmailSettings.get(session.shop);
    if (!settings) {
      throw new Error('Email settings not found for shop: ' + session.shop);
    }

    if (!settings.enabled) {
      console.log('📧 Email notifications are disabled for:', session.shop);
      return;
    }

    if (!settings.scheduleEnabled) {
      console.log('⏰ Scheduled reports are disabled for:', session.shop);
      return;
    }

    // Check if we have at least one email address
    const allEmails = [
      settings.fromEmail,
      ...(settings.additionalEmails || [])
    ].filter(email => email && email.trim());

    if (allEmails.length === 0) {
      throw new Error('No recipient email addresses configured for: ' + session.shop);
    }

    console.log(`📊 Collecting analytics data for: ${session.shop}`);
    
    // Collect analytics data
    const collector = new AnalyticsCollector(session);
    const analyticsData = await collector.collectDailyAnalytics();
    
    // Check if we have data to send
    if (analyticsData.ordersLoaded === 0) {
      console.log('📭 No order data available for:', session.shop);
      return;
    }

    console.log(`📧 Sending analytics report to ${allEmails.length} recipients for: ${session.shop}`);
    
    // Send email with analytics
    const emailService = new AnalyticsEmailService(session.shop);
    const emailResult = await emailService.sendDailyAnalytics(analyticsData);

    console.log(`✅ Successfully sent analytics report for: ${session.shop}`);
    console.log(`📨 Recipients: ${allEmails.join(', ')}`);

    return emailResult;

  } catch (error: any) {
    console.error(`❌ Error in sendScheduledReports for ${session.shop}:`, error);
    throw error;
  }
}