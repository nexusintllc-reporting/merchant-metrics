// // // // import { PrismaClient } from "@prisma/client";

// // // // const prisma = new PrismaClient();

// // // // export interface CreateStoreEmailSettingsInput {
// // // //   shop: string;
// // // //   fromEmail?: string;
// // // //   fromName?: string;
// // // //   enabled?: boolean;
// // // //   additionalEmails?: string[]; // NEW: Multiple email addresses
// // // //   scheduleEnabled?: boolean;
// // // //   scheduleTime?: string;
// // // //   timezone?: string;
// // // // }

// // // // export interface UpdateStoreEmailSettingsInput {
// // // //   fromEmail?: string;
// // // //   fromName?: string;
// // // //   enabled?: boolean;
// // // //   additionalEmails?: string[]; // NEW: Multiple email addresses
// // // //   scheduleEnabled?: boolean;
// // // //   scheduleTime?: string;
// // // //   timezone?: string;
// // // //   sendGridApiKey?: string;
// // // // }

// // // // export const StoreEmailSettings = {
// // // //   async get(shop: string) {
// // // //     try {
// // // //       const settings = await prisma.storeEmailSettings.findUnique({
// // // //         where: { shop },
// // // //       });
      
// // // //       // Ensure additionalEmails is always an array, even if null/undefined
// // // //       if (settings) {
// // // //         return {
// // // //           ...settings,
// // // //           additionalEmails: settings.additionalEmails || [] // Default to empty array
// // // //         };
// // // //       }
      
// // // //       return null;
// // // //     } catch (error) {
// // // //       console.error('Error retrieving email settings:', error);
// // // //       throw new Error('Failed to retrieve email settings');
// // // //     }
// // // //   },

// // // //   async create(input: CreateStoreEmailSettingsInput) {
// // // //     try {
// // // //       return await prisma.storeEmailSettings.create({
// // // //         data: {
// // // //           shop: input.shop,
// // // //           fromEmail: input.fromEmail || "info@nexusbling.com",
// // // //           fromName: input.fromName || "Store",
// // // //           enabled: input.enabled ?? true,
// // // //           additionalEmails: input.additionalEmails || [], // NEW: Handle additional emails
// // // //           scheduleEnabled: input.scheduleEnabled ?? false,
// // // //           scheduleTime: input.scheduleTime || "09:00",
// // // //           timezone: input.timezone || "UTC",
// // // //         },
// // // //       });
// // // //     } catch (error) {
// // // //       console.error('Error creating email settings:', error);
// // // //       throw new Error('Failed to create email settings');
// // // //     }
// // // //   },

// // // //   async update(shop: string, input: UpdateStoreEmailSettingsInput) {
// // // //     try {
// // // //       return await prisma.storeEmailSettings.upsert({
// // // //         where: { shop },
// // // //         update: {
// // // //           fromEmail: input.fromEmail,
// // // //           fromName: input.fromName,
// // // //           enabled: input.enabled,
// // // //           additionalEmails: input.additionalEmails || [], // NEW: Handle additional emails
// // // //           scheduleEnabled: input.scheduleEnabled,
// // // //           scheduleTime: input.scheduleTime,
// // // //           timezone: input.timezone,
// // // //           sendGridApiKey: input.sendGridApiKey,
// // // //         },
// // // //         create: {
// // // //           shop,
// // // //           fromEmail: input.fromEmail || "info@nexusbling.com",
// // // //           fromName: input.fromName || "Store",
// // // //           enabled: input.enabled ?? true,
// // // //           additionalEmails: input.additionalEmails || [], // NEW: Handle additional emails
// // // //           scheduleEnabled: input.scheduleEnabled ?? false,
// // // //           scheduleTime: input.scheduleTime || "09:00",
// // // //           timezone: input.timezone || "UTC",
// // // //         },
// // // //       });
// // // //     } catch (error) {
// // // //       console.error('Error updating email settings:', error);
// // // //       throw new Error('Failed to update email settings');
// // // //     }
// // // //   },

