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

import { AtGuard } from 'src/auth/interface/guards/at.guard';
import { IsPublic } from 'src/auth/interface/decorators/is-public.decorator';
import { GetUser } from 'src/auth/interface/decorators/get-user.decorator';
import { PaginationDto } from 'src/shared/interface/PaginatedResult';
import { CartService } from '../application/services/cart.service';
import { AddCartItemDto } from 'src/module/carts/application/dtos/add-cart-item.dto';

@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  //   @Get()
  //   findAll(
  //     @GetUser('email') email: string,
  //     @Query() paginationDto: PaginationDto,
  //   ) {
  //     return this.cartService.findAll(paginationDto);
  //   }

  @Get()
  getCartOfUser(@GetUser('sub') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Post()
  create(@GetUser('sub') userId: string, @Body() itemDto: AddCartItemDto) {
    return this.cartService.addItem(userId, itemDto);
  }

  //   @Put(':id')
  //   update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
  //     return this.cartService.update(id, updateProductDto);
  //   }

  //   @Delete(':id')
  //   delete(@Param('id') id: string) {
  //     return this.cartService.delete(id);
  //   }

  //   @IsPublic()
  //   @Get('public')
  //   publicEndpoint() {
  //     // ...
  //   }
}
