-- AlterTable
ALTER TABLE "store_email_settings" ADD COLUMN     "additionalEmails" TEXT[],
ADD COLUMN     "lastSent" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "email_sent_log" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "scheduleTime" TEXT NOT NULL,
    "sentDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_sent_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "email_sent_log_shop_sentDate_idx" ON "email_sent_log"("shop", "sentDate");

-- CreateIndex
CREATE UNIQUE INDEX "email_sent_log_shop_scheduleTime_sentDate_key" ON "email_sent_log"("shop", "scheduleTime", "sentDate");
