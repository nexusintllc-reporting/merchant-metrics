// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export interface CreateStoreEmailSettingsInput {
//   shop: string;
//   fromEmail?: string;
//   fromName?: string;
//   enabled?: boolean;
//   additionalEmails?: string[]; // NEW: Multiple email addresses
//   scheduleEnabled?: boolean;
//   scheduleTime?: string;
//   timezone?: string;
// }

// export interface UpdateStoreEmailSettingsInput {
//   fromEmail?: string;
//   fromName?: string;
//   enabled?: boolean;
//   additionalEmails?: string[]; // NEW: Multiple email addresses
//   scheduleEnabled?: boolean;
//   scheduleTime?: string;
//   timezone?: string;
//   sendGridApiKey?: string;
// }

// export const StoreEmailSettings = {
//   async get(shop: string) {
//     try {
//       const settings = await prisma.storeEmailSettings.findUnique({
//         where: { shop },
//       });
      
//       // Ensure additionalEmails is always an array, even if null/undefined
//       if (settings) {
//         return {
//           ...settings,
//           additionalEmails: settings.additionalEmails || [] // Default to empty array
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
//           additionalEmails: input.additionalEmails || [], // NEW: Handle additional emails
//           scheduleEnabled: input.scheduleEnabled ?? false,
//           scheduleTime: input.scheduleTime || "09:00",
//           timezone: input.timezone || "UTC",
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
//           additionalEmails: input.additionalEmails || [], // NEW: Handle additional emails
//           scheduleEnabled: input.scheduleEnabled,
//           scheduleTime: input.scheduleTime,
//           timezone: input.timezone,
//           sendGridApiKey: input.sendGridApiKey,
//         },
//         create: {
//           shop,
//           fromEmail: input.fromEmail || "info@nexusbling.com",
//           fromName: input.fromName || "Store",
//           enabled: input.enabled ?? true,
//           additionalEmails: input.additionalEmails || [], // NEW: Handle additional emails
//           scheduleEnabled: input.scheduleEnabled ?? false,
//           scheduleTime: input.scheduleTime || "09:00",
//           timezone: input.timezone || "UTC",
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
//           additionalEmails: true, // NEW: Include additional emails
//         },
//       });

//       // Ensure additionalEmails is always an array for each shop
//       return shops.map(shop => ({
//         ...shop,
//         additionalEmails: shop.additionalEmails || []
//       }));
//     } catch (error) {
//       console.error('Error retrieving shops with scheduled reports:', error);
//       throw new Error('Failed to retrieve shops with scheduled reports');
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
  accessToken?: string; // RECOMMENDED: Add for session management
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
  accessToken?: string; // RECOMMENDED: Add for session management
}

export const StoreEmailSettings = {
  async get(shop: string) {
    try {
      const settings = await prisma.storeEmailSettings.findUnique({
        where: { shop },
      });
      
      // Ensure additionalEmails is always an array, even if null/undefined
      if (settings) {
        return {
          ...settings,
          additionalEmails: settings.additionalEmails || [] // Default to empty array
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
          accessToken: input.accessToken || null, // RECOMMENDED: Store access token
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
          accessToken: input.accessToken, // CRITICAL: Include access token
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
          accessToken: input.accessToken || null, // CRITICAL: Include access token
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
          accessToken: true, // CRITICAL: Include access token for cron jobs
        },
      });

      // Ensure additionalEmails is always an array for each shop
      return shops.map(shop => ({
        ...shop,
        additionalEmails: shop.additionalEmails || []
      }));
    } catch (error) {
      console.error('Error retrieving shops with scheduled reports:', error);
      throw new Error('Failed to retrieve shops with scheduled reports');
    }
  },

  // RECOMMENDED: New method to update access token separately
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

  // RECOMMENDED: New method to get shops that need reports right now
  async getShopsDueForReports(currentTime: string = new Date().toTimeString().slice(0, 5)) {
    try {
      const shops = await prisma.storeEmailSettings.findMany({
        where: {
          enabled: true,
          scheduleEnabled: true,
          scheduleTime: currentTime, // Match shops where it's time to send
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
      console.error('Error retrieving shops due for reports:', error);
      throw new Error('Failed to retrieve shops due for reports');
    }
  },
};