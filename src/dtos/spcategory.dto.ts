

import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";
import { UUID } from "crypto";


export class CreateServiceProviderCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  public name: string;

  @IsUUID()
  @IsOptional()
  public parentId?: UUID;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  public icon: string;

  @IsBoolean()
  @IsOptional()
  public isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  public isInHome?: boolean;
}