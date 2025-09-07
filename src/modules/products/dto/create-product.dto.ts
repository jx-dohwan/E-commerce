import { IsString, IsNotEmpty, IsOptional, IsBoolean, MaxLength, IsNumber, IsPositive, IsInt, Min, IsUUID } from 'class-validator';
import { plainToInstance, Transform, Type } from 'class-transformer';
import { IsNullable } from 'src/core/decorator/isNullable.decorator';
import { Product } from 'src/entities/product/product.entity';

export class CreateProductDto {
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

    toEntity(): Product {
        return plainToInstance(Product, this);
    }
}
