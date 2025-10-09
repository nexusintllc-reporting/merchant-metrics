// import { json, LoaderFunctionArgs } from "@remix-run/node";
// import { StoreEmailSettings } from "../models/StoreEmailSettings.server";
// import { getValidSession, getOfflineSession } from "../utils/sessionManager.server";
// import { sendScheduledReports } from "../jobs/sendScheduledReports.server";

// const CRON_SECRET_TOKEN = process.env.CRON_SECRET_TOKEN;

// // Timezone conversion function
// function convertUTCToTimezone(utcTime: string, timezone: string): string {
//   try {
//     // Parse UTC time (e.g., "14:20")
//     const [hours, minutes] = utcTime.split(':').map(Number);
    
//     // Create a date object for today with the UTC time
//     const utcDate = new Date();
//     utcDate.setUTCHours(hours, minutes, 0, 0);
    
//     // Convert to target timezone
//     const formatter = new Intl.DateTimeFormat('en-US', {
//       timeZone: timezone,
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: false
//     });
    
//     const parts = formatter.formatToParts(utcDate);
//     const hour = parts.find(part => part.type === 'hour')?.value.padStart(2, '0') || '00';
//     const minute = parts.find(part => part.type === 'minute')?.value.padStart(2, '0') || '00';
    
//     return `${hour}:${minute}`;
//   } catch (error) {
//     console.error(`Error converting UTC ${utcTime} to ${timezone}:`, error);
//     return utcTime; // Fallback to UTC
//   }
// }

// export async function action({ request }: { request: Request }) {
//   try {
//     // Verify the request is from our cron job
//     const authHeader = request.headers.get('Authorization');
//     if (!authHeader || authHeader !== `Bearer ${CRON_SECRET_TOKEN}`) {
//       console.log('❌ Unauthorized cron request');
//       return json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     // Get current UTC time
//     const nowUTC = new Date();
//     const currentUTCTime = nowUTC.toTimeString().slice(0, 5);
    
//     console.log(`🚀 Smart cron started at UTC: ${currentUTCTime}`);
//     console.log(`📅 Full UTC datetime: ${nowUTC.toISOString()}`);

//     // Get shops due across ALL timezones
//     const shops = await StoreEmailSettings.getShopsDueForReportsInAllTimezones(currentUTCTime);
    
//     if (shops.length === 0) {
//       console.log(`⏰ No shops with scheduled reports due at UTC ${currentUTCTime}`);
//       return json({ 
//         success: true, 
//         message: `No shops with scheduled reports due at UTC ${currentUTCTime}`,
//         currentUTCTime,
//         shopsProcessed: 0 
//       });
//     }

//     console.log(`🎯 Processing ${shops.length} shops due across different timezones`);

//     const results = [];
    
//     for (const shopConfig of shops) {
//       try {
//         console.log(`🛍️ Processing shop: ${shopConfig.shop} (Timezone: ${shopConfig.timezone}, Scheduled: ${shopConfig.scheduleTime})`);
        
//         // USE YOUR EXISTING SESSION UTILITIES
//         let session = await getValidSession(shopConfig.shop);
        
//         // Fallback to offline session if needed
//         if (!session) {
//           session = await getOfflineSession(shopConfig.shop);
//         }
        
//         if (!session) {
//           console.log(`❌ No valid session found for shop: ${shopConfig.shop}`);
//           results.push({
//             shop: shopConfig.shop,
//             success: false,
//             error: 'No valid Shopify session found'
//           });
//           continue;
//         }

//         // USE YOUR EXISTING BACKGROUND JOB FUNCTION
//         await sendScheduledReports(session);

//         results.push({
//           shop: shopConfig.shop,
//           success: true,
//           message: `Report sent successfully (Timezone: ${shopConfig.timezone}, Scheduled: ${shopConfig.scheduleTime})`
//         });

//         console.log(`✅ Successfully processed shop: ${shopConfig.shop}`);

//       } catch (shopError: any) {
//         console.error(`❌ Error processing shop ${shopConfig.shop}:`, shopError);
//         results.push({
//           shop: shopConfig.shop,
//           success: false,
//           error: shopError.message
//         });
//       }
//     }

//     const successful = results.filter(r => r.success).length;
//     const failed = results.filter(r => !r.success).length;

//     console.log(`📊 Smart cron completed: ${successful} successful, ${failed} failed at UTC ${currentUTCTime}`);

//     return json({
//       success: true,
//       summary: {
//         currentUTCTime,
//         totalShops: shops.length,
//         successful,
//         failed
//       },
//       results
//     });

//   } catch (error: any) {
//     console.error('❌ Smart cron job failed:', error);
//     return json({
//       success: false,
//       error: 'Failed to process scheduled analytics reports',
//       details: error.message
//     }, { status: 500 });
//   }
// }

