import { UuidEntity } from "src/core/database/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { User } from "../users/user.entity";


@Entity('posts')
export class Post extends UuidEntity {
    // 게시글 제목
    @Column({type:'varchar', nullable:false})
    title: string;

    // 게시글 내용
    @Column({type:'text', nullable: true})
    content: string | null;

    // 게시글 작성자의 ID(User 테이블과 관계)
    @Column({name:'user_id',type:'uuid'})
    userId: string;

    @ManyToOne(() => User, (user) => user.post, {
        onDelete:'RESTRICT',
        nullable: false,
    })
    @JoinColumn({name:'user_id'})
    user: User;
}