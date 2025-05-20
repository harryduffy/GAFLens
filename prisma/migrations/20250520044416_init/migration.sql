/*
  Warnings:

  - You are about to drop the column `AUM` on the `Manager` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `Manager` table. All the data in the column will be lost.
  - You are about to drop the column `region` on the `Manager` table. All the data in the column will be lost.
  - You are about to drop the column `managerAUM` on the `ManagerMeetingDetail` table. All the data in the column will be lost.
  - Added the required column `currency` to the `Fund` table without a default value. This is not possible if the table is not empty.
  - Added the required column `region` to the `Fund` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Fund" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "strategy" TEXT NOT NULL,
    "assetClass" TEXT NOT NULL,
    "targetNetReturn" INTEGER NOT NULL,
    "geographicFocus" TEXT NOT NULL,
    "size" BIGINT NOT NULL,
    "currency" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "managerId" INTEGER NOT NULL,
    CONSTRAINT "Fund_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Manager" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Fund" ("assetClass", "geographicFocus", "id", "managerId", "name", "size", "strategy", "targetNetReturn") SELECT "assetClass", "geographicFocus", "id", "managerId", "name", "size", "strategy", "targetNetReturn" FROM "Fund";
DROP TABLE "Fund";
ALTER TABLE "new_Fund" RENAME TO "Fund";
CREATE TABLE "new_Manager" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "managerName" TEXT NOT NULL
);
INSERT INTO "new_Manager" ("id", "managerName") SELECT "id", "managerName" FROM "Manager";
DROP TABLE "Manager";
ALTER TABLE "new_Manager" RENAME TO "Manager";
CREATE TABLE "new_ManagerMeetingDetail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "managerName" TEXT NOT NULL,
    "managerCountry" TEXT NOT NULL,
    "meetingDate" DATETIME NOT NULL,
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
INSERT INTO "new_ManagerMeetingDetail" ("assetClasses", "externalAttendees", "fundGeographicFocus", "fundName", "fundSize", "fundTargetNetReturn", "gafAttendees", "id", "investmentStrategies", "managerCountry", "managerName", "meetingDate", "notes") SELECT "assetClasses", "externalAttendees", "fundGeographicFocus", "fundName", "fundSize", "fundTargetNetReturn", "gafAttendees", "id", "investmentStrategies", "managerCountry", "managerName", "meetingDate", "notes" FROM "ManagerMeetingDetail";
DROP TABLE "ManagerMeetingDetail";
ALTER TABLE "new_ManagerMeetingDetail" RENAME TO "ManagerMeetingDetail";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