// // // //   async isEnabled(shop: string) {
// // // //     try {
// // // //       const settings = await this.get(shop);
// // // //       return settings?.enabled ?? true;
// // // //     } catch (error) {
// // // //       console.error('Error checking if email is enabled:', error);
// // // //       return true;
// // // //     }
// // // //   },

// // // //   async getShopsWithScheduledReports() {
// // // //     try {
// // // //       const shops = await prisma.storeEmailSettings.findMany({
// // // //         where: {
// // // //           enabled: true,
// // // //           scheduleEnabled: true,
// // // //         },
// // // //         select: {
// // // //           shop: true,
// // // //           scheduleTime: true,
// // // //           timezone: true,
// // // //           fromEmail: true,
// // // //           fromName: true,
// // // //           additionalEmails: true, // NEW: Include additional emails
// // // //         },
// // // //       });

// // // //       // Ensure additionalEmails is always an array for each shop
// // // //       return shops.map(shop => ({
// // // //         ...shop,
// // // //         additionalEmails: shop.additionalEmails || []
// // // //       }));
// // // //     } catch (error) {
// // // //       console.error('Error retrieving shops with scheduled reports:', error);
// // // //       throw new Error('Failed to retrieve shops with scheduled reports');
// // // //     }
// // // //   },
// // // // };

// // // import { PrismaClient } from "@prisma/client";

// // // const prisma = new PrismaClient();

// // // export interface CreateStoreEmailSettingsInput {
// // //   shop: string;
// // //   fromEmail?: string;
// // //   fromName?: string;
// // //   enabled?: boolean;
// // //   additionalEmails?: string[];
// // //   scheduleEnabled?: boolean;
// // //   scheduleTime?: string;
// // //   timezone?: string;
// // //   accessToken?: string; // RECOMMENDED: Add for session management
// // // }

// // // export interface UpdateStoreEmailSettingsInput {
// // //   fromEmail?: string;
// // //   fromName?: string;
// // //   enabled?: boolean;
// // //   additionalEmails?: string[];
// // //   scheduleEnabled?: boolean;
// // //   scheduleTime?: string;
// // //   timezone?: string;
// // //   sendGridApiKey?: string;
// // //   accessToken?: string; // RECOMMENDED: Add for session management
// // // }

// // // export const StoreEmailSettings = {
// // //   async get(shop: string) {
// // //     try {
// // //       const settings = await prisma.storeEmailSettings.findUnique({
// // //         where: { shop },
// // //       });
      
// // //       // Ensure additionalEmails is always an array, even if null/undefined
// // //       if (settings) {
// // //         return {
// // //           ...settings,
// // //           additionalEmails: settings.additionalEmails || [] // Default to empty array
// // //         };
// // //       }
      
// // //       return null;
// // //     } catch (error) {
// // //       console.error('Error retrieving email settings:', error);
// // //       throw new Error('Failed to retrieve email settings');
// // //     }
// // //   },

// // //   async create(input: CreateStoreEmailSettingsInput) {
// // //     try {
// // //       return await prisma.storeEmailSettings.create({
// // //         data: {
// // //           shop: input.shop,
// // //           fromEmail: input.fromEmail || "info@nexusbling.com",
// // //           fromName: input.fromName || "Store",
// // //           enabled: input.enabled ?? true,
// // //           additionalEmails: input.additionalEmails || [],
// // //           scheduleEnabled: input.scheduleEnabled ?? false,
// // //           scheduleTime: input.scheduleTime || "09:00",
// // //           timezone: input.timezone || "UTC",
// // //           accessToken: input.accessToken || null, // RECOMMENDED: Store access token
// // //         },
// // //       });
// // //     } catch (error) {
// // //       console.error('Error creating email settings:', error);
// // //       throw new Error('Failed to create email settings');
// // //     }
// // //   },

