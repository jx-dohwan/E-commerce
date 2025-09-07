import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThanOrEqual, Like, MoreThanOrEqual, Repository } from 'typeorm';
import { Product } from 'src/entities/product/product.entity';

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




}
