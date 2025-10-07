import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface CreateStoreEmailSettingsInput {
  shop: string;
  fromEmail?: string;
  fromName?: string;
  enabled?: boolean;
  scheduleEnabled?: boolean;
  scheduleTime?: string;
  timezone?: string;
}

export interface UpdateStoreEmailSettingsInput {
  fromEmail?: string;
  fromName?: string;
  enabled?: boolean;
  scheduleEnabled?: boolean;
  scheduleTime?: string;
  timezone?: string;
  sendGridApiKey?: string;
}

export const StoreEmailSettings = {
  async get(shop: string) {
    try {
      return await prisma.storeEmailSettings.findUnique({
        where: { shop },
      });
    } catch (error) {
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
          scheduleEnabled: input.scheduleEnabled ?? false,
          scheduleTime: input.scheduleTime || "09:00",
          timezone: input.timezone || "UTC",
        },
      });
    } catch (error) {
      throw new Error('Failed to create email settings');
    }
  },

  async update(shop: string, input: UpdateStoreEmailSettingsInput) {
    try {
      return await prisma.storeEmailSettings.upsert({
        where: { shop },
        update: input,
        create: {
          shop,
          fromEmail: input.fromEmail || "info@nexusbling.com",
          fromName: input.fromName || "Store",
          enabled: input.enabled ?? true,
          scheduleEnabled: input.scheduleEnabled ?? false,
          scheduleTime: input.scheduleTime || "09:00",
          timezone: input.timezone || "UTC",
        },
      });
    } catch (error) {
      throw new Error('Failed to update email settings');
    }
  },

  async isEnabled(shop: string) {
    try {
      const settings = await this.get(shop);
      return settings?.enabled ?? true;
    } catch (error) {
      return true;
    }
  },

  async getShopsWithScheduledReports() {
    try {
      return await prisma.storeEmailSettings.findMany({
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
        },
      });
    } catch (error) {
      throw new Error('Failed to retrieve shops with scheduled reports');
    }
  },
};