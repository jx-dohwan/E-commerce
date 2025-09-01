import { Category } from "src/categories/entities/category.entity";
import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, RelationId } from "typeorm";

@Entity('products')
export class Product extends BaseEntity {
    @Column({length: 200})
    name: string

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ type: 'int',})
    price: number;

    @Column({ type: 'int', default: 0 })
    stock: number;

    @Column({ type: 'boolean', default: true })
    isActive: boolean


    @ManyToOne(() => Category, (category) => category.products, {eager:true})
    @JoinColumn({name:'categoryId'})
    category: Category;
}
