import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from '../../application/services/product.service';
import { CreateProductDto } from '../../application/dtos/create-product.dto';
import { UpdateProductDto } from '../../application/dtos/update-product.dto';
import { AtGuard } from 'src/auth/interface/guards/at.guard';
import { IsPublic } from 'src/auth/interface/decorators/is-public.decorator';
import { GetUser } from 'src/auth/interface/decorators/get-user.decorator';

@UseGuards(AtGuard)
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAll(@GetUser('email') userId: string) {
    console.log(userId);
    return this.productService.findAll();
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