// // //   async update(shop: string, input: UpdateStoreEmailSettingsInput) {
// // //     try {
// // //       return await prisma.storeEmailSettings.upsert({
// // //         where: { shop },
// // //         update: {
// // //           fromEmail: input.fromEmail,
// // //           fromName: input.fromName,
// // //           enabled: input.enabled,
// // //           additionalEmails: input.additionalEmails || [],
// // //           scheduleEnabled: input.scheduleEnabled,
// // //           scheduleTime: input.scheduleTime,
// // //           timezone: input.timezone,
// // //           sendGridApiKey: input.sendGridApiKey,
// // //           accessToken: input.accessToken, // CRITICAL: Include access token
// // //         },
// // //         create: {
// // //           shop,
// // //           fromEmail: input.fromEmail || "info@nexusbling.com",
// // //           fromName: input.fromName || "Store",
// // //           enabled: input.enabled ?? true,
// // //           additionalEmails: input.additionalEmails || [],
// // //           scheduleEnabled: input.scheduleEnabled ?? false,
// // //           scheduleTime: input.scheduleTime || "09:00",
// // //           timezone: input.timezone || "UTC",
// // //           accessToken: input.accessToken || null, // CRITICAL: Include access token
// // //         },
// // //       });
// // //     } catch (error) {
// // //       console.error('Error updating email settings:', error);
// // //       throw new Error('Failed to update email settings');
// // //     }
// // //   },

// // //   async isEnabled(shop: string) {
// // //     try {
// // //       const settings = await this.get(shop);
// // //       return settings?.enabled ?? true;
// // //     } catch (error) {
// // //       console.error('Error checking if email is enabled:', error);
// // //       return true;
// // //     }
// // //   },

// // //   async getShopsWithScheduledReports() {
// // //     try {
// // //       const shops = await prisma.storeEmailSettings.findMany({
// // //         where: {
// // //           enabled: true,
// // //           scheduleEnabled: true,
// // //         },
// // //         select: {
// // //           shop: true,
// // //           scheduleTime: true,
// // //           timezone: true,
// // //           fromEmail: true,
// // //           fromName: true,
// // //           additionalEmails: true,
// // //           accessToken: true, // CRITICAL: Include access token for cron jobs
// // //         },
// // //       });

// // //       // Ensure additionalEmails is always an array for each shop
// // //       return shops.map(shop => ({
// // //         ...shop,
// // //         additionalEmails: shop.additionalEmails || []
// // //       }));
// // //     } catch (error) {
// // //       console.error('Error retrieving shops with scheduled reports:', error);
// // //       throw new Error('Failed to retrieve shops with scheduled reports');
// // //     }
// // //   },

// // //   // RECOMMENDED: New method to update access token separately
// // //   async updateAccessToken(shop: string, accessToken: string) {
// // //     try {
// // //       return await prisma.storeEmailSettings.update({
// // //         where: { shop },
// // //         data: { accessToken },
// // //       });
// // //     } catch (error) {
// // //       console.error('Error updating access token:', error);
// // //       throw new Error('Failed to update access token');
// // //     }
// // //   },

// // //   // RECOMMENDED: New method to get shops that need reports right now
// // //   async getShopsDueForReports(currentTime: string = new Date().toTimeString().slice(0, 5)) {
// // //     try {
// // //       const shops = await prisma.storeEmailSettings.findMany({
// // //         where: {
// // //           enabled: true,
// // //           scheduleEnabled: true,
// // //           scheduleTime: currentTime, // Match shops where it's time to send
// // //         },
// // //         select: {
// // //           shop: true,
// // //           scheduleTime: true,
// // //           timezone: true,
// // //           fromEmail: true,
// // //           fromName: true,
// // //           additionalEmails: true,
// // //           accessToken: true,
// // //         },
// // //       });

// // //       return shops.map(shop => ({
// // //         ...shop,
// // //         additionalEmails: shop.additionalEmails || []
// // //       }));
// // //     } catch (error) {
// // //       console.error('Error retrieving shops due for reports:', error);
// // //       throw new Error('Failed to retrieve shops due for reports');
// // //     }
// // //   },
// // // };

// // import { PrismaClient } from "@prisma/client";

// // const prisma = new PrismaClient();

// // export interface CreateStoreEmailSettingsInput {
// //   shop: string;
// //   fromEmail?: string;
// //   fromName?: string;
// //   enabled?: boolean;
// //   additionalEmails?: string[];
// //   scheduleEnabled?: boolean;
// //   scheduleTime?: string;
// //   timezone?: string;
// //   accessToken?: string;
// // }