// export async function loader({ request }: LoaderFunctionArgs) {
//   try {
//     // Get ALL scheduled shops to see what we have
//     const allScheduledShops = await StoreEmailSettings.getShopsWithScheduledReports();
    
//     // Get current UTC time for testing
//     const nowUTC = new Date();
//     const currentUTCTime = nowUTC.toTimeString().slice(0, 5);
    
//     // Test timezone conversion
//     const debugShops = allScheduledShops.map(shop => {
//       // Use the same conversion logic as in your action
//       const convertedTime = convertUTCToTimezone(currentUTCTime, shop.timezone);
      
//       return {
//         shop: shop.shop,
//         scheduleTime: shop.scheduleTime,
//         timezone: shop.timezone,
//         currentUTCTime: currentUTCTime,
//         convertedLocalTime: convertedTime,
//         matches: shop.scheduleTime === convertedTime,
//         enabled: true, // Assuming from getShopsWithScheduledReports
//         scheduleEnabled: true // Assuming from getShopsWithScheduledReports
//       };
//     });

//     return json({
//       message: "Debug: Current scheduled shops status",
//       currentUTCTime,
//       totalScheduledShops: allScheduledShops.length,
//       shops: debugShops,
//       nextCronRuns: [
//         "14:39 UTC (09:39 CT)",
//         "14:40 UTC (09:40 CT)", 
//         "14:41 UTC (09:41 CT)"
//       ].join(", "),
//       explanation: "When UTC time matches the converted local time, emails will be sent"
//     });
//   } catch (error: any) {
//     return json({ 
//       error: "Debug failed", 
//       details: error.message 
//     }, { status: 500 });
//   }
// }

import { json, LoaderFunctionArgs } from "@remix-run/node";
import { StoreEmailSettings } from "../models/StoreEmailSettings.server";
import { getValidSession, getOfflineSession } from "../utils/sessionManager.server";
import { sendScheduledReports } from "../jobs/sendScheduledReports.server";

const CRON_SECRET_TOKEN = process.env.CRON_SECRET_TOKEN;

// ==================== A. ERROR HANDLING & RETRY CONFIG ====================
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds

// Check if error is retryable
function isRetryableError(error: any): boolean {
  const retryableMessages = [
    'rate limit',
    'too many requests',
    'timeout',
    'network',
    'temporary',
    'server error',
    'gateway timeout',
    'service unavailable',
    'connection reset',
    'socket hang up'
  ];
  
  const errorMessage = error.message?.toLowerCase() || '';
  const statusCode = error.code || error.status;
  
  // Retry on 5xx errors and specific 4xx errors
  if (statusCode >= 500) return true;
  if (statusCode === 429) return true; // Rate limit
  
  return retryableMessages.some(msg => errorMessage.includes(msg));
}

