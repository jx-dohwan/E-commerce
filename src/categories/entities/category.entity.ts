import { BaseEntity } from "src/common/entities/base.entity";
import { Product } from "src/products/entities/product.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity('categorys')
export class Category extends BaseEntity {
    
    @Column({length: 100, nullable:false, unique:true})
    name: string;

    @Column({type:'text', nullable:true})
    description?: string;

    @OneToMany(() => Product, (product) => product.category)
    products: Product[]
}
