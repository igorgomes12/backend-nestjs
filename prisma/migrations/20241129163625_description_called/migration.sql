-- CreateTable
CREATE TABLE "DescriptionCalled" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "DescriptionCalled_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DescriptionCalled_description_key" ON "DescriptionCalled"("description");
