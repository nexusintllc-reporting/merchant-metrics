// // ==================== 1. IMPORTS ====================
// import { LoaderFunctionArgs, json } from "@remix-run/node";
// import { useLoaderData, useNavigation } from "@remix-run/react";
// import { authenticate } from "../shopify.server";
// import "../styles/orders.css";
// import { useState, useMemo } from 'react';

// // Chart.js imports
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';

// // ==================== 2. CHART.JS REGISTRATION ====================
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend
// );

// // ==================== 3. TYPES ====================
// interface OrderData {
//   totalOrders: number;
//   fulfilledOrders: number;
//   unfulfilledOrders: number;
//   totalRevenue: number;

//   // New financial metrics
//   totalDiscounts: number;
//   totalShipping: number;
//   totalTaxes: number;
//   totalReturns: number;
//   returnFees: number;
//   netRevenue: number;
//   discountRate: number;
//   shippingRate: number;
//   taxRate: number;
//   returnRate: number;


//   totalItems: number;
//   averageOrderValue: number;
//   averageItemsPerOrder: number;
//   dailySales: Array<{ date: string; revenue: number; orders: number; items: number }>;
//   weeklySales: Array<{ week: string; revenue: number; orders: number; items: number }>;
//   monthlySales: Array<{ month: string; revenue: number; orders: number; items: number }>;
//   todayRevenue: number;
//   todayOrders: number;
//   todayItems: number;
//   yesterdayRevenue: number;
//   yesterdayOrders: number;
//   yesterdayItems: number;
//   lastWeekRevenue: number;
//   lastWeekOrders: number;
//   lastWeekItems: number;
//   todayFulfilled: number;
//   todayUnfulfilled: number;
//   last7DaysFulfilled: number;
//   last7DaysUnfulfilled: number;
//   fulfillmentRate: number;
//   revenueChangeVsYesterday: number;
//   ordersChangeVsYesterday: number;
//   itemsChangeVsYesterday: number;
//   revenueChangeVsLastWeek: number;
//   bestDay: { date: string; revenue: number; orders: number; items: number };
//   averageDailyRevenue: number;
//   totalCustomers: number;
//   repeatCustomers: number;
//   newCustomers: number;
//   repeatCustomerRate: number;
//   last7DaysTotalCustomers: number;
//   last7DaysRepeatCustomers: number;
//   last7DaysNewCustomers: number;
//   last7DaysRepeatCustomerRate: number;
//   customerTypeData: { new: number; repeat: number };
//   fulfillmentStatusData: { fulfilled: number; unfulfilled: number };
//   weeklyRevenueTrend: Array<{ week: string; revenue: number }>;
//   monthlyComparison: Array<{ month: string; revenue: number; orders: number }>;
//   dailyPerformance: Array<{ day: string; revenue: number; orders: number }>;
//   ordersLoaded: number;
//   shopTimezone: string;
//   currentDateInShopTZ: string;
// }

// // ==================== 4. HELPER FUNCTIONS ====================
// function getEmptyData(): Omit<OrderData, 'shopTimezone' | 'currentDateInShopTZ'> {
//   return {
//     totalOrders: 0,
//     fulfilledOrders: 0,
//     unfulfilledOrders: 0,
//     totalRevenue: 0,

// // New financial metrics
//     totalDiscounts: 0,
//     totalShipping: 0,
//     totalTaxes: 0,
//     totalReturns: 0,
//     returnFees: 0,
//     netRevenue: 0,
//     discountRate: 0,
//     shippingRate: 0,
//     taxRate: 0,
//     returnRate: 0,

//     totalItems: 0,
//     averageOrderValue: 0,
//     averageItemsPerOrder: 0,
//     dailySales: [],
//     weeklySales: [],
//     monthlySales: [],
//     todayRevenue: 0,
//     todayOrders: 0,
//     todayItems: 0,
//     yesterdayRevenue: 0,
//     yesterdayOrders: 0,
//     yesterdayItems: 0,
//     lastWeekRevenue: 0,
//     lastWeekOrders: 0,
//     lastWeekItems: 0,
//     todayFulfilled: 0,
//     todayUnfulfilled: 0,
//     last7DaysFulfilled: 0,
//     last7DaysUnfulfilled: 0,
//     fulfillmentRate: 0,
//     revenueChangeVsYesterday: 0,
//     ordersChangeVsYesterday: 0,
//     itemsChangeVsYesterday: 0,
//     revenueChangeVsLastWeek: 0,
//     bestDay: { date: '', revenue: 0, orders: 0, items: 0 },
//     averageDailyRevenue: 0,
//     totalCustomers: 0,
//     repeatCustomers: 0,
//     newCustomers: 0,
//     repeatCustomerRate: 0,
//     last7DaysTotalCustomers: 0,
//     last7DaysRepeatCustomers: 0,
//     last7DaysNewCustomers: 0,
//     last7DaysRepeatCustomerRate: 0,
//     customerTypeData: { new: 0, repeat: 0 },
//     fulfillmentStatusData: { fulfilled: 0, unfulfilled: 0 },
//     weeklyRevenueTrend: [],
//     monthlyComparison: [],
//     dailyPerformance: [],
//     ordersLoaded: 0
//   };
// }

// // ==================== 5. TIMEZONE UTILITIES ====================
// class TimezoneHelper {
//   static getLocalDateKey(utcDate: Date, timezone: string): string {
//     try {
//       return utcDate.toLocaleDateString('en-CA', { 
//         timeZone: timezone,
//         year: 'numeric',
//         month: '2-digit',
//         day: '2-digit'
//       });
//     } catch (error) {
//       console.warn('Timezone conversion failed, using UTC fallback:', error);
//       return utcDate.toISOString().split('T')[0];
//     }
//   }

//   static getCurrentDateInTimezone(timezone: string): string {
//     return this.getLocalDateKey(new Date(), timezone);
//   }

//   static getDateInTimezone(date: Date, timezone: string): string {
//     return this.getLocalDateKey(date, timezone);
//   }

//   static getDateRangeInTimezone(timezone: string, days: number): string[] {
//     const dates: string[] = [];
//     const now = new Date();
    
//     for (let i = 0; i < days; i++) {
//       const date = new Date(now);
//       date.setDate(date.getDate() - i);
//       dates.push(this.getLocalDateKey(date, timezone));
//     }
    
//     return dates.reverse(); // Oldest to newest
//   }

//   static getPreviousDate(currentDate: string, timezone: string): string {
//     try {
//       // Parse the current date in the shop's timezone
//       const current = new Date(currentDate + 'T00:00:00');
//       const previous = new Date(current);
//       previous.setDate(previous.getDate() - 1);
//       return this.getLocalDateKey(previous, timezone);
//     } catch (error) {
//       console.warn('Error calculating previous date:', error);
//       // Fallback calculation
//       const current = new Date(currentDate + 'T00:00:00Z');
//       const previous = new Date(current);
//       previous.setUTCDate(previous.getUTCDate() - 1);
//       return previous.toISOString().split('T')[0];
//     }
//   }

//   static getWeekStartDate(date: Date, timezone: string): Date {
//     const localDateKey = this.getLocalDateKey(date, timezone);
//     const localDate = new Date(localDateKey + 'T00:00:00');
//     const dayOfWeek = localDate.getDay();
//     const weekStart = new Date(localDate);
//     weekStart.setDate(localDate.getDate() - dayOfWeek);
//     return weekStart;
//   }

//   static getMonthKey(date: Date, timezone: string): string {
//     const localDateKey = this.getLocalDateKey(date, timezone);
//     const localDate = new Date(localDateKey + 'T00:00:00');
//     return `${localDate.getFullYear()}-${(localDate.getMonth() + 1).toString().padStart(2, "0")}`;
//   }
// }

// // ==================== 6. DATA PROCESSING ====================
// function processOrdersData(orders: any[], shopTimezone: string = 'UTC'): Omit<OrderData, 'shopTimezone' | 'currentDateInShopTZ'> {
//   // Core metrics
//   const totalOrders = orders.length;
//   const fulfilledOrders = orders.filter((o: any) => o.node.displayFulfillmentStatus === "FULFILLED").length;
//   const unfulfilledOrders = totalOrders - fulfilledOrders;

//   const totalRevenue = orders.reduce((sum: number, o: any) => {
//     const amount = parseFloat(o.node.currentTotalPriceSet?.shopMoney?.amount || '0');
//     return sum + (isNaN(amount) ? 0 : amount);
//   }, 0);

//   const totalItems = orders.reduce((sum: number, o: any) => {
//     const lineItems = o.node.lineItems?.edges || [];
//     const itemsInOrder = lineItems.reduce((itemSum: number, item: any) => {
//       return itemSum + (item.node.quantity || 0);
//     }, 0);
//     return sum + itemsInOrder;
//   }, 0);

//   const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
//   const averageItemsPerOrder = totalOrders > 0 ? totalItems / totalOrders : 0;

//     // NEW: Calculate additional financial metrics
//   const totalDiscounts = orders.reduce((sum: number, o: any) => {
//     const amount = parseFloat(o.node.totalDiscountsSet?.shopMoney?.amount || '0');
//     return sum + (isNaN(amount) ? 0 : amount);
//   }, 0);

//   const totalShipping = orders.reduce((sum: number, o: any) => {
//     const amount = parseFloat(o.node.totalShippingPriceSet?.shopMoney?.amount || '0');
//     return sum + (isNaN(amount) ? 0 : amount);
//   }, 0);

//   const totalTaxes = orders.reduce((sum: number, o: any) => {
//     const amount = parseFloat(o.node.totalTaxSet?.shopMoney?.amount || '0');
//     return sum + (isNaN(amount) ? 0 : amount);
//   }, 0);

//   const totalReturns = orders.reduce((sum: number, o: any) => {
//     const refunds = o.node.refunds || [];
//     const refundAmount = refunds.reduce((refundSum: number, refund: any) => {
//       const amount = parseFloat(refund.totalRefundedSet?.shopMoney?.amount || '0');
//       return refundSum + (isNaN(amount) ? 0 : amount);
//     }, 0);
//     return sum + refundAmount;
//   }, 0);

//   // Calculate derived metrics
//   const netRevenue = totalRevenue - totalReturns;
//   const discountRate = totalRevenue > 0 ? (totalDiscounts / totalRevenue) * 100 : 0;
//   const shippingRate = totalRevenue > 0 ? (totalShipping / totalRevenue) * 100 : 0;
//   const taxRate = totalRevenue > 0 ? (totalTaxes / totalRevenue) * 100 : 0;
//   const returnRate = totalRevenue > 0 ? (totalReturns / totalRevenue) * 100 : 0;

//   // ==================== FIXED: PROPER TIMEZONE HANDLING ====================
//   const salesByDay: Record<string, { revenue: number; orders: number; items: number }> = {};
//   const salesByWeek: Record<string, { revenue: number; orders: number; items: number }> = {};
//   const salesByMonth: Record<string, { revenue: number; orders: number; items: number }> = {};

