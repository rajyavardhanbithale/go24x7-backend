import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Service } from 'typedi';
import { SECRET_KEY } from '@config';
import { CreateUserDto, LoginUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User, UserResponse } from '@interfaces/users.interface';
import { access } from 'fs';
import { prisma } from '@/lib/prisma';

@Service()
export class AuthService {
  public users = prisma.user;
  public otpService = prisma.otp;

  public async loginOrSignup(userData: LoginUserDto): Promise<{ cookie: string; user: UserResponse }> {
    // Check if user exists
    let user = await this.users.findUnique({ where: { phone_number: userData.phone_number } });

    // If not, create a new user (auto-signup)
    if (!user) {
      user = await this.users.create({ data: { phone_number: userData.phone_number, is_verified: false, is_active: true } });
    }

    const otpRecord = await this.otpService.findFirst({
      where: {
        phone_number: userData.phone_number,
        otp: userData.otp,
        expiresAt: { gt: new Date() },
      },
    });

    if (!otpRecord) throw new HttpException(400, 'Invalid or expired OTP');


    await this.otpService.deleteMany({ where: { phone_number: userData.phone_number } });


    if (!user.is_verified) {
      user = await this.users.update({
        where: { id: user.id },
        data: { is_verified: true },

      });
    }

    console.log("User logged in:", user);

    const tokenData = this.createToken(user);
    const cookie = this.createCookie(tokenData);

    const response: UserResponse = {
      id: user.id,
      phone_number: user.phone_number,
      is_active: user.is_active,
      is_verified: user.is_verified,
      access_token: tokenData.token,
    };

    return { cookie, user: response };
  }


  /* LOGOUT */
  public async logout(userData: User): Promise<User> {
    const findUser: User = await this.users.findFirst({ where: { phone_number: userData.phone_number } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  /* REFRESH TOKEN  */
  public async refreshToken(userId: string): Promise<{ cookie: string; accessToken: string }> {
    const findUser: User = await this.users.findUnique({ where: { id: String(userId) } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const tokenData = this.createToken(findUser);
    const cookie = this.createCookie(tokenData);

    return { cookie, accessToken: tokenData.token };
  }


  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = {
      id: user.id,
      phone_number: user.phone_number,
      role: user.role,
    };
    const secretKey: string = SECRET_KEY;
    const expiresIn: number = 60 * 60;

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}
