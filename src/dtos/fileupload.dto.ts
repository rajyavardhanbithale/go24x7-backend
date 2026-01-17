import { IsIn, IsMimeType, IsNotEmpty, IsString, isString } from 'class-validator';

export class FileUploadDto {
    @IsMimeType()
    @IsIn(['image/png', 'image/jpeg', 'application/pdf'])
    file: string;
    
    @IsString()
    @IsNotEmpty()
    ref_id: string;
}
