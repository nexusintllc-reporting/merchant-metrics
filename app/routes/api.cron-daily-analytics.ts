import { json } from "@remix-run/node";
import { StoreEmailSettings } from "../models/StoreEmailSettings.server";
import { getValidSession, getOfflineSession } from "../utils/sessionManager.server"; // CORRECT PATH
import { sendScheduledReports } from "../jobs/sendScheduledReports.server"; // CORRECT PATH

const CRON_SECRET_TOKEN = process.env.CRON_SECRET_TOKEN || 'your-secret-token-here';

export async function action({ request }: { request: Request }) {
  try {
    // Verify the request is from our cron job
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || authHeader !== `Bearer ${CRON_SECRET_TOKEN}`) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🚀 Starting scheduled analytics report generation...');

    // Get all shops that have scheduled reports enabled
    const shops = await StoreEmailSettings.getShopsWithScheduledReports();
    
    if (shops.length === 0) {
      console.log('No shops with scheduled reports enabled');
      return json({ 
        success: true, 
        message: 'No shops with scheduled reports enabled',
        shopsProcessed: 0 
      });
    }

    const results = [];
    
    for (const shopConfig of shops) {
      try {
        console.log(`Processing analytics for shop: ${shopConfig.shop}`);
        
        // USE YOUR EXISTING SESSION UTILITIES
        let session = await getValidSession(shopConfig.shop);
        
        // Fallback to offline session if needed
        if (!session) {
          session = await getOfflineSession(shopConfig.shop);
        }
        
        if (!session) {
          console.log(`❌ No valid session found for shop: ${shopConfig.shop}`);
          results.push({
            shop: shopConfig.shop,
            success: false,
            error: 'No valid Shopify session found'
          });
          continue;
        }

        // USE YOUR EXISTING BACKGROUND JOB FUNCTION
        await sendScheduledReports(session);

        results.push({
          shop: shopConfig.shop,
          success: true,
          message: 'Scheduled report sent successfully'
        });

        console.log(`✅ Successfully processed shop: ${shopConfig.shop}`);

      } catch (shopError: any) {
        console.error(`❌ Error processing shop ${shopConfig.shop}:`, shopError);
        results.push({
          shop: shopConfig.shop,
          success: false,
          error: shopError.message
        });
      }
    }

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log(`📊 Cron job completed: ${successful} successful, ${failed} failed`);

    return json({
      success: true,
      summary: {
        totalShops: shops.length,
        successful,
        failed
      },
      results
    });

  } catch (error: any) {
    console.error('❌ Cron job failed:', error);
    return json({
      success: false,
      error: 'Failed to process scheduled analytics reports',
      details: error.message
    }, { status: 500 });
  }
}

export async function loader() {
  return json({ 
    message: "Cron job endpoint for daily analytics reports",
    usage: "POST with Authorization header to trigger reports"
  });
}