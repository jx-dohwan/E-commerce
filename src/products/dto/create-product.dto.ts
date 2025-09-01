import { IsString, IsNotEmpty, IsOptional, IsBoolean, MaxLength, IsNumber, IsPositive, IsInt, Min } from 'class-validator';
import { plainToInstance, Transform, Type } from 'class-transformer';
import { Product } from '../entities/product.entity';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    name: string;

    @IsOptional()
    @IsString()
    description?: string;


    @IsNotEmpty()
    @Type(() => Number) // 요처값을 number로 qusghks
    @IsNumber() // 숫자인지 검사
    @IsPositive() // 0보다 큰 양수인지 검사
    price: number;

    @IsNotEmpty()
    @Type(() => Number) // number로 변환
    @IsInt() // 정수인지 검사
    @Min(0) // 최소값 0이상
    stock: number;


    // 외래키인데 이것도 넣어야되나?
    @Type(() => Number) // number로 변환
    @IsInt() // 정수인지 검사
    @Min(1) // 최소값이 1이상
    categoryId: number;

    @IsOptional()
    @IsBoolean()
    @Transform(({value}) => (value === undefined ? true : value))
    isActive: boolean;

    toEntity(): Product {
        return plainToInstance(Product, {
            name: this.name,
            description: this.description ?? null,
            price: this.price,
            stock: this.stock,
            isActive: this.isActive ?? true,
            category: { id: this.categoryId } as any
        })
    }
}
