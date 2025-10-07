// import { Session } from "@shopify/shopify-api";

// export interface OrderData {
//   totalOrders: number;
//   fulfilledOrders: number;
//   unfulfilledOrders: number;
//   totalRevenue: number;
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
// }

// export class AnalyticsCollector {
//   private session: Session;

//   constructor(session: Session) {
//     this.session = session;
//   }

//   async collectDailyAnalytics(): Promise<OrderData> {
//     try {
//       console.log('📊 [AnalyticsCollector] Collecting real data for:', this.session.shop);

//       // Use REST API approach since we don't have direct GraphQL access
//       const orders = await this.fetchAllOrders();
      
//       // Return empty data if no orders
//       if (orders.length === 0) {
//         return this.getEmptyData();
//       }

//       // Process orders data
//       const processedData = this.processOrdersData(orders);
//       return processedData;
      
//     } catch (error: any) {
//       console.error('❌ [AnalyticsCollector] Error collecting data:', error);
//       throw new Error(`Failed to collect analytics: ${error.message}`);
//     }
//   }

//   private async fetchAllOrders(): Promise<any[]> {
//     const allOrders: any[] = [];
//     let sinceId: string | null = null;
//     let hasMore = true;
//     const limit = 250;

//     while (hasMore && allOrders.length < 1000) {
//       try {
//         // Build the API URL
//         let url = `https://${this.session.shop}/admin/api/2024-01/orders.json?limit=${limit}&status=any`;
//         if (sinceId) {
//           url += `&since_id=${sinceId}`;
//         }

//         const response = await fetch(url, {
//           headers: {
//             'X-Shopify-Access-Token': this.session.accessToken!,
//             'Content-Type': 'application/json',
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
//         const orders = data.orders || [];

//         if (orders.length === 0) {
//           hasMore = false;
//           break;
//         }

//         allOrders.push(...orders);
//         sinceId = orders[orders.length - 1].id;

//         // Stop if we've reached the limit or if there are no more orders
//         if (orders.length < limit) {
//           hasMore = false;
//         }

//       } catch (error) {
//         console.error('❌ Error fetching orders:', error);
//         hasMore = false;
//       }
//     }

//     return allOrders;
//   }

//   private getEmptyData(): OrderData {
//     return {
//       totalOrders: 0,
//       fulfilledOrders: 0,
//       unfulfilledOrders: 0,
//       totalRevenue: 0,
//       totalItems: 0,
//       averageOrderValue: 0,
//       averageItemsPerOrder: 0,
//       dailySales: [],
//       weeklySales: [],
//       monthlySales: [],
//       todayRevenue: 0,
//       todayOrders: 0,
//       todayItems: 0,
//       yesterdayRevenue: 0,
//       yesterdayOrders: 0,
//       yesterdayItems: 0,
//       lastWeekRevenue: 0,
//       lastWeekOrders: 0,
//       lastWeekItems: 0,
//       todayFulfilled: 0,
//       todayUnfulfilled: 0,
//       last7DaysFulfilled: 0,
//       last7DaysUnfulfilled: 0,
//       fulfillmentRate: 0,
//       revenueChangeVsYesterday: 0,
//       ordersChangeVsYesterday: 0,
//       itemsChangeVsYesterday: 0,
//       revenueChangeVsLastWeek: 0,
//       bestDay: { date: '', revenue: 0, orders: 0, items: 0 },
//       averageDailyRevenue: 0,
//       totalCustomers: 0,
//       repeatCustomers: 0,
//       newCustomers: 0,
//       repeatCustomerRate: 0,
//       last7DaysTotalCustomers: 0,
//       last7DaysRepeatCustomers: 0,
//       last7DaysNewCustomers: 0,
//       last7DaysRepeatCustomerRate: 0,
//       customerTypeData: { new: 0, repeat: 0 },
//       fulfillmentStatusData: { fulfilled: 0, unfulfilled: 0 },
//       weeklyRevenueTrend: [],
//       monthlyComparison: [],
//       dailyPerformance: [],
//       ordersLoaded: 0
//     };
//   }

