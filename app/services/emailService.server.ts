// import sgMail from "@sendgrid/mail";
// import { StoreEmailSettings } from "../models/StoreEmailSettings.server";
// import { OrderData } from "./analyticsCollector.server";

// // Initialize SendGrid
// if (process.env.SENDGRID_API_KEY) {
//   sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// }

// export class AnalyticsEmailService {
//   private shop: string;

//   constructor(shop: string) {
//     this.shop = shop;
//   }

//   async sendDailyAnalytics(analyticsData: OrderData) {
//     try {
//       // Validate SendGrid configuration
//       if (!process.env.SENDGRID_API_KEY) {
//         throw new Error('SendGrid API key is not configured');
//       }

//       if (!process.env.SENDGRID_FROM_EMAIL) {
//         throw new Error('SENDGRID_FROM_EMAIL is not configured');
//       }

//       // Fetch store email settings
//       const settings = await StoreEmailSettings.get(this.shop);
      
//       if (!settings) {
//         throw new Error('Email settings not configured for this store');
//       }

//       if (!settings.enabled) {
//         return {
//           success: true,
//           skipped: true,
//           message: 'Email notifications are disabled'
//         };
//       }

//       // Validate recipient email
//       if (!settings.fromEmail || !this.isValidEmail(settings.fromEmail)) {
//         throw new Error(`Invalid recipient email address: ${settings.fromEmail}`);
//       }

//       // Build email with analytics data
//       const emailContent = this.buildAnalyticsEmail(analyticsData, this.shop);
      
//       const msg = {
//         to: settings.fromEmail,
//         from: process.env.SENDGRID_FROM_EMAIL,
//         subject: `📊 Daily Analytics Report - ${this.shop} - ${new Date().toLocaleDateString()}`,
//         html: emailContent,
//         text: this.generateTextVersion(analyticsData, this.shop),
//       };

//       const result = await sgMail.send(msg);
      
//       return {
//         success: true,
//         message: 'Email sent successfully',
//         result
//       };

//     } catch (error: any) {
//       console.error('Error sending email:', error);
      
//       // Enhanced error logging for SendGrid
//       if (error.response) {
//         console.error('SendGrid API Response Details:');
//         console.error('Status:', error.response.status);
//         console.error('Body:', JSON.stringify(error.response.body, null, 2));
        
//         // Provide specific error messages based on SendGrid response
//         if (error.response.status === 403) {
//           throw new Error('SendGrid API key is invalid or does not have sending permissions');
//         } else if (error.response.status === 401) {
//           throw new Error('SendGrid authentication failed. API key may be invalid.');
//         } else if (error.response.body?.errors) {
//           const sendGridError = error.response.body.errors[0];
//           throw new Error(`SendGrid error: ${sendGridError.message}`);
//         }
//       }
      
//       throw new Error(`Email delivery failed: ${error.message}`);
//     }
//   }

//   private isValidEmail(email: string): boolean {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   }

//   private buildAnalyticsEmail(data: OrderData, shop: string): string {
//     const formatCurrency = (amount: number) => `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
//     const formatNumber = (num: number) => num.toLocaleString();
//     const formatPercent = (num: number) => `${num >= 0 ? '+' : ''}${num.toFixed(1)}%`;

//     const getTrendIcon = (value: number) => value >= 0 ? '↗' : '↘';

