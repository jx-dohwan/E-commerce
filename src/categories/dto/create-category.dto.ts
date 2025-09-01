import { IsString, IsNotEmpty, IsOptional, IsBoolean, MaxLength } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Category } from '../entities/category.entity';

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    toEntity(): Category {
        return plainToInstance(Category, {
            name: this.name,
            description: this.description ?? null,
        })
    }
}
