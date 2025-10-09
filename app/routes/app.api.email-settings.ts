// import { json, LoaderFunctionArgs } from "@remix-run/node";
// import { authenticate } from "../shopify.server";
// import { StoreEmailSettings } from "../models/StoreEmailSettings.server";

// export async function loader({ request }: LoaderFunctionArgs) {
//   const { session } = await authenticate.admin(request);

//   try {
//     let settings = await StoreEmailSettings.get(session.shop);
    
//     // If no settings exist, create default ones
//     if (!settings) {
//       settings = await StoreEmailSettings.create({
//         shop: session.shop,
//         fromEmail: "info@nexusbling.com",
//         fromName: "Store",
//         enabled: true,
//         scheduleEnabled: false,
//         scheduleTime: "09:00",
//         timezone: "UTC"
//       });
//     }
    
//     return json({ settings });
//   } catch (error: any) {
//     return json({ 
//       error: "Failed to load settings"
//     }, { status: 500 });
//   }
// }

// export async function action({ request }: { request: Request }) {
//   const { session } = await authenticate.admin(request);

//   if (request.method === "POST") {
//     try {
//       const formData = await request.json();

//       const settings = await StoreEmailSettings.update(session.shop, {
//         fromEmail: formData.fromEmail,
//         fromName: formData.fromName,
//         enabled: formData.enabled,
//         scheduleEnabled: formData.scheduleEnabled,
//         scheduleTime: formData.scheduleTime,
//         timezone: formData.timezone,
//       });

//       return json({ success: true, settings });
//     } catch (error: any) {
//       return json({ 
//         error: "Failed to save settings"
//       }, { status: 500 });
//     }
//   }

//   return json({ error: "Method not allowed" }, { status: 405 });
// }


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
        additionalEmails: [], // NEW: Initialize with empty array
        scheduleEnabled: false,
        scheduleTime: "09:00",
        timezone: "UTC"
      });
    }
    
    return json({ settings });
  } catch (error: any) {
    console.error('Error loading email settings:', error);
    return json({ 
      error: "Failed to load settings",
      details: error.message 
    }, { status: 500 });
  }
}

export async function action({ request }: { request: Request }) {
  const { session } = await authenticate.admin(request);

  if (request.method === "POST") {
    try {
      const formData = await request.json();
      
      console.log('Received email settings update:', {
        shop: session.shop,
        fromEmail: formData.fromEmail,
        additionalEmailsCount: formData.additionalEmails?.length || 0
      });

      // Validate required fields
      if (!formData.fromEmail) {
        return json({ 
          error: "Primary email is required"
        }, { status: 400 });
      }

      // Validate additional emails array
      let additionalEmails = formData.additionalEmails || [];
      if (!Array.isArray(additionalEmails)) {
        console.warn('Additional emails is not an array, converting to array');
        additionalEmails = [];
      }

      // Validate maximum of 5 additional emails
      if (additionalEmails.length > 5) {
        return json({ 
          error: "Maximum of 5 additional email addresses allowed"
        }, { status: 400 });
      }

      // Validate email formats
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (!emailRegex.test(formData.fromEmail)) {
        return json({ 
          error: "Primary email address is invalid"
        }, { status: 400 });
      }

      // Validate additional emails format and remove empty ones
      const validAdditionalEmails: string[] = [];
      for (const email of additionalEmails) {
        if (email && email.trim()) {
          if (!emailRegex.test(email)) {
            return json({ 
              error: `Invalid email address in additional emails: ${email}`
            }, { status: 400 });
          }
          validAdditionalEmails.push(email.trim());
        }
      }

      // Check for duplicates between primary and additional emails
      const allEmails = [formData.fromEmail, ...validAdditionalEmails];
      const uniqueEmails = [...new Set(allEmails)];
      
      if (uniqueEmails.length !== allEmails.length) {
        return json({ 
          error: "Duplicate email addresses found between primary and additional emails"
        }, { status: 400 });
      }

      const settings = await StoreEmailSettings.update(session.shop, {
        fromEmail: formData.fromEmail,
        fromName: formData.fromName,
        enabled: formData.enabled,
        additionalEmails: validAdditionalEmails, // NEW: Pass validated additional emails
        scheduleEnabled: formData.scheduleEnabled,
        scheduleTime: formData.scheduleTime,
        timezone: formData.timezone,
      });

      console.log('Successfully updated email settings:', {
        shop: session.shop,
        fromEmail: settings.fromEmail,
        additionalEmailsCount: settings.additionalEmails?.length || 0
      });

      return json({ 
        success: true, 
        settings: {
          ...settings,
          additionalEmails: settings.additionalEmails || [] // Ensure array
        }
      });
    } catch (error: any) {
      console.error('Error saving email settings:', error);
      return json({ 
        error: "Failed to save settings",
        details: error.message
      }, { status: 500 });
    }
  }

  return json({ error: "Method not allowed" }, { status: 405 });
}