import { Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, IsUUID, Min } from 'class-validator';

export class AddCartItemDto {
  @IsNotEmpty()
  @IsUUID()
  @Expose()
  productId: string;

  @Expose()
  @IsNotEmpty()
  quantity: number;
}
