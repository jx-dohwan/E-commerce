import { Injectable } from "@nestjs/common";
import { BaseRepository } from "src/common/repositories/base.repository";
import { Product } from "./entities/product.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";


@Injectable()
export class ProductsRepository extends BaseRepository<Product> {
    constructor(
        @InjectRepository(Product)
        private readonly productsRepo: Repository<Product>
    ) {
        super(productsRepo)
    }
}