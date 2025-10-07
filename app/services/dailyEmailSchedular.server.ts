import { Session } from "@shopify/shopify-api";
import { AnalyticsCollector } from "./analyticsCollector.server";
import { AnalyticsEmailService } from "./emailService.server";

export class DailyEmailScheduler {
  private shop: string;
  private session: Session;

  constructor(shop: string, session: Session) {
    this.shop = shop;
    this.session = session;
  }

  async sendDailyReport() {
    try {
      // Collect analytics data
      const collector = new AnalyticsCollector(this.session);
      const analyticsData = await collector.collectDailyAnalytics();
      
      // Check if we have meaningful data to send
      if (analyticsData.ordersLoaded === 0) {
        return {
          success: true,
          message: 'No order data available',
          skipped: true
        };
      }

      // Send email with analytics
      const emailService = new AnalyticsEmailService(this.shop);
      const emailResult = await emailService.sendDailyAnalytics(analyticsData);

      return {
        success: true,
        message: 'Daily analytics email sent successfully',
        data: {
          ordersAnalyzed: analyticsData.ordersLoaded,
          todayRevenue: analyticsData.todayRevenue,
          todayOrders: analyticsData.todayOrders,
          totalCustomers: analyticsData.totalCustomers
        }
      };

    } catch (error: any) {
      // Provide specific error messages
      let errorMessage = 'Failed to send daily email';
      if (error.message.includes('Failed to collect analytics')) {
        errorMessage = 'Failed to collect store analytics data';
      } else if (error.message.includes('Email delivery failed')) {
        errorMessage = 'Failed to send email via SendGrid';
      } else if (error.message.includes('Email settings not configured')) {
        errorMessage = 'Email settings not configured for this store';
      }

      throw new Error(`${errorMessage}: ${error.message}`);
    }
  }
}