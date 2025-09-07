import { Injectable } from "@nestjs/common";
import { Category } from "../entities/category/category.entity";
import { Like, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository } from "src/common/repositories/base.repository";

@Injectable()
export class CategoriesRepository extends BaseRepository<Category> {
    constructor(
        @InjectRepository(Category)
        private readonly categoriesRepository: Repository<Category>,
    ) {
        super(categoriesRepository)
    }

    // 카테고리명으로 단건 조회
    async findByName(name: string): Promise<Category | null> {
        return await this.categoriesRepository.findOne({where:{name}});
    }

    // 카테고리명이 이미 사용 중인지 확인
    async isNameTaken(name: string):Promise<boolean> {
        const exists = await this.categoriesRepository.exists({where:{name}});
        return !!exists;
    }

    // 카테고리명 부분 검색
    async searchByName(keyword: string): Promise<Category[]> {
        return await this.categoriesRepository.find({
            where: {name: Like(`%${keyword}%`)},
            order: {createdAt: 'DESC'},
        });
    }

    // 연관 상품까지 로드
    async findAllWithProducts(): Promise<Category[]> {
        return await this.categoriesRepository.find({
            relations: ['products'],
            order: {createdAt:'DESC'},
        });
    }



    // 페이지네이션(오프셋 기반)
    async paginateCategories(
        page = 1,
        limit = 20,
        keyword?: string,
    ): Promise<{
        items: Category[];
        meta: {page: number; limit: number; total: number; totalPages:number, hasNext:boolean};
    }> {
        const where = keyword ? {name:Like(`%${keyword}%`)} : {};
        const [items, total] = await this.categoriesRepository.findAndCount({
            where,
            order: {createdAt: 'DESC'},
            skip: (page - 1) * limit,
            take: limit
        });

        return {
            items,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total/limit),
                hasNext: page * limit < total,
            }
        }
    }

    // 페이지네이션(커서 기반)
    async cursorCategories(options: {
        limit?: number;      // 1~100 권장
        after?: string | null; // base64 `${createdAt}:${id}`
        keyword?: string;
      }): Promise<{
        items: Category[];
        pageInfo: { hasNext: boolean; nextCursor: string | null };
      }> {
        const { limit = 20, after = null, keyword } = options;
    
        let createdAtCursor: Date | null = null;
        let idCursor: number | null = null;
    
        if (after) {
          const [ts, id] = Buffer.from(after, "base64").toString("utf8").split(":");
          createdAtCursor = new Date(ts);
          idCursor = Number(id);
        }
    
        const qb = this.repository.createQueryBuilder("c")
          .orderBy("c.createdAt", "DESC")
          .addOrderBy("c.id", "DESC")
          .take(limit + 1);
    
        if (keyword) {
          qb.where("c.name ILIKE :kw", { kw: `%${keyword}%` });
        }
    
        if (createdAtCursor && idCursor != null) {
          qb.andWhere(
            "(c.createdAt < :cAt OR (c.createdAt = :cAt AND c.id < :cid))",
            { cAt: createdAtCursor, cid: idCursor },
          );
        }
    
        const rows = await qb.getMany();
        const hasNext = rows.length > limit;
        const items = hasNext ? rows.slice(0, limit) : rows;
    
        const nextCursor = hasNext && items.length
          ? Buffer.from(
              `${items[items.length - 1].createdAt.toISOString()}:${items[items.length - 1].id}`,
            ).toString("base64")
          : null;
    
        return { items, pageInfo: { hasNext, nextCursor } };
      }



}