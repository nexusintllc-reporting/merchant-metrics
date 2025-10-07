// app/routes/app.api.trigger-reports.ts - NEW FILE
import { json } from "@remix-run/node";
import { triggerScheduledReports } from "../services/scheduler";

export async function action({ request }: { request: Request }) {
  if (request.method === "POST") {
    try {
      const result = await triggerScheduledReports();
      return json(result);
    } catch (error: any) {
      return json({ 
        success: false, 
        error: 'Failed to trigger reports' 
      }, { status: 500 });
    }
  }

  return json({ error: "Method not allowed" }, { status: 405 });
}

export async function loader() {
  return json({ 
    message: "Trigger reports endpoint",
    instructions: "Send POST request to manually trigger scheduled reports"
  });
}