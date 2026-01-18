import { CreateServiceProviderCategoryDto } from "@/dtos/spcategory.dto";
import { ServiceProviderCategoryCreate } from "@/interfaces/spcategory";
import { prisma } from "@/lib/prisma";
import { ServiceProviderCategory } from "@/prisma/prisma/client";
import { Service } from "typedi";


@Service()
export class ServiceProviderCategoryService {
    public sp = prisma.serviceProviderCategory;

    public async findAll(): Promise<ServiceProviderCategory[]> {
        try {
            return await this.sp.findMany();
        } catch (error) {
            throw error;
        }
    }

    public async findbyHome(): Promise<ServiceProviderCategory[]> {
        try {
            return await this.sp.findMany({
                where: {
                    isInHome: true,
                    isActive: true
                }
            });
        } catch (error) {
            throw error;
        }
    }

    public async create(data: ServiceProviderCategoryCreate): Promise<ServiceProviderCategory> {
        try {
            const category = await this.sp.create({ data });
            return category;
        } catch (error) {
            throw error;
        }
    }


    public async update(id: string, data: Partial<CreateServiceProviderCategoryDto>): Promise<void> {
        try {
            await this.sp.update({
                where: { id },
                data,
            });
        } catch (error) {
            throw error;
        }
    }

    public async delete(id: string): Promise<void> {
        try {
            const deleteCategoryRecursively = async (categoryId: string) => {
                const children = await prisma.serviceProviderCategory.findMany({
                    where: { parentId: categoryId },
                });

                for (const child of children) {
                    await deleteCategoryRecursively(child.id);
                }

                // Delete the current category
                await prisma.serviceProviderCategory.delete({
                    where: { id: categoryId },
                });
            };

            await deleteCategoryRecursively(id);

        } catch (error) {
            console.error(error);
        }
    }

}