//     return `
// <!DOCTYPE html>
// <html>
// <head>
//     <meta charset="utf-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1">
//     <title>📊 Analytics Report - ${shop}</title>
//     <style>
//         body {
//             font-family: Arial, sans-serif;
//             line-height: 1.6;
//             color: #333333;
//             margin: 0;
//             padding: 0;
//             background-color: #f8f9fa;
//         }
//         .container {
//             max-width: 600px;
//             margin: 0 auto;
//             background: #ffffff;
//             border-radius: 8px;
//             overflow: hidden;
//             box-shadow: 0 2px 10px rgba(0,0,0,0.1);
//         }
//         .header {
//             background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//             color: white;
//             padding: 30px 20px;
//             text-align: center;
//         }
//         .header h1 {
//             margin: 0;
//             font-size: 28px;
//             font-weight: bold;
//         }
//         .header .subtitle {
//             margin: 8px 0 0 0;
//             font-size: 16px;
//             opacity: 0.9;
//         }
//         .content {
//             padding: 30px;
//         }
//         .section {
//             margin-bottom: 30px;
//             border: 1px solid #e9ecef;
//             border-radius: 8px;
//             overflow: hidden;
//         }
//         .section-header {
//             background: #f8f9fa;
//             padding: 15px 20px;
//             border-bottom: 1px solid #e9ecef;
//         }
//         .section-header h2 {
//             margin: 0;
//             font-size: 18px;
//             color: #495057;
//             font-weight: 600;
//         }
//         .section-body {
//             padding: 20px;
//         }
//         .metrics-grid {
//             display: block;
//         }
//         .metric-row {
//             display: flex;
//             justify-content: space-between;
//             margin-bottom: 15px;
//             padding-bottom: 15px;
//             border-bottom: 1px solid #f1f3f4;
//         }
//         .metric-row:last-child {
//             margin-bottom: 0;
//             padding-bottom: 0;
//             border-bottom: none;
//         }
//         .metric-item {
//             flex: 1;
//             text-align: center;
//         }
//         .metric-value {
//             font-size: 24px;
//             font-weight: bold;
//             color: #2c3e50;
//             margin: 0 0 5px 0;
//         }
//         .metric-label {
//             font-size: 12px;
//             color: #6c757d;
//             margin: 0;
//             text-transform: uppercase;
//             letter-spacing: 0.5px;
//         }
//         .metric-change {
//             font-size: 11px;
//             padding: 2px 8px;
//             border-radius: 10px;
//             display: inline-block;
//             margin-top: 4px;
//         }
//         .change-positive {
//             background: #d4edda;
//             color: #155724;
//         }
//         .change-negative {
//             background: #f8d7da;
//             color: #721c24;
//         }
//         .daily-grid {
//             display: block;
//         }
//         .daily-row {
//             display: flex;
//             justify-content: space-between;
//             align-items: center;
//             padding: 10px 0;
//             border-bottom: 1px solid #f1f3f4;
//         }
//         .daily-row:last-child {
//             border-bottom: none;
//         }
//         .daily-date {
//             font-weight: 600;
//             color: #495057;
//             min-width: 80px;
//         }
//         .daily-metrics {
//             display: flex;
//             gap: 20px;
//         }
//         .daily-metric {
//             text-align: right;
//             min-width: 80px;
//         }
//         .daily-value {
//             font-weight: 600;
//             color: #2c3e50;
//         }
//         .daily-label {
//             font-size: 10px;
//             color: #6c757d;
//             text-transform: uppercase;
//         }
//         .today-highlight {
//             background: #e7f3ff;
//             border-left: 4px solid #007bff;
//             margin: 0 -20px;
//             padding: 10px 20px;
//         }
//         .summary-grid {
//             display: flex;
//             justify-content: space-between;
//             flex-wrap: wrap;
//             gap: 15px;
//         }
//         .summary-card {
//             flex: 1;
//             min-width: 120px;
//             text-align: center;
//             padding: 15px;
//             background: #f8f9fa;
//             border-radius: 6px;
//             border: 1px solid #e9ecef;
//         }
//         .summary-value {
//             font-size: 20px;
//             font-weight: bold;
//             color: #2c3e50;
//             margin: 0 0 5px 0;
//         }
//         .summary-label {
//             font-size: 11px;
//             color: #6c757d;
//             margin: 0;
//             text-transform: uppercase;
//             letter-spacing: 0.5px;
//         }
//         .footer {
//             background: #f8f9fa;
//             padding: 20px;
//             text-align: center;
//             border-top: 1px solid #e9ecef;
//         }
//         .footer-text {
//             font-size: 12px;
//             color: #6c757d;
//             margin: 0;
//         }
//         .highlight {
//             background: #fff3cd;
//             padding: 15px;
//             border-radius: 6px;
//             border-left: 4px solid #ffc107;
//             margin: 15px 0;
//         }
//         .highlight strong {
//             color: #856404;
//         }
//     </style>
// </head>
// <body>
//     <div class="container">
//         <!-- Header -->
//         <div class="header">
//             <h1>📊 Analytics Report</h1>
//             <div class="subtitle">${shop} • ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
//         </div>

