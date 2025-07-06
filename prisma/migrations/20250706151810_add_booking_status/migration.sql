-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('ACTIVE', 'CANCELLED');

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "status" "BookingStatus" NOT NULL DEFAULT 'ACTIVE';
