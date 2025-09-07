import { Expose } from "class-transformer";
import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryColumn, BeforeInsert} from "typeorm";
import { v4 } from "uuid";

export class BaseTimeEntity {
    @Expose() // 어떤 기능이지? 
    @CreateDateColumn({type:'timestamp', update: false}) // 해당 Type과 update는 무슨 설정인거지?
    createdAt: Date;

    @Expose()
    @UpdateDateColumn({type:'timestamp'})
    updatedAt: Date;

    @Expose()
    @DeleteDateColumn({type:'timestamp', nullable:true})
    deletedAt: Date | null;
}

export class UuidEntity extends BaseTimeEntity {
    @Expose()
    @PrimaryColumn({type: 'uuid'})
    id!: string;

    @BeforeInsert()
    generateUuid() {
        if(!this.id) this.id = v4() // 생성전 uuid 발급
    }
}

export abstract class BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}