//         <!-- Content -->
//         <div class="content">
//             <!-- Today's Performance -->
//             <div class="section">
//                 <div class="section-header">
//                     <h2>Today's Performance</h2>
//                 </div>
//                 <div class="section-body">
//                     <div class="metrics-grid">
//                         <div class="metric-row">
//                             <div class="metric-item">
//                                 <div class="metric-value">${formatNumber(data.todayOrders)}</div>
//                                 <div class="metric-label">Orders</div>
//                                 ${data.ordersChangeVsYesterday !== 0 ? `
//                                 <div class="metric-change ${data.ordersChangeVsYesterday >= 0 ? 'change-positive' : 'change-negative'}">
//                                     ${getTrendIcon(data.ordersChangeVsYesterday)} ${formatPercent(data.ordersChangeVsYesterday)}
//                                 </div>
//                                 ` : ''}
//                             </div>
//                             <div class="metric-item">
//                                 <div class="metric-value">${formatCurrency(data.todayRevenue)}</div>
//                                 <div class="metric-label">Revenue</div>
//                                 ${data.revenueChangeVsYesterday !== 0 ? `
//                                 <div class="metric-change ${data.revenueChangeVsYesterday >= 0 ? 'change-positive' : 'change-negative'}">
//                                     ${getTrendIcon(data.revenueChangeVsYesterday)} ${formatPercent(data.revenueChangeVsYesterday)}
//                                 </div>
//                                 ` : ''}
//                             </div>
//                             <div class="metric-item">
//                                 <div class="metric-value">${formatNumber(data.todayItems)}</div>
//                                 <div class="metric-label">Items Sold</div>
//                                 ${data.itemsChangeVsYesterday !== 0 ? `
//                                 <div class="metric-change ${data.itemsChangeVsYesterday >= 0 ? 'change-positive' : 'change-negative'}">
//                                     ${getTrendIcon(data.itemsChangeVsYesterday)} ${formatPercent(data.itemsChangeVsYesterday)}
//                                 </div>
//                                 ` : ''}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <!-- Customer Insights -->
//             <div class="section">
//                 <div class="section-header">
//                     <h2>Customer Insights</h2>
//                 </div>
//                 <div class="section-body">
//                     <div class="metrics-grid">
//                         <div class="metric-row">
//                             <div class="metric-item">
//                                 <div class="metric-value">${formatNumber(data.totalCustomers)}</div>
//                                 <div class="metric-label">Total Customers</div>
//                             </div>
//                             <div class="metric-item">
//                                 <div class="metric-value">${formatNumber(data.newCustomers)}</div>
//                                 <div class="metric-label">New Customers</div>
//                             </div>
//                             <div class="metric-item">
//                                 <div class="metric-value">${formatNumber(data.repeatCustomers)}</div>
//                                 <div class="metric-label">Repeat Customers</div>
//                             </div>
//                             <div class="metric-item">
//                                 <div class="metric-value">${data.repeatCustomerRate.toFixed(1)}%</div>
//                                 <div class="metric-label">Repeat Rate</div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <!-- Fulfillment Status -->
//             <div class="section">
//                 <div class="section-header">
//                     <h2>Order Fulfillment</h2>
//                 </div>
//                 <div class="section-body">
//                     <div class="metrics-grid">
//                         <div class="metric-row">
//                             <div class="metric-item">
//                                 <div class="metric-value">${formatNumber(data.todayFulfilled)}</div>
//                                 <div class="metric-label">Fulfilled Today</div>
//                             </div>
//                             <div class="metric-item">
//                                 <div class="metric-value">${formatNumber(data.todayUnfulfilled)}</div>
//                                 <div class="metric-label">Unfulfilled Today</div>
//                             </div>
//                             <div class="metric-item">
//                                 <div class="metric-value">${data.fulfillmentRate.toFixed(1)}%</div>
//                                 <div class="metric-label">Fulfillment Rate</div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <!-- Last 7 Days Performance -->
//             <div class="section">
//                 <div class="section-header">
//                     <h2>Last 7 Days Performance</h2>
//                 </div>
//                 <div class="section-body">
//                     <div class="daily-grid">
//                         ${data.dailySales.map(day => {
//                             const date = new Date(day.date);
//                             const isToday = day.date === new Date().toISOString().split('T')[0];
//                             const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
//                             const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                            
//                             return `
//                             <div class="daily-row ${isToday ? 'today-highlight' : ''}">
//                                 <div class="daily-date">
//                                     ${dayName}, ${dateStr}
//                                     ${isToday ? ' <strong>(Today)</strong>' : ''}
//                                 </div>
//                                 <div class="daily-metrics">
//                                     <div class="daily-metric">
//                                         <div class="daily-value">${formatCurrency(day.revenue)}</div>
//                                         <div class="daily-label">Revenue</div>
//                                     </div>
//                                     <div class="daily-metric">
//                                         <div class="daily-value">${formatNumber(day.orders)}</div>
//                                         <div class="daily-label">Orders</div>
//                                     </div>
//                                     <div class="daily-metric">
//                                         <div class="daily-value">${formatNumber(day.items)}</div>
//                                         <div class="daily-label">Items</div>
//                                     </div>
//                                 </div>
//                             </div>
//                             `;
//                         }).join('')}
//                     </div>

