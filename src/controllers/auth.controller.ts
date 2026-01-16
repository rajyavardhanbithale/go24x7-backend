import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User, UserLogin } from '@interfaces/users.interface';
import { AuthService } from '@services/auth.service';
import { OtpService } from '@/services/otp.service';
import { RequestWithOTP } from '@/interfaces/otp.interface';
import { LoginUserDto } from '@/dtos/users.dto';

export class AuthController {
  public auth = Container.get(AuthService);
  public otp = Container.get(OtpService)

  /* LOGIN */
  public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: LoginUserDto = req.body;
      const { cookie, user } = await this.auth.login(userData);


      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ data: user,  message: 'login' });
    } catch (error) {
      next(error);
    }
  };

  public signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData = req.body;
      const signupData = await this.auth.signup(userData);

      res.status(201).json({ data: signupData, message: 'signup' });
    } catch (error) {
      next(error);
    }
  }

  /* LOGOUT */
  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.user;
      const logOutUserData: User = await this.auth.logout(userData);

      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ data: logOutUserData, message: 'logout' });
    } catch (error) {
      next(error);
    }
  };

  /* SEND OTP */
  public sendOTP = async(req: RequestWithOTP, res: Response, next: NextFunction): Promise<void> => {
    try{
      const phone_number = req.body.phone_number
      console.log(phone_number)
      const sendOTPData = await this. otp.generateOtp(phone_number as string)

      res.status(200).json({data: sendOTPData, message: 'send otp'})
    }catch(error){
      next(error)
    }
  }

  /* Verify OTP */
  public verifyOTP = async(req: RequestWithOTP, res: Response, next: NextFunction): Promise<void> => {
    try{
      const phone_number = req.body.phone_number
      const otp = req.body.otp
      
      const verifyOTPData = await this.otp.verifyOtp(phone_number as string, otp as number)
      
      if(!verifyOTPData) {
        res.status(400).json({message: 'Invalid OTP'})
        return
      }
      
      res.status(200).json({data: verifyOTPData, message: 'verify otp'})
    }catch(error){
      next(error)
    }
  }

  /* REFRESH TOKEN */
  public refreshToken = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user.id;
      const { cookie, accessToken } = await this.auth.refreshToken(userId);

      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ data: { accessToken }, message: 'refresh token' });
    } catch (error) {
      next(error);
    }
  }
  
}
