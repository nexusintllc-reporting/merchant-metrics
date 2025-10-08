import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader() {
  // This will help us see what routes are available
  return json({
    message: "Debug routes",
    timestamp: new Date().toISOString(),
    availableRoutes: [
      "/app/api/email-settings",
      "/app/api/send-analytics-report", 
      "/app/api/trigger-reports",
      "/app/api/cron",
      "/debug-routes"
    ]
  });
}

export default function DebugRoutes() {
  const data = useLoaderData<typeof loader>();
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🛠️ Debug Routes</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      
      <h2>Test Links:</h2>
      {data.availableRoutes.map(route => (
        <div key={route}>
          <a href={route} target="_blank" rel="noreferrer">
            {route}
          </a>
        </div>
      ))}
    </div>
  );
}