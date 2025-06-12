-- CreateTable
CREATE TABLE `Manager` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `managerName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Fund` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `strategy` VARCHAR(191) NOT NULL,
    `assetClass` VARCHAR(191) NOT NULL,
    `targetNetReturn` DOUBLE NOT NULL,
    `geographicFocus` VARCHAR(191) NOT NULL,
    `size` BIGINT NOT NULL,
    `currency` VARCHAR(191) NOT NULL,
    `region` VARCHAR(191) NOT NULL,
    `firstClose` DATETIME(3) NOT NULL,
    `finalClose` DATETIME(3) NOT NULL,
    `investmentPeriod` DOUBLE NOT NULL,
    `fundTerm` DOUBLE NOT NULL,
    `targetNetMOIC` DOUBLE NOT NULL,
    `tier` VARCHAR(191) NULL,
    `tierJustification` TEXT NULL,
    `status` VARCHAR(191) NULL DEFAULT 'declined',
    `managerId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FundMeetingDetail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `meetingDate` DATETIME(3) NOT NULL,
    `fundSize` BIGINT NOT NULL,
    `gafAttendees` VARCHAR(191) NOT NULL,
    `externalAttendees` VARCHAR(191) NOT NULL,
    `notes` VARCHAR(191) NOT NULL,
    `fundId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `totpSecret` VARCHAR(191) NOT NULL,
    `mfaEnabled` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Fund` ADD CONSTRAINT `Fund_managerId_fkey` FOREIGN KEY (`managerId`) REFERENCES `Manager`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FundMeetingDetail` ADD CONSTRAINT `FundMeetingDetail_fundId_fkey` FOREIGN KEY (`fundId`) REFERENCES `Fund`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