//   // FIXED: Get current date IN SHOP'S TIMEZONE
//   const currentDateInShopTZ = TimezoneHelper.getCurrentDateInTimezone(shopTimezone);
//   const yesterdayInShopTZ = TimezoneHelper.getPreviousDate(currentDateInShopTZ, shopTimezone);
//   const lastWeekSameDayInShopTZ = TimezoneHelper.getPreviousDate(currentDateInShopTZ, shopTimezone);
  
//   // FIXED: Generate last 7 days in shop's timezone
//   const last7DaysKeys = TimezoneHelper.getDateRangeInTimezone(shopTimezone, 7);

//   let todayRevenue = 0;
//   let todayOrders = 0;
//   let todayItems = 0;
//   let yesterdayRevenue = 0;
//   let yesterdayOrders = 0;
//   let yesterdayItems = 0;
//   let lastWeekRevenue = 0;
//   let lastWeekOrders = 0;
//   let lastWeekItems = 0;

//   let todayFulfilled = 0;
//   let todayUnfulfilled = 0;
//   let last7DaysFulfilled = 0;
//   let last7DaysUnfulfilled = 0;

//   // Process each order with proper timezone conversion
//   orders.forEach((o: any) => {
//     const createdAtUTC = new Date(o.node.createdAt);
//     const revenue = parseFloat(o.node.currentTotalPriceSet?.shopMoney?.amount || '0');
    
//     const lineItems = o.node.lineItems?.edges || [];
//     const itemsInOrder = lineItems.reduce((sum: number, item: any) => {
//       return sum + (item.node.quantity || 0);
//     }, 0);
    
//     // Convert UTC order date to shop's local date
//     const dateKey = TimezoneHelper.getLocalDateKey(createdAtUTC, shopTimezone);
    
//     // FIXED: Compare using shop's timezone dates
//     const isToday = dateKey === currentDateInShopTZ;
//     const isYesterday = dateKey === yesterdayInShopTZ;
//     const isLastWeekSameDay = dateKey === lastWeekSameDayInShopTZ;
//     const isLast7Days = last7DaysKeys.includes(dateKey);

//     // Today's metrics (in shop's timezone)
//     if (isToday) {
//       todayRevenue += revenue;
//       todayOrders += 1;
//       todayItems += itemsInOrder;
      
//       if (o.node.displayFulfillmentStatus === "FULFILLED") {
//         todayFulfilled += 1;
//       } else {
//         todayUnfulfilled += 1;
//       }
//     }
    
//     // Yesterday's metrics (in shop's timezone)
//     if (isYesterday) {
//       yesterdayRevenue += revenue;
//       yesterdayOrders += 1;
//       yesterdayItems += itemsInOrder;
//     }
    
//     // Last week metrics (in shop's timezone)
//     if (isLastWeekSameDay) {
//       lastWeekRevenue += revenue;
//       lastWeekOrders += 1;
//       lastWeekItems += itemsInOrder;
//     }

//     // Last 7 days fulfillment (in shop's timezone)
//     if (isLast7Days) {
//       if (o.node.displayFulfillmentStatus === "FULFILLED") {
//         last7DaysFulfilled += 1;
//       } else {
//         last7DaysUnfulfilled += 1;
//       }
//     }

//     // Daily aggregation (using shop's timezone)
//     if (!salesByDay[dateKey]) {
//       salesByDay[dateKey] = { revenue: 0, orders: 0, items: 0 };
//     }
//     salesByDay[dateKey].revenue += revenue;
//     salesByDay[dateKey].orders += 1;
//     salesByDay[dateKey].items += itemsInOrder;

//     // Weekly aggregation (using shop's timezone)
//     const weekStart = TimezoneHelper.getWeekStartDate(createdAtUTC, shopTimezone);
//     const weekKey = `${weekStart.getFullYear()}-W${Math.ceil((weekStart.getDate() + 6) / 7)}`;
    
//     if (!salesByWeek[weekKey]) {
//       salesByWeek[weekKey] = { revenue: 0, orders: 0, items: 0 };
//     }
//     salesByWeek[weekKey].revenue += revenue;
//     salesByWeek[weekKey].orders += 1;
//     salesByWeek[weekKey].items += itemsInOrder;

//     // Monthly aggregation (using shop's timezone)
//     const monthKey = TimezoneHelper.getMonthKey(createdAtUTC, shopTimezone);
//     if (!salesByMonth[monthKey]) {
//       salesByMonth[monthKey] = { revenue: 0, orders: 0, items: 0 };
//     }
//     salesByMonth[monthKey].revenue += revenue;
//     salesByMonth[monthKey].orders += 1;
//     salesByMonth[monthKey].items += itemsInOrder;
//   });

//   // Customer analytics
//   const customerOrderCount: Record<string, number> = {};
//   orders.forEach((o: any) => {
//     const customerId = o.node.customer?.id;
//     if (customerId) {
//       customerOrderCount[customerId] = (customerOrderCount[customerId] || 0) + 1;
//     }
//   });

//   const totalCustomers = Object.keys(customerOrderCount).length;
//   const repeatCustomers = Object.values(customerOrderCount).filter(count => count > 1).length;
//   const repeatCustomerRate = totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0;
//   const newCustomers = totalCustomers - repeatCustomers;

//   // Last 7 days customer analytics (using shop's timezone)
//   const last7DaysCustomers: Record<string, number> = {};
//   orders.forEach((o: any) => {
//     const createdAtUTC = new Date(o.node.createdAt);
//     const dateKey = TimezoneHelper.getLocalDateKey(createdAtUTC, shopTimezone);
    
//     if (last7DaysKeys.includes(dateKey)) {
//       const customerId = o.node.customer?.id;
//       if (customerId) {
//         last7DaysCustomers[customerId] = (last7DaysCustomers[customerId] || 0) + 1;
//       }
//     }
//   });

//   const last7DaysTotalCustomers = Object.keys(last7DaysCustomers).length;
//   const last7DaysRepeatCustomers = Object.values(last7DaysCustomers).filter(count => count > 1).length;
//   const last7DaysRepeatCustomerRate = last7DaysTotalCustomers > 0 ? (last7DaysRepeatCustomers / last7DaysTotalCustomers) * 100 : 0;
//   const last7DaysNewCustomers = last7DaysTotalCustomers - last7DaysRepeatCustomers;

//   // FIXED: Process daily data using shop's timezone
//   const dailySales = last7DaysKeys.map(date => {
//     const dayData = salesByDay[date] || { revenue: 0, orders: 0, items: 0 };
//     return {
//       date,
//       revenue: dayData.revenue,
//       orders: dayData.orders,
//       items: dayData.items
//     };
//   });

//   // Process weekly data (last 8 weeks)
//   const weeklyEntries = Object.entries(salesByWeek)
//     .sort((a, b) => a[0].localeCompare(b[0]))
//     .slice(-8);

//   const weeklySales = weeklyEntries.map(([week, data]) => ({
//     week,
//     revenue: data.revenue,
//     orders: data.orders,
//     items: data.items
//   }));

//   // Process monthly data (last 6 months)
//   const monthlyEntries = Object.entries(salesByMonth)
//     .sort((a, b) => a[0].localeCompare(b[0]))
//     .slice(-6);

//   const monthlySales = monthlyEntries.map(([month, data]) => ({
//     month,
//     revenue: data.revenue,
//     orders: data.orders,
//     items: data.items
//   }));

//   // Additional metrics
//   const fulfillmentRate = totalOrders > 0 ? (fulfilledOrders / totalOrders) * 100 : 0;
  
//   const revenueChangeVsYesterday = yesterdayRevenue > 0 
//     ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 
//     : todayRevenue > 0 ? 100 : 0;
  
//   const ordersChangeVsYesterday = yesterdayOrders > 0 
//     ? ((todayOrders - yesterdayOrders) / yesterdayOrders) * 100 
//     : todayOrders > 0 ? 100 : 0;

//   const itemsChangeVsYesterday = yesterdayItems > 0 
//     ? ((todayItems - yesterdayItems) / yesterdayItems) * 100 
//     : todayItems > 0 ? 100 : 0;
  
//   const revenueChangeVsLastWeek = lastWeekRevenue > 0 
//     ? ((todayRevenue - lastWeekRevenue) / lastWeekRevenue) * 100 
//     : todayRevenue > 0 ? 100 : 0;

//   const bestDay = dailySales.reduce((best, current) => 
//     current.revenue > best.revenue ? current : best, { date: '', revenue: 0, orders: 0, items: 0 }
//   );

//   const averageDailyRevenue = dailySales.length > 0 
//     ? dailySales.reduce((sum, day) => sum + day.revenue, 0) / dailySales.length 
//     : 0;

//   // Chart data
//   const customerTypeData = {
//     new: newCustomers,
//     repeat: repeatCustomers
//   };

//   const fulfillmentStatusData = {
//     fulfilled: fulfilledOrders,
//     unfulfilled: unfulfilledOrders
//   };

//   const weeklyRevenueTrend = weeklySales.map(week => ({
//     week: `Week ${week.week.split('-W')[1]}`,
//     revenue: week.revenue
//   }));

//   const monthlyComparison = monthlySales.map(month => {
//     const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//     const monthNumber = parseInt(month.month.split('-')[1]);
//     return {
//       month: monthNames[monthNumber - 1],
//       revenue: month.revenue,
//       orders: month.orders
//     };
//   });

//   const dailyPerformance = dailySales.map(day => {
//     const date = new Date(day.date);
//     const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//     return {
//       day: dayNames[date.getDay()],
//       revenue: day.revenue,
//       orders: day.orders
//     };
//   });

//   return {
//     // Core metrics
//     totalOrders,
//     fulfilledOrders,
//     unfulfilledOrders,
//     totalRevenue,
// // New financial metrics
//     totalDiscounts,
//     totalShipping,
//     totalTaxes,
//     totalReturns,
//     returnFees: totalReturns,
//     netRevenue,
//     discountRate,
//     shippingRate,
//     taxRate,
//     returnRate,

//     totalItems,
//     averageOrderValue,
//     averageItemsPerOrder,
//     dailySales,
//     weeklySales,
//     monthlySales,
    
//     // Today's performance metrics
//     todayRevenue,
//     todayOrders,
//     todayItems,
//     yesterdayRevenue,
//     yesterdayOrders,
//     yesterdayItems,
//     lastWeekRevenue,
//     lastWeekOrders,
//     lastWeekItems,
    
//     // Fulfillment metrics
//     todayFulfilled,
//     todayUnfulfilled,
//     last7DaysFulfilled,
//     last7DaysUnfulfilled,
    
//     // Calculated metrics
//     fulfillmentRate,
//     revenueChangeVsYesterday,
//     ordersChangeVsYesterday,
//     itemsChangeVsYesterday,
//     revenueChangeVsLastWeek,
//     bestDay,
//     averageDailyRevenue,

//     // Customer metrics
//     totalCustomers,
//     repeatCustomers,
//     newCustomers,
//     repeatCustomerRate,

