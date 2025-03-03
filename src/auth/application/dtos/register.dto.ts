import { Expose } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @Expose()
  email: string;

  @IsString()
  @MinLength(6)
  @Expose()
  password: string;

  @IsString()
  @Expose()
  name: string;
}
