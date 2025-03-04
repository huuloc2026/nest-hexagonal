import { Expose } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @Expose()
  email: string;

  @IsString()
  @MinLength(6)
  @Expose()
  password: string;
}
