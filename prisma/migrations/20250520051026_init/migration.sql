/*
  Warnings:

  - You are about to drop the `ManagerMeetingDetail` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Fund" ADD COLUMN "tier" TEXT;
ALTER TABLE "Fund" ADD COLUMN "tierJustification" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ManagerMeetingDetail";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "FundMeetingDetail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "meetingDate" DATETIME NOT NULL,
    "fundSize" BIGINT NOT NULL,
    "gafAttendees" TEXT NOT NULL,
    "externalAttendees" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "fundId" INTEGER NOT NULL,
    CONSTRAINT "FundMeetingDetail_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "Fund" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