// // export interface UpdateStoreEmailSettingsInput {
// //   fromEmail?: string;
// //   fromName?: string;
// //   enabled?: boolean;
// //   additionalEmails?: string[];
// //   scheduleEnabled?: boolean;
// //   scheduleTime?: string;
// //   timezone?: string;
// //   sendGridApiKey?: string;
// //   accessToken?: string;
// // }

// // export const StoreEmailSettings = {
// //   async get(shop: string) {
// //     try {
// //       const settings = await prisma.storeEmailSettings.findUnique({
// //         where: { shop },
// //       });
      
// //       if (settings) {
// //         return {
// //           ...settings,
// //           additionalEmails: settings.additionalEmails || []
// //         };
// //       }
      
// //       return null;
// //     } catch (error) {
// //       console.error('Error retrieving email settings:', error);
// //       throw new Error('Failed to retrieve email settings');
// //     }
// //   },

// //   async create(input: CreateStoreEmailSettingsInput) {
// //     try {
// //       return await prisma.storeEmailSettings.create({
// //         data: {
// //           shop: input.shop,
// //           fromEmail: input.fromEmail || "info@nexusbling.com",
// //           fromName: input.fromName || "Store",
// //           enabled: input.enabled ?? true,
// //           additionalEmails: input.additionalEmails || [],
// //           scheduleEnabled: input.scheduleEnabled ?? false,
// //           scheduleTime: input.scheduleTime || "09:00",
// //           timezone: input.timezone || "UTC",
// //           accessToken: input.accessToken || null,
// //         },
// //       });
// //     } catch (error) {
// //       console.error('Error creating email settings:', error);
// //       throw new Error('Failed to create email settings');
// //     }
// //   },

// //   async update(shop: string, input: UpdateStoreEmailSettingsInput) {
// //     try {
// //       return await prisma.storeEmailSettings.upsert({
// //         where: { shop },
// //         update: {
// //           fromEmail: input.fromEmail,
// //           fromName: input.fromName,
// //           enabled: input.enabled,
// //           additionalEmails: input.additionalEmails || [],
// //           scheduleEnabled: input.scheduleEnabled,
// //           scheduleTime: input.scheduleTime,
// //           timezone: input.timezone,
// //           sendGridApiKey: input.sendGridApiKey,
// //           accessToken: input.accessToken,
// //         },
// //         create: {
// //           shop,
// //           fromEmail: input.fromEmail || "info@nexusbling.com",
// //           fromName: input.fromName || "Store",
// //           enabled: input.enabled ?? true,
// //           additionalEmails: input.additionalEmails || [],
// //           scheduleEnabled: input.scheduleEnabled ?? false,
// //           scheduleTime: input.scheduleTime || "09:00",
// //           timezone: input.timezone || "UTC",
// //           accessToken: input.accessToken || null,
// //         },
// //       });
// //     } catch (error) {
// //       console.error('Error updating email settings:', error);
// //       throw new Error('Failed to update email settings');
// //     }
// //   },

// //   async isEnabled(shop: string) {
// //     try {
// //       const settings = await this.get(shop);
// //       return settings?.enabled ?? true;
// //     } catch (error) {
// //       console.error('Error checking if email is enabled:', error);
// //       return true;
// //     }
// //   },

// //   async getShopsWithScheduledReports() {
// //     try {
// //       const shops = await prisma.storeEmailSettings.findMany({
// //         where: {
// //           enabled: true,
// //           scheduleEnabled: true,
// //         },
// //         select: {
// //           shop: true,
// //           scheduleTime: true,
// //           timezone: true,
// //           fromEmail: true,
// //           fromName: true,
// //           additionalEmails: true,
// //           accessToken: true,
// //         },
// //       });

// //       return shops.map(shop => ({
// //         ...shop,
// //         additionalEmails: shop.additionalEmails || []
// //       }));
// //     } catch (error) {
// //       console.error('Error retrieving shops with scheduled reports:', error);
// //       throw new Error('Failed to retrieve shops with scheduled reports');
// //     }
// //   },

// //   // NEW: Get shops that need reports at the current time
// //   async getShopsDueForReports(currentTime: string) {
// //     try {
// //       console.log(`🔍 Looking for shops due at: ${currentTime}`);
      
