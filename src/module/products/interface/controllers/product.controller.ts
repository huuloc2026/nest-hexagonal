import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';

import { PaginationDto } from 'src/shared/interface/PaginatedResult';
import {
  CreateProductDto,
  UpdateProductDto,
} from 'src/module/products/application/dtos';
import { ProductService } from 'src/module/products/application/services/product.service';
import { GetUser, IsPublic } from 'src/module/auth/interface/decorators';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAll(
    @GetUser('sub') email: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.productService.findAll(paginationDto);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.productService.findById(id);
  }

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.productService.delete(id);
  }

  @IsPublic()
  @Get('public')
  publicEndpoint() {
    // ...
  }
}
