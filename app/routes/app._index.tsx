// ==================== 1. IMPORTS & DEPENDENCIES ====================
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import "../styles/orders.css";
import { useState, useMemo } from 'react';

// Chart.js imports for data visualization
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';

// ==================== 2. CHART.JS CONFIGURATION ====================
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// ==================== 3. TYPE DEFINITIONS ====================
interface OrderData {
  totalOrders: number;
  fulfilledOrders: number;
  unfulfilledOrders: number;
  totalRevenue: number;

  // Financial metrics
  totalDiscounts: number;
  totalShipping: number;
  totalTaxes: number;
  totalReturns: number;
  returnFees: number;
  netRevenue: number;
  discountRate: number;
  shippingRate: number;
  taxRate: number;
  returnRate: number;

  // Order metrics
  totalItems: number;
  averageOrderValue: number;
  averageItemsPerOrder: number;
  
  // Time-based sales data
  dailySales: Array<{ date: string; revenue: number; orders: number; items: number }>;
  weeklySales: Array<{ week: string; revenue: number; orders: number; items: number }>;
  monthlySales: Array<{ month: string; revenue: number; orders: number; items: number }>;
  
  // Today's performance
  todayRevenue: number;
  todayOrders: number;
  todayItems: number;
  yesterdayRevenue: number;
  yesterdayOrders: number;
  yesterdayItems: number;
  lastWeekRevenue: number;
  lastWeekOrders: number;
  lastWeekItems: number;
  
  // Fulfillment metrics
  todayFulfilled: number;
  todayUnfulfilled: number;
  last7DaysFulfilled: number;
  last7DaysUnfulfilled: number;
  fulfillmentRate: number;
  
  // Change metrics
  revenueChangeVsYesterday: number;
  ordersChangeVsYesterday: number;
  itemsChangeVsYesterday: number;
  revenueChangeVsLastWeek: number;
  
  // Performance insights
  bestDay: { date: string; revenue: number; orders: number; items: number };
  averageDailyRevenue: number;
  
  // Customer analytics
  totalCustomers: number;
  repeatCustomers: number;
  newCustomers: number;
  repeatCustomerRate: number;
  last7DaysTotalCustomers: number;
  last7DaysRepeatCustomers: number;
  last7DaysNewCustomers: number;
  last7DaysRepeatCustomerRate: number;
  
  // Chart data
  customerTypeData: { new: number; repeat: number };
  fulfillmentStatusData: { fulfilled: number; unfulfilled: number };
  weeklyRevenueTrend: Array<{ week: string; revenue: number }>;
  monthlyComparison: Array<{ month: string; revenue: number; orders: number }>;
  dailyPerformance: Array<{ day: string; revenue: number; orders: number }>;
  
  // System info
  ordersLoaded: number;
  shopTimezone: string;
  currentDateInShopTZ: string;
}

// ==================== 4. HELPER FUNCTIONS ====================
/**
 * Returns empty data structure for initialization and error states
 */
function getEmptyData(): Omit<OrderData, 'shopTimezone' | 'currentDateInShopTZ'> {
  return {
    totalOrders: 0,
    fulfilledOrders: 0,
    unfulfilledOrders: 0,
    totalRevenue: 0,

    // Financial metrics
    totalDiscounts: 0,
    totalShipping: 0,
    totalTaxes: 0,
    totalReturns: 0,
    returnFees: 0,
    netRevenue: 0,
    discountRate: 0,
    shippingRate: 0,
    taxRate: 0,
    returnRate: 0,

    // Order metrics
    totalItems: 0,
    averageOrderValue: 0,
    averageItemsPerOrder: 0,
    
    // Time-based data
    dailySales: [],
    weeklySales: [],
    monthlySales: [],
    
    // Today's performance
    todayRevenue: 0,
    todayOrders: 0,
    todayItems: 0,
    yesterdayRevenue: 0,
    yesterdayOrders: 0,
    yesterdayItems: 0,
    lastWeekRevenue: 0,
    lastWeekOrders: 0,
    lastWeekItems: 0,
    
    // Fulfillment
    todayFulfilled: 0,
    todayUnfulfilled: 0,
    last7DaysFulfilled: 0,
    last7DaysUnfulfilled: 0,
    fulfillmentRate: 0,
    
    // Change metrics
    revenueChangeVsYesterday: 0,
    ordersChangeVsYesterday: 0,
    itemsChangeVsYesterday: 0,
    revenueChangeVsLastWeek: 0,
    
    // Performance
    bestDay: { date: '', revenue: 0, orders: 0, items: 0 },
    averageDailyRevenue: 0,
    
    // Customer analytics
    totalCustomers: 0,
    repeatCustomers: 0,
    newCustomers: 0,
    repeatCustomerRate: 0,
    last7DaysTotalCustomers: 0,
    last7DaysRepeatCustomers: 0,
    last7DaysNewCustomers: 0,
    last7DaysRepeatCustomerRate: 0,
    
    // Chart data
    customerTypeData: { new: 0, repeat: 0 },
    fulfillmentStatusData: { fulfilled: 0, unfulfilled: 0 },
    weeklyRevenueTrend: [],
    monthlyComparison: [],
    dailyPerformance: [],
    
    // System
    ordersLoaded: 0
  };
}