//     // 7-Day Customer metrics
//     last7DaysTotalCustomers,
//     last7DaysRepeatCustomers,
//     last7DaysNewCustomers, 
//     last7DaysRepeatCustomerRate,

//     // Chart data
//     customerTypeData,
//     fulfillmentStatusData,
//     weeklyRevenueTrend,
//     monthlyComparison,
//     dailyPerformance,

//     // Debug info
//     ordersLoaded: orders.length,
//   };
// }

// // ==================== 7. LOADER FUNCTION ====================
// export const loader = async ({ request }: LoaderFunctionArgs) => {
//   try {
//     const { admin, session } = await authenticate.admin(request);
//     const shop = session.shop;

//     // Get shop timezone from Shopify
//     const shopResponse = await admin.graphql(`
//       {
//         shop {
//           ianaTimezone
//         }
//       }
//     `);
    
//     const shopData = await shopResponse.json() as any;
//     const shopTimezone = shopData.data?.shop?.ianaTimezone || 'UTC';

//     // ==================== FETCH ORDERS WITH PAGINATION ====================
//     let allOrders: any[] = [];
//     let hasNextPage = true;
//     let endCursor: string | null = null;

//     while (hasNextPage && allOrders.length < 1000) {
//       const ordersQuery = `
//   {
//     orders(
//       first: 250, 
//       ${endCursor ? `after: "${endCursor}",` : ''}
//       sortKey: CREATED_AT, 
//       reverse: true
//     ) {
//       pageInfo {
//         hasNextPage
//         endCursor
//       }
//       edges {
//         node {
//           id
//           createdAt
//           displayFulfillmentStatus
//           currentTotalPriceSet {
//             shopMoney {
//               amount
//             }
//           }
//           totalShippingPriceSet {
//             shopMoney {
//               amount
//             }
//           }
//           totalTaxSet {
//             shopMoney {
//               amount
//             }
//           }
//           totalDiscountsSet {
//             shopMoney {
//               amount
//             }
//           }
//                           lineItems(first: 10) {
//             edges {
//               node {
//                 quantity
//                 originalTotalSet {
//                   shopMoney {
//                     amount
//                   }
//                 }
//                 discountedTotalSet {
//                   shopMoney {
//                     amount
//                   }
//                 }
//               }
//             }
//           }
//           refunds {
//             totalRefundedSet {
//               shopMoney {
//                 amount
//               }
//             }
//           }
//                 customer {
//                   id
//                 }
//               }
//             }
//           }
//         }
//       `;

//       const ordersResponse = await admin.graphql(ordersQuery);
//       const ordersData = await ordersResponse.json() as any;
      
//       if (ordersData.errors) {
//         throw new Error(ordersData.errors[0]?.message || "Failed to fetch orders");
//       }
      
//       const ordersPage = ordersData.data?.orders?.edges || [];
//       allOrders = [...allOrders, ...ordersPage];
      
//       hasNextPage = ordersData.data?.orders?.pageInfo?.hasNextPage || false;
//       endCursor = ordersData.data?.orders?.pageInfo?.endCursor;
      
//       if (!hasNextPage || allOrders.length >= 1000) break;
//     }

//     const orders = allOrders;

//     // ==================== RETURN EMPTY DATA IF NO ORDERS ====================
//     if (orders.length === 0) {
//       return json({ 
//         ...getEmptyData(), 
//         shopTimezone,
//         currentDateInShopTZ: TimezoneHelper.getCurrentDateInTimezone(shopTimezone)
//       });
//     }

//     // ==================== PROCESS ORDERS DATA ====================
//     const processedData = processOrdersData(orders, shopTimezone);
//     return json({ 
//       ...processedData, 
//       shopTimezone,
//       currentDateInShopTZ: TimezoneHelper.getCurrentDateInTimezone(shopTimezone)
//     });
    
//   } catch (error: any) {
//     console.error('Error in orders loader:', error);
//     return json({ 
//       ...getEmptyData(), 
//       shopTimezone: 'UTC',
//       currentDateInShopTZ: TimezoneHelper.getCurrentDateInTimezone('UTC')
//     });
//   }
// };

// // ==================== 8. ICON COMPONENTS ====================
// const Icon = {
//   Print: () => (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
//       <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>
//     </svg>
//   ),
//   TrendUp: () => (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
//       <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
//     </svg>
//   ),
//   TrendDown: () => (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
//       <path d="M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z"/>
//     </svg>
//   )
// };

// // ==================== 9. LOADING COMPONENT ====================
// function LoadingProgress() {
//   const loadingSteps = [
//     "Fetching recent orders...",
//     "Analyzing revenue data...", 
//     "Processing customer insights...",
//     "Calculating fulfillment rates...",
//     "Generating sales analytics..."
//   ];

//   return (
//     <div className="loading-progress-container">
//       <div className="loading-header">
//         <h2>Loading Orders Dashboard</h2>
//         <p>Analyzing your order data and generating insights...</p>
//       </div>
      
//       <div className="progress-bar-container">
//         <div className="progress-bar">
//           <div className="progress-fill"></div>
//         </div>
//       </div>

//       <div className="loading-steps">
//         {loadingSteps.map((step, index) => (
//           <div key={index} className="loading-step">
//             <div className="step-indicator">⟳</div>
//             <div className="step-text">{step}</div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // ==================== 10. MAIN COMPONENT ====================
// export default function Orders() {
//   const data = useLoaderData<typeof loader>();
//   const navigation = useNavigation();
//   const [isExporting, setIsExporting] = useState(false);

//   const isLoading = navigation.state === 'loading';

//   // ==================== HELPER FUNCTIONS ====================
//   const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
//   const formatNumber = (num: number) => num.toFixed(0);
//   const formatPercent = (num: number) => `${num.toFixed(1)}%`;

//   // ==================== CHART DATA MEMOIZATION ====================
//   const chartData = useMemo(() => {
//     return {
//       customerDistribution: {
//         labels: ['New Customers', 'Repeat Customers'],
//         datasets: [
//           {
//             data: [data.customerTypeData.new, data.customerTypeData.repeat],
//             backgroundColor: ['#f59e0b', '#10b981'],
//             borderWidth: 2,
//             borderColor: '#fff'
//           }
//         ]
//       },
//       orderFulfillment: {
//         labels: ['Fulfilled', 'Unfulfilled'],
//         datasets: [
//           {
//             data: [data.fulfillmentStatusData.fulfilled, data.fulfillmentStatusData.unfulfilled],
//             backgroundColor: ['#10b981', '#ef4444'],
//             borderWidth: 2,
//             borderColor: '#fff'
//           }
//         ]
//       },
//       weeklyRevenue: {
//         labels: data.weeklyRevenueTrend.map(w => w.week),
//         datasets: [
//           {
//             label: 'Revenue',
//             data: data.weeklyRevenueTrend.map(w => w.revenue),
//             borderColor: '#3b82f6',
//             backgroundColor: 'rgba(59, 130, 246, 0.1)',
//             tension: 0.4,
//             fill: true,
//             borderWidth: 2,
//             pointBackgroundColor: '#3b82f6',
//             pointBorderColor: '#fff',
//             pointBorderWidth: 2,
//             pointRadius: 3,
//             pointHoverRadius: 5
//           }
//         ]
//       },
//       monthlyPerformance: {
//         labels: data.monthlyComparison.map(m => m.month),
//         datasets: [
//           {
//             label: 'Revenue',
//             data: data.monthlyComparison.map(m => m.revenue),
//             backgroundColor: 'rgba(59, 130, 246, 0.8)',
//             borderRadius: 4,
//             borderSkipped: false,
//           },
//           {
//             label: 'Orders',
//             data: data.monthlyComparison.map(m => m.orders),
//             backgroundColor: 'rgba(139, 92, 246, 0.8)',
//             borderRadius: 4,
//             borderSkipped: false,
//           }
//         ]
//       }
//     };
//   }, [data]);

//   // ==================== CHART OPTIONS MEMOIZATION ====================
//   const chartOptions = useMemo(() => ({
//     pie: {
//       responsive: true,
//       maintainAspectRatio: false,
//       plugins: { legend: { display: false } },
//       animation: {
//         duration: 500,
//         easing: 'easeOutQuart' as const
//       }
//     },
//     line: {
//       responsive: true,
//       maintainAspectRatio: false,
//       plugins: { 
//         legend: { display: false },
//         tooltip: {
//           mode: 'index' as const,
//           intersect: false
//         }
//       },
//       interaction: {
//         mode: 'nearest' as const,
//         axis: 'x' as const,
//         intersect: false
//       },
//       scales: {
//         x: {
//           grid: { display: false }
//         },
//         y: {
//           beginAtZero: true,
//           ticks: {
//             callback: function(this: any, value: any) {
//               return '$' + value;
//             }
//           },
//           grid: { color: 'rgba(0, 0, 0, 0.1)' }
//         }
//       },
//       animation: {
//         duration: 600,
//         easing: 'easeOutQuart' as const
//       }
//     },
//     bar: {
//       responsive: true,
//       maintainAspectRatio: false,
//       plugins: { 
//         legend: { display: false },
//         tooltip: {
//           mode: 'index' as const,
//           intersect: false
//         }
//       },
//       interaction: {
//         mode: 'index' as const,
//         intersect: false
//       },
//       scales: {
//         x: { grid: { display: false } },
//         y: { 
//           beginAtZero: true,
//           grid: { color: 'rgba(0, 0, 0, 0.1)' }
//         }
//       },
//       animation: {
//         duration: 600,
//         easing: 'easeOutQuart' as const
//       }
//     }
//   }), []);

//   // ==================== INDIVIDUAL CHART COMPONENTS ====================
//   const CustomerDistributionChart = useMemo(() => (
//     <Pie 
//       data={chartData.customerDistribution}
//       options={chartOptions.pie}
//       height={120}
//       redraw={false}
//     />
//   ), [chartData.customerDistribution, chartOptions.pie]);

//   const OrderFulfillmentChart = useMemo(() => (
//     <Doughnut 
//       data={chartData.orderFulfillment}
//       options={chartOptions.pie}
//       height={120}
//       redraw={false}
//     />
//   ), [chartData.orderFulfillment, chartOptions.pie]);

//   const RevenueTrendChart = useMemo(() => (
//     <Line 
//       data={chartData.weeklyRevenue}
//       options={chartOptions.line}
//       height={120}
//       redraw={false}
//     />
//   ), [chartData.weeklyRevenue, chartOptions.line]);

//   const MonthlyPerformanceChart = useMemo(() => (
//     <Bar 
//       data={chartData.monthlyPerformance}
//       options={chartOptions.bar}
//       height={120}
//       redraw={false}
//     />
//   ), [chartData.monthlyPerformance, chartOptions.bar]);

//   // ==================== LOADING STATE ====================
//   if (isLoading) {
//     return (
//       <div className="orders-dashboard">
//         <div className="dashboard-header">
//           <h1>Orders Dashboard</h1>
//         </div>
//         <LoadingProgress />
//       </div>
//     );
//   }

