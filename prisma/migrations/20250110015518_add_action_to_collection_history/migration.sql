/*
  Warnings:

  - Added the required column `action` to the `CollectionHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CollectionHistory" ADD COLUMN     "action" TEXT NOT NULL;
