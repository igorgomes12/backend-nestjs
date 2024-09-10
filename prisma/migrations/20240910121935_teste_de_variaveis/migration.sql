/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email_login_user]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `channel_user` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_user` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email_login_user` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_user` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password_user` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_user` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status_user` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
DROP COLUMN "name",
ADD COLUMN     "channel_user" INTEGER NOT NULL,
ADD COLUMN     "company_user" TEXT NOT NULL,
ADD COLUMN     "email_login_user" TEXT NOT NULL,
ADD COLUMN     "name_user" TEXT NOT NULL,
ADD COLUMN     "password_user" TEXT NOT NULL,
ADD COLUMN     "profile_user" INTEGER NOT NULL,
ADD COLUMN     "status_user" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_login_user_key" ON "User"("email_login_user");