// Enhanced shop processing with retry logic
async function processShopWithRetry(shopConfig: any, retries = MAX_RETRIES): Promise<any> {
  try {
    console.log(`🔄 Processing shop: ${shopConfig.shop} (${retries} retries left)`);
    
    let session = await getValidSession(shopConfig.shop);
    
    // Fallback to offline session if needed
    if (!session) {
      session = await getOfflineSession(shopConfig.shop);
    }
    
    if (!session) {
      throw new Error('No valid Shopify session found');
    }

    // Use existing background job function
    await sendScheduledReports(session);

    console.log(`✅ Successfully processed shop: ${shopConfig.shop}`);
    
    return {
      shop: shopConfig.shop,
      success: true,
      message: `Report sent successfully (Timezone: ${shopConfig.timezone}, Scheduled: ${shopConfig.scheduleTime})`
    };

  } catch (error: any) {
    if (retries > 0 && isRetryableError(error)) {
      console.log(`🔄 Retrying shop ${shopConfig.shop}, ${retries} attempts left. Error: ${error.message}`);
      
      // Exponential backoff
      const delay = RETRY_DELAY * (MAX_RETRIES - retries + 1);
      console.log(`⏳ Waiting ${delay/1000} seconds before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return processShopWithRetry(shopConfig, retries - 1);
    }
    
    // Final failure
    console.error(`❌ Final failure for shop ${shopConfig.shop}:`, error.message);
    return {
      shop: shopConfig.shop,
      success: false,
      error: error.message,
      retriesAttempted: MAX_RETRIES - retries
    };
  }
}

// ==================== B. RATE LIMITING PROTECTION ====================
const SHOPIFY_RATE_LIMIT_DELAY = 2000; // 2 seconds between shops
const BATCH_SIZE = 5; // Process 5 shops at a time
const BATCH_DELAY = 10000; // 10 seconds between batches

// Process shops with rate limiting
async function processShopsWithRateLimit(shops: any[]): Promise<any[]> {
  const results = [];
  let processedCount = 0;
  
  console.log(`📦 Processing ${shops.length} shops in batches of ${BATCH_SIZE}`);
  
  // Process in batches to avoid overwhelming Shopify API
  for (let i = 0; i < shops.length; i += BATCH_SIZE) {
    const batch = shops.slice(i, i + BATCH_SIZE);
    const batchNumber = Math.floor(i/BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(shops.length/BATCH_SIZE);
    
    console.log(`\n📦 Processing batch ${batchNumber} of ${totalBatches} (shops ${i+1}-${Math.min(i+BATCH_SIZE, shops.length)})`);
    
    // Process shops in current batch
    const batchPromises = batch.map(async (shopConfig, index) => {
      // Stagger requests within batch to avoid rate limits
      if (index > 0) {
        await new Promise(resolve => setTimeout(resolve, SHOPIFY_RATE_LIMIT_DELAY));
      }
      
      processedCount++;
      console.log(`📊 Progress: ${processedCount}/${shops.length} shops (${Math.round(processedCount/shops.length*100)}%)`);
      
      try {
        const result = await processShopWithRetry(shopConfig);
        return result;
      } catch (error: any) {
        return {
          shop: shopConfig.shop,
          success: false,
          error: error.message,
          retriesAttempted: MAX_RETRIES
        };
      }
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Add delay between batches (unless it's the last batch)
    if (i + BATCH_SIZE < shops.length) {
      console.log(`⏳ Waiting ${BATCH_DELAY/1000} seconds before next batch...`);
      await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
    }
  }
  
  return results;
}

// ==================== C. TIMEZONE CONVERSION ====================
function convertUTCToTimezone(utcTime: string, timezone: string): string {
  try {
    // Parse UTC time (e.g., "14:20")
    const [hours, minutes] = utcTime.split(':').map(Number);
    
    // Create a date object for today with the UTC time
    const utcDate = new Date();
    utcDate.setUTCHours(hours, minutes, 0, 0);
    
    // Convert to target timezone
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    
    const parts = formatter.formatToParts(utcDate);
    const hour = parts.find(part => part.type === 'hour')?.value.padStart(2, '0') || '00';
    const minute = parts.find(part => part.type === 'minute')?.value.padStart(2, '0') || '00';
    
    return `${hour}:${minute}`;
  } catch (error) {
    console.error(`Error converting UTC ${utcTime} to ${timezone}:`, error);
    return utcTime; // Fallback to UTC
  }
}

// ==================== D. HEALTH & DEBUG FUNCTIONS ====================
async function getHealthStatus() {
  try {
    const scheduledShops = await StoreEmailSettings.getShopsWithScheduledReports();
    const nowUTC = new Date();
    const currentUTCTime = nowUTC.toTimeString().slice(0, 5);
    
    // Check if we can connect to database and process shops
    const testShops = await StoreEmailSettings.getShopsDueForReportsInAllTimezones(currentUTCTime);
    
    return {
      status: 'healthy',
      timestamp: nowUTC.toISOString(),
      currentUTCTime,
      totalScheduledShops: scheduledShops.length,
      shopsDueNow: testShops.length,
      features: {
        retryLogic: true,
        rateLimiting: true,
        timezoneAware: true,
        multiEmail: true,
        healthCheck: true
      },
      configuration: {
        maxRetries: MAX_RETRIES,
        retryDelay: RETRY_DELAY,
        batchSize: BATCH_SIZE,
        shopDelay: SHOPIFY_RATE_LIMIT_DELAY,
        batchDelay: BATCH_DELAY
      }
    };
  } catch (error: any) {
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

async function getDebugInfo() {
  try {
    // Get ALL scheduled shops to see what we have
    const allScheduledShops = await StoreEmailSettings.getShopsWithScheduledReports();
    
    // Get current UTC time for testing
    const nowUTC = new Date();
    const currentUTCTime = nowUTC.toTimeString().slice(0, 5);
    
    // Test timezone conversion
    const debugShops = allScheduledShops.map(shop => {
      // Use the same conversion logic as in your action
      const convertedTime = convertUTCToTimezone(currentUTCTime, shop.timezone);
      
      return {
        shop: shop.shop,
        scheduleTime: shop.scheduleTime,
        timezone: shop.timezone,
        currentUTCTime: currentUTCTime,
        convertedLocalTime: convertedTime,
        matches: shop.scheduleTime === convertedTime,
        enabled: true,
        scheduleEnabled: true
      };
    });

    return {
      message: "DEBUG: Current scheduled shops status",
      currentUTCTime,
      totalScheduledShops: allScheduledShops.length,
      shops: debugShops,
      nextCronRuns: [
        "Every 15 minutes",
        "Based on individual shop timezones"
      ].join(", "),
      explanation: "When UTC time matches the converted local time, emails will be sent"
    };
  } catch (error: any) {
    return { 
      error: "Debug failed", 
      details: error.message 
    };
  }
}

// ==================== E. MAIN ACTION FUNCTION ====================
export async function action({ request }: { request: Request }) {
  const startTime = Date.now();
  const executionId = Math.random().toString(36).substring(2, 15);
  
  try {
    console.log(`\n🚀 ========== CRON EXECUTION STARTED [${executionId}] ==========`);
    
    // Verify the request is from our cron job
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || authHeader !== `Bearer ${CRON_SECRET_TOKEN}`) {
      console.log('❌ Unauthorized cron request');
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current UTC time
    const nowUTC = new Date();
    const currentUTCTime = nowUTC.toTimeString().slice(0, 5);
    
    console.log(`🕒 Execution started at UTC: ${currentUTCTime}`);
    console.log(`📊 Rate limiting: ${BATCH_SIZE} shops/batch, ${SHOPIFY_RATE_LIMIT_DELAY}ms delay`);
    console.log(`🔄 Retry config: ${MAX_RETRIES} max retries, ${RETRY_DELAY}ms base delay`);

    // Get shops due across ALL timezones
    const shops = await StoreEmailSettings.getShopsDueForReportsInAllTimezones(currentUTCTime);
    
    if (shops.length === 0) {
      const executionTime = Date.now() - startTime;
      console.log(`⏰ No shops with scheduled reports due at UTC ${currentUTCTime}`);
      console.log(`✅ ========== CRON EXECUTION COMPLETED [${executionId}] - ${executionTime}ms ==========\n`);
      
      return json({ 
        success: true, 
        message: `No shops with scheduled reports due at UTC ${currentUTCTime}`,
        executionId,
        currentUTCTime,
        shopsProcessed: 0,
        executionTime
      });
    }

    console.log(`🎯 Found ${shops.length} shops due for processing`);

    // Process shops with rate limiting and retry logic
    const results = await processShopsWithRateLimit(shops);

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    const executionTime = Date.now() - startTime;

    // Calculate performance metrics
    const avgTimePerShop = executionTime / shops.length;
    const successRate = (successful / shops.length) * 100;

    console.log(`\n📊 ========== CRON EXECUTION COMPLETED [${executionId}] ==========`);
    console.log(`✅ Successful: ${successful}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⏱️  Execution time: ${executionTime}ms`);
    console.log(`📈 Average time per shop: ${avgTimePerShop.toFixed(0)}ms`);
    console.log(`🎯 Success rate: ${successRate.toFixed(1)}%`);
    console.log(`🔄 Retry stats: ${results.filter(r => !r.success && r.retriesAttempted).length} shops used retries`);

    return json({
      success: true,
      executionId,
      summary: {
        currentUTCTime,
        totalShops: shops.length,
        successful,
        failed,
        successRate: Math.round(successRate),
        executionTime,
        avgTimePerShop: Math.round(avgTimePerShop)
      },
      rateLimiting: {
        batches: Math.ceil(shops.length / BATCH_SIZE),
        batchSize: BATCH_SIZE,
        shopDelay: SHOPIFY_RATE_LIMIT_DELAY,
        batchDelay: BATCH_DELAY
      },
      retryConfig: {
        maxRetries: MAX_RETRIES,
        retryDelay: RETRY_DELAY
      },
      results
    });

  } catch (error: any) {
    const executionTime = Date.now() - startTime;
    console.error(`\n❌ ========== CRON EXECUTION FAILED [${executionId}] ==========`);
    console.error(`💥 Error: ${error.message}`);
    console.error(`⏱️  Execution time: ${executionTime}ms`);
    
    return json({
      success: false,
      executionId,
      error: 'Failed to process scheduled analytics reports',
      details: error.message,
      executionTime
    }, { status: 500 });
  }
}

// ==================== F. LOADER FUNCTION ====================
export async function loader({ request, params }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  
  // Health check endpoint
  if (url.searchParams.get('health') === 'true') {
    const healthStatus = await getHealthStatus();
    const statusCode = healthStatus.status === 'healthy' ? 200 : 500;
    return json(healthStatus, { status: statusCode });
  }
  
  // Debug endpoint
  if (url.searchParams.get('debug') === 'true') {
    const debugInfo = await getDebugInfo();
    return json(debugInfo);
  }
  
  // Default response
  return json({ 
    message: "Smart cron job endpoint for daily analytics reports",
    description: "Processes shops based on their individual schedule times and timezones",
    usage: "POST with Authorization header to trigger reports",
    endpoints: {
      health: "/api/cron-daily-analytics?health=true",
      debug: "/api/cron-daily-analytics?debug=true"
    }
  });
}