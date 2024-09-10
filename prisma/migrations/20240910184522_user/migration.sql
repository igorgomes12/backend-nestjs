/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name_user" TEXT NOT NULL,
    "email_login_user" TEXT NOT NULL,
    "password_user" TEXT NOT NULL,
    "channel_user" INTEGER NOT NULL,
    "profile_user" INTEGER NOT NULL,
    "status_user" TEXT NOT NULL,
    "company_user" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_name_user_key" ON "users"("name_user");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_login_user_key" ON "users"("email_login_user");
