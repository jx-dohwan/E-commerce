import { IsString, IsNotEmpty, IsOptional, IsBoolean, MaxLength } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateCategoryDto } from './create-category.dto';
import { Category } from '../entities/category.entity';

export class UpdateCategoryDto {
        @IsString()
        @IsOptional()
        @MaxLength(100)
        name?: string;
    
        @IsOptional()
        @IsString()
        description?: string;

        toEntity(): Partial<Category> {
            const entity: Partial<Category> = {};

            if (this.name !== undefined) entity.name = this.name;
            if (this.description !== undefined) entity.description = this.description

            return entity;
        }
    
}
