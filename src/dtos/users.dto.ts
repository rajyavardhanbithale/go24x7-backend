import { IsString, IsNotEmpty, MinLength, MaxLength, IsPhoneNumber, IsNumber, IsOptional, IsUrl, IsEmail, IsArray, ValidateNested, IsEnum, IsBoolean, IsDateString, isNotEmpty, isEmail, minLength, isEnum } from 'class-validator';
import { Role } from '@/prisma/prisma/client';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(64)
  public firstname: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(64)
  public lastname: string;

  @IsEmail()
  @IsNotEmpty()
  public email: string;
  
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(10)
  public phone_number: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  public password: string;

  @IsEnum(Role)
  @IsOptional()
  public role: Role;


}
export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;
  
  
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  public password: string;
  
}

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(32)
  public password: string;
}

export class SendOtpDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(10)
  @IsPhoneNumber("IN")
  public phone_number: string;
}

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(10)
  @IsPhoneNumber("IN")
  public phone_number: string;

  @IsNotEmpty()
  @IsNumber()
  public otp: number;
}

