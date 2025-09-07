import { IsString, IsNotEmpty, IsOptional, IsBoolean, MaxLength } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateCategoryDto } from './create-category.dto';
import { Category } from '../../entities/category/category.entity';
import { IsNullable } from 'src/core/decorator/isNullable.decorator';

export class UpdateCategoryDto {
    @IsString()
    @MaxLength(200)
    name: string

    @IsNullable()
    @IsString()
    description: string | null;

    toEntity(): Partial<Category> {
        return plainToInstance(Category, {
            name: this.name,
            description: this.description,
        })
    }

}
