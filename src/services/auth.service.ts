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

  public async login(userData: LoginUserDto): Promise<{ cookie: string; user: UserResponse }> {
    // Check if user exists
    let user = await this.users.findUnique({ where: { email: userData.email } });

    // If not, create a new user (auto-signup)
    if (!user) {
      throw new HttpException(404, 'User does not exist. Please sign up first.');
    }

    // if not verified
    if (!user.is_verified) {
      throw new HttpException(403, 'User is not verified. Please verify your account.');
    }

    // Check if password matches
    const isPasswordMatching: boolean = await compare(userData.password, user.password);
    if (!isPasswordMatching) {
      throw new HttpException(401, 'Incorrect password');
    }

    // Create token and cookie
    const tokenData = this.createToken(user);
    const cookie = this.createCookie(tokenData);

    // Prepare user response without password
    const { password, ...userWithoutPassword } = { ...user, access_token: tokenData.token };

    return { cookie, user: userWithoutPassword };
  }

  public async signup(userData: CreateUserDto): Promise<{success: boolean; message: string}> {
    // Check if user already exists
    const findUser = await this.users.findFirst({
      where: {
        OR: [
          { email: userData.email },
          { phone_number: userData.phone_number },
        ],
      },
    });
    if (findUser) throw new HttpException(409, `User with email ${userData.email} already exists`);

    // Hash password
    userData.password = await hash(userData.password, 10);

    const createUserData = await this.users.create({
      data: userData,
    });

    return {
      success: true,
      message: 'User created successfully. Please verify your account to login.',
    };
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