//                     <!-- 7-Day Summary -->
//                     <div class="summary-grid" style="margin-top: 20px;">
//                         <div class="summary-card">
//                             <div class="summary-value">${formatNumber(data.dailySales.reduce((sum, day) => sum + day.orders, 0))}</div>
//                             <div class="summary-label">Total Orders</div>
//                         </div>
//                         <div class="summary-card">
//                             <div class="summary-value">${formatCurrency(data.dailySales.reduce((sum, day) => sum + day.revenue, 0))}</div>
//                             <div class="summary-label">Total Revenue</div>
//                         </div>
//                         <div class="summary-card">
//                             <div class="summary-value">${formatCurrency(data.averageDailyRevenue)}</div>
//                             <div class="summary-label">Avg Daily Revenue</div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <!-- Overall Business Summary -->
//             <div class="section">
//                 <div class="section-header">
//                     <h2>Business Overview</h2>
//                 </div>
//                 <div class="section-body">
//                     <div class="summary-grid">
//                         <div class="summary-card">
//                             <div class="summary-value">${formatNumber(data.totalOrders)}</div>
//                             <div class="summary-label">All-Time Orders</div>
//                         </div>
//                         <div class="summary-card">
//                             <div class="summary-value">${formatCurrency(data.totalRevenue)}</div>
//                             <div class="summary-label">All-Time Revenue</div>
//                         </div>
//                         <div class="summary-card">
//                             <div class="summary-value">${formatCurrency(data.averageOrderValue)}</div>
//                             <div class="summary-label">Avg Order Value</div>
//                         </div>
//                         <div class="summary-card">
//                             <div class="summary-value">${formatNumber(data.ordersLoaded)}</div>
//                             <div class="summary-label">Orders Analyzed</div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <!-- Performance Insight -->
//             ${data.revenueChangeVsYesterday !== 0 || data.ordersChangeVsYesterday !== 0 ? `
//             <div class="highlight">
//                 <strong>Performance Insight:</strong><br>
//                 ${data.revenueChangeVsYesterday > 0 ? `📈 Revenue is up ${formatPercent(data.revenueChangeVsYesterday)} from yesterday.` : ''}
//                 ${data.revenueChangeVsYesterday < 0 ? `📉 Revenue is down ${formatPercent(Math.abs(data.revenueChangeVsYesterday))} from yesterday.` : ''}
//                 ${data.revenueChangeVsYesterday === 0 && data.ordersChangeVsYesterday > 0 ? `📈 Order volume is up ${formatPercent(data.ordersChangeVsYesterday)} from yesterday.` : ''}
//                 ${data.bestDay && data.bestDay.revenue > data.todayRevenue ? `Your best day was ${new Date(data.bestDay.date).toLocaleDateString()} with ${formatCurrency(data.bestDay.revenue)} in revenue.` : ''}
//             </div>
//             ` : ''}
//         </div>

