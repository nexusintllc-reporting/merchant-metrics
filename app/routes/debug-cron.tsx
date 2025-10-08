import { json } from "@remix-run/node";

export async function loader() {
  console.log('DEBUG: Cron test route accessed');
  return json({ 
    message: "Debug cron route works!", 
    timestamp: new Date().toISOString(),
    route: "debug-cron"
  });
}

export default function DebugCron() {
  return <div>Debug Cron Route</div>;
}