import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { Product } from '../entities/product.entity';

export class UpdateProductDto {
    @IsOptional()
    @IsString()
    @MaxLength(200)
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    price?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    stock?: number;


    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    toEntity(): Partial<Product> {
        const entity: Partial<Product> = {};

        if (this.name !== undefined) entity.name = this.name;
        if (this.description !== undefined) entity.description = this.description;
        if (this.price !== undefined) entity.price = this.price;
        if (this.stock !== undefined) entity.stock = this.stock;
        if (this.isActive !== undefined) entity.isActive = this.isActive;

        return entity;

    }
}