// //       const shops = await prisma.storeEmailSettings.findMany({
// //         where: {
// //           enabled: true,
// //           scheduleEnabled: true,
// //           scheduleTime: currentTime, // Exact time match like "09:00", "17:30"
// //         },
// //         select: {
// //           shop: true,
// //           scheduleTime: true,
// //           timezone: true,
// //           fromEmail: true,
// //           fromName: true,
// //           additionalEmails: true,
// //           accessToken: true,
// //         },
// //       });

// //       console.log(`📊 Found ${shops.length} shops due at ${currentTime}`);
      
// //       return shops.map(shop => ({
// //         ...shop,
// //         additionalEmails: shop.additionalEmails || []
// //       }));
// //     } catch (error) {
// //       console.error('Error retrieving shops due for reports:', error);
// //       throw new Error('Failed to retrieve shops due for reports');
// //     }
// //   },

// //   // Optional: Get shops due in the next X minutes (for advanced scheduling)
// //   async getShopsDueInNextMinutes(minutes: number = 15) {
// //     try {
// //       const now = new Date();
// //       const future = new Date(now.getTime() + minutes * 60000);
// //       const currentTime = now.toTimeString().slice(0, 5);
// //       const futureTime = future.toTimeString().slice(0, 5);
      
// //       console.log(`🔍 Looking for shops due between ${currentTime} and ${futureTime}`);
      
// //       const shops = await prisma.storeEmailSettings.findMany({
// //         where: {
// //           enabled: true,
// //           scheduleEnabled: true,
// //           scheduleTime: {
// //             gte: currentTime,
// //             lte: futureTime
// //           }
// //         },
// //         select: {
// //           shop: true,
// //           scheduleTime: true,
// //           timezone: true,
// //           fromEmail: true,
// //           fromName: true,
// //           additionalEmails: true,
// //           accessToken: true,
// //         },
// //       });

// //       console.log(`📊 Found ${shops.length} shops due in next ${minutes} minutes`);
      
// //       return shops.map(shop => ({
// //         ...shop,
// //         additionalEmails: shop.additionalEmails || []
// //       }));
// //     } catch (error) {
// //       console.error('Error retrieving shops due in next minutes:', error);
// //       throw new Error('Failed to retrieve shops due in next minutes');
// //     }
// //   },
// // };


// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export interface CreateStoreEmailSettingsInput {
//   shop: string;
//   fromEmail?: string;
//   fromName?: string;
//   enabled?: boolean;
//   additionalEmails?: string[];
//   scheduleEnabled?: boolean;
//   scheduleTime?: string;
//   timezone?: string;
//   accessToken?: string;
// }

// export interface UpdateStoreEmailSettingsInput {
//   fromEmail?: string;
//   fromName?: string;
//   enabled?: boolean;
//   additionalEmails?: string[];
//   scheduleEnabled?: boolean;
//   scheduleTime?: string;
//   timezone?: string;
//   sendGridApiKey?: string;
//   accessToken?: string;
// }

// // Helper function to convert UTC time to any timezone
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

// export const StoreEmailSettings = {
//   async get(shop: string) {
//     try {
//       const settings = await prisma.storeEmailSettings.findUnique({
//         where: { shop },
//       });
      
//       if (settings) {
//         return {
//           ...settings,
//           additionalEmails: settings.additionalEmails || []
//         };
//       }
      
//       return null;
//     } catch (error) {
//       console.error('Error retrieving email settings:', error);
//       throw new Error('Failed to retrieve email settings');
//     }
//   },

//   async create(input: CreateStoreEmailSettingsInput) {
//     try {
//       return await prisma.storeEmailSettings.create({
//         data: {
//           shop: input.shop,
//           fromEmail: input.fromEmail || "info@nexusbling.com",
//           fromName: input.fromName || "Store",
//           enabled: input.enabled ?? true,
//           additionalEmails: input.additionalEmails || [],
//           scheduleEnabled: input.scheduleEnabled ?? false,
//           scheduleTime: input.scheduleTime || "09:00",
//           timezone: input.timezone || "UTC",
//           accessToken: input.accessToken || null,
//         },
//       });
//     } catch (error) {
//       console.error('Error creating email settings:', error);
//       throw new Error('Failed to create email settings');
//     }
//   },

