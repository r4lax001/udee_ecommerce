/*
  Warnings:

  - The values [CONFIRMED,CANCELLED] on the enum `Order_status` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `shippingAddress` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Order` ADD COLUMN `shippingAddress` VARCHAR(191) NOT NULL,
    MODIFY `status` ENUM('PENDING', 'WAITING_FOR_PAYMENT', 'PAID', 'SHIPPED', 'DELIVERED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `User` ADD COLUMN `phone` VARCHAR(191) NOT NULL,
    MODIFY `role` ENUM('CUSTOMER', 'MANAGER', 'ADMIN') NOT NULL DEFAULT 'CUSTOMER';

-- CreateTable
CREATE TABLE `Address` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `houseNo` VARCHAR(191) NOT NULL,
    `soi` VARCHAR(191) NULL,
    `road` VARCHAR(191) NULL,
    `subDistrict` VARCHAR(191) NOT NULL,
    `district` VARCHAR(191) NOT NULL,
    `province` VARCHAR(191) NOT NULL,
    `postalCode` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