//   private processOrdersData(orders: any[]): OrderData {
//     // Core metrics
//     const totalOrders = orders.length;
//     const fulfilledOrders = orders.filter((order: any) => 
//       order.fulfillment_status === "fulfilled" || order.fulfillments?.length > 0
//     ).length;
//     const unfulfilledOrders = totalOrders - fulfilledOrders;

//     const totalRevenue = orders.reduce((sum: number, order: any) => {
//       const amount = parseFloat(order.total_price || '0');
//       return sum + (isNaN(amount) ? 0 : amount);
//     }, 0);

//     const totalItems = orders.reduce((sum: number, order: any) => {
//       const lineItems = order.line_items || [];
//       const itemsInOrder = lineItems.reduce((itemSum: number, item: any) => {
//         return itemSum + (item.quantity || 0);
//       }, 0);
//       return sum + itemsInOrder;
//     }, 0);

//     const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
//     const averageItemsPerOrder = totalOrders > 0 ? totalItems / totalOrders : 0;

//     // Time-based metrics
//     const salesByDay: Record<string, { revenue: number; orders: number; items: number }> = {};
//     const salesByWeek: Record<string, { revenue: number; orders: number; items: number }> = {};
//     const salesByMonth: Record<string, { revenue: number; orders: number; items: number }> = {};

//     const today = new Date();
//     const todayKey = today.toISOString().split("T")[0];
//     const yesterday = new Date(today);
//     yesterday.setDate(yesterday.getDate() - 1);
//     const yesterdayKey = yesterday.toISOString().split("T")[0];
//     const lastWeek = new Date(today);
//     lastWeek.setDate(lastWeek.getDate() - 7);
//     const lastWeekKey = lastWeek.toISOString().split("T")[0];

//     let todayRevenue = 0;
//     let todayOrders = 0;
//     let todayItems = 0;
//     let yesterdayRevenue = 0;
//     let yesterdayOrders = 0;
//     let yesterdayItems = 0;
//     let lastWeekRevenue = 0;
//     let lastWeekOrders = 0;
//     let lastWeekItems = 0;

//     let todayFulfilled = 0;
//     let todayUnfulfilled = 0;
//     let last7DaysFulfilled = 0;
//     let last7DaysUnfulfilled = 0;

//     // Process each order
//     orders.forEach((order: any) => {
//       const createdAt = new Date(order.created_at);
//       const revenue = parseFloat(order.total_price || '0');
      
//       const lineItems = order.line_items || [];
//       const itemsInOrder = lineItems.reduce((sum: number, item: any) => {
//         return sum + (item.quantity || 0);
//       }, 0);
      
//       const dateKey = createdAt.toISOString().split("T")[0];
//       const isToday = dateKey === todayKey;
//       const isYesterday = dateKey === yesterdayKey;
//       const isLastWeekSameDay = dateKey === lastWeekKey;
//       const isLast7Days = (today.getTime() - createdAt.getTime()) <= (7 * 24 * 60 * 60 * 1000);

//       // Today's metrics
//       if (isToday) {
//         todayRevenue += revenue;
//         todayOrders += 1;
//         todayItems += itemsInOrder;
        
//         if (order.fulfillment_status === "fulfilled" || order.fulfillments?.length > 0) {
//           todayFulfilled += 1;
//         } else {
//           todayUnfulfilled += 1;
//         }
//       }
      
//       // Yesterday's metrics
//       if (isYesterday) {
//         yesterdayRevenue += revenue;
//         yesterdayOrders += 1;
//         yesterdayItems += itemsInOrder;
//       }
      
//       // Last week metrics
//       if (isLastWeekSameDay) {
//         lastWeekRevenue += revenue;
//         lastWeekOrders += 1;
//         lastWeekItems += itemsInOrder;
//       }