//   async update(shop: string, input: UpdateStoreEmailSettingsInput) {
//     try {
//       return await prisma.storeEmailSettings.upsert({
//         where: { shop },
//         update: {
//           fromEmail: input.fromEmail,
//           fromName: input.fromName,
//           enabled: input.enabled,
//           additionalEmails: input.additionalEmails || [],
//           scheduleEnabled: input.scheduleEnabled,
//           scheduleTime: input.scheduleTime,
//           timezone: input.timezone,
//           sendGridApiKey: input.sendGridApiKey,
//           accessToken: input.accessToken,
//         },
//         create: {
//           shop,
//           fromEmail: input.fromEmail || "info@nexusbling.com",
//           fromName: input.fromName || "Store",
//           enabled: input.enabled ?? true,
//           additionalEmails: input.additionalEmails || [],
//           scheduleEnabled: input.scheduleEnabled ?? false,
//           scheduleTime: input.scheduleTime || "09:00",
//           timezone: input.timezone || "UTC",
//           accessToken: input.accessToken || null,
//         },
//       });
//     } catch (error) {
//       console.error('Error updating email settings:', error);
//       throw new Error('Failed to update email settings');
//     }
//   },

//   async isEnabled(shop: string) {
//     try {
//       const settings = await this.get(shop);
//       return settings?.enabled ?? true;
//     } catch (error) {
//       console.error('Error checking if email is enabled:', error);
//       return true;
//     }
//   },

//   async getShopsWithScheduledReports() {
//     try {
//       const shops = await prisma.storeEmailSettings.findMany({
//         where: {
//           enabled: true,
//           scheduleEnabled: true,
//         },
//         select: {
//           shop: true,
//           scheduleTime: true,
//           timezone: true,
//           fromEmail: true,
//           fromName: true,
//           additionalEmails: true,
//           accessToken: true,
//         },
//       });

//       return shops.map(shop => ({
//         ...shop,
//         additionalEmails: shop.additionalEmails || []
//       }));
//     } catch (error) {
//       console.error('Error retrieving shops with scheduled reports:', error);
//       throw new Error('Failed to retrieve shops with scheduled reports');
//     }
//   },

//   async getShopsDueForReports(currentTime: string) {
//     try {
//       console.log(`🔍 Looking for shops due at: ${currentTime}`);
      
//       const shops = await prisma.storeEmailSettings.findMany({
//         where: {
//           enabled: true,
//           scheduleEnabled: true,
//           scheduleTime: currentTime,
//         },
//         select: {
//           shop: true,
//           scheduleTime: true,
//           timezone: true,
//           fromEmail: true,
//           fromName: true,
//           additionalEmails: true,
//           accessToken: true,
//         },
//       });

//       console.log(`📊 Found ${shops.length} shops due at ${currentTime}`);
      
//       return shops.map(shop => ({
//         ...shop,
//         additionalEmails: shop.additionalEmails || []
//       }));
//     } catch (error) {
//       console.error('Error retrieving shops due for reports:', error);
//       throw new Error('Failed to retrieve shops due for reports');
//     }
//   },

//   async getShopsDueInNextMinutes(minutes: number = 15) {
//     try {
//       const now = new Date();
//       const future = new Date(now.getTime() + minutes * 60000);
//       const currentTime = now.toTimeString().slice(0, 5);
//       const futureTime = future.toTimeString().slice(0, 5);
      
//       console.log(`🔍 Looking for shops due between ${currentTime} and ${futureTime}`);
      
//       const shops = await prisma.storeEmailSettings.findMany({
//         where: {
//           enabled: true,
//           scheduleEnabled: true,
//           scheduleTime: {
//             gte: currentTime,
//             lte: futureTime
//           }
//         },
//         select: {
//           shop: true,
//           scheduleTime: true,
//           timezone: true,
//           fromEmail: true,
//           fromName: true,
//           additionalEmails: true,
//           accessToken: true,
//         },
//       });

