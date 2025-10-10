/*
  Warnings:

  - You are about to drop the `Password` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Password";

-- CreateTable
CREATE TABLE "passwords" (
    "id" TEXT NOT NULL,
    "originalText" TEXT NOT NULL,
    "encryptedText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "passwords_pkey" PRIMARY KEY ("id")
);