//         <!-- Footer -->
//         <div class="footer">
//             <p class="footer-text">
//                 This automated report was generated on ${new Date().toLocaleString()}<br>
//                 Data analyzed from ${formatNumber(data.ordersLoaded)} orders
//             </p>
//         </div>
//     </div>
// </body>
// </html>
//     `;
//   }

//   private generateTextVersion(data: OrderData, shop: string): string {
//     const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
//     const formatPercent = (num: number) => `${num >= 0 ? '+' : ''}${num.toFixed(1)}%`;

//     return `
// ANALYTICS REPORT - ${shop}
// ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

// TODAY'S PERFORMANCE:
// - Orders: ${data.todayOrders} (${formatPercent(data.ordersChangeVsYesterday)} vs yesterday)
// - Revenue: ${formatCurrency(data.todayRevenue)} (${formatPercent(data.revenueChangeVsYesterday)} vs yesterday)
// - Items Sold: ${data.todayItems} (${formatPercent(data.itemsChangeVsYesterday)} vs yesterday)

// CUSTOMER INSIGHTS:
// - Total Customers: ${data.totalCustomers}
// - New Customers: ${data.newCustomers}
// - Repeat Customers: ${data.repeatCustomers}
// - Repeat Rate: ${data.repeatCustomerRate.toFixed(1)}%

// FULFILLMENT:
// - Fulfilled Today: ${data.todayFulfilled}
// - Unfulfilled Today: ${data.todayUnfulfilled}
// - Fulfillment Rate: ${data.fulfillmentRate.toFixed(1)}%

// LAST 7 DAYS:
// ${data.dailySales.map(day => {
//   const date = new Date(day.date);
//   return `- ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: ${formatCurrency(day.revenue)} (${day.orders} orders)`;
// }).join('\n')}

// BUSINESS OVERVIEW:
// - All-Time Orders: ${data.totalOrders}
// - All-Time Revenue: ${formatCurrency(data.totalRevenue)}
// - Average Order Value: ${formatCurrency(data.averageOrderValue)}

// Data analyzed from ${data.ordersLoaded} orders.
// Generated on ${new Date().toLocaleString()}
//     `;
//   }
// }




