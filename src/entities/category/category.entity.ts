import { BaseEntity, UuidEntity } from "src/core/database/base.entity";
import { Product } from "src/entities/product/product.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity('categorys')
export class Category extends UuidEntity {
    
    @Column({type:'varchar', length: 100, unique:true})
    name: string;

    @Column({type:'text', nullable:true})
    description?: string | null;

    @OneToMany(() => Product, (product) => product.category) 
    products: Product[];
  
}
