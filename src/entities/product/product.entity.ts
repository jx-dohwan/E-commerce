import { BaseEntity, UuidEntity } from 'src/core/database/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { Category } from '../category/category.entity';

@Entity('products')
export class Product extends UuidEntity {
  @Column({ length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'int' })
  price: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'category_id', type: 'uuid' })
  categoryId: string;

  @ManyToOne(() => Category, (c) => c.products, {
    onDelete: 'RESTRICT', // 카테고리에 상품이 있으면 카테고리 삭제 불가
    nullable: false, // set null 방지
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
