import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesRepository } from './categories.repository';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category[]> {
    return await this.categoriesRepository.create(createCategoryDto.toEntity());
  }

  async findAll(): Promise<Category[]> {
    return await this.categoriesRepository.findAll();
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findOne(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category | null> {
    const category = await this.findOne(id);
    return await this.categoriesRepository.update(id, updateCategoryDto.toEntity());
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.categoriesRepository.remove(id);
  }
}
