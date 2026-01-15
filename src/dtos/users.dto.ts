import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, MinLength, MaxLength, IsPhoneNumber, IsNumber, IsOptional, IsUrl, IsEmail, IsArray, ValidateNested, IsEnum, IsBoolean, IsDateString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(10)
  public phone_number: string;


}
export class LoginUserDto {

  
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(10)
  public phone_number: string;


  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(6)
  public otp: string;
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

