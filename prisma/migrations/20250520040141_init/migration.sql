/*
  Warnings:

  - You are about to drop the `ManagerMeeting` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ManagerMeeting";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Manager" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "managerName" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "AUM" BIGINT NOT NULL
);

-- CreateTable
CREATE TABLE "Fund" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "managerId" INTEGER NOT NULL,
    "strategy" TEXT NOT NULL,
    "assetClass" TEXT NOT NULL,
    "targetNetReturn" INTEGER NOT NULL,
    "geographicFocus" TEXT NOT NULL,
    "size" BIGINT NOT NULL,
    CONSTRAINT "Fund_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Manager" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ManagerMeetingDetail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "managerName" TEXT NOT NULL,
    "managerCountry" TEXT NOT NULL,
    "meetingDate" DATETIME NOT NULL,
    "managerAUM" BIGINT NOT NULL,
    "fundName" TEXT NOT NULL,
    "fundSize" BIGINT NOT NULL,
    "assetClasses" TEXT NOT NULL,
    "investmentStrategies" TEXT NOT NULL,
    "fundGeographicFocus" TEXT NOT NULL,
    "fundTargetNetReturn" INTEGER NOT NULL,
    "gafAttendees" TEXT NOT NULL,
    "externalAttendees" TEXT NOT NULL,
    "notes" TEXT NOT NULL
);