// ==================== 5. TIMEZONE UTILITY CLASS ====================
/**
 * Handles timezone conversion and date formatting for consistent date handling
 */
class TimezoneHelper {
  /**
   * Converts UTC date to shop's local date string
   */
  static getLocalDateKey(utcDate: Date, timezone: string): string {
    try {
      return utcDate.toLocaleDateString('en-CA', { 
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (error) {
      console.warn('Timezone conversion failed, using UTC fallback:', error);
      return utcDate.toISOString().split('T')[0];
    }
  }

  /**
   * Gets current date in shop's timezone
   */
  static getCurrentDateInTimezone(timezone: string): string {
    return this.getLocalDateKey(new Date(), timezone);
  }

  /**
   * Gets formatted date in shop's timezone
   */
  static getDateInTimezone(date: Date, timezone: string): string {
    return this.getLocalDateKey(date, timezone);
  }

  /**
   * Generates date range for last N days in shop's timezone
   */
  static getDateRangeInTimezone(timezone: string, days: number): string[] {
    const dates: string[] = [];
    const now = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      dates.push(this.getLocalDateKey(date, timezone));
    }
    
    return dates.reverse(); // Oldest to newest
  }

  /**
   * Calculates previous date in shop's timezone
   */
  static getPreviousDate(currentDate: string, timezone: string): string {
    try {
      const current = new Date(currentDate + 'T00:00:00');
      const previous = new Date(current);
      previous.setDate(previous.getDate() - 1);
      return this.getLocalDateKey(previous, timezone);
    } catch (error) {
      console.warn('Error calculating previous date:', error);
      // Fallback calculation
      const current = new Date(currentDate + 'T00:00:00Z');
      const previous = new Date(current);
      previous.setUTCDate(previous.getUTCDate() - 1);
      return previous.toISOString().split('T')[0];
    }
  }

  /**
   * Gets week start date in shop's timezone
   */
  static getWeekStartDate(date: Date, timezone: string): Date {
    const localDateKey = this.getLocalDateKey(date, timezone);
    const localDate = new Date(localDateKey + 'T00:00:00');
    const dayOfWeek = localDate.getDay();
    const weekStart = new Date(localDate);
    weekStart.setDate(localDate.getDate() - dayOfWeek);
    return weekStart;
  }

  /**
   * Gets month key in YYYY-MM format for shop's timezone
   */
  static getMonthKey(date: Date, timezone: string): string {
    const localDateKey = this.getLocalDateKey(date, timezone);
    const localDate = new Date(localDateKey + 'T00:00:00');
    return `${localDate.getFullYear()}-${(localDate.getMonth() + 1).toString().padStart(2, "0")}`;
  }
}

// ==================== 6. DATA PROCESSING LOGIC ====================
/**
 * Processes raw order data into structured analytics
 */
function processOrdersData(orders: any[], shopTimezone: string = 'UTC'): Omit<OrderData, 'shopTimezone' | 'currentDateInShopTZ'> {
  // Core order metrics
  const totalOrders = orders.length;
  const fulfilledOrders = orders.filter((o: any) => o.node.displayFulfillmentStatus === "FULFILLED").length;
  const unfulfilledOrders = totalOrders - fulfilledOrders;

  // Revenue calculations
  const totalRevenue = orders.reduce((sum: number, o: any) => {
    const amount = parseFloat(o.node.currentTotalPriceSet?.shopMoney?.amount || '0');
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  // Item count calculations
  const totalItems = orders.reduce((sum: number, o: any) => {
    const lineItems = o.node.lineItems?.edges || [];
    const itemsInOrder = lineItems.reduce((itemSum: number, item: any) => {
      return itemSum + (item.node.quantity || 0);
    }, 0);
    return sum + itemsInOrder;
  }, 0);

  // Average calculations
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const averageItemsPerOrder = totalOrders > 0 ? totalItems / totalOrders : 0;

  // Financial metrics calculations
  const totalDiscounts = orders.reduce((sum: number, o: any) => {
    const amount = parseFloat(o.node.totalDiscountsSet?.shopMoney?.amount || '0');
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const totalShipping = orders.reduce((sum: number, o: any) => {
    const amount = parseFloat(o.node.totalShippingPriceSet?.shopMoney?.amount || '0');
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const totalTaxes = orders.reduce((sum: number, o: any) => {
    const amount = parseFloat(o.node.totalTaxSet?.shopMoney?.amount || '0');
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const totalReturns = orders.reduce((sum: number, o: any) => {
    const refunds = o.node.refunds || [];
    const refundAmount = refunds.reduce((refundSum: number, refund: any) => {
      const amount = parseFloat(refund.totalRefundedSet?.shopMoney?.amount || '0');
      return refundSum + (isNaN(amount) ? 0 : amount);
    }, 0);
    return sum + refundAmount;
  }, 0);

  // Derived financial metrics
  const netRevenue = totalRevenue - totalReturns;
  const discountRate = totalRevenue > 0 ? (totalDiscounts / totalRevenue) * 100 : 0;
  const shippingRate = totalRevenue > 0 ? (totalShipping / totalRevenue) * 100 : 0;
  const taxRate = totalRevenue > 0 ? (totalTaxes / totalRevenue) * 100 : 0;
  const returnRate = totalRevenue > 0 ? (totalReturns / totalRevenue) * 100 : 0;

  // Timezone-based date calculations
  const salesByDay: Record<string, { revenue: number; orders: number; items: number }> = {};
  const salesByWeek: Record<string, { revenue: number; orders: number; items: number }> = {};
  const salesByMonth: Record<string, { revenue: number; orders: number; items: number }> = {};

  const currentDateInShopTZ = TimezoneHelper.getCurrentDateInTimezone(shopTimezone);
  const yesterdayInShopTZ = TimezoneHelper.getPreviousDate(currentDateInShopTZ, shopTimezone);
  const lastWeekSameDayInShopTZ = TimezoneHelper.getPreviousDate(currentDateInShopTZ, shopTimezone);
  const last7DaysKeys = TimezoneHelper.getDateRangeInTimezone(shopTimezone, 7);

  // Initialize time-based metrics
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

  // Process each order with timezone conversion
  orders.forEach((o: any) => {
    const createdAtUTC = new Date(o.node.createdAt);
    const revenue = parseFloat(o.node.currentTotalPriceSet?.shopMoney?.amount || '0');
    
    const lineItems = o.node.lineItems?.edges || [];
    const itemsInOrder = lineItems.reduce((sum: number, item: any) => {
      return sum + (item.node.quantity || 0);
    }, 0);
    
    // Convert UTC to shop's local date
    const dateKey = TimezoneHelper.getLocalDateKey(createdAtUTC, shopTimezone);
    
    // Time-based comparisons
    const isToday = dateKey === currentDateInShopTZ;
    const isYesterday = dateKey === yesterdayInShopTZ;
    const isLastWeekSameDay = dateKey === lastWeekSameDayInShopTZ;
    const isLast7Days = last7DaysKeys.includes(dateKey);

    // Aggregate today's metrics
    if (isToday) {
      todayRevenue += revenue;
      todayOrders += 1;
      todayItems += itemsInOrder;
      
      if (o.node.displayFulfillmentStatus === "FULFILLED") {
        todayFulfilled += 1;
      } else {
        todayUnfulfilled += 1;
      }
    }
    
    // Aggregate yesterday's metrics
    if (isYesterday) {
      yesterdayRevenue += revenue;
      yesterdayOrders += 1;
      yesterdayItems += itemsInOrder;
    }
    
    // Aggregate last week metrics
    if (isLastWeekSameDay) {
      lastWeekRevenue += revenue;
      lastWeekOrders += 1;
      lastWeekItems += itemsInOrder;
    }

    // Last 7 days fulfillment tracking
    if (isLast7Days) {
      if (o.node.displayFulfillmentStatus === "FULFILLED") {
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
    const weekStart = TimezoneHelper.getWeekStartDate(createdAtUTC, shopTimezone);
    const weekKey = `${weekStart.getFullYear()}-W${Math.ceil((weekStart.getDate() + 6) / 7)}`;
    
    if (!salesByWeek[weekKey]) {
      salesByWeek[weekKey] = { revenue: 0, orders: 0, items: 0 };
    }
    salesByWeek[weekKey].revenue += revenue;
    salesByWeek[weekKey].orders += 1;
    salesByWeek[weekKey].items += itemsInOrder;

    // Monthly aggregation
    const monthKey = TimezoneHelper.getMonthKey(createdAtUTC, shopTimezone);
    if (!salesByMonth[monthKey]) {
      salesByMonth[monthKey] = { revenue: 0, orders: 0, items: 0 };
    }
    salesByMonth[monthKey].revenue += revenue;
    salesByMonth[monthKey].orders += 1;
    salesByMonth[monthKey].items += itemsInOrder;
  });

  // Customer analytics
  const customerOrderCount: Record<string, number> = {};
  orders.forEach((o: any) => {
    const customerId = o.node.customer?.id;
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
  orders.forEach((o: any) => {
    const createdAtUTC = new Date(o.node.createdAt);
    const dateKey = TimezoneHelper.getLocalDateKey(createdAtUTC, shopTimezone);
    
    if (last7DaysKeys.includes(dateKey)) {
      const customerId = o.node.customer?.id;
      if (customerId) {
        last7DaysCustomers[customerId] = (last7DaysCustomers[customerId] || 0) + 1;
      }
    }
  });

  const last7DaysTotalCustomers = Object.keys(last7DaysCustomers).length;
  const last7DaysRepeatCustomers = Object.values(last7DaysCustomers).filter(count => count > 1).length;
  const last7DaysRepeatCustomerRate = last7DaysTotalCustomers > 0 ? (last7DaysRepeatCustomers / last7DaysTotalCustomers) * 100 : 0;
  const last7DaysNewCustomers = last7DaysTotalCustomers - last7DaysRepeatCustomers;

  // Process structured data for charts
  const dailySales = last7DaysKeys.map(date => {
    const dayData = salesByDay[date] || { revenue: 0, orders: 0, items: 0 };
    return {
      date,
      revenue: dayData.revenue,
      orders: dayData.orders,
      items: dayData.items
    };
  });

  // Weekly data processing (last 8 weeks)
  const weeklyEntries = Object.entries(salesByWeek)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-8);

  const weeklySales = weeklyEntries.map(([week, data]) => ({
    week,
    revenue: data.revenue,
    orders: data.orders,
    items: data.items
  }));

  // Monthly data processing (last 6 months)
  const monthlyEntries = Object.entries(salesByMonth)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-6);

  const monthlySales = monthlyEntries.map(([month, data]) => ({
    month,
    revenue: data.revenue,
    orders: data.orders,
    items: data.items
  }));

  // Performance metrics calculations
  const fulfillmentRate = totalOrders > 0 ? (fulfilledOrders / totalOrders) * 100 : 0;
  
  const revenueChangeVsYesterday = yesterdayRevenue > 0 
    ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 
    : todayRevenue > 0 ? 100 : 0;
  
  const ordersChangeVsYesterday = yesterdayOrders > 0 
    ? ((todayOrders - yesterdayOrders) / yesterdayOrders) * 100 
    : todayOrders > 0 ? 100 : 0;

  const itemsChangeVsYesterday = yesterdayItems > 0 
    ? ((todayItems - yesterdayItems) / yesterdayItems) * 100 
    : todayItems > 0 ? 100 : 0;
  
  const revenueChangeVsLastWeek = lastWeekRevenue > 0 
    ? ((todayRevenue - lastWeekRevenue) / lastWeekRevenue) * 100 
    : todayRevenue > 0 ? 100 : 0;

  const bestDay = dailySales.reduce((best, current) => 
    current.revenue > best.revenue ? current : best, { date: '', revenue: 0, orders: 0, items: 0 }
  );

  const averageDailyRevenue = dailySales.length > 0 
    ? dailySales.reduce((sum, day) => sum + day.revenue, 0) / dailySales.length 
    : 0;

  // Chart data preparation
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
    // Core metrics
    totalOrders,
    fulfilledOrders,
    unfulfilledOrders,
    totalRevenue,

    // Financial metrics
    totalDiscounts,
    totalShipping,
    totalTaxes,
    totalReturns,
    returnFees: totalReturns,
    netRevenue,
    discountRate,
    shippingRate,
    taxRate,
    returnRate,

    // Order metrics
    totalItems,
    averageOrderValue,
    averageItemsPerOrder,
    
    // Time-based data
    dailySales,
    weeklySales,
    monthlySales,
    
    // Today's performance
    todayRevenue,
    todayOrders,
    todayItems,
    yesterdayRevenue,
    yesterdayOrders,
    yesterdayItems,
    lastWeekRevenue,
    lastWeekOrders,
    lastWeekItems,
    
    // Fulfillment metrics
    todayFulfilled,
    todayUnfulfilled,
    last7DaysFulfilled,
    last7DaysUnfulfilled,
    
    // Calculated metrics
    fulfillmentRate,
    revenueChangeVsYesterday,
    ordersChangeVsYesterday,
    itemsChangeVsYesterday,
    revenueChangeVsLastWeek,
    bestDay,
    averageDailyRevenue,

    // Customer metrics
    totalCustomers,
    repeatCustomers,
    newCustomers,
    repeatCustomerRate,

    // 7-Day Customer metrics
    last7DaysTotalCustomers,
    last7DaysRepeatCustomers,
    last7DaysNewCustomers, 
    last7DaysRepeatCustomerRate,

    // Chart data
    customerTypeData,
    fulfillmentStatusData,
    weeklyRevenueTrend,
    monthlyComparison,
    dailyPerformance,

    // System info
    ordersLoaded: orders.length,
  };
}

// ==================== 7. LOADER FUNCTION ====================
/**
 * Server-side data loader for orders dashboard
 */
export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const { admin, session } = await authenticate.admin(request);
    const shop = session.shop;

    // Fetch shop timezone from Shopify API
    const shopResponse = await admin.graphql(`
      {
        shop {
          ianaTimezone
        }
      }
    `);
    
    const shopData = await shopResponse.json() as any;
    const shopTimezone = shopData.data?.shop?.ianaTimezone || 'UTC';

    // Paginated orders fetching
    let allOrders: any[] = [];
    let hasNextPage = true;
    let endCursor: string | null = null;

    while (hasNextPage && allOrders.length < 1000) {
      const ordersQuery = `
        {
          orders(
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
                createdAt
                displayFulfillmentStatus
                currentTotalPriceSet {
                  shopMoney {
                    amount
                  }
                }
                totalShippingPriceSet {
                  shopMoney {
                    amount
                  }
                }
                totalTaxSet {
                  shopMoney {
                    amount
                  }
                }
                totalDiscountsSet {
                  shopMoney {
                    amount
                  }
                }
                lineItems(first: 10) {
                  edges {
                    node {
                      quantity
                      originalTotalSet {
                        shopMoney {
                          amount
                        }
                      }
                      discountedTotalSet {
                        shopMoney {
                          amount
                        }
                      }
                    }
                  }
                }
                refunds {
                  totalRefundedSet {
                    shopMoney {
                      amount
                    }
                  }
                }
                customer {
                  id
                }
              }
            }
          }
        }
      `;

      const ordersResponse = await admin.graphql(ordersQuery);
      const ordersData = await ordersResponse.json() as any;
      
      if (ordersData.errors) {
        throw new Error(ordersData.errors[0]?.message || "Failed to fetch orders");
      }
      
      const ordersPage = ordersData.data?.orders?.edges || [];
      allOrders = [...allOrders, ...ordersPage];
      
      hasNextPage = ordersData.data?.orders?.pageInfo?.hasNextPage || false;
      endCursor = ordersData.data?.orders?.pageInfo?.endCursor;
      
      if (!hasNextPage || allOrders.length >= 1000) break;
    }

    const orders = allOrders;

    // Return empty data if no orders found
    if (orders.length === 0) {
      return json({ 
        ...getEmptyData(), 
        shopTimezone,
        currentDateInShopTZ: TimezoneHelper.getCurrentDateInTimezone(shopTimezone)
      });
    }

    // Process orders data
    const processedData = processOrdersData(orders, shopTimezone);
    return json({ 
      ...processedData, 
      shopTimezone,
      currentDateInShopTZ: TimezoneHelper.getCurrentDateInTimezone(shopTimezone)
    });
    
  } catch (error: any) {
    console.error('Error in orders loader:', error);
    return json({ 
      ...getEmptyData(), 
      shopTimezone: 'UTC',
      currentDateInShopTZ: TimezoneHelper.getCurrentDateInTimezone('UTC')
    });
  }
};

// ==================== 8. ICON COMPONENTS ====================
/**
 * SVG Icon components for consistent UI
 */
const Icon = {
  Print: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>
    </svg>
  ),
  TrendUp: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
    </svg>
  ),
  TrendDown: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z"/>
    </svg>
  ),
  Loading: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 4V2A10 10 0 00 2 12h2a8 8 0 018-8z"/>
    </svg>
  ),
  Analytics: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 22h18v-2H3v2zM3 2v2h18V2H3zm10 16h4V6h-4v12zm-6 0h4v-4H7v4z"/>
    </svg>
  )
};

// ==================== 9. LOADING COMPONENT ====================
/**
 * Loading progress indicator with step-by-step progress
 */
function LoadingProgress() {
  const loadingSteps = [
    "Fetching recent orders...",
    "Analyzing revenue data...", 
    "Processing customer insights...",
    "Calculating fulfillment rates...",
    "Generating sales analytics..."
  ];

  return (
    <div className="loading-progress-container">
      <div className="loading-header">
        <h2>Loading Orders Dashboard</h2>
        <p>Analyzing your order data and generating insights...</p>
      </div>
      
      <div className="progress-bar-container">
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
      </div>

      <div className="loading-steps">
        {loadingSteps.map((step, index) => (
          <div key={index} className="loading-step">
            <div className="step-indicator">
              <Icon.Loading />
            </div>
            <div className="step-text">{step}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== 10. MAIN ORDERS COMPONENT ====================
/**
 * Main orders dashboard component with analytics and charts
 */
export default function Orders() {
  const data = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const [isExporting, setIsExporting] = useState(false);

  const isLoading = navigation.state === 'loading';

  // ==================== FORMATTING UTILITIES ====================
  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
  const formatNumber = (num: number) => num.toFixed(0);
  const formatPercent = (num: number) => `${num.toFixed(1)}%`;

  // ==================== CHART DATA MEMOIZATION ====================
  const chartData = useMemo(() => {
    return {
      customerDistribution: {
        labels: ['New Customers', 'Repeat Customers'],
        datasets: [
          {
            data: [data.customerTypeData.new, data.customerTypeData.repeat],
            backgroundColor: ['#f59e0b', '#10b981'],
            borderWidth: 2,
            borderColor: '#fff'
          }
        ]
      },
      orderFulfillment: {
        labels: ['Fulfilled', 'Unfulfilled'],
        datasets: [
          {
            data: [data.fulfillmentStatusData.fulfilled, data.fulfillmentStatusData.unfulfilled],
            backgroundColor: ['#10b981', '#ef4444'],
            borderWidth: 2,
            borderColor: '#fff'
          }
        ]
      },
      weeklyRevenue: {
        labels: data.weeklyRevenueTrend.map(w => w.week),
        datasets: [
          {
            label: 'Revenue',
            data: data.weeklyRevenueTrend.map(w => w.revenue),
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true,
            borderWidth: 2,
            pointBackgroundColor: '#3b82f6',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5
          }
        ]
      },
      monthlyPerformance: {
        labels: data.monthlyComparison.map(m => m.month),
        datasets: [
          {
            label: 'Revenue',
            data: data.monthlyComparison.map(m => m.revenue),
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderRadius: 4,
            borderSkipped: false,
          },
          {
            label: 'Orders',
            data: data.monthlyComparison.map(m => m.orders),
            backgroundColor: 'rgba(139, 92, 246, 0.8)',
            borderRadius: 4,
            borderSkipped: false,
          }
        ]
      }
    };
  }, [data]);

  // ==================== CHART OPTIONS MEMOIZATION ====================
  const chartOptions = useMemo(() => ({
    pie: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      animation: {
        duration: 500,
        easing: 'easeOutQuart' as const
      }
    },
    line: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { 
        legend: { display: false },
        tooltip: {
          mode: 'index' as const,
          intersect: false
        }
      },
      interaction: {
        mode: 'nearest' as const,
        axis: 'x' as const,
        intersect: false
      },
      scales: {
        x: {
          grid: { display: false }
        },
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(this: any, value: any) {
              return '$' + value;
            }
          },
          grid: { color: 'rgba(0, 0, 0, 0.1)' }
        }
      },
      animation: {
        duration: 600,
        easing: 'easeOutQuart' as const
      }
    },
    bar: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { 
        legend: { display: false },
        tooltip: {
          mode: 'index' as const,
          intersect: false
        }
      },
      interaction: {
        mode: 'index' as const,
        intersect: false
      },
      scales: {
        x: { grid: { display: false } },
        y: { 
          beginAtZero: true,
          grid: { color: 'rgba(0, 0, 0, 0.1)' }
        }
      },
      animation: {
        duration: 600,
        easing: 'easeOutQuart' as const
      }
    }
  }), []);

  // ==================== INDIVIDUAL CHART COMPONENTS ====================
  const CustomerDistributionChart = useMemo(() => (
    <Pie 
      data={chartData.customerDistribution}
      options={chartOptions.pie}
      height={120}
      redraw={false}
    />
  ), [chartData.customerDistribution, chartOptions.pie]);

  const OrderFulfillmentChart = useMemo(() => (
    <Doughnut 
      data={chartData.orderFulfillment}
      options={chartOptions.pie}
      height={120}
      redraw={false}
    />
  ), [chartData.orderFulfillment, chartOptions.pie]);

  const RevenueTrendChart = useMemo(() => (
    <Line 
      data={chartData.weeklyRevenue}
      options={chartOptions.line}
      height={120}
      redraw={false}
    />
  ), [chartData.weeklyRevenue, chartOptions.line]);

  const MonthlyPerformanceChart = useMemo(() => (
    <Bar 
      data={chartData.monthlyPerformance}
      options={chartOptions.bar}
      height={120}
      redraw={false}
    />
  ), [chartData.monthlyPerformance, chartOptions.bar]);

  // ==================== LOADING STATE ====================
  if (isLoading) {
    return (
      <div className="orders-dashboard">
        <div className="dashboard-header">
          <h1>Orders Dashboard</h1>
        </div>
        <LoadingProgress />
      </div>
    );
  }

  // ==================== COMPONENT RENDER ====================
  return (
    <div className="orders-dashboard">
      {/* DASHBOARD HEADER */}
      <div className="dashboard-header">
        <h1>Orders Dashboard</h1>
        <button
          className="print-button"
          onClick={() => window.print()}
          disabled={isExporting}
        >
          <Icon.Print />
          Print Report
        </button>
      </div>

      {/* MAIN DASHBOARD CONTENT */}
      <div id="dashboard-content">
        
        {/* TODAY'S PERFORMANCE SECTION */}
        <div className="today-performance">
          <h2>Today's Performance</h2>
          
          {/* Primary Metrics Grid */}
          <div className="primary-metrics-grid">
            <div className={`metric-card orders ${data.ordersChangeVsYesterday >= 0 ? 'positive' : 'negative'}`}>
              <p className="metric-value">{formatNumber(data.todayOrders)}</p>
              <p className="metric-label">Today's Orders</p>
              {data.ordersChangeVsYesterday !== 0 && (
                <div className={`metric-change ${data.ordersChangeVsYesterday >= 0 ? 'positive' : 'negative'}`}>
                  {data.ordersChangeVsYesterday >= 0 ? <Icon.TrendUp /> : <Icon.TrendDown />} 
                  {Math.abs(data.ordersChangeVsYesterday).toFixed(1)}% vs yesterday
                </div>
              )}
            </div>
            
            <div className={`metric-card revenue ${data.revenueChangeVsYesterday >= 0 ? 'positive' : 'negative'}`}>
              <p className="metric-value">{formatCurrency(data.todayRevenue)}</p>
              <p className="metric-label">Today's Revenue</p>
              {data.revenueChangeVsYesterday !== 0 && (
                <div className={`metric-change ${data.revenueChangeVsYesterday >= 0 ? 'positive' : 'negative'}`}>
                  {data.revenueChangeVsYesterday >= 0 ? <Icon.TrendUp /> : <Icon.TrendDown />} 
                  {Math.abs(data.revenueChangeVsYesterday).toFixed(1)}% vs yesterday
                </div>
              )}
            </div>
            
            <div className={`metric-card items ${data.itemsChangeVsYesterday >= 0 ? 'positive' : 'negative'}`}>
              <p className="metric-value">{formatNumber(data.todayItems)}</p>
              <p className="metric-label">Items Ordered</p>
              {data.itemsChangeVsYesterday !== 0 && (
                <div className={`metric-change ${data.itemsChangeVsYesterday >= 0 ? 'positive' : 'negative'}`}>
                  {data.itemsChangeVsYesterday >= 0 ? <Icon.TrendUp /> : <Icon.TrendDown />} 
                  {Math.abs(data.itemsChangeVsYesterday).toFixed(1)}% vs yesterday
                </div>
              )}
            </div>
          </div>

          {/* FULFILLMENT METRICS */}
          <div className="fulfillment-metrics-grid">
            <div className="fulfillment-metric-card today-fulfilled">
              <div className="fulfillment-metric-value">{formatNumber(data.todayFulfilled)}</div>
              <div className="fulfillment-metric-label">Fulfilled Today</div>
              <div className="fulfillment-metric-period">Today</div>
            </div>
            
            <div className="fulfillment-metric-card today-unfulfilled">
              <div className="fulfillment-metric-value">{formatNumber(data.todayUnfulfilled)}</div>
              <div className="fulfillment-metric-label">Unfulfilled Today</div>
              <div className="fulfillment-metric-period">Today</div>
            </div>
            
            <div className="fulfillment-metric-card week-fulfilled">
              <div className="fulfillment-metric-value">{formatNumber(data.last7DaysFulfilled)}</div>
              <div className="fulfillment-metric-label">Fulfilled</div>
              <div className="fulfillment-metric-period">Last 7 Days</div>
            </div>
            
            <div className="fulfillment-metric-card week-unfulfilled">
              <div className="fulfillment-metric-value">{formatNumber(data.last7DaysUnfulfilled)}</div>
              <div className="fulfillment-metric-label">Unfulfilled</div>
              <div className="fulfillment-metric-period">Last 7 Days</div>
            </div>
          </div>

          {/* LAST 7 DAYS SUMMARY */}
          <div className="last7days-section">
            <h3>Last 7 Days Performance</h3>
            
            {/* 7 Days Totals */}
            <div className="last7days-grid">
              <div className="last7days-total-card">
                <div className="last7days-total-value">
                  {formatNumber(data.dailySales.reduce((sum, day) => sum + day.orders, 0))}
                </div>
                <div className="last7days-total-label">Total Orders</div>
              </div>
              
              <div className="last7days-total-card">
                <div className="last7days-total-value">
                  {formatCurrency(data.dailySales.reduce((sum, day) => sum + day.revenue, 0))}
                </div>
                <div className="last7days-total-label">Total Revenue</div>
              </div>
              
              <div className="last7days-total-card">
                <div className="last7days-total-value">
                  {formatNumber(data.dailySales.reduce((sum, day) => sum + day.items, 0))}
                </div>
                <div className="last7days-total-label">Total Items</div>
              </div>
              
              <div className="last7days-total-card">
                <div className="last7days-total-value">
                  {formatCurrency(data.averageDailyRevenue)}
                </div>
                <div className="last7days-total-label">Avg Daily Revenue</div>
              </div>
            </div>

            {/* Daily Breakdown */}
            <div className="daily-breakdown">
              <h4>Daily Breakdown</h4>
              <div className="daily-cards-container">
                {data.dailySales.map((day, index) => {
                  const [year, month, dayNum] = day.date.split('-').map(Number);
                  const date = new Date(year, month - 1, dayNum);
                  
                  const isToday = day.date === data.currentDateInShopTZ;
                  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                  
                  return (
                    <div key={day.date} className={`daily-card ${isToday ? 'today' : ''}`}>
                      <div className="daily-card-header">
                        <div className="daily-date">
                          {date.getDate()}/{date.getMonth() + 1}
                        </div>
                        <div className="daily-day">
                          {dayNames[date.getDay()]}
                        </div>
                      </div>
                      
                      <div className="daily-metrics">
                        <div className="daily-metric orders">
                          <span className="daily-metric-label">Orders</span>
                          <span className="daily-metric-value">{formatNumber(day.orders)}</span>
                        </div>
                        
                        <div className="daily-metric revenue">
                          <span className="daily-metric-label">Revenue</span>
                          <span className="daily-metric-value">{formatCurrency(day.revenue)}</span>
                        </div>
                        
                        <div className="daily-metric items">
                          <span className="daily-metric-label">Items</span>
                          <span className="daily-metric-value">{formatNumber(day.items)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* WEEK-OVER-WEEK INSIGHT */}
          <div className="secondary-metrics">
            <div className="insight-card">
              <h4>Week-over-Week Revenue Change</h4>
              <p className={`insight-value ${data.revenueChangeVsLastWeek >= 0 ? 'text-positive' : 'text-negative'}`}>
                {data.revenueChangeVsLastWeek >= 0 ? <Icon.TrendUp /> : <Icon.TrendDown />} 
                {Math.abs(data.revenueChangeVsLastWeek).toFixed(1)}%
              </p>
            </div>
          </div>

          {/* CUSTOMER INSIGHTS */}
          <div className="customer-metrics">
            <h3>Customer Insights</h3>
            <div className="customer-metrics-grid">
              <div className="customer-metric-card total-customers">
                <div className="customer-metric-value">{formatNumber(data.totalCustomers)}</div>
                <div className="customer-metric-label">Total Customers</div>
              </div>
              
              <div className="customer-metric-card new-customers">
                <div className="customer-metric-value">{formatNumber(data.newCustomers)}</div>
                <div className="customer-metric-label">New Customers</div>
              </div>
              
              <div className="customer-metric-card repeat-customers">
                <div className="customer-metric-value">{formatNumber(data.repeatCustomers)}</div>
                <div className="customer-metric-label">Repeat Customers</div>
              </div>
              
              <div className="customer-metric-card loyalty-rate">
                <div className="customer-metric-value">{formatPercent(data.repeatCustomerRate)}</div>
                <div className="customer-metric-label">Repeat Customer Rate</div>
              </div>
            </div>
          </div>
  
          {/* 7-DAY CUSTOMER INSIGHTS */}
          <div className="customer-metrics">
            <h3>Last 7 Days Customer Insights</h3>
            
            <div className="customer-metrics-grid">
              <div className="customer-metric-card total-customers">
                <div className="customer-metric-value">{formatNumber(data.last7DaysTotalCustomers)}</div>
                <div className="customer-metric-label">7-Day Total Customers</div>
              </div>
              
              <div className="customer-metric-card new-customers">
                <div className="customer-metric-value">{formatNumber(data.last7DaysNewCustomers)}</div>
                <div className="customer-metric-label">7-Day New Customers</div>
              </div>
              
              <div className="customer-metric-card repeat-customers">
                <div className="customer-metric-value">{formatNumber(data.last7DaysRepeatCustomers)}</div>
                <div className="customer-metric-label">7-Day Repeat Customers</div>
              </div>
              
              <div className="customer-metric-card loyalty-rate">
                <div className="customer-metric-value">{formatPercent(data.last7DaysRepeatCustomerRate)}</div>
                <div className="customer-metric-label">7-Day Repeat Rate</div>
              </div>
            </div>
          </div>

          {/* FINANCIAL METRICS SECTION */}
          <div className="financial-metrics">
            <h3>Financial Breakdown</h3>
            <div className="financial-metrics-grid">
              <div className="financial-metric-card discounts">
                <div className="financial-metric-value">{formatCurrency(data.totalDiscounts)}</div>
                <div className="financial-metric-label">Total Discounts</div>
                <div className="financial-metric-rate">{formatPercent(data.discountRate)} of revenue</div>
              </div>
              
              <div className="financial-metric-card shipping">
                <div className="financial-metric-value">{formatCurrency(data.totalShipping)}</div>
                <div className="financial-metric-label">Shipping Charges</div>
                <div className="financial-metric-rate">{formatPercent(data.shippingRate)} of revenue</div>
              </div>
              
              <div className="financial-metric-card taxes">
                <div className="financial-metric-value">{formatCurrency(data.totalTaxes)}</div>
                <div className="financial-metric-label">Taxes Collected</div>
                <div className="financial-metric-rate">{formatPercent(data.taxRate)} of revenue</div>
              </div>
              
              <div className="financial-metric-card returns">
                <div className="financial-metric-value">{formatCurrency(data.totalReturns)}</div>
                <div className="financial-metric-label">Returns & Refunds</div>
                <div className="financial-metric-rate">{formatPercent(data.returnRate)} of revenue</div>
              </div>
              
              <div className="financial-metric-card net-revenue">
                <div className="financial-metric-value">{formatCurrency(data.netRevenue)}</div>
                <div className="financial-metric-label">Net Revenue</div>
                <div className="financial-metric-rate">After returns</div>
              </div>
            </div>
          </div>

        {/* CHARTS & ANALYTICS SECTION */}
        <div className="charts-section">
          <h2>Advanced Analytics & Insights</h2>
          
          <div className="charts-grid">
            {/* Customer Distribution Pie Chart */}
            <div className="chart-container">
              <div className="chart-header">
                <div className="chart-title">Customer Distribution</div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <div className="legend-color new"></div>
                    <span>New</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color repeat"></div>
                    <span>Repeat</span>
                  </div>
                </div>
              </div>
              {CustomerDistributionChart}
              <div className="mini-stats">
                <div className="mini-stat-card">
                  <div className="mini-stat-value">{formatPercent(data.repeatCustomerRate)}</div>
                  <div className="mini-stat-label">Repeat Rate</div>
                </div>
                <div className="mini-stat-card">
                  <div className="mini-stat-value">{formatNumber(data.totalCustomers)}</div>
                  <div className="mini-stat-label">Total Customers</div>
                </div>
              </div>
            </div>

            {/* Order Status Doughnut Chart */}
            <div className="chart-container">
              <div className="chart-header">
                <div className="chart-title">Order Fulfillment</div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <div className="legend-color fulfilled"></div>
                    <span>Fulfilled</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color unfulfilled"></div>
                    <span>Unfulfilled</span>
                  </div>
                </div>
              </div>
              {OrderFulfillmentChart}
              <div className="mini-stats">
                <div className="mini-stat-card">
                  <div className="mini-stat-value">{formatPercent(data.fulfillmentRate)}</div>
                  <div className="mini-stat-label">Fulfillment Rate</div>
                </div>
                <div className="mini-stat-card">
                  <div className="mini-stat-value">{formatNumber(data.totalOrders)}</div>
                  <div className="mini-stat-label">Total Orders</div>
                </div>
              </div>
            </div>

            {/* Revenue Trend Line Chart */}
            <div className="chart-container">
              <div className="chart-header">
                <div className="chart-title">Weekly Revenue</div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <div className="legend-color revenue"></div>
                    <span>Revenue</span>
                  </div>
                </div>
              </div>
              {RevenueTrendChart}
            </div>

            {/* Monthly Performance Bar Chart */}
            <div className="chart-container">
              <div className="chart-header">
                <div className="chart-title">Monthly Performance</div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <div className="legend-color revenue"></div>
                    <span>Revenue</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color orders"></div>
                    <span>Orders</span>
                  </div>
                </div>
              </div>
              {MonthlyPerformanceChart}
            </div>
          </div>
        </div>

        {/* APP FOOTER */}
        <div className="app-footer">
          <div className="footer-content">
            <p>
              <strong>Orders Analyzed:</strong> {data.ordersLoaded} orders • 
              <strong> Net Revenue:</strong> {formatCurrency(data.netRevenue)} • 
              <strong> Data Updated:</strong> {new Date().toLocaleDateString()}
            </p>
            <p className="footer-brand">
              <Icon.Analytics />
              Orders Dashboard - Powering Your Business Insights
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}