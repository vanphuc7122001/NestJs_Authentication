/*
  Warnings:

  - You are about to drop the column `exp` on the `refreshTokens` table. All the data in the column will be lost.
  - You are about to drop the column `iat` on the `refreshTokens` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "refreshTokens" DROP COLUMN "exp",
DROP COLUMN "iat";