//   // ==================== COMPONENT RENDER ====================
//   return (
//     <div className="orders-dashboard">
//       {/* DASHBOARD HEADER */}
//       <div className="dashboard-header">
//         <h1>Orders Dashboard</h1>
//         <button
//           className="print-button"
//           onClick={() => window.print()}
//           disabled={isExporting}
//         >
//           <Icon.Print />
//           Print Report
//         </button>
//       </div>

//       {/* MAIN DASHBOARD CONTENT */}
//       <div id="dashboard-content">
        
//         {/* TODAY'S PERFORMANCE SECTION */}
//         <div className="today-performance">
//           <h2>Today's Performance</h2>
          
//           {/* Primary Metrics Grid */}
//           <div className="primary-metrics-grid">
//             <div className={`metric-card orders ${data.ordersChangeVsYesterday >= 0 ? 'positive' : 'negative'}`}>
//               <p className="metric-value">{formatNumber(data.todayOrders)}</p>
//               <p className="metric-label">Today's Orders</p>
//               {data.ordersChangeVsYesterday !== 0 && (
//                 <div className={`metric-change ${data.ordersChangeVsYesterday >= 0 ? 'positive' : 'negative'}`}>
//                   {data.ordersChangeVsYesterday >= 0 ? <Icon.TrendUp /> : <Icon.TrendDown />} 
//                   {Math.abs(data.ordersChangeVsYesterday).toFixed(1)}% vs yesterday
//                 </div>
//               )}
//             </div>
            
//             <div className={`metric-card revenue ${data.revenueChangeVsYesterday >= 0 ? 'positive' : 'negative'}`}>
//               <p className="metric-value">{formatCurrency(data.todayRevenue)}</p>
//               <p className="metric-label">Today's Revenue</p>
//               {data.revenueChangeVsYesterday !== 0 && (
//                 <div className={`metric-change ${data.revenueChangeVsYesterday >= 0 ? 'positive' : 'negative'}`}>
//                   {data.revenueChangeVsYesterday >= 0 ? <Icon.TrendUp /> : <Icon.TrendDown />} 
//                   {Math.abs(data.revenueChangeVsYesterday).toFixed(1)}% vs yesterday
//                 </div>
//               )}
//             </div>
            
//             <div className={`metric-card items ${data.itemsChangeVsYesterday >= 0 ? 'positive' : 'negative'}`}>
//               <p className="metric-value">{formatNumber(data.todayItems)}</p>
//               <p className="metric-label">Items Ordered</p>
//               {data.itemsChangeVsYesterday !== 0 && (
//                 <div className={`metric-change ${data.itemsChangeVsYesterday >= 0 ? 'positive' : 'negative'}`}>
//                   {data.itemsChangeVsYesterday >= 0 ? <Icon.TrendUp /> : <Icon.TrendDown />} 
//                   {Math.abs(data.itemsChangeVsYesterday).toFixed(1)}% vs yesterday
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* FULFILLMENT METRICS */}
//           <div className="fulfillment-metrics-grid">
//             <div className="fulfillment-metric-card today-fulfilled">
//               <div className="fulfillment-metric-value">{formatNumber(data.todayFulfilled)}</div>
//               <div className="fulfillment-metric-label">Fulfilled Today</div>
//               <div className="fulfillment-metric-period">Today</div>
//             </div>
            
//             <div className="fulfillment-metric-card today-unfulfilled">
//               <div className="fulfillment-metric-value">{formatNumber(data.todayUnfulfilled)}</div>
//               <div className="fulfillment-metric-label">Unfulfilled Today</div>
//               <div className="fulfillment-metric-period">Today</div>
//             </div>
            
//             <div className="fulfillment-metric-card week-fulfilled">
//               <div className="fulfillment-metric-value">{formatNumber(data.last7DaysFulfilled)}</div>
//               <div className="fulfillment-metric-label">Fulfilled</div>
//               <div className="fulfillment-metric-period">Last 7 Days</div>
//             </div>
            
//             <div className="fulfillment-metric-card week-unfulfilled">
//               <div className="fulfillment-metric-value">{formatNumber(data.last7DaysUnfulfilled)}</div>
//               <div className="fulfillment-metric-label">Unfulfilled</div>
//               <div className="fulfillment-metric-period">Last 7 Days</div>
//             </div>
//           </div>


//            {/* LAST 7 DAYS SUMMARY */}
//           <div className="last7days-section">
//             <h3>Last 7 Days Performance</h3>
            
//             {/* 7 Days Totals */}
//             <div className="last7days-grid">
//               <div className="last7days-total-card">
//                 <div className="last7days-total-value">
//                   {formatNumber(data.dailySales.reduce((sum, day) => sum + day.orders, 0))}
//                 </div>
//                 <div className="last7days-total-label">Total Orders</div>
//               </div>
              
//               <div className="last7days-total-card">
//                 <div className="last7days-total-value">
//                   {formatCurrency(data.dailySales.reduce((sum, day) => sum + day.revenue, 0))}
//                 </div>
//                 <div className="last7days-total-label">Total Revenue</div>
//               </div>
              
//               <div className="last7days-total-card">
//                 <div className="last7days-total-value">
//                   {formatNumber(data.dailySales.reduce((sum, day) => sum + day.items, 0))}
//                 </div>
//                 <div className="last7days-total-label">Total Items</div>
//               </div>
              
//               <div className="last7days-total-card">
//                 <div className="last7days-total-value">
//                   {formatCurrency(data.averageDailyRevenue)}
//                 </div>
//                 <div className="last7days-total-label">Avg Daily Revenue</div>
//               </div>
//             </div>

       

// {/* Daily Breakdown */}
// <div className="daily-breakdown">
//   <h4>Daily Breakdown</h4>
//   <div className="daily-cards-container">
//     {data.dailySales.map((day, index) => {
//       // Parse the date correctly from YYYY-MM-DD format
//       const [year, month, dayNum] = day.date.split('-').map(Number);
//       const date = new Date(year, month - 1, dayNum); // month is 0-indexed in Date
      
//       const isToday = day.date === data.currentDateInShopTZ;
//       const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
//       return (
//         <div key={day.date} className={`daily-card ${isToday ? 'today' : ''}`}>
//           <div className="daily-card-header">
//             <div className="daily-date">
//               {date.getDate()}/{date.getMonth() + 1}
//             </div>
//             <div className="daily-day">
//               {dayNames[date.getDay()]}
//             </div>
//           </div>
          
//           <div className="daily-metrics">
//             <div className="daily-metric orders">
//               <span className="daily-metric-label">Orders</span>
//               <span className="daily-metric-value">{formatNumber(day.orders)}</span>
//             </div>
            
//             <div className="daily-metric revenue">
//               <span className="daily-metric-label">Revenue</span>
//               <span className="daily-metric-value">{formatCurrency(day.revenue)}</span>
//             </div>
            
//             <div className="daily-metric items">
//               <span className="daily-metric-label">Items</span>
//               <span className="daily-metric-value">{formatNumber(day.items)}</span>
//             </div>
//           </div>
//         </div>
//       );
//     })}
//   </div>
// </div>
//           </div>
//         </div>

//           {/* WEEK-OVER-WEEK INSIGHT */}
//           <div className="secondary-metrics">
//             <div className="insight-card">
//               <h4>Week-over-Week Revenue Change</h4>
//               <p className={`insight-value ${data.revenueChangeVsLastWeek >= 0 ? 'text-positive' : 'text-negative'}`}>
//                 {data.revenueChangeVsLastWeek >= 0 ? <Icon.TrendUp /> : <Icon.TrendDown />} 
//                 {Math.abs(data.revenueChangeVsLastWeek).toFixed(1)}%
//               </p>
//             </div>
//           </div>

//           {/* CUSTOMER INSIGHTS */}
//           <div className="customer-metrics">
//             <h3>Customer Insights</h3>
//             <div className="customer-metrics-grid">
//               <div className="customer-metric-card total-customers">
//                 <div className="customer-metric-value">{formatNumber(data.totalCustomers)}</div>
//                 <div className="customer-metric-label">Total Customers</div>
//               </div>
              
//               <div className="customer-metric-card new-customers">
//                 <div className="customer-metric-value">{formatNumber(data.newCustomers)}</div>
//                 <div className="customer-metric-label">New Customers</div>
//               </div>
              
//               <div className="customer-metric-card repeat-customers">
//                 <div className="customer-metric-value">{formatNumber(data.repeatCustomers)}</div>
//                 <div className="customer-metric-label">Repeat Customers</div>
//               </div>
              
//               <div className="customer-metric-card loyalty-rate">
//                 <div className="customer-metric-value">{formatPercent(data.repeatCustomerRate)}</div>
//                 <div className="customer-metric-label">Repeat Customer Rate</div>
//               </div>
//             </div>
//          </div>
  
//           {/* 7-DAY CUSTOMER INSIGHTS */}
//           <div className="customer-metrics">
//             <h3>Last 7 Days Customer Insights</h3>
            
//             <div className="customer-metrics-grid">
//               <div className="customer-metric-card total-customers">
//                 <div className="customer-metric-value">{formatNumber(data.last7DaysTotalCustomers)}</div>
//                 <div className="customer-metric-label">7-Day Total Customers</div>
//               </div>
              
//               <div className="customer-metric-card new-customers">
//                 <div className="customer-metric-value">{formatNumber(data.last7DaysNewCustomers)}</div>
//                 <div className="customer-metric-label">7-Day New Customers</div>
//               </div>
              
//               <div className="customer-metric-card repeat-customers">
//                 <div className="customer-metric-value">{formatNumber(data.last7DaysRepeatCustomers)}</div>
//                 <div className="customer-metric-label">7-Day Repeat Customers</div>
//               </div>
              
//               <div className="customer-metric-card loyalty-rate">
//                 <div className="customer-metric-value">{formatPercent(data.last7DaysRepeatCustomerRate)}</div>
//                 <div className="customer-metric-label">7-Day Repeat Rate</div>
//               </div>
//             </div>
//           </div>

//    {/* FINANCIAL METRICS SECTION */}
//           <div className="financial-metrics">
//             <h3>Financial Breakdown</h3>
//             <div className="financial-metrics-grid">
//               <div className="financial-metric-card discounts">
//                 <div className="financial-metric-value">{formatCurrency(data.totalDiscounts)}</div>
//                 <div className="financial-metric-label">Total Discounts</div>
//                 <div className="financial-metric-rate">{formatPercent(data.discountRate)} of revenue</div>
//               </div>
              
//               <div className="financial-metric-card shipping">
//                 <div className="financial-metric-value">{formatCurrency(data.totalShipping)}</div>
//                 <div className="financial-metric-label">Shipping Charges</div>
//                 <div className="financial-metric-rate">{formatPercent(data.shippingRate)} of revenue</div>
//               </div>
              
//               <div className="financial-metric-card taxes">
//                 <div className="financial-metric-value">{formatCurrency(data.totalTaxes)}</div>
//                 <div className="financial-metric-label">Taxes Collected</div>
//                 <div className="financial-metric-rate">{formatPercent(data.taxRate)} of revenue</div>
//               </div>
              
