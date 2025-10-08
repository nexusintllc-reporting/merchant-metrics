import { type NextRequest } from 'next/server'
import { DailyEmailScheduler } from '../../scheduler/DailyEmailScheduler'

export async function GET(request: NextRequest) {
  try {
    console.log('🕒 Cron-job.org triggered daily emails')
    
    // Optional: Add basic security check
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET_TOKEN
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.warn('❌ Unauthorized cron job attempt')
      return new Response('Unauthorized', { status: 401 })
    }

    // Execute the email scheduler
    const scheduler = new DailyEmailScheduler()
    const result = await scheduler.executeDailyEmails()
    
    return Response.json({
      success: true,
      message: 'Daily email execution completed via cron-job.org',
      timestamp: new Date().toISOString(),
      result: {
        storesProcessed: result.storesProcessed,
        emailsSent: result.emailsSent,
        failedStores: result.failedStores.length
      }
    })
    
  } catch (error) {
    console.error('❌ Error in cron job:', error)
    return Response.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// Also support POST requests if preferred
export async function POST(request: NextRequest) {
  return GET(request)
}