import { Router } from 'express';
import { AuthController } from '@controllers/auth.controller';
import { CreateUserDto, LoginUserDto, SendOtpDto, VerifyOtpDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';

export class AuthRoute implements Routes {
  public path = '/auth/';
  public router = Router();
  public auth = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}login`, ValidationMiddleware(LoginUserDto), this.auth.logIn);
    
    this.router.post(`${this.path}logout`, AuthMiddleware, this.auth.logOut);
  
    this.router.post(`${this.path}refresh-token`, AuthMiddleware, this.auth.refreshToken);
    this.router.post(`${this.path}send-otp`, ValidationMiddleware(SendOtpDto) ,this.auth.sendOTP);
    this.router.post(`${this.path}verify-otp`, ValidationMiddleware(VerifyOtpDto), this.auth.verifyOTP);
  }
}