//               <div className="financial-metric-card returns">
//                 <div className="financial-metric-value">{formatCurrency(data.totalReturns)}</div>
//                 <div className="financial-metric-label">Returns & Refunds</div>
//                 <div className="financial-metric-rate">{formatPercent(data.returnRate)} of revenue</div>
//               </div>
              
//               <div className="financial-metric-card net-revenue">
//                 <div className="financial-metric-value">{formatCurrency(data.netRevenue)}</div>
//                 <div className="financial-metric-label">Net Revenue</div>
//                 <div className="financial-metric-rate">After returns</div>
//               </div>
//             </div>
//           </div>




        

//         {/* CHARTS & ANALYTICS SECTION */}
//         <div className="charts-section">
//           <h2>Advanced Analytics & Insights</h2>
          
//           <div className="charts-grid">
//             {/* Customer Distribution Pie Chart */}
//             <div className="chart-container">
//               <div className="chart-header">
//                 <div className="chart-title">Customer Distribution</div>
//                 <div className="chart-legend">
//                   <div className="legend-item">
//                     <div className="legend-color new"></div>
//                     <span>New</span>
//                   </div>
//                   <div className="legend-item">
//                     <div className="legend-color repeat"></div>
//                     <span>Repeat</span>
//                   </div>
//                 </div>
//               </div>
//               {CustomerDistributionChart}
//               <div className="mini-stats">
//                 <div className="mini-stat-card">
//                   <div className="mini-stat-value">{formatPercent(data.repeatCustomerRate)}</div>
//                   <div className="mini-stat-label">Repeat Rate</div>
//                 </div>
//                 <div className="mini-stat-card">
//                   <div className="mini-stat-value">{formatNumber(data.totalCustomers)}</div>
//                   <div className="mini-stat-label">Total Customers</div>
//                 </div>
//               </div>
//             </div>

//             {/* Order Status Doughnut Chart */}
//             <div className="chart-container">
//               <div className="chart-header">
//                 <div className="chart-title">Order Fulfillment</div>
//                 <div className="chart-legend">
//                   <div className="legend-item">
//                     <div className="legend-color fulfilled"></div>
//                     <span>Fulfilled</span>
//                   </div>
//                   <div className="legend-item">
//                     <div className="legend-color unfulfilled"></div>
//                     <span>Unfulfilled</span>
//                   </div>
//                 </div>
//               </div>
//               {OrderFulfillmentChart}
//               <div className="mini-stats">
//                 <div className="mini-stat-card">
//                   <div className="mini-stat-value">{formatPercent(data.fulfillmentRate)}</div>
//                   <div className="mini-stat-label">Fulfillment Rate</div>
//                 </div>
//                 <div className="mini-stat-card">
//                   <div className="mini-stat-value">{formatNumber(data.totalOrders)}</div>
//                   <div className="mini-stat-label">Total Orders</div>
//                 </div>
//               </div>
//             </div>

//             {/* Revenue Trend Line Chart */}
//             <div className="chart-container">
//               <div className="chart-header">
//                 <div className="chart-title">Weekly Revenue</div>
//                 <div className="chart-legend">
//                   <div className="legend-item">
//                     <div className="legend-color revenue"></div>
//                     <span>Revenue</span>
//                   </div>
//                 </div>
//               </div>
//               {RevenueTrendChart}
//             </div>

//             {/* Monthly Performance Bar Chart */}
//             <div className="chart-container">
//               <div className="chart-header">
//                 <div className="chart-title">Monthly Performance</div>
//                 <div className="chart-legend">
//                   <div className="legend-item">
//                     <div className="legend-color revenue"></div>
//                     <span>Revenue</span>
//                   </div>
//                   <div className="legend-item">
//                     <div className="legend-color orders"></div>
//                     <span>Orders</span>
//                   </div>
//                 </div>
//               </div>
//               {MonthlyPerformanceChart}
//             </div>
//           </div>
//         </div>


// {/* Success Metrics Footer with End Message */}
// {/* Simple Footer */}
// <div className="app-footer">
//   <div className="footer-content">
//     <p>
//       <strong>Orders Analyzed:</strong> {data.ordersLoaded} orders • 
//       <strong> Net Revenue:</strong> {formatCurrency(data.netRevenue)} • 
//       <strong> Data Updated:</strong> {new Date().toLocaleDateString()}
//     </p>
//     <p className="footer-brand">📊 Orders Dashboard - Powering Your Business Insights</p>
//   </div>
// </div>
//         {/* DEBUG INFO */}
        

//       </div>
//     </div>
//   );
// }


// ==================== 1. IMPORTS ====================
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, useNavigation, Link } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import "../styles/products.css";
import { useState } from 'react';

