-- Das bisherige SavedSearch-Modell (Merkliste) wird zum vollwertigen
-- Suchprofil ausgebaut. Es war bis hierher unbenutzt; eventuelle Altzeilen
-- lassen sich nicht sinnvoll auf die neue Struktur abbilden und werden
-- entfernt, damit die NOT-NULL-Spalten angelegt werden koennen.
DELETE FROM "SavedSearch";

-- AlterEnum
ALTER TYPE "LeadSource" ADD VALUE 'SUCHPROFIL';

-- AlterTable
ALTER TABLE "SavedSearch" ADD COLUMN     "agentId" TEXT,
ADD COLUMN     "areaMin" DOUBLE PRECISION,
ADD COLUMN     "financing" TEXT,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "internalNote" TEXT,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "marketingType" "MarketingType" NOT NULL DEFAULT 'KAUF',
ADD COLUMN     "message" TEXT,
ADD COLUMN     "notifyByEmail" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "ownUse" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "plotAreaMin" DOUBLE PRECISION,
ADD COLUMN     "priceMax" DECIMAL(12,2),
ADD COLUMN     "priceMin" DECIMAL(12,2),
ADD COLUMN     "privacyAccepted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "propertyTypes" "PropertyType"[] DEFAULT ARRAY[]::"PropertyType"[],
ADD COLUMN     "radiusKm" INTEGER,
ADD COLUMN     "regions" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "roomsMin" DOUBLE PRECISION,
ADD COLUMN     "status" "RequestStatus" NOT NULL DEFAULT 'NEU',
ADD COLUMN     "timeframe" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "zipCode" TEXT;

-- CreateTable
CREATE TABLE "OpeningHour" (
    "id" TEXT NOT NULL,
    "days" TEXT NOT NULL,
    "hours" TEXT NOT NULL,
    "closed" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OpeningHour_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OpeningHour_sortOrder_idx" ON "OpeningHour"("sortOrder");

-- CreateIndex
CREATE INDEX "SavedSearch_status_createdAt_idx" ON "SavedSearch"("status", "createdAt");

-- AddForeignKey
ALTER TABLE "SavedSearch" ADD CONSTRAINT "SavedSearch_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

