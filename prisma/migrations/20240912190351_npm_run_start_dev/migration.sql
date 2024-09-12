-- CreateTable
CREATE TABLE "logins" (
    "id" SERIAL NOT NULL,
    "email_login" TEXT NOT NULL,
    "password_login" TEXT NOT NULL,

    CONSTRAINT "logins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "logins_email_login_key" ON "logins"("email_login");
