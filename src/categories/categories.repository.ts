import { Injectable } from "@nestjs/common";
import { Category } from "./entities/category.entity";
import { Repository } from "typeorm";
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
}