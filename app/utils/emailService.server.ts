// app/utils/emailService.server.ts
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export class AnalyticsEmailService {
  shop: string;

  constructor(shop: string) {
    this.shop = shop;
  }

  async sendDailyAnalytics(analyticsData: any) {
    const msg = {
      to: analyticsData.merchantEmail, // from your DB
      from: process.env.SENDGRID_FROM_EMAIL!,
      subject: `Daily Shopify Report for ${this.shop}`,
      text: `Hello ${analyticsData.merchantName}, your daily report:\n\nOrders: ${analyticsData.ordersLoaded}`,
      html: `<p>Hello ${analyticsData.merchantName},</p>
             <p>Your daily report:</p>
             <ul>
               <li>Orders: ${analyticsData.ordersLoaded}</li>
               <li>Revenue: ${analyticsData.revenue || 0}</li>
             </ul>`,
    };

    await sgMail.send(msg);
    console.log(`✅ SendGrid email sent to ${analyticsData.merchantEmail}`);
  }
}
