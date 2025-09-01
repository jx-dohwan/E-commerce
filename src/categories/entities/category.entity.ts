import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity('categorys')
export class Category extends BaseEntity {
    
    @Column({length: 100, nullable:false, unique:true})
    name: string;

    @Column({type:'text', nullable:true})
    description?: string;
}
