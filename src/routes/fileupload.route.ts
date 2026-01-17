import { FileUploadController } from "@/controllers/fileupload.controller";
import { FileUploadDto } from "@/dtos/fileupload.dto";
import { Routes } from "@/interfaces/routes.interface";
import { ValidationMiddleware } from "@/middlewares/validation.middleware";
import { Router } from "express";

export class FileUploadRoute implements Routes {
    public path = '/file-upload';
    public router = Router();
    public fuc = new FileUploadController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/:id` ,this.fuc.uploadFile);
    }

} 