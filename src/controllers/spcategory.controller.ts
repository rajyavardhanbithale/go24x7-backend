import { Request, Response } from "express";
import { ServiceProviderCategory } from "@/prisma/prisma/client";
import { ServiceProviderCategoryService } from "@/services/spcategory.service";
import { NextFunction } from "express";
import Container from "typedi";
import { ServiceProviderCategory as ServiceProviderCategoryInterface } from "@/interfaces/spcategory";


export class ServiceProviderCategoryController {

    public spService = Container.get(ServiceProviderCategoryService);

    public async getAllCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const categories = await this.spService.findAll();
            res.status(200).json(categories);
        } catch (error) {
            next(error);
        }
    }

    public async getCategoriesByHome(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const categories = await this.spService.findbyHome();
            res.status(200).json(categories);
        } catch (error) {
            next(error);
        }
    }

    public async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const categoryData = req.body;
            const createdCategory = await this.spService.create(categoryData);
            res.status(201).json({ message: "Category created successfully", data: createdCategory });
        } catch (error) {
            next(error);
        }
    }

    public async updateCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const categoryId = req.params.id;
            const categoryData = req.body;
            await this.spService.update(categoryId as string, categoryData);
            res.status(200).json({ message: "Category updated successfully" });
        } catch (error) {
            next(error);
        }
    }

    public async deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const categoryId = req.params.id;
            await this.spService.delete(categoryId as string);
            res.status(200).json({ message: "Category deleted successfully" });
        } catch (error) {
            next(error);
        }
    }

}