import sgMail from "@sendgrid/mail";
import { StoreEmailSettings } from "../models/StoreEmailSettings.server";
import { OrderData } from "./analyticsCollector.server";

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export class AnalyticsEmailService {
  private shop: string;

  constructor(shop: string) {
    this.shop = shop;
  }

  async sendDailyAnalytics(analyticsData: OrderData) {
    try {
      // Validate SendGrid configuration
      if (!process.env.SENDGRID_API_KEY) {
        throw new Error('Email service not configured');
      }

      if (!process.env.SENDGRID_FROM_EMAIL) {
        throw new Error('Sender email not configured');
      }

      // Fetch store email settings
      const settings = await StoreEmailSettings.get(this.shop);
      
      if (!settings) {
        throw new Error('Email settings not configured for this store');
      }

      if (!settings.enabled) {
        return {
          success: true,
          skipped: true,
          message: 'Email notifications are disabled'
        };
      }

      // Validate recipient email
      if (!settings.fromEmail || !this.isValidEmail(settings.fromEmail)) {
        throw new Error('Invalid recipient email address');
      }

      // Build email with analytics data
      const emailContent = this.buildAnalyticsEmail(analyticsData, this.shop);
      
      const msg = {
        to: settings.fromEmail,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: `Daily Analytics Report - ${this.shop} - ${new Date().toLocaleDateString()}`,
        html: emailContent,
        text: this.generateTextVersion(analyticsData, this.shop),
      };

      const result = await sgMail.send(msg);
      
      return {
        success: true,
        message: 'Email sent successfully',
        result
      };

    } catch (error: any) {
  console.error('🔍 DEBUG: SendGrid Error Details:', error);
  console.error('🔍 DEBUG: SendGrid Response:', error?.response?.body);
  console.error('🔍 DEBUG: SendGrid Code:', error?.code);
  
  // Include the actual error message
  throw new Error(`Failed to send analytics email: ${error.message}`);
}
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private buildAnalyticsEmail(data: OrderData, shop: string): string {
    const formatCurrency = (amount: number) => `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const formatNumber = (num: number) => num.toLocaleString();
    const formatPercent = (num: number) => `${num >= 0 ? '+' : ''}${num.toFixed(1)}%`;

    const getTrendIcon = (value: number) => value >= 0 ? '↑' : '↓';

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Analytics Report - ${shop}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }
        .header .subtitle {
            margin: 8px 0 0 0;
            font-size: 16px;
            opacity: 0.9;
        }
        .content {
            padding: 30px;
        }
        .section {
            margin-bottom: 30px;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            overflow: hidden;
        }
        .section-header {
            background: #f8f9fa;
            padding: 15px 20px;
            border-bottom: 1px solid #e9ecef;
        }
        .section-header h2 {
            margin: 0;
            font-size: 18px;
            color: #495057;
            font-weight: 600;
        }
        .section-body {
            padding: 20px;
        }
        .metrics-grid {
            display: block;
        }
        .metric-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid #f1f3f4;
        }
        .metric-row:last-child {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
        }
        .metric-item {
            flex: 1;
            text-align: center;
        }
        .metric-value {
            font-size: 24px;
            font-weight: bold;
            color: #2c3e50;
            margin: 0 0 5px 0;
        }
        .metric-label {
            font-size: 12px;
            color: #6c757d;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .metric-change {
            font-size: 11px;
            padding: 2px 8px;
            border-radius: 10px;
            display: inline-block;
            margin-top: 4px;
        }
        .change-positive {
            background: #d4edda;
            color: #155724;
        }
        .change-negative {
            background: #f8d7da;
            color: #721c24;
        }
        .daily-grid {
            display: block;
        }
        .daily-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #f1f3f4;
        }
        .daily-row:last-child {
            border-bottom: none;
        }
        .daily-date {
            font-weight: 600;
            color: #495057;
            min-width: 80px;
        }
        .daily-metrics {
            display: flex;
            gap: 20px;
        }
        .daily-metric {
            text-align: right;
            min-width: 80px;
        }
        .daily-value {
            font-weight: 600;
            color: #2c3e50;
        }
        .daily-label {
            font-size: 10px;
            color: #6c757d;
            text-transform: uppercase;
        }
        .today-highlight {
            background: #e7f3ff;
            border-left: 4px solid #007bff;
            margin: 0 -20px;
            padding: 10px 20px;
        }
        .summary-grid {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 15px;
        }
        .summary-card {
            flex: 1;
            min-width: 120px;
            text-align: center;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 6px;
            border: 1px solid #e9ecef;
        }
        .summary-value {
            font-size: 20px;
            font-weight: bold;
            color: #2c3e50;
            margin: 0 0 5px 0;
        }
        .summary-label {
            font-size: 11px;
            color: #6c757d;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #e9ecef;
        }
        .footer-text {
            font-size: 12px;
            color: #6c757d;
            margin: 0;
        }
        .highlight {
            background: #fff3cd;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #ffc107;
            margin: 15px 0;
        }
        .highlight strong {
            color: #856404;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>Analytics Report</h1>
            <div class="subtitle">${shop} • ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>

        <!-- Content -->
        <div class="content">
            <!-- Today's Performance -->
            <div class="section">
                <div class="section-header">
                    <h2>Today's Performance</h2>
                </div>
                <div class="section-body">
                    <div class="metrics-grid">
                        <div class="metric-row">
                            <div class="metric-item">
                                <div class="metric-value">${formatNumber(data.todayOrders)}</div>
                                <div class="metric-label">Orders</div>
                                ${data.ordersChangeVsYesterday !== 0 ? `
                                <div class="metric-change ${data.ordersChangeVsYesterday >= 0 ? 'change-positive' : 'change-negative'}">
                                    ${getTrendIcon(data.ordersChangeVsYesterday)} ${formatPercent(data.ordersChangeVsYesterday)}
                                </div>
                                ` : ''}
                            </div>
                            <div class="metric-item">
                                <div class="metric-value">${formatCurrency(data.todayRevenue)}</div>
                                <div class="metric-label">Revenue</div>
                                ${data.revenueChangeVsYesterday !== 0 ? `
                                <div class="metric-change ${data.revenueChangeVsYesterday >= 0 ? 'change-positive' : 'change-negative'}">
                                    ${getTrendIcon(data.revenueChangeVsYesterday)} ${formatPercent(data.revenueChangeVsYesterday)}
                                </div>
                                ` : ''}
                            </div>
                            <div class="metric-item">
                                <div class="metric-value">${formatNumber(data.todayItems)}</div>
                                <div class="metric-label">Items Sold</div>
                                ${data.itemsChangeVsYesterday !== 0 ? `
                                <div class="metric-change ${data.itemsChangeVsYesterday >= 0 ? 'change-positive' : 'change-negative'}">
                                    ${getTrendIcon(data.itemsChangeVsYesterday)} ${formatPercent(data.itemsChangeVsYesterday)}
                                </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Customer Insights -->
            <div class="section">
                <div class="section-header">
                    <h2>Customer Insights</h2>
                </div>
                <div class="section-body">
                    <div class="metrics-grid">
                        <div class="metric-row">
                            <div class="metric-item">
                                <div class="metric-value">${formatNumber(data.totalCustomers)}</div>
                                <div class="metric-label">Total Customers</div>
                            </div>
                            <div class="metric-item">
                                <div class="metric-value">${formatNumber(data.newCustomers)}</div>
                                <div class="metric-label">New Customers</div>
                            </div>
                            <div class="metric-item">
                                <div class="metric-value">${formatNumber(data.repeatCustomers)}</div>
                                <div class="metric-label">Repeat Customers</div>
                            </div>
                            <div class="metric-item">
                                <div class="metric-value">${data.repeatCustomerRate.toFixed(1)}%</div>
                                <div class="metric-label">Repeat Rate</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Fulfillment Status -->
            <div class="section">
                <div class="section-header">
                    <h2>Order Fulfillment</h2>
                </div>
                <div class="section-body">
                    <div class="metrics-grid">
                        <div class="metric-row">
                            <div class="metric-item">
                                <div class="metric-value">${formatNumber(data.todayFulfilled)}</div>
                                <div class="metric-label">Fulfilled Today</div>
                            </div>
                            <div class="metric-item">
                                <div class="metric-value">${formatNumber(data.todayUnfulfilled)}</div>
                                <div class="metric-label">Unfulfilled Today</div>
                            </div>
                            <div class="metric-item">
                                <div class="metric-value">${data.fulfillmentRate.toFixed(1)}%</div>
                                <div class="metric-label">Fulfillment Rate</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Last 7 Days Performance -->
            <div class="section">
                <div class="section-header">
                    <h2>Last 7 Days Performance</h2>
                </div>
                <div class="section-body">
                    <div class="daily-grid">
                        ${data.dailySales.map(day => {
                            const date = new Date(day.date);
                            const isToday = day.date === new Date().toISOString().split('T')[0];
                            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                            
                            return `
                            <div class="daily-row ${isToday ? 'today-highlight' : ''}">
                                <div class="daily-date">
                                    ${dayName}, ${dateStr}
                                    ${isToday ? ' <strong>(Today)</strong>' : ''}
                                </div>
                                <div class="daily-metrics">
                                    <div class="daily-metric">
                                        <div class="daily-value">${formatCurrency(day.revenue)}</div>
                                        <div class="daily-label">Revenue</div>
                                    </div>
                                    <div class="daily-metric">
                                        <div class="daily-value">${formatNumber(day.orders)}</div>
                                        <div class="daily-label">Orders</div>
                                    </div>
                                    <div class="daily-metric">
                                        <div class="daily-value">${formatNumber(day.items)}</div>
                                        <div class="daily-label">Items</div>
                                    </div>
                                </div>
                            </div>
                            `;
                        }).join('')}
                    </div>

                    <!-- 7-Day Summary -->
                    <div class="summary-grid" style="margin-top: 20px;">
                        <div class="summary-card">
                            <div class="summary-value">${formatNumber(data.dailySales.reduce((sum, day) => sum + day.orders, 0))}</div>
                            <div class="summary-label">Total Orders</div>
                        </div>
                        <div class="summary-card">
                            <div class="summary-value">${formatCurrency(data.dailySales.reduce((sum, day) => sum + day.revenue, 0))}</div>
                            <div class="summary-label">Total Revenue</div>
                        </div>
                        <div class="summary-card">
                            <div class="summary-value">${formatCurrency(data.averageDailyRevenue)}</div>
                            <div class="summary-label">Avg Daily Revenue</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Overall Business Summary -->
            <div class="section">
                <div class="section-header">
                    <h2>Business Overview</h2>
                </div>
                <div class="section-body">
                    <div class="summary-grid">
                        <div class="summary-card">
                            <div class="summary-value">${formatNumber(data.totalOrders)}</div>
                            <div class="summary-label">All-Time Orders</div>
                        </div>
                        <div class="summary-card">
                            <div class="summary-value">${formatCurrency(data.totalRevenue)}</div>
                            <div class="summary-label">All-Time Revenue</div>
                        </div>
                        <div class="summary-card">
                            <div class="summary-value">${formatCurrency(data.averageOrderValue)}</div>
                            <div class="summary-label">Avg Order Value</div>
                        </div>
                        <div class="summary-card">
                            <div class="summary-value">${formatNumber(data.ordersLoaded)}</div>
                            <div class="summary-label">Orders Analyzed</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Performance Insight -->
            ${data.revenueChangeVsYesterday !== 0 || data.ordersChangeVsYesterday !== 0 ? `
            <div class="highlight">
                <strong>Performance Insight:</strong><br>
                ${data.revenueChangeVsYesterday > 0 ? `Revenue is up ${formatPercent(data.revenueChangeVsYesterday)} from yesterday.` : ''}
                ${data.revenueChangeVsYesterday < 0 ? `Revenue is down ${formatPercent(Math.abs(data.revenueChangeVsYesterday))} from yesterday.` : ''}
                ${data.revenueChangeVsYesterday === 0 && data.ordersChangeVsYesterday > 0 ? `Order volume is up ${formatPercent(data.ordersChangeVsYesterday)} from yesterday.` : ''}
                ${data.bestDay && data.bestDay.revenue > data.todayRevenue ? `Your best day was ${new Date(data.bestDay.date).toLocaleDateString()} with ${formatCurrency(data.bestDay.revenue)} in revenue.` : ''}
            </div>
            ` : ''}
        </div>

        <!-- Footer -->
        <div class="footer">
            <p class="footer-text">
                This automated report was generated on ${new Date().toLocaleString()}<br>
                Data analyzed from ${formatNumber(data.ordersLoaded)} orders
            </p>
        </div>
    </div>
</body>
</html>
    `;
  }

  private generateTextVersion(data: OrderData, shop: string): string {
    const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
    const formatPercent = (num: number) => `${num >= 0 ? '+' : ''}${num.toFixed(1)}%`;

    return `
ANALYTICS REPORT - ${shop}
${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

TODAY'S PERFORMANCE:
- Orders: ${data.todayOrders} (${formatPercent(data.ordersChangeVsYesterday)} vs yesterday)
- Revenue: ${formatCurrency(data.todayRevenue)} (${formatPercent(data.revenueChangeVsYesterday)} vs yesterday)
- Items Sold: ${data.todayItems} (${formatPercent(data.itemsChangeVsYesterday)} vs yesterday)

CUSTOMER INSIGHTS:
- Total Customers: ${data.totalCustomers}
- New Customers: ${data.newCustomers}
- Repeat Customers: ${data.repeatCustomers}
- Repeat Rate: ${data.repeatCustomerRate.toFixed(1)}%

FULFILLMENT:
- Fulfilled Today: ${data.todayFulfilled}
- Unfulfilled Today: ${data.todayUnfulfilled}
- Fulfillment Rate: ${data.fulfillmentRate.toFixed(1)}%

LAST 7 DAYS:
${data.dailySales.map(day => {
  const date = new Date(day.date);
  return `- ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: ${formatCurrency(day.revenue)} (${day.orders} orders)`;
}).join('\n')}

BUSINESS OVERVIEW:
- All-Time Orders: ${data.totalOrders}
- All-Time Revenue: ${formatCurrency(data.totalRevenue)}
- Average Order Value: ${formatCurrency(data.averageOrderValue)}

Data analyzed from ${data.ordersLoaded} orders.
Generated on ${new Date().toLocaleString()}
    `;
  }
}