//       // Last 7 days fulfillment
//       if (isLast7Days) {
//         if (order.fulfillment_status === "fulfilled" || order.fulfillments?.length > 0) {
//           last7DaysFulfilled += 1;
//         } else {
//           last7DaysUnfulfilled += 1;
//         }
//       }

//       // Daily aggregation
//       if (!salesByDay[dateKey]) {
//         salesByDay[dateKey] = { revenue: 0, orders: 0, items: 0 };
//       }
//       salesByDay[dateKey].revenue += revenue;
//       salesByDay[dateKey].orders += 1;
//       salesByDay[dateKey].items += itemsInOrder;

//       // Weekly aggregation
//       const weekKey = `${createdAt.getFullYear()}-W${Math.ceil((createdAt.getDate() - createdAt.getDay() + 1) / 7)}`;
//       if (!salesByWeek[weekKey]) {
//         salesByWeek[weekKey] = { revenue: 0, orders: 0, items: 0 };
//       }
//       salesByWeek[weekKey].revenue += revenue;
//       salesByWeek[weekKey].orders += 1;
//       salesByWeek[weekKey].items += itemsInOrder;

//       // Monthly aggregation
//       const monthKey = `${createdAt.getFullYear()}-${(createdAt.getMonth() + 1).toString().padStart(2, "0")}`;
//       if (!salesByMonth[monthKey]) {
//         salesByMonth[monthKey] = { revenue: 0, orders: 0, items: 0 };
//       }
//       salesByMonth[monthKey].revenue += revenue;
//       salesByMonth[monthKey].orders += 1;
//       salesByMonth[monthKey].items += itemsInOrder;
//     });

//     // Customer analytics
//     const customerOrderCount: Record<string, number> = {};
//     orders.forEach((order: any) => {
//       const customerId = order.customer?.id;
//       if (customerId) {
//         customerOrderCount[customerId] = (customerOrderCount[customerId] || 0) + 1;
//       }
//     });

//     const totalCustomers = Object.keys(customerOrderCount).length;
//     const repeatCustomers = Object.values(customerOrderCount).filter(count => count > 1).length;
//     const repeatCustomerRate = totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0;
//     const newCustomers = totalCustomers - repeatCustomers;

//     // Last 7 days customer analytics
//     const last7DaysCustomers: Record<string, number> = {};
//     orders.forEach((order: any) => {
//       const createdAt = new Date(order.created_at);
//       const isLast7Days = (today.getTime() - createdAt.getTime()) <= (7 * 24 * 60 * 60 * 1000);
      
//       if (isLast7Days) {
//         const customerId = order.customer?.id;
//         if (customerId) {
//           last7DaysCustomers[customerId] = (last7DaysCustomers[customerId] || 0) + 1;
//         }
//       }
//     });

//     const last7DaysTotalCustomers = Object.keys(last7DaysCustomers).length;
//     const last7DaysRepeatCustomers = Object.values(last7DaysCustomers).filter(count => count > 1).length;
//     const last7DaysRepeatCustomerRate = last7DaysTotalCustomers > 0 ? (last7DaysRepeatCustomers / last7DaysTotalCustomers) * 100 : 0;
//     const last7DaysNewCustomers = last7DaysTotalCustomers - last7DaysRepeatCustomers;

//     // Process daily data (last 7 days)
//     const last7Days = Array.from({ length: 7 }, (_, i) => {
//       const date = new Date();
//       date.setDate(date.getDate() - i);
//       return date.toISOString().split("T")[0];
//     }).reverse();

//     const dailySales = last7Days.map(date => {
//       const dayData = salesByDay[date] || { revenue: 0, orders: 0, items: 0 };
//       return {
//         date,
//         revenue: dayData.revenue,
//         orders: dayData.orders,
//         items: dayData.items
//       };
//     });

//     // Process weekly data (last 8 weeks)
//     const weeklyEntries = Object.entries(salesByWeek)
//       .sort((a, b) => a[0].localeCompare(b[0]))
//       .slice(-8);

