import { Category, ProductVariant, Review } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Expose } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsPositive,
  IsEnum,
  IsArray,
  IsOptional,
  IsDate,
  IsNotEmpty,
} from 'class-validator';
export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @Expose()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  description: string;

  @IsNumber()
  @IsPositive()
  @Expose()
  price: Decimal;

  @IsNumber()
  @IsPositive()
  @Expose()
  stock: number;

  @IsEnum(Category)
  @Expose()
  category: Category;

  @IsArray()
  @IsOptional()
  @Expose()
  variants?: ProductVariant[];

  @IsArray()
  @IsOptional()
  @Expose()
  reviews?: Review[];

  @IsDate()
  @IsOptional()
  @Expose()
  createdAt?: Date;

  @IsDate()
  @IsOptional()
  @Expose()
  updatedAt?: Date;
}
