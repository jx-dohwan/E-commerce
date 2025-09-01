import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsRepository } from './product.repository';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async create(createProductDto: CreateProductDto): Promise<Product[]> {
    return await this.productsRepository.create(createProductDto.toEntity());
  }

  async findAll():Promise<Product[]> {
    return await this.productsRepository.findAll();
  }

  async findOne(id: number): Promise<Product | null> {
    const product = await this.productsRepository.findOne(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product | null> {
    const product = await this.findOne(id);
    return await this.productsRepository.update(id, updateProductDto.toEntity());
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.productsRepository.remove(id);
  }
}
