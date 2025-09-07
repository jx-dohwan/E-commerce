import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';
import { IsNullable } from 'src/core/decorator/isNullable.decorator';
import { Product } from 'src/entities/product/product.entity';
import { plainToInstance } from 'class-transformer';

export class UpdateProductDto {
    @IsString()
    @MaxLength(200)
    name: string;

    @IsNullable()
    @IsString()
    description: string | null;

    @IsNumber()
    @Min(0)
    price: number;

    @IsNumber()
    @Min(0)
    stock: number;

    @IsUUID()
    categoryId: string;

    @IsBoolean()
    isActive: boolean;

    toEntity(): Partial<Product> {
        return plainToInstance(Product, this);
    }
 
}