// ==================== 2. LOADING COMPONENT ====================
function LoadingProgress() {
  const loadingSteps = [
    "Scanning products...",
    "Analyzing inventory...", 
    "Checking SEO...",
    "Processing collections...",
    "Generating analytics..."
  ];

  return (
    <div className="loading-progress-container">
      <div className="loading-header">
        <h2>Preparing Your Products Dashboard</h2>
        <p>This may take 20-30 seconds as we analyze your entire product catalog</p>
      </div>
      
      <div className="progress-bar-container">
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
      </div>

      <div className="loading-steps">
        {loadingSteps.map((step, index) => (
          <div key={index} className="loading-step">
            <div className="step-indicator">⟳</div>
            <div className="step-text">{step}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== 3. TYPES ====================
interface ProductsData {
  totalProducts: number;
  activeProducts: number;
  newProductsThisMonth: number;
  totalCollections: number;
  collectionsWithCounts: any[];
  collectionStats: {
    totalCollections: number;
    collectionsWithProducts: number;
    emptyCollections: number;
    averageProductsPerCollection: number;
    largestCollection: any;
  };
  enhancedMetrics: {
    inventory: { 
      totalVariants: number; 
      outOfStock: number; 
      lowStock: number; 
      inventoryValue: number;
      outOfStockProducts: any[];
      lowStockProducts: any[];
    };
    statusBreakdown: { draft: number; active: number; archived: number };
    productTimeline: { last30Days: number; last90Days: number; thisYear: number };
    seoInsights: { 
      missingMeta: number; 
      shortTitles: number; 
      missingImages: number;
      seoScore: number;
      missingMetaProducts: any[];
      shortTitleProducts: any[];
      missingImageProducts: any[];
    };
    optimizationScore: number;
  };
  insights: {
    needsAttention: number;
    growthOpportunity: number;
    seoImprovements: number;
  };
  shop: string;
  chartData: {
    statusData: { activePercentage: number; draftPercentage: number; archivedPercentage: number };
    topCollections: any[];
    monthlyData: { labels: string[]; data: number[] };
  };
  productsLoaded: number;
}

// ==================== 4. HELPER FUNCTIONS ====================
async function fetchAllCollectionProducts(admin: any, collectionId: string) {
  let allProducts: any[] = [];
  let after = null;
  let hasMore = true;

  while (hasMore) {
    const productsQuery = after 
      ? `products(first: 250, after: "${after}")`
      : `products(first: 250)`;

    const response = await admin.graphql(`
      query collectionProducts($id: ID!) {
        collection(id: $id) {
          ${productsQuery} {
            edges {
              node {
                id
              }
              cursor
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      }
    `, {
      variables: { id: collectionId }
    });

    const data = await response.json() as any;
    const products = data.data?.collection?.products?.edges || [];
    const pageInfo = data.data?.collection?.products?.pageInfo;

    allProducts = [...allProducts, ...products];
    after = pageInfo?.endCursor;
    hasMore = pageInfo?.hasNextPage;

    if (allProducts.length >= 1000) break;
  }

  return allProducts.length;
}

async function getInventoryMetrics(admin: any, allProducts: any[]) {
  let totalVariants = 0;
  let outOfStockCount = 0;
  let lowStockCount = 0;
  let totalInventoryValue = 0;
  
  const outOfStockProducts: any[] = [];
  const lowStockProducts: any[] = [];
  
  const sampleProducts = allProducts.slice(0, 50);
  
  for (const product of sampleProducts) {
    try {
      const variantsResponse = await admin.graphql(`
        query productVariants($id: ID!) {
          product(id: $id) {
            title
            handle
            variants(first: 10) {
              edges {
                node {
                  inventoryQuantity
                  price
                  sku
                  title
                }
              }
            }
          }
        }
      `, {
        variables: { id: product.node.id }
      });
      
      const variantsData = await variantsResponse.json() as any;
      const variants = variantsData.data?.product?.variants?.edges || [];
      
      let productOutOfStock = false;
      let productLowStock = false;
      
      variants.forEach((variant: any) => {
        totalVariants++;
        const quantity = variant.node.inventoryQuantity || 0;
        const price = parseFloat(variant.node.price) || 0;
        
        if (quantity === 0) {
          outOfStockCount++;
          productOutOfStock = true;
        }
        if (quantity > 0 && quantity <= 5) {
          lowStockCount++;
          productLowStock = true;
        }
        totalInventoryValue += quantity * price;
      });

      if (productOutOfStock) {
        outOfStockProducts.push({
          title: variantsData.data?.product?.title,
          handle: variantsData.data?.product?.handle,
          type: 'out_of_stock'
        });
      } else if (productLowStock) {
        lowStockProducts.push({
          title: variantsData.data?.product?.title,
          handle: variantsData.data?.product?.handle,
          type: 'low_stock'
        });
      }
      
    } catch (error) {
      continue;
    }
  }
  
  const sampleRatio = sampleProducts.length / Math.max(allProducts.length, 1);
  
  return {
    totalVariants: Math.round(totalVariants / Math.max(sampleRatio, 0.1)),
    outOfStock: Math.round(outOfStockCount / Math.max(sampleRatio, 0.1)),
    lowStock: Math.round(lowStockCount / Math.max(sampleRatio, 0.1)),
    inventoryValue: Math.round(totalInventoryValue / Math.max(sampleRatio, 0.1)),
    outOfStockProducts: outOfStockProducts.slice(0, 10),
    lowStockProducts: lowStockProducts.slice(0, 10),
  };
}

function getProductStatusBreakdown(allProducts: any[]) {
  const statusCounts = {
    draft: 0,
    active: 0,
    archived: 0,
  };
  
  allProducts.forEach((product: any) => {
    switch (product.node.status) {
      case 'DRAFT': statusCounts.draft++; break;
      case 'ACTIVE': statusCounts.active++; break;
      case 'ARCHIVED': statusCounts.archived++; break;
    }
  });
  
  return statusCounts;
}

function getProductTimeline(allProducts: any[]) {
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);
  const last90Days = new Date();
  last90Days.setDate(last90Days.getDate() - 90);
  
  return {
    last30Days: allProducts.filter((p: any) => new Date(p.node.createdAt) >= last30Days).length,
    last90Days: allProducts.filter((p: any) => new Date(p.node.createdAt) >= last90Days).length,
    thisYear: allProducts.filter((p: any) => new Date(p.node.createdAt).getFullYear() === new Date().getFullYear()).length,
  };
}

function getSEOInsights(allProducts: any[]) {
  const productsWithMissingMeta = allProducts.filter((p: any) => 
    !p.node.description || p.node.description.trim().length < 50
  );
  
  const productsWithShortTitles = allProducts.filter((p: any) => 
    !p.node.title || p.node.title.length < 10
  );

  const productsWithMissingImages = allProducts.filter((p: any) => 
    !p.node.featuredImage?.url
  );
  
  return {
    missingMeta: productsWithMissingMeta.length,
    shortTitles: productsWithShortTitles.length,
    missingImages: productsWithMissingImages.length,
    seoScore: Math.max(0, 100 - (productsWithMissingMeta.length / Math.max(allProducts.length, 1) * 100)),
    missingMetaProducts: productsWithMissingMeta.slice(0, 10).map((p: any) => ({
      title: p.node.title,
      id: p.node.id
    })),
    shortTitleProducts: productsWithShortTitles.slice(0, 10).map((p: any) => ({
      title: p.node.title,
      id: p.node.id
    })),
    missingImageProducts: productsWithMissingImages.slice(0, 10).map((p: any) => ({
      title: p.node.title,
      id: p.node.id
    }))
  };
}

function calculateOptimizationScore(mainData: any, inventory: any, seoInsights: any, statusBreakdown: any) {
  let score = 0;
  
  const activeRate = mainData.totalProducts > 0 ? (mainData.activeProducts / mainData.totalProducts) * 100 : 0;
  score += (activeRate / 100) * 30;
  
  const collectionUtilization = mainData.totalCollections > 0 ? 
    (mainData.collectionStats.collectionsWithProducts / mainData.totalCollections) * 100 : 0;
  score += (collectionUtilization / 100) * 20;
  
  const inventoryHealth = inventory.totalVariants > 0 ? 
    (1 - (inventory.outOfStock / inventory.totalVariants)) * 100 : 100;
  score += (inventoryHealth / 100) * 30;
  
  const recentProducts = mainData.newProductsThisMonth;
  const recentScore = Math.min(20, (recentProducts / 10) * 20);
  score += recentScore;
  
  return Math.round(Math.min(100, score));
}

function generateChartData(allProducts: any[], collectionsWithCounts: any[], statusBreakdown: any) {
  const total = statusBreakdown.active + statusBreakdown.draft + statusBreakdown.archived;
  const activePercentage = total > 0 ? (statusBreakdown.active / total) * 100 : 0;
  const draftPercentage = total > 0 ? (statusBreakdown.draft / total) * 100 : 0;
  const archivedPercentage = total > 0 ? (statusBreakdown.archived / total) * 100 : 0;

  const topCollections = [...collectionsWithCounts]
    .sort((a: any, b: any) => b.productCount - a.productCount)
    .slice(0, 8);
  
  const monthlyData = generateMonthlyProductData(allProducts);

  return {
    statusData: {
      activePercentage,
      draftPercentage,
      archivedPercentage
    },
    topCollections,
    monthlyData
  };
}

function generateMonthlyProductData(allProducts: any[]) {
  const monthlyCounts: { [key: string]: number } = {};
  const currentYear = new Date().getFullYear();
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const key = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    monthlyCounts[key] = 0;
  }
  
  allProducts.forEach((product: any) => {
    const productDate = new Date(product.node.createdAt);
    if (productDate.getFullYear() === currentYear) {
      const key = productDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      if (monthlyCounts[key] !== undefined) {
        monthlyCounts[key]++;
      }
    }
  });
  
  const labels = Object.keys(monthlyCounts);
  const data = Object.values(monthlyCounts);
  
  return {
    labels,
    data
  };
}

// ==================== 5. LOADER FUNCTION ====================
export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const { admin, session } = await authenticate.admin(request);
    const shop = session.shop;

    let allProducts: any[] = [];
    let hasNextPage = true;
    let endCursor: string | null = null;

    while (hasNextPage && allProducts.length < 1000) {
      const productsQuery = `
        {
          products(
            first: 250, 
            ${endCursor ? `after: "${endCursor}",` : ''}
            sortKey: CREATED_AT, 
            reverse: true
          ) {
            pageInfo {
              hasNextPage
              endCursor
            }
            edges {
              node {
                id
                title
                status
                createdAt
                description
                featuredImage {
                  url
                }
              }
            }
          }
        }
      `;

      const productsResponse = await admin.graphql(productsQuery);
      const productsData = await productsResponse.json() as any;
      
      if (productsData.errors) {
        throw new Error(productsData.errors[0]?.message || "Failed to fetch products");
      }
      
      const productsPage = productsData.data?.products?.edges || [];
      allProducts = [...allProducts, ...productsPage];
      
      hasNextPage = productsData.data?.products?.pageInfo?.hasNextPage || false;
      endCursor = productsData.data?.products?.pageInfo?.endCursor;
      
      if (!hasNextPage || allProducts.length >= 1000) break;
    }

    let allCollections: any[] = [];
    let hasMoreCollections = true;
    let collectionsEndCursor: string | null = null;

    while (hasMoreCollections && allCollections.length < 500) {
      const collectionsQuery = `
        {
          collections(
            first: 250, 
            ${collectionsEndCursor ? `after: "${collectionsEndCursor}",` : ''}
            sortKey: TITLE
          ) {
            pageInfo {
              hasNextPage
              endCursor
            }
            edges {
              node {
                id
                title
                description
              }
            }
          }
        }
      `;

      const collectionsResponse = await admin.graphql(collectionsQuery);
      const collectionsData = await collectionsResponse.json() as any;
      
      const collectionsPage = collectionsData.data?.collections?.edges || [];
      allCollections = [...allCollections, ...collectionsPage];
      
      hasMoreCollections = collectionsData.data?.collections?.pageInfo?.hasNextPage || false;
      collectionsEndCursor = collectionsData.data?.collections?.pageInfo?.endCursor;
      
      if (!hasMoreCollections || allCollections.length >= 500) break;
    }

    if (allProducts.length === 0) {
      return json(getEmptyData(shop));
    }

    const processedData = await processProductsData(admin, allProducts, allCollections, shop);
    return json(processedData);
    
  } catch (error: any) {
    return json(getEmptyData(""));
  }
};

async function processProductsData(admin: any, allProducts: any[], allCollections: any[], shop: string) {
  const [
    inventoryMetrics,
    statusBreakdown,
    productTimeline,
    seoInsights
  ] = await Promise.all([
    getInventoryMetrics(admin, allProducts),
    getProductStatusBreakdown(allProducts),
    getProductTimeline(allProducts),
    getSEOInsights(allProducts)
  ]);

  const collectionsWithCounts = await Promise.all(
    allCollections.map(async (collection: any) => {
      try {
        const productCount = await fetchAllCollectionProducts(admin, collection.node.id);
        return {
          ...collection,
          productCount: productCount
        };
      } catch (error) {
        return {
          ...collection,
          productCount: 0
        };
      }
    })
  );

  const totalProducts = allProducts.length;
  const activeProducts = allProducts.filter((p: any) => p.node.status === "ACTIVE").length;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const newProductsThisMonth = allProducts.filter((p: any) => new Date(p.node.createdAt) >= startOfMonth).length;

  const collectionStats = {
    totalCollections: collectionsWithCounts.length,
    collectionsWithProducts: collectionsWithCounts.filter((c: any) => (c.productCount || 0) > 0).length,
    emptyCollections: collectionsWithCounts.filter((c: any) => (c.productCount || 0) === 0).length,
    averageProductsPerCollection: collectionsWithCounts.length > 0
      ? collectionsWithCounts.reduce((sum: number, c: any) => sum + (c.productCount || 0), 0) / collectionsWithCounts.length
      : 0,
    largestCollection: collectionsWithCounts.length > 0
      ? collectionsWithCounts.reduce((max: any, c: any) => (c.productCount || 0) > (max.productCount || 0) ? c : max, collectionsWithCounts[0])
      : null,
  };

  const optimizationScore = calculateOptimizationScore(
    { totalProducts, activeProducts, newProductsThisMonth, collectionStats },
    inventoryMetrics,
    seoInsights,
    statusBreakdown
  );

  const chartData = generateChartData(allProducts, collectionsWithCounts, statusBreakdown);

  return {
    totalProducts,
    activeProducts,
    newProductsThisMonth,
    totalCollections: collectionsWithCounts.length,
    collectionsWithCounts,
    collectionStats,
    allProductsCount: allProducts.length,
    enhancedMetrics: {
      inventory: inventoryMetrics,
      statusBreakdown,
      productTimeline,
      seoInsights,
      optimizationScore,
    },
    insights: {
      needsAttention: inventoryMetrics.lowStock + inventoryMetrics.outOfStock + seoInsights.missingMeta + seoInsights.shortTitles + seoInsights.missingImages,
      growthOpportunity: productTimeline.last30Days,
      seoImprovements: seoInsights.missingMeta + seoInsights.shortTitles + seoInsights.missingImages,
    },
    shop: shop,
    chartData: chartData,
    productsLoaded: allProducts.length
  };
}

function getEmptyData(shop: string) {
  return {
    totalProducts: 0,
    activeProducts: 0,
    newProductsThisMonth: 0,
    totalCollections: 0,
    collectionsWithCounts: [],
    collectionStats: {
      totalCollections: 0,
      collectionsWithProducts: 0,
      emptyCollections: 0,
      averageProductsPerCollection: 0,
      largestCollection: null
    },
    allProductsCount: 0,
    enhancedMetrics: {
      inventory: { 
        totalVariants: 0, 
        outOfStock: 0, 
        lowStock: 0, 
        inventoryValue: 0,
        outOfStockProducts: [],
        lowStockProducts: []
      },
      statusBreakdown: { draft: 0, active: 0, archived: 0 },
      productTimeline: { last30Days: 0, last90Days: 0, thisYear: 0 },
      seoInsights: { 
        missingMeta: 0, 
        shortTitles: 0, 
        missingImages: 0,
        seoScore: 0,
        missingMetaProducts: [],
        shortTitleProducts: [],
        missingImageProducts: []
      },
      optimizationScore: 0,
    },
    insights: {
      needsAttention: 0,
      growthOpportunity: 0,
      seoImprovements: 0,
    },
    shop: shop,
    chartData: {
      statusData: { activePercentage: 0, draftPercentage: 0, archivedPercentage: 0 },
      topCollections: [],
      monthlyData: { labels: [], data: [] }
    },
    productsLoaded: 0
  };
}


// ==================== 6. ICON COMPONENTS ====================
const Icon = {
  Print: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>
    </svg>
  ),
  Manage: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
    </svg>
  ),
  Attention: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
    </svg>
  ),
  Growth: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
    </svg>
  ),
  SEO: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
  ),
  Products: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
    </svg>
  ),
  Chart: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
    </svg>
  ),
  Inventory: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 2H4c-1 0-2 .9-2 2v3.01c0 .72.43 1.34 1 1.69V20c0 1.1 1.1 2 2 2h14c.9 0 2-.9 2-2V8.7c.57-.35 1-.97 1-1.69V4c0-1.1-1-2-2-2zm-5 12H9v-2h6v2zm5-7H4V4h16v3z"/>
    </svg>
  ),
  Status: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
  ),
  Timeline: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
    </svg>
  ),
  Collections: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 6h-5v-2c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2H2v15h20V6zm-7-2v2H9V4h6zm7 15H4v-2h16v2zm0-4H4V8h3v2h2V8h6v2h2V8h3v11z"/>
    </svg>
  ),
  Trophy: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C13.1 2 14 2.9 14 4c0 .74-.4 1.38-1 1.72v.78c0 .42.28.78.68.93C15.53 7.94 17 9.84 17 12v.5l-2 2V12c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2v4.5l-2-2V12c0-2.16 1.47-4.06 3.32-4.57.4-.15.68-.51.68-.93v-.78c-.6-.34-1-.98-1-1.72 0-1.1.9-2 2-2zm-2 9c.55 0 1 .45 1 1v3.5l2 2V12c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2v5.5l2-2V12c0-.55.45-1 1-1h2z"/>
    </svg>
  ),
  Insights: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 8c-1.45 0-2.26 1.44-1.93 2.51l-3.55 3.56c-.3-.09-.74-.09-1.04 0l-2.55-2.55C12.27 10.45 11.46 9 10 9c-1.45 0-2.27 1.44-1.93 2.52l-4.56 4.55C2.44 15.74 1 16.55 1 18c0 1.1.9 2 2 2 1.45 0 2.26-1.44 1.93-2.51l4.55-4.56c.3.09.74.09 1.04 0l2.55 2.55C12.73 16.55 13.54 18 15 18c1.45 0 2.27-1.44 1.93-2.52l3.56-3.55c1.07.33 2.51-.48 2.51-1.93 0-1.1-.9-2-2-2z"/>
    </svg>
  ),
  Folder: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
    </svg>
  ),
  Lightning: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
    </svg>
  ),
  AddProduct: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
    </svg>
  ),
  ManageCollections: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
    </svg>
  ),
  Export: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z"/>
    </svg>
  )
};

