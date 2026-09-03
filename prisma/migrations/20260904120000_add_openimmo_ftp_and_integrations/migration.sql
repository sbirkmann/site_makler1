-- AlterTable
ALTER TABLE "Property" ADD COLUMN "externalId" TEXT,
ADD COLUMN "importSource" TEXT;

-- CreateTable
CREATE TABLE "FtpAccount" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "homeDir" TEXT NOT NULL DEFAULT '/imports',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "FtpAccount_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OpenImmoImport" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "checksum" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PROCESSED',
    "propertyCount" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OpenImmoImport_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "LeadPushProvider" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "endpoint" TEXT,
    "apiKey" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "LeadPushProvider_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "BlogApiSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "allowUnauthenticated" BOOLEAN NOT NULL DEFAULT false,
    "apiKey" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "BlogApiSettings_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "FtpAccount_username_key" ON "FtpAccount"("username");
CREATE UNIQUE INDEX "OpenImmoImport_checksum_key" ON "OpenImmoImport"("checksum");
CREATE UNIQUE INDEX "LeadPushProvider_provider_key" ON "LeadPushProvider"("provider");
CREATE UNIQUE INDEX "Property_importSource_externalId_key" ON "Property"("importSource", "externalId");
