import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';
import { plainToInstance, Type } from 'class-transformer';
import { Product } from '../../entities/product/product.entity';
import { IsNullable } from 'src/core/decorator/isNullable.decorator';

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
