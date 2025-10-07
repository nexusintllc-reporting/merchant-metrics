import { json, LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { StoreEmailSettings } from "../models/StoreEmailSettings.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);

  try {
    let settings = await StoreEmailSettings.get(session.shop);
    
    // If no settings exist, create default ones
    if (!settings) {
      settings = await StoreEmailSettings.create({
        shop: session.shop,
        fromEmail: "info@nexusbling.com",
        fromName: "Store",
        enabled: true,
        scheduleEnabled: false,
        scheduleTime: "09:00",
        timezone: "UTC"
      });
    }
    
    return json({ settings });
  } catch (error: any) {
    return json({ 
      error: "Failed to load settings"
    }, { status: 500 });
  }
}

export async function action({ request }: { request: Request }) {
  const { session } = await authenticate.admin(request);

  if (request.method === "POST") {
    try {
      const formData = await request.json();

      const settings = await StoreEmailSettings.update(session.shop, {
        fromEmail: formData.fromEmail,
        fromName: formData.fromName,
        enabled: formData.enabled,
        scheduleEnabled: formData.scheduleEnabled,
        scheduleTime: formData.scheduleTime,
        timezone: formData.timezone,
      });

      return json({ success: true, settings });
    } catch (error: any) {
      return json({ 
        error: "Failed to save settings"
      }, { status: 500 });
    }
  }

  return json({ error: "Method not allowed" }, { status: 405 });
}