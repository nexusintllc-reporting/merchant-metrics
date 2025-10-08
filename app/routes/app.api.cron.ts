import { json } from "@remix-run/node";

console.log('🔄 app.api.cron.ts is being loaded during build');

export async function loader() {
  console.log('✅ /app/api/cron route was accessed');
  return json({ 
    success: true,
    message: "Cron route is working!",
    timestamp: new Date().toISOString(),
    route: "app.api.cron"
  });
}