import { IsString, IsNotEmpty, IsOptional, IsBoolean, MaxLength } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { IsNullable } from 'src/core/decorator/isNullable.decorator';
import { Category } from 'src/entities/category/category.entity';

export class CreateCategoryDto {
    @IsString()
    @MaxLength(100)
    name: string;

    @IsNullable()
    @IsString()
    description: string | null;

    toEntity(): Category {
        return plainToInstance(Category, {
            name: this.name,
            description: this.description,
        })
    }

}
