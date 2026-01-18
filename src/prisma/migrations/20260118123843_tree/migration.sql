-- DropForeignKey
ALTER TABLE "ServiceProviderCategory" DROP CONSTRAINT "ServiceProviderCategory_parentId_fkey";

-- AddForeignKey
ALTER TABLE "ServiceProviderCategory" ADD CONSTRAINT "ServiceProviderCategory_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ServiceProviderCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
