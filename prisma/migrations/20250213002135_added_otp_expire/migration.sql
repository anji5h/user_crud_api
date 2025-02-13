/*
  Warnings:

  - A unique constraint covering the columns `[userId,device]` on the table `Session` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `otpExpireAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX `Session_userId_device_key` ON `Session`(`userId`, `device`);
