import { ServiceProviderCategoryController } from "@/controllers/spcategory.controller";
import { CreateServiceProviderCategoryDto } from "@/dtos/spcategory.dto";
import { Routes } from "@/interfaces/routes.interface";
import { ValidationMiddleware } from "@/middlewares/validation.middleware";
import { Router } from "express";

export class ServiceProviderCategoryRoute implements Routes {
    public path = '/category';
    public router = Router();
    public controller = new ServiceProviderCategoryController();

    constructor() {
        this.initializeRoutes();
    }


    private initializeRoutes() {
        this.router.get(`${this.path}/`, this.controller.getAllCategories.bind(this.controller));
        this.router.get(`${this.path}/home`, this.controller.getCategoriesByHome.bind(this.controller));
        this.router.post(`${this.path}/`, ValidationMiddleware(CreateServiceProviderCategoryDto), this.controller.createCategory.bind(this.controller));
        this.router.put(`${this.path}/:id`, this.controller.updateCategory.bind(this.controller));
        this.router.delete(`${this.path}/:id`, this.controller.deleteCategory.bind(this.controller));
    }
}

