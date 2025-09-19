/*
  Warnings:

  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Category` table. All the data in the column will be lost.
  - The primary key for the `Internship` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `categoryId` on the `Internship` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Internship` table. All the data in the column will be lost.
  - The primary key for the `Request` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `internshipId` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Request` table. All the data in the column will be lost.
  - The primary key for the `Tag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Tag` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - The primary key for the `_InternshipToTag` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- DropForeignKey
ALTER TABLE "Internship" DROP CONSTRAINT "Internship_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_internshipId_fkey";

-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_userId_fkey";

-- DropForeignKey
ALTER TABLE "_InternshipToTag" DROP CONSTRAINT "_InternshipToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_InternshipToTag" DROP CONSTRAINT "_InternshipToTag_B_fkey";

-- AlterTable
ALTER TABLE "Category" DROP CONSTRAINT "Category_pkey",
DROP COLUMN "id",
ADD COLUMN     "uuid" TEXT NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("uuid");

-- AlterTable
ALTER TABLE "Internship" DROP CONSTRAINT "Internship_pkey",
DROP COLUMN "categoryId",
DROP COLUMN "id",
ADD COLUMN     "categoryUuid" TEXT NOT NULL,
ADD COLUMN     "uuid" TEXT NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "Internship_pkey" PRIMARY KEY ("uuid");

-- AlterTable
ALTER TABLE "Request" DROP CONSTRAINT "Request_pkey",
DROP COLUMN "id",
DROP COLUMN "internshipId",
DROP COLUMN "userId",
ADD COLUMN     "internshipUuid" TEXT NOT NULL,
ADD COLUMN     "userUuid" TEXT NOT NULL,
ADD COLUMN     "uuid" TEXT NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "Request_pkey" PRIMARY KEY ("uuid");

-- AlterTable
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_pkey",
DROP COLUMN "id",
ADD COLUMN     "uuid" TEXT NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "Tag_pkey" PRIMARY KEY ("uuid");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "uuid" TEXT NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("uuid");

-- AlterTable
ALTER TABLE "_InternshipToTag" DROP CONSTRAINT "_InternshipToTag_AB_pkey",
ALTER COLUMN "A" SET DATA TYPE TEXT,
ALTER COLUMN "B" SET DATA TYPE TEXT,
ADD CONSTRAINT "_InternshipToTag_AB_pkey" PRIMARY KEY ("A", "B");

-- AddForeignKey
ALTER TABLE "Internship" ADD CONSTRAINT "Internship_categoryUuid_fkey" FOREIGN KEY ("categoryUuid") REFERENCES "Category"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_internshipUuid_fkey" FOREIGN KEY ("internshipUuid") REFERENCES "Internship"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InternshipToTag" ADD CONSTRAINT "_InternshipToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Internship"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InternshipToTag" ADD CONSTRAINT "_InternshipToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;