//     const weeklySales = weeklyEntries.map(([week, data]) => ({
//       week,
//       revenue: data.revenue,
//       orders: data.orders,
//       items: data.items
//     }));

//     // Process monthly data (last 6 months)
//     const monthlyEntries = Object.entries(salesByMonth)
//       .sort((a, b) => a[0].localeCompare(b[0]))
//       .slice(-6);

//     const monthlySales = monthlyEntries.map(([month, data]) => ({
//       month,
//       revenue: data.revenue,
//       orders: data.orders,
//       items: data.items
//     }));

//     // Additional metrics
//     const fulfillmentRate = totalOrders > 0 ? (fulfilledOrders / totalOrders) * 100 : 0;
    
//     const revenueChangeVsYesterday = yesterdayRevenue > 0 
//       ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 
//       : 0;
    
//     const ordersChangeVsYesterday = yesterdayOrders > 0 
//       ? ((todayOrders - yesterdayOrders) / yesterdayOrders) * 100 
//       : 0;

//     const itemsChangeVsYesterday = yesterdayItems > 0 
//       ? ((todayItems - yesterdayItems) / yesterdayItems) * 100 
//       : 0;
    
//     const revenueChangeVsLastWeek = lastWeekRevenue > 0 
//       ? ((todayRevenue - lastWeekRevenue) / lastWeekRevenue) * 100 
//       : 0;

//     const bestDay = dailySales.reduce((best, current) => 
//       current.revenue > best.revenue ? current : best, { date: '', revenue: 0, orders: 0, items: 0 }
//     );

//     const averageDailyRevenue = dailySales.length > 0 
//       ? dailySales.reduce((sum, day) => sum + day.revenue, 0) / dailySales.length 
//       : 0;

//     // Chart data
//     const customerTypeData = {
//       new: newCustomers,
//       repeat: repeatCustomers
//     };

//     const fulfillmentStatusData = {
//       fulfilled: fulfilledOrders,
//       unfulfilled: unfulfilledOrders
//     };

//     const weeklyRevenueTrend = weeklySales.map(week => ({
//       week: `Week ${week.week.split('-W')[1]}`,
//       revenue: week.revenue
//     }));

//     const monthlyComparison = monthlySales.map(month => {
//       const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//       const monthNumber = parseInt(month.month.split('-')[1]);
//       return {
//         month: monthNames[monthNumber - 1],
//         revenue: month.revenue,
//         orders: month.orders
//       };
//     });

//     const dailyPerformance = dailySales.map(day => {
//       const date = new Date(day.date);
//       const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//       return {
//         day: dayNames[date.getDay()],
//         revenue: day.revenue,
//         orders: day.orders
//       };
//     });

//     return {
//       // Core metrics
//       totalOrders,
//       fulfilledOrders,
//       unfulfilledOrders,
//       totalRevenue,
//       totalItems,
//       averageOrderValue,
//       averageItemsPerOrder,
//       dailySales,
//       weeklySales,
//       monthlySales,
      
//       // Today's performance metrics
//       todayRevenue,
//       todayOrders,
//       todayItems,
//       yesterdayRevenue,
//       yesterdayOrders,
//       yesterdayItems,
//       lastWeekRevenue,
//       lastWeekOrders,
//       lastWeekItems,
      
//       // Fulfillment metrics
//       todayFulfilled,
//       todayUnfulfilled,
//       last7DaysFulfilled,
//       last7DaysUnfulfilled,
      
//       // Calculated metrics
//       fulfillmentRate,
//       revenueChangeVsYesterday,
//       ordersChangeVsYesterday,
//       itemsChangeVsYesterday,
//       revenueChangeVsLastWeek,
//       bestDay,
//       averageDailyRevenue,

//       // Customer metrics
//       totalCustomers,
//       repeatCustomers,
//       newCustomers,
//       repeatCustomerRate,

//       // 7-Day Customer metrics
//       last7DaysTotalCustomers,
//       last7DaysRepeatCustomers,
//       last7DaysNewCustomers, 
//       last7DaysRepeatCustomerRate,