//       console.log(`📊 Found ${shops.length} shops due in next ${minutes} minutes`);
      
//       return shops.map(shop => ({
//         ...shop,
//         additionalEmails: shop.additionalEmails || []
//       }));
//     } catch (error) {
//       console.error('Error retrieving shops due in next minutes:', error);
//       throw new Error('Failed to retrieve shops due in next minutes');
//     }
//   },

//   // NEW: Timezone-aware method for public apps
//   async getShopsDueForReportsInAllTimezones(currentUTCTime: string) {
//     try {
//       console.log(`🔍 Checking all timezones for UTC time: ${currentUTCTime}`);
      
//       // Get ALL shops with scheduling enabled
//       const allShops = await prisma.storeEmailSettings.findMany({
//         where: {
//           enabled: true,
//           scheduleEnabled: true,
//         },
//         select: {
//           shop: true,
//           scheduleTime: true,
//           timezone: true,
//           fromEmail: true,
//           fromName: true,
//           additionalEmails: true,
//           accessToken: true,
//         },
//       });

//       const dueShops = [];
      
//       for (const shop of allShops) {
//         try {
//           // Convert UTC time to shop's timezone
//           const shopLocalTime = convertUTCToTimezone(currentUTCTime, shop.timezone);
          
//           console.log(`🔍 Shop ${shop.shop}: UTC ${currentUTCTime} -> ${shop.timezone} ${shopLocalTime}, Scheduled: ${shop.scheduleTime}`);
          
//           // Check if it's time for this shop's report
//           if (shop.scheduleTime === shopLocalTime) {
//             console.log(`🎯 Shop ${shop.shop} is due!`);
//             dueShops.push({
//               ...shop,
//               additionalEmails: shop.additionalEmails || []
//             });
//           }
//         } catch (error) {
//           console.error(`❌ Error processing timezone for shop ${shop.shop}:`, error);
//         }
//       }

//       console.log(`📊 Found ${dueShops.length} shops due across all timezones`);
//       return dueShops;
      
//     } catch (error) {
//       console.error('Error retrieving shops due for reports:', error);
//       throw new Error('Failed to retrieve shops due for reports');
//     }
//   },

//   // Optional: Update access token separately
//   async updateAccessToken(shop: string, accessToken: string) {
//     try {
//       return await prisma.storeEmailSettings.update({
//         where: { shop },
//         data: { accessToken },
//       });
//     } catch (error) {
//       console.error('Error updating access token:', error);
//       throw new Error('Failed to update access token');
//     }
//   },
// };


import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface CreateStoreEmailSettingsInput {
  shop: string;
  fromEmail?: string;
  fromName?: string;
  enabled?: boolean;
  additionalEmails?: string[];
  scheduleEnabled?: boolean;
  scheduleTime?: string;
  timezone?: string;
  accessToken?: string;
}

export interface UpdateStoreEmailSettingsInput {
  fromEmail?: string;
  fromName?: string;
  enabled?: boolean;
  additionalEmails?: string[];
  scheduleEnabled?: boolean;
  scheduleTime?: string;
  timezone?: string;
  sendGridApiKey?: string;
  accessToken?: string;
}

// Helper function to convert UTC time to any timezone
function convertUTCToTimezone(utcTime: string, timezone: string): string {
  try {
    const [hours, minutes] = utcTime.split(':').map(Number);
    const utcDate = new Date();
    utcDate.setUTCHours(hours, minutes, 0, 0);
    
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
    return utcTime;
  }
}