// ==================== 7. MAIN COMPONENT ====================
export default function Products() {
  const data = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const [isExporting, setIsExporting] = useState(false);

  const isLoading = navigation.state === 'loading';

  const formatNumber = (num: number | null | undefined) => {
    if (num === null || num === undefined || isNaN(num)) return '0';
    return num.toLocaleString();
  };

  const formatPercentage = (num: number | null | undefined) => {
    if (num === null || num === undefined || isNaN(num)) return '0.0';
    return num.toFixed(1);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const Tooltip = ({ text, children }: { text: string; children: React.ReactNode }) => (
    <span className="tooltip" data-tooltip={text}>
      {children}
    </span>
  );

  const TrendIndicator = ({ value, previousValue }: { value: number; previousValue: number }) => {
    const trend = value - previousValue;
    const trendPercent = previousValue > 0 ? (trend / previousValue) * 100 : 0;
    
    return (
      <div className={`trend-indicator ${trend > 0 ? 'trend-up' : trend < 0 ? 'trend-down' : 'trend-neutral'}`}>
        {trend > 0 ? '↗' : trend < 0 ? '↘' : '→'}
        {Math.abs(trendPercent).toFixed(1)}%
      </div>
    );
  };

  const QualityBadge = ({ score }: { score: number }) => {
    let qualityClass = '';
    let label = '';
    
    if (score >= 90) {
      qualityClass = 'quality-excellent';
      label = 'Excellent';
    } else if (score >= 75) {
      qualityClass = 'quality-good';
      label = 'Good';
    } else if (score >= 60) {
      qualityClass = 'quality-fair';
      label = 'Fair';
    } else {
      qualityClass = 'quality-poor';
      label = 'Needs Work';
    }
    
    return (
      <span className={`quality-badge ${qualityClass}`}>
        {label}
      </span>
    );
  };

  const activePercentage = data.enhancedMetrics.statusBreakdown.active;
  const draftPercentage = data.enhancedMetrics.statusBreakdown.draft;
  const archivedPercentage = data.enhancedMetrics.statusBreakdown.archived;
  const totalStatus = activePercentage + draftPercentage + archivedPercentage;

      return (
    <div className="products-dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h1>Products Dashboard</h1>
        <div className="header-controls">
          <a 
            href={`https://${data.shop}/admin/products`} 
            className="action-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon.Manage />
            Manage Products
          </a>
          <button 
            className="print-report-btn"
            onClick={() => window.print()}
          >
            <Icon.Print />
            Print Report
          </button>
        </div>
      </div>

      {/* Optimization Score */}
      <div className="optimization-score">
        <div className="score-card">
          <div className="score-value">{data.enhancedMetrics.optimizationScore}</div>
          <div className="score-label">Optimization Score</div>
          <div className="score-description">Based on analysis of {formatNumber(data.totalProducts)} products</div>
        </div>
        <div className="insights-pills">
          <Link 
            to="/attention"
            className={`insight-pill clickable ${data.insights.needsAttention > 0 ? 'warning' : 'success'}`}
          >
            <Icon.Attention />
            {data.insights.needsAttention} need attention
          </Link>
          <div className="insight-pill info non-clickable">
            <Icon.Growth />
            {data.insights.growthOpportunity} new this month
          </div>
          <div className="insight-pill info non-clickable">
            <Icon.SEO />
            {data.insights.seoImprovements} SEO improvements
          </div>
        </div>
      </div>

      {/* Products Overview Section */}
      <div className="products-overview">
        <h2><Icon.Products /> Products Overview</h2>
        <div className="primary-metrics-grid">
          <div className="metric-card total-products">
            <div className="metric-value">{formatNumber(data.totalProducts)}</div>
            <div className="metric-label">Total Products</div>
            <div className="metric-description">Complete catalog analysis</div>
          </div>
          
          <div className="metric-card active-products">
            <div className="metric-value">{formatNumber(data.activeProducts)}</div>
            <div className="metric-label">Active Products</div>
            <div className="metric-description">
              {data.totalProducts > 0 ? formatPercentage((data.activeProducts / data.totalProducts) * 100) : '0'}% of total
            </div>
          </div>
          
          <div className="metric-card new-products">
            <div className="metric-value">{formatNumber(data.newProductsThisMonth)}</div>
            <div className="metric-label">New This Month</div>
            <div className="metric-description">Recent product additions</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <h2><Icon.Chart /> Visual Analytics</h2>
        <div className="charts-grid">
          {/* Product Status Distribution */}
          <div className="chart-container">
            <h3>Product Status Distribution</h3>
            <div className="chart-placeholder pie-chart">
              <div className="chart-visual">
                <div 
                  className="pie-chart-visual"
                  style={{
                    background: `conic-gradient(
                      #28a745 0% ${data.chartData.statusData.activePercentage}%,
                      #ffc107 ${data.chartData.statusData.activePercentage}% ${data.chartData.statusData.activePercentage + data.chartData.statusData.draftPercentage}%,
                      #dc3545 ${data.chartData.statusData.activePercentage + data.chartData.statusData.draftPercentage}% 100%
                    )`
                  }}
                >
                  <div className="pie-center">
                    <div className="pie-total">{formatNumber(totalStatus)}</div>
                    <div className="pie-label">Products</div>
                  </div>
                </div>
              </div>
              <div className="chart-legend">
                <div className="legend-item tooltip" data-tooltip={`${formatNumber(activePercentage)} active products (${formatPercentage(data.chartData.statusData.activePercentage)}% of total)`}>
                  <span className="legend-color active"></span>
                  <span>Active: {formatNumber(activePercentage)} ({formatPercentage(data.chartData.statusData.activePercentage)}%)</span>
                </div>
                <div className="legend-item tooltip" data-tooltip={`${formatNumber(draftPercentage)} draft products (${formatPercentage(data.chartData.statusData.draftPercentage)}% of total)`}>
                  <span className="legend-color draft"></span>
                  <span>Draft: {formatNumber(draftPercentage)} ({formatPercentage(data.chartData.statusData.draftPercentage)}%)</span>
                </div>
                <div className="legend-item tooltip" data-tooltip={`${formatNumber(archivedPercentage)} archived products (${formatPercentage(data.chartData.statusData.archivedPercentage)}% of total)`}>
                  <span className="legend-color archived"></span>
                  <span>Archived: {formatNumber(archivedPercentage)} ({formatPercentage(data.chartData.statusData.archivedPercentage)}%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Collections */}
          <div className="chart-container">
            <h3>Top Collections</h3>
            <div className="chart-placeholder bar-chart">
              <div className="chart-visual">
                <div className="bar-chart-visual">
                  {data.chartData.topCollections.slice(0, 5).map((collection: any, index: number) => {
                    const maxCount = Math.max(...data.chartData.topCollections.map((c: any) => c.productCount));
                    const heightPercentage = maxCount > 0 ? 
                      Math.max(10, (collection.productCount / maxCount) * 100) : 10;
                    return (
                      <div key={collection.node.id} className="bar-container tooltip" data-tooltip={`${collection.node.title}: ${collection.productCount} products`}>
                        <div 
                          className="bar" 
                          style={{ height: `${heightPercentage}%` }}
                        ></div>
                        <div className="bar-label">{collection.node.title.split(' ')[0]}</div>
                        <div className="bar-value">{collection.productCount}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="chart-summary tooltip" data-tooltip={`Largest collection: ${data.collectionStats.largestCollection?.node.title || 'None'} with ${data.collectionStats.largestCollection?.productCount || 0} products`}>
                Total collections: {formatNumber(data.totalCollections)}
              </div>
            </div>
          </div>

          {/* Monthly Product Growth */}
          <div className="chart-container">
            <h3>Monthly Product Growth</h3>
            <div className="chart-placeholder line-chart">
              <div className="chart-visual">
                <div className="line-chart-visual">
                  <div className="line-graph">
                    <svg className="line-path" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path 
                        className="line" 
                        d={data.chartData.monthlyData.labels.map((label: string, index: number) => {
                          const maxData = Math.max(...data.chartData.monthlyData.data);
                          const heightPercentage = maxData > 0 ? (data.chartData.monthlyData.data[index] / maxData) * 100 : 0;
                          const x = (index / (data.chartData.monthlyData.labels.length - 1)) * 100;
                          const y = 100 - heightPercentage;
                          return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                        }).join(' ')}
                        fill="none"
                        stroke="#6f42c1"
                        strokeWidth="2"
                      />
                    </svg>
                    
                    {data.chartData.monthlyData.labels.map((label: string, index: number) => {
                      const maxData = Math.max(...data.chartData.monthlyData.data);
                      const heightPercentage = maxData > 0 ? (data.chartData.monthlyData.data[index] / maxData) * 100 : 0;
                      const value = data.chartData.monthlyData.data[index];
                      return (
                        <div 
                          key={label} 
                          className="data-point tooltip" 
                          data-tooltip={`${label}: ${value} new products`}
                          style={{ 
                            left: `${(index / (data.chartData.monthlyData.labels.length - 1)) * 100}%`,
                            bottom: `${heightPercentage}%`
                          }}
                        ></div>
                      );
                    })}
                  </div>
                  <div className="x-axis">
                    {data.chartData.monthlyData.labels.map((label: string) => (
                      <div key={label} className="x-label">{label}</div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="chart-summary tooltip" data-tooltip={`${data.enhancedMetrics.productTimeline.last30Days} products created in the last 30 days`}>
                Recent growth: {formatNumber(data.enhancedMetrics.productTimeline.last30Days)} products
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Management Section */}
      <div className="inventory-section">
        <h2><Icon.Inventory /> Inventory Overview</h2>
        <div className="inventory-grid">
          <div className="inventory-card total-variants">
            <Tooltip text="Total number of product variants across all products">
              <div className="inventory-value">{formatNumber(data.enhancedMetrics.inventory.totalVariants)}</div>
            </Tooltip>
            <div className="inventory-label">Total Variants</div>
            <div className="inventory-status">
              <div className="status-dot healthy"></div>
              <span>All variants tracked</span>
            </div>
          </div>
          <div className="inventory-card out-of-stock">
            <Tooltip text="Variants currently out of stock that need restocking">
              <div className="inventory-value">{formatNumber(data.enhancedMetrics.inventory.outOfStock)}</div>
            </Tooltip>
            <div className="inventory-label">Out of Stock</div>
            <div className="inventory-status">
              <div className={`status-dot ${data.enhancedMetrics.inventory.outOfStock > 0 ? 'critical' : 'healthy'}`}></div>
              <span>{data.enhancedMetrics.inventory.outOfStock > 0 ? 'Needs attention' : 'All in stock'}</span>
            </div>
          </div>
          <div className="inventory-card low-stock">
            <Tooltip text="Variants with 5 or fewer items in stock">
              <div className="inventory-value">{formatNumber(data.enhancedMetrics.inventory.lowStock)}</div>
            </Tooltip>
            <div className="inventory-label">Low Stock</div>
            <div className="inventory-status">
              <div className={`status-dot ${data.enhancedMetrics.inventory.lowStock > 0 ? 'warning' : 'healthy'}`}></div>
              <span>{data.enhancedMetrics.inventory.lowStock > 0 ? 'Monitor closely' : 'Good levels'}</span>
            </div>
          </div>
          <div className="inventory-card inventory-value">
            <Tooltip text="Total value of all inventory at current prices">
              <div className="inventory-value">{formatCurrency(data.enhancedMetrics.inventory.inventoryValue)}</div>
            </Tooltip>
            <div className="inventory-label">Inventory Value</div>
            <div className="inventory-status">
              <div className="status-dot healthy"></div>
              <span>Total asset value</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Status & Timeline */}
      <div className="status-timeline-section">
        <div className="status-breakdown">
          <h3><Icon.Status /> Product Status</h3>
          <div className="status-grid">
            <div className="status-card active">
              <div className="status-value">{formatNumber(data.enhancedMetrics.statusBreakdown.active)}</div>
              <div className="status-label">Active</div>
            </div>
            <div className="status-card draft">
              <div className="status-value">{formatNumber(data.enhancedMetrics.statusBreakdown.draft)}</div>
              <div className="status-label">Draft</div>
            </div>
            <div className="status-card archived">
              <div className="status-value">{formatNumber(data.enhancedMetrics.statusBreakdown.archived)}</div>
              <div className="status-label">Archived</div>
            </div>
          </div>
        </div>

        <div className="timeline-breakdown">
          <h3><Icon.Timeline /> Product Timeline</h3>
          <div className="timeline-grid">
            <div className="timeline-card">
              <div className="timeline-value">{formatNumber(data.enhancedMetrics.productTimeline.last30Days)}</div>
              <div className="timeline-label">Last 30 Days</div>
            </div>
            <div className="timeline-card">
              <div className="timeline-value">{formatNumber(data.enhancedMetrics.productTimeline.last90Days)}</div>
              <div className="timeline-label">Last 90 Days</div>
            </div>
            <div className="timeline-card">
              <div className="timeline-value">{formatNumber(data.enhancedMetrics.productTimeline.thisYear)}</div>
              <div className="timeline-label">This Year</div>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Insights */}
      <div className="seo-section">
        <h2><Icon.SEO /> SEO Insights</h2>
        <div className="seo-grid">
          <div className="seo-card">
            <Tooltip text={`${data.enhancedMetrics.seoInsights.missingMeta} products have short or missing descriptions that affect SEO`}>
              <div className="seo-value">{formatNumber(data.enhancedMetrics.seoInsights.missingMeta)}</div>
            </Tooltip>
            <div className="seo-label">Missing Descriptions</div>
            <div className="seo-description">Products needing better descriptions</div>
            <QualityBadge score={100 - (data.enhancedMetrics.seoInsights.missingMeta / data.totalProducts) * 100} />
          </div>
          <div className="seo-card">
            <Tooltip text={`${data.enhancedMetrics.seoInsights.shortTitles} products have titles shorter than 10 characters`}>
              <div className="seo-value">{formatNumber(data.enhancedMetrics.seoInsights.shortTitles)}</div>
            </Tooltip>
            <div className="seo-label">Short Titles</div>
            <div className="seo-description">Titles under 10 characters</div>
            <QualityBadge score={100 - (data.enhancedMetrics.seoInsights.shortTitles / data.totalProducts) * 100} />
          </div>
          <div className="seo-card">
            <Tooltip text={`${data.enhancedMetrics.seoInsights.missingImages} products are missing featured images`}>
              <div className="seo-value">{formatNumber(data.enhancedMetrics.seoInsights.missingImages)}</div>
            </Tooltip>
            <div className="seo-label">Missing Images</div>
            <div className="seo-description">Products without featured images</div>
            <QualityBadge score={100 - (data.enhancedMetrics.seoInsights.missingImages / data.totalProducts) * 100} />
          </div>
          <div className="seo-card score">
            <Tooltip text="Overall SEO health score based on descriptions, titles, and images">
              <div className="seo-value">{formatNumber(data.enhancedMetrics.seoInsights.seoScore)}%</div>
            </Tooltip>
            <div className="seo-label">SEO Score</div>
            <div className="seo-description">Overall SEO health</div>
            <QualityBadge score={data.enhancedMetrics.seoInsights.seoScore} />
          </div>
        </div>
      </div>

      {/* Collections Overview Section */}
      <div className="collections-overview">
        <h2><Icon.Collections /> Collections Analytics</h2>
        
        <div className="collections-stats-grid">
          <div className="collection-stat-card">
            <div className="collection-stat-value">{formatNumber(data.collectionStats.totalCollections)}</div>
            <div className="collection-stat-label">Total Collections</div>
          </div>
          
          <div className="collection-stat-card">
            <div className="collection-stat-value">{formatNumber(data.collectionStats.collectionsWithProducts)}</div>
            <div className="collection-stat-label">With Products</div>
          </div>
          
          <div className="collection-stat-card">
            <div className="collection-stat-value">{formatNumber(data.collectionStats.emptyCollections)}</div>
            <div className="collection-stat-label">Empty Collections</div>
          </div>
          
          <div className="collection-stat-card">
            <div className="collection-stat-value">{formatPercentage(data.collectionStats.averageProductsPerCollection)}</div>
            <div className="collection-stat-label">Avg Products</div>
          </div>
        </div>

        {/* Largest Collection Highlight */}
        {data.collectionStats.largestCollection && data.collectionStats.largestCollection.productCount > 0 && (
          <div className="largest-collection">
            <h3><Icon.Trophy /> Largest Collection</h3>
            <div className="collection-name">
              {data.collectionStats.largestCollection.node.title}
            </div>
            <div className="product-count">
              {formatNumber(data.collectionStats.largestCollection.productCount)} products
            </div>
          </div>
        )}
      </div>

      {/* Performance Insights */}
      <div className="performance-insights">
        <h2><Icon.Insights /> Performance Insights</h2>
        <div className="insights-grid">
          <div className="insight-item">
            <div className="insight-value">
              {data.totalProducts > 0 ? formatPercentage((data.activeProducts / data.totalProducts) * 100) : '0'}%
            </div>
            <div className="insight-label">Active Rate</div>
          </div>
          
          <div className="insight-item">
            <div className="insight-value">
              {data.totalCollections > 0 ? formatPercentage((data.collectionStats.collectionsWithProducts / data.totalCollections) * 100) : '0'}%
            </div>
            <div className="insight-label">Utilized Collections</div>
          </div>
          
          <div className="insight-item">
            <div className="insight-value">
              {data.totalCollections > 0 ? formatPercentage((data.collectionStats.emptyCollections / data.totalCollections) * 100) : '0'}%
            </div>
            <div className="insight-label">Empty Collections</div>
          </div>
        </div>
      </div>

      {/* Collections Breakdown */}
      <div className="collections-breakdown">
        <h2><Icon.Folder /> Collections Breakdown</h2>
        
        {data.collectionsWithCounts.length > 0 ? (
          <div className="collections-grid">
            {data.collectionsWithCounts.map((collection: any) => (
              <div key={collection.node.id} className="collection-card">
                <div className="collection-header">
                  <div className="collection-title">{collection.node.title}</div>
                  {collection.node.description && (
                    <div className="collection-description">
                      {collection.node.description}
                    </div>
                  )}
                </div>
                <div className="collection-stats">
                  <div className="product-count-badge">
                    {formatNumber(collection.productCount)} products
                  </div>
                  <div className={`collection-status ${collection.productCount > 0 ? 'status-active' : 'status-draft'}`}>
                    {collection.productCount > 0 ? 'Active' : 'Empty'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-collections">
            <h3>No Collections Found</h3>
            <p>Create collections to organize your products and improve customer experience.</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2><Icon.Lightning /> Quick Actions</h2>
        <div className="actions-grid">
          <a 
            href={`https://${data.shop}/admin/products/new`} 
            className="action-card" 
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon.AddProduct />
            <div className="action-title">Add New Product</div>
            <div className="action-description">Create a new product</div>
          </a>
          <a 
            href={`https://${data.shop}/admin/collections`} 
            className="action-card" 
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon.ManageCollections />
            <div className="action-title">Manage Collections</div>
            <div className="action-description">Organize your products</div>
          </a>
          <a 
            href={`https://${data.shop}/admin/products/inventory`} 
            className="action-card" 
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon.Inventory />
            <div className="action-title">Inventory Management</div>
            <div className="action-description">Update stock levels</div>
          </a>
          <div className="action-card" onClick={() => window.print()}>
            <Icon.Export />
            <div className="action-title">Export Report</div>
            <div className="action-description">Print or save as PDF</div>
          </div>
        </div>
      </div>
    </div>
  );
}