//       // Chart data
//       customerTypeData,
//       fulfillmentStatusData,
//       weeklyRevenueTrend,
//       monthlyComparison,
//       dailyPerformance,

//       // Debug info
//       ordersLoaded: orders.length,
//     };
//   }
// }




import { Session } from "@shopify/shopify-api";

export interface OrderData {
  totalOrders: number;
  fulfilledOrders: number;
  unfulfilledOrders: number;
  totalRevenue: number;
  totalItems: number;
  averageOrderValue: number;
  averageItemsPerOrder: number;
  dailySales: Array<{ date: string; revenue: number; orders: number; items: number }>;
  weeklySales: Array<{ week: string; revenue: number; orders: number; items: number }>;
  monthlySales: Array<{ month: string; revenue: number; orders: number; items: number }>;
  todayRevenue: number;
  todayOrders: number;
  todayItems: number;
  yesterdayRevenue: number;
  yesterdayOrders: number;
  yesterdayItems: number;
  lastWeekRevenue: number;
  lastWeekOrders: number;
  lastWeekItems: number;
  todayFulfilled: number;
  todayUnfulfilled: number;
  last7DaysFulfilled: number;
  last7DaysUnfulfilled: number;
  fulfillmentRate: number;
  revenueChangeVsYesterday: number;
  ordersChangeVsYesterday: number;
  itemsChangeVsYesterday: number;
  revenueChangeVsLastWeek: number;
  bestDay: { date: string; revenue: number; orders: number; items: number };
  averageDailyRevenue: number;
  totalCustomers: number;
  repeatCustomers: number;
  newCustomers: number;
  repeatCustomerRate: number;
  last7DaysTotalCustomers: number;
  last7DaysRepeatCustomers: number;
  last7DaysNewCustomers: number;
  last7DaysRepeatCustomerRate: number;
  customerTypeData: { new: number; repeat: number };
  fulfillmentStatusData: { fulfilled: number; unfulfilled: number };
  weeklyRevenueTrend: Array<{ week: string; revenue: number }>;
  monthlyComparison: Array<{ month: string; revenue: number; orders: number }>;
  dailyPerformance: Array<{ day: string; revenue: number; orders: number }>;
  ordersLoaded: number;
}

export class AnalyticsCollector {
  private session: Session;

  constructor(session: Session) {
    this.session = session;
  }

  async collectDailyAnalytics(): Promise<OrderData> {
    try {
      const orders = await this.fetchAllOrders();
      
      if (orders.length === 0) {
        return this.getEmptyData();
      }

      const processedData = this.processOrdersData(orders);
      return processedData;
      
    } catch (error: any) {
      throw new Error('Failed to collect analytics data');
    }
  }