export const StoreEmailSettings = {
  async get(shop: string) {
    try {
      const settings = await prisma.storeEmailSettings.findUnique({
        where: { shop },
      });
      
      if (settings) {
        return {
          ...settings,
          additionalEmails: settings.additionalEmails || []
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error retrieving email settings:', error);
      throw new Error('Failed to retrieve email settings');
    }
  },

  async create(input: CreateStoreEmailSettingsInput) {
    try {
      return await prisma.storeEmailSettings.create({
        data: {
          shop: input.shop,
          fromEmail: input.fromEmail || "info@nexusbling.com",
          fromName: input.fromName || "Store",
          enabled: input.enabled ?? true,
          additionalEmails: input.additionalEmails || [],
          scheduleEnabled: input.scheduleEnabled ?? false,
          scheduleTime: input.scheduleTime || "09:00",
          timezone: input.timezone || "UTC",
          accessToken: input.accessToken || null,
        },
      });
    } catch (error) {
      console.error('Error creating email settings:', error);
      throw new Error('Failed to create email settings');
    }
  },

  async update(shop: string, input: UpdateStoreEmailSettingsInput) {
    try {
      return await prisma.storeEmailSettings.upsert({
        where: { shop },
        update: {
          fromEmail: input.fromEmail,
          fromName: input.fromName,
          enabled: input.enabled,
          additionalEmails: input.additionalEmails || [],
          scheduleEnabled: input.scheduleEnabled,
          scheduleTime: input.scheduleTime,
          timezone: input.timezone,
          sendGridApiKey: input.sendGridApiKey,
          accessToken: input.accessToken,
        },
        create: {
          shop,
          fromEmail: input.fromEmail || "info@nexusbling.com",
          fromName: input.fromName || "Store",
          enabled: input.enabled ?? true,
          additionalEmails: input.additionalEmails || [],
          scheduleEnabled: input.scheduleEnabled ?? false,
          scheduleTime: input.scheduleTime || "09:00",
          timezone: input.timezone || "UTC",
          accessToken: input.accessToken || null,
        },
      });
    } catch (error) {
      console.error('Error updating email settings:', error);
      throw new Error('Failed to update email settings');
    }
  },

  async isEnabled(shop: string) {
    try {
      const settings = await this.get(shop);
      return settings?.enabled ?? true;
    } catch (error) {
      console.error('Error checking if email is enabled:', error);
      return true;
    }
  },

  async getShopsWithScheduledReports() {
    try {
      const shops = await prisma.storeEmailSettings.findMany({
        where: {
          enabled: true,
          scheduleEnabled: true,
        },
        select: {
          shop: true,
          scheduleTime: true,
          timezone: true,
          fromEmail: true,
          fromName: true,
          additionalEmails: true,
          accessToken: true,
        },
      });

      return shops.map(shop => ({
        ...shop,
        additionalEmails: shop.additionalEmails || []
      }));
    } catch (error) {
      console.error('Error retrieving shops with scheduled reports:', error);
      throw new Error('Failed to retrieve shops with scheduled reports');
    }
  },

  async getShopsDueForReportsInAllTimezones(currentUTCTime: string) {
    try {
      console.log(`🔍 Checking all timezones for UTC time: ${currentUTCTime}`);
      
      const allShops = await prisma.storeEmailSettings.findMany({
        where: {
          enabled: true,
          scheduleEnabled: true,
        },
        select: {
          shop: true,
          scheduleTime: true,
          timezone: true,
          fromEmail: true,
          fromName: true,
          additionalEmails: true,
          accessToken: true,
        },
      });

      const dueShops = [];
      
      for (const shop of allShops) {
        try {
          const shopLocalTime = convertUTCToTimezone(currentUTCTime, shop.timezone);
          
          console.log(`🔍 Shop ${shop.shop}: UTC ${currentUTCTime} -> ${shop.timezone} ${shopLocalTime}, Scheduled: ${shop.scheduleTime}`);
          
          if (shop.scheduleTime === shopLocalTime) {
            console.log(`🎯 Shop ${shop.shop} is due!`);
            dueShops.push({
              ...shop,
              additionalEmails: shop.additionalEmails || []
            });
          }
        } catch (error) {
          console.error(`❌ Error processing timezone for shop ${shop.shop}:`, error);
        }
      }

      console.log(`📊 Found ${dueShops.length} shops due across all timezones`);
      return dueShops;
      
    } catch (error) {
      console.error('Error retrieving shops due for reports:', error);
      throw new Error('Failed to retrieve shops due for reports');
    }
  },

  async updateAccessToken(shop: string, accessToken: string) {
    try {
      return await prisma.storeEmailSettings.update({
        where: { shop },
        data: { accessToken },
      });
    } catch (error) {
      console.error('Error updating access token:', error);
      throw new Error('Failed to update access token');
    }
  },
};