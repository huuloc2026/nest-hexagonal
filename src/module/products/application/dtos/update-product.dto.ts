import { PartialType } from '@nestjs/mapped-types';
import { Category, ProductVariant, Review } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import {
  IsString,
  IsNumber,
  IsPositive,
  IsOptional,
  IsEnum,
  IsArray,
  IsDate,
} from 'class-validator';
import { CreateProductDto } from 'src/module/products/application/dtos/create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
