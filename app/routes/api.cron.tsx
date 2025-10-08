import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  console.log('🔔 Cron endpoint called at:', new Date().toISOString());
  
  // Verify cron secret
  const authHeader = request.headers.get('Authorization');
  const expectedSecret = `Bearer ${process.env.CRON_SECRET}`;
  
  if (authHeader !== expectedSecret) {
    console.log('❌ Unauthorized cron attempt');
    return new Response('Unauthorized', { status: 401 });
  }

  console.log('✅ Authorized cron request - would process emails here');
  
  return json({
    success: true,
    message: 'Cron job executed - email processing would happen here',
    timestamp: new Date().toISOString()
  });
}

// Required default export
export default function CronRoute() {
  return null;
}