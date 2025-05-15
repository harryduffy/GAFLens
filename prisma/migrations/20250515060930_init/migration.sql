-- CreateTable
CREATE TABLE "ManagerMeeting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "managerName" TEXT NOT NULL,
    "meetingDate" DATETIME NOT NULL,
    "gafAttendees" TEXT NOT NULL,
    "externalAttendees" TEXT NOT NULL
);