  private async fetchAllOrders(): Promise<any[]> {
    const allOrders: any[] = [];
    let sinceId: string | null = null;
    let hasMore = true;
    const limit = 250;

    while (hasMore && allOrders.length < 1000) {
      try {
        let url = `https://${this.session.shop}/admin/api/2024-01/orders.json?limit=${limit}&status=any`;
        if (sinceId) {
          url += `&since_id=${sinceId}`;
        }

        const response = await fetch(url, {
          headers: {
            'X-Shopify-Access-Token': this.session.accessToken!,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const orders = data.orders || [];

        if (orders.length === 0) {
          hasMore = false;
          break;
        }

        allOrders.push(...orders);
        sinceId = orders[orders.length - 1].id;

        if (orders.length < limit) {
          hasMore = false;
        }

      } catch (error) {
        hasMore = false;
      }
    }

    return allOrders;
  }

  private getEmptyData(): OrderData {
    return {
      totalOrders: 0,
      fulfilledOrders: 0,
      unfulfilledOrders: 0,
      totalRevenue: 0,
      totalItems: 0,
      averageOrderValue: 0,
      averageItemsPerOrder: 0,
      dailySales: [],
      weeklySales: [],
      monthlySales: [],
      todayRevenue: 0,
      todayOrders: 0,
      todayItems: 0,
      yesterdayRevenue: 0,
      yesterdayOrders: 0,
      yesterdayItems: 0,
      lastWeekRevenue: 0,
      lastWeekOrders: 0,
      lastWeekItems: 0,
      todayFulfilled: 0,
      todayUnfulfilled: 0,
      last7DaysFulfilled: 0,
      last7DaysUnfulfilled: 0,
      fulfillmentRate: 0,
      revenueChangeVsYesterday: 0,
      ordersChangeVsYesterday: 0,
      itemsChangeVsYesterday: 0,
      revenueChangeVsLastWeek: 0,
      bestDay: { date: '', revenue: 0, orders: 0, items: 0 },
      averageDailyRevenue: 0,
      totalCustomers: 0,
      repeatCustomers: 0,
      newCustomers: 0,
      repeatCustomerRate: 0,
      last7DaysTotalCustomers: 0,
      last7DaysRepeatCustomers: 0,
      last7DaysNewCustomers: 0,
      last7DaysRepeatCustomerRate: 0,
      customerTypeData: { new: 0, repeat: 0 },
      fulfillmentStatusData: { fulfilled: 0, unfulfilled: 0 },
      weeklyRevenueTrend: [],
      monthlyComparison: [],
      dailyPerformance: [],
      ordersLoaded: 0
    };
  }

  private processOrdersData(orders: any[]): OrderData {
    // Core metrics
    const totalOrders = orders.length;
    const fulfilledOrders = orders.filter((order: any) => 
      order.fulfillment_status === "fulfilled" || order.fulfillments?.length > 0
    ).length;
    const unfulfilledOrders = totalOrders - fulfilledOrders;

    const totalRevenue = orders.reduce((sum: number, order: any) => {
      const amount = parseFloat(order.total_price || '0');
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    const totalItems = orders.reduce((sum: number, order: any) => {
      const lineItems = order.line_items || [];
      const itemsInOrder = lineItems.reduce((itemSum: number, item: any) => {
        return itemSum + (item.quantity || 0);
      }, 0);
      return sum + itemsInOrder;
    }, 0);

    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const averageItemsPerOrder = totalOrders > 0 ? totalItems / totalOrders : 0;

    // Time-based metrics
    const salesByDay: Record<string, { revenue: number; orders: number; items: number }> = {};
    const salesByWeek: Record<string, { revenue: number; orders: number; items: number }> = {};
    const salesByMonth: Record<string, { revenue: number; orders: number; items: number }> = {};

    const today = new Date();
    const todayKey = today.toISOString().split("T")[0];
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().split("T")[0];
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastWeekKey = lastWeek.toISOString().split("T")[0];

    let todayRevenue = 0;
    let todayOrders = 0;
    let todayItems = 0;
    let yesterdayRevenue = 0;
    let yesterdayOrders = 0;
    let yesterdayItems = 0;
    let lastWeekRevenue = 0;
    let lastWeekOrders = 0;
    let lastWeekItems = 0;

    let todayFulfilled = 0;
    let todayUnfulfilled = 0;
    let last7DaysFulfilled = 0;
    let last7DaysUnfulfilled = 0;

    // Process each order
    orders.forEach((order: any) => {
      const createdAt = new Date(order.created_at);
      const revenue = parseFloat(order.total_price || '0');
      
      const lineItems = order.line_items || [];
      const itemsInOrder = lineItems.reduce((sum: number, item: any) => {
        return sum + (item.quantity || 0);
      }, 0);
      
      const dateKey = createdAt.toISOString().split("T")[0];
      const isToday = dateKey === todayKey;
      const isYesterday = dateKey === yesterdayKey;
      const isLastWeekSameDay = dateKey === lastWeekKey;
      const isLast7Days = (today.getTime() - createdAt.getTime()) <= (7 * 24 * 60 * 60 * 1000);

      // Today's metrics
      if (isToday) {
        todayRevenue += revenue;
        todayOrders += 1;
        todayItems += itemsInOrder;
        
        if (order.fulfillment_status === "fulfilled" || order.fulfillments?.length > 0) {
          todayFulfilled += 1;
        } else {
          todayUnfulfilled += 1;
        }
      }
      
      // Yesterday's metrics
      if (isYesterday) {
        yesterdayRevenue += revenue;
        yesterdayOrders += 1;
        yesterdayItems += itemsInOrder;
      }
      
      // Last week metrics
      if (isLastWeekSameDay) {
        lastWeekRevenue += revenue;
        lastWeekOrders += 1;
        lastWeekItems += itemsInOrder;
      }

      // Last 7 days fulfillment
      if (isLast7Days) {
        if (order.fulfillment_status === "fulfilled" || order.fulfillments?.length > 0) {
          last7DaysFulfilled += 1;
        } else {
          last7DaysUnfulfilled += 1;
        }
      }

      // Daily aggregation
      if (!salesByDay[dateKey]) {
        salesByDay[dateKey] = { revenue: 0, orders: 0, items: 0 };
      }
      salesByDay[dateKey].revenue += revenue;
      salesByDay[dateKey].orders += 1;
      salesByDay[dateKey].items += itemsInOrder;

      // Weekly aggregation
      const weekKey = `${createdAt.getFullYear()}-W${Math.ceil((createdAt.getDate() - createdAt.getDay() + 1) / 7)}`;
      if (!salesByWeek[weekKey]) {
        salesByWeek[weekKey] = { revenue: 0, orders: 0, items: 0 };
      }
      salesByWeek[weekKey].revenue += revenue;
      salesByWeek[weekKey].orders += 1;
      salesByWeek[weekKey].items += itemsInOrder;

      // Monthly aggregation
      const monthKey = `${createdAt.getFullYear()}-${(createdAt.getMonth() + 1).toString().padStart(2, "0")}`;
      if (!salesByMonth[monthKey]) {
        salesByMonth[monthKey] = { revenue: 0, orders: 0, items: 0 };
      }
      salesByMonth[monthKey].revenue += revenue;
      salesByMonth[monthKey].orders += 1;
      salesByMonth[monthKey].items += itemsInOrder;
    });

    // Customer analytics
    const customerOrderCount: Record<string, number> = {};
    orders.forEach((order: any) => {
      const customerId = order.customer?.id;
      if (customerId) {
        customerOrderCount[customerId] = (customerOrderCount[customerId] || 0) + 1;
      }
    });

    const totalCustomers = Object.keys(customerOrderCount).length;
    const repeatCustomers = Object.values(customerOrderCount).filter(count => count > 1).length;
    const repeatCustomerRate = totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0;
    const newCustomers = totalCustomers - repeatCustomers;

    // Last 7 days customer analytics
    const last7DaysCustomers: Record<string, number> = {};
    orders.forEach((order: any) => {
      const createdAt = new Date(order.created_at);
      const isLast7Days = (today.getTime() - createdAt.getTime()) <= (7 * 24 * 60 * 60 * 1000);
      
      if (isLast7Days) {
        const customerId = order.customer?.id;
        if (customerId) {
          last7DaysCustomers[customerId] = (last7DaysCustomers[customerId] || 0) + 1;
        }
      }
    });

    const last7DaysTotalCustomers = Object.keys(last7DaysCustomers).length;
    const last7DaysRepeatCustomers = Object.values(last7DaysCustomers).filter(count => count > 1).length;
    const last7DaysRepeatCustomerRate = last7DaysTotalCustomers > 0 ? (last7DaysRepeatCustomers / last7DaysTotalCustomers) * 100 : 0;
    const last7DaysNewCustomers = last7DaysTotalCustomers - last7DaysRepeatCustomers;

    // Process daily data (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split("T")[0];
    }).reverse();

    const dailySales = last7Days.map(date => {
      const dayData = salesByDay[date] || { revenue: 0, orders: 0, items: 0 };
      return {
        date,
        revenue: dayData.revenue,
        orders: dayData.orders,
        items: dayData.items
      };
    });

    // Process weekly data (last 8 weeks)
    const weeklyEntries = Object.entries(salesByWeek)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-8);

    const weeklySales = weeklyEntries.map(([week, data]) => ({
      week,
      revenue: data.revenue,
      orders: data.orders,
      items: data.items
    }));

    // Process monthly data (last 6 months)
    const monthlyEntries = Object.entries(salesByMonth)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-6);

    const monthlySales = monthlyEntries.map(([month, data]) => ({
      month,
      revenue: data.revenue,
      orders: data.orders,
      items: data.items
    }));

    // Additional metrics
    const fulfillmentRate = totalOrders > 0 ? (fulfilledOrders / totalOrders) * 100 : 0;
    
    const revenueChangeVsYesterday = yesterdayRevenue > 0 
      ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 
      : 0;
    
    const ordersChangeVsYesterday = yesterdayOrders > 0 
      ? ((todayOrders - yesterdayOrders) / yesterdayOrders) * 100 
      : 0;

    const itemsChangeVsYesterday = yesterdayItems > 0 
      ? ((todayItems - yesterdayItems) / yesterdayItems) * 100 
      : 0;
    
    const revenueChangeVsLastWeek = lastWeekRevenue > 0 
      ? ((todayRevenue - lastWeekRevenue) / lastWeekRevenue) * 100 
      : 0;

    const bestDay = dailySales.reduce((best, current) => 
      current.revenue > best.revenue ? current : best, { date: '', revenue: 0, orders: 0, items: 0 }
    );

    const averageDailyRevenue = dailySales.length > 0 
      ? dailySales.reduce((sum, day) => sum + day.revenue, 0) / dailySales.length 
      : 0;

    // Chart data
    const customerTypeData = {
      new: newCustomers,
      repeat: repeatCustomers
    };

    const fulfillmentStatusData = {
      fulfilled: fulfilledOrders,
      unfulfilled: unfulfilledOrders
    };

    const weeklyRevenueTrend = weeklySales.map(week => ({
      week: `Week ${week.week.split('-W')[1]}`,
      revenue: week.revenue
    }));

    const monthlyComparison = monthlySales.map(month => {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthNumber = parseInt(month.month.split('-')[1]);
      return {
        month: monthNames[monthNumber - 1],
        revenue: month.revenue,
        orders: month.orders
      };
    });

    const dailyPerformance = dailySales.map(day => {
      const date = new Date(day.date);
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return {
        day: dayNames[date.getDay()],
        revenue: day.revenue,
        orders: day.orders
      };
    });

    return {
      totalOrders,
      fulfilledOrders,
      unfulfilledOrders,
      totalRevenue,
      totalItems,
      averageOrderValue,
      averageItemsPerOrder,
      dailySales,
      weeklySales,
      monthlySales,
      todayRevenue,
      todayOrders,
      todayItems,
      yesterdayRevenue,
      yesterdayOrders,
      yesterdayItems,
      lastWeekRevenue,
      lastWeekOrders,
      lastWeekItems,
      todayFulfilled,
      todayUnfulfilled,
      last7DaysFulfilled,
      last7DaysUnfulfilled,
      fulfillmentRate,
      revenueChangeVsYesterday,
      ordersChangeVsYesterday,
      itemsChangeVsYesterday,
      revenueChangeVsLastWeek,
      bestDay,
      averageDailyRevenue,
      totalCustomers,
      repeatCustomers,
      newCustomers,
      repeatCustomerRate,
      last7DaysTotalCustomers,
      last7DaysRepeatCustomers,
      last7DaysNewCustomers, 
      last7DaysRepeatCustomerRate,
      customerTypeData,
      fulfillmentStatusData,
      weeklyRevenueTrend,
      monthlyComparison,
      dailyPerformance,
      ordersLoaded: orders.length,
    };
  }
}