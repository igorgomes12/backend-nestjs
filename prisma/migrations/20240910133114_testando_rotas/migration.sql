/*
  Warnings:

  - A unique constraint covering the columns `[name_user]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_name_user_key" ON "User"("name_user");
