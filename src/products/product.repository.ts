import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThanOrEqual, Like, MoreThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class ProductsRepository extends BaseRepository<Product> {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepo: Repository<Product>,
  ) {
    super(productsRepo);
  }

  // 활성 상품 최신순
  async findActive(): Promise<Product[]> {
    return await this.productsRepo.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  // 카테고리별 상품 조회
  async findByCategory(categoryId: number): Promise<Product[]> {
    return await this.productsRepo.find({
      where: { categoryId, isActive: true },
    });
  }

  // 가격 범위 검색
  async findByPriceRange(
    minPrice?: number,
    maxPrice?: number,
  ): Promise<Product[]> {
    let priceCond: any = undefined;

    if (minPrice != null && maxPrice != null) {
      priceCond = Between(minPrice, maxPrice);
    } else if (minPrice != null) {
      priceCond = MoreThanOrEqual(minPrice);
    } else if (maxPrice != null) {
      priceCond = LessThanOrEqual(maxPrice);
    }

    return await this.repository.find({
      where: {
        ...(priceCond ? { price: priceCond } : {}),
        isActive: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  // 이름/설명 키워드 검색(대소문자 무시)
  async search(keyword: string): Promise<Product[]> {
    return await this.productsRepo.find({
        where: [
            {name: Like(`%${keyword}%`), isActive: true},
            {description: Like(`%${keyword}%`), isActive:true},
        ],
        order: {createdAt:'DESC'}
    });
  }

  // 활성화 상태 토글
  async toggleActive(id:number): Promise<Product | null> {
    const product = await this.findOne(id);
    if (!product) return null;

    return await this.update(id,{isActive: !product.isActive} as Partial<Product>);
  }

  // 카테고리 변경
  async moveToCategory(id: number, categoryId: number): Promise<Product | null> {
    const product = await this.findOne(id);
    if (!product) return null;

    return await this.update(id, { categoryId } as Partial<Product>);
  }

}
