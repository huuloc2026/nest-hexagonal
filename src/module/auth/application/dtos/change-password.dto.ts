import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @Expose()
  @MinLength(6)
  oldPassword: string;

  @IsString()
  @MinLength(6)
  @Expose()
  @IsNotEmpty()
  newPassword: string;
}
