/*
  Warnings:

  - You are about to drop the column `channel_user` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `company_user` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `email_login_user` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `name_user` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `password_user` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `profile_user` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `status_user` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `logins` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email_login]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `channel` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email_login` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_email_login_user_key";

-- DropIndex
DROP INDEX "users_name_user_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "channel_user",
DROP COLUMN "company_user",
DROP COLUMN "email_login_user",
DROP COLUMN "name_user",
DROP COLUMN "password_user",
DROP COLUMN "profile_user",
DROP COLUMN "status_user",
ADD COLUMN     "channel" INTEGER NOT NULL,
ADD COLUMN     "company" TEXT NOT NULL,
ADD COLUMN     "email_login" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "profile" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL;

-- DropTable
DROP TABLE "logins";

-- CreateIndex
CREATE UNIQUE INDEX "users_name_key" ON "users"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_login_key" ON "users"("email_login");
