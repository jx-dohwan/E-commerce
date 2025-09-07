import { Role } from "src/constants/role";
import { UuidEntity } from "src/core/database/base.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { Post } from "../posts/post.entity";


@Entity('users')
export class User extends UuidEntity {
    //사용자의 이메일 주소
    @Column({type:'varchar', length:255, nullable:false, unique:true})
    email: string;

    // Bcrypt로 해싱된 비밀번호
    @Column({type:'varchar', nullable:false})
    password: string;

    // 사용자 역할 (일반 사용자 또는 관리자)
    @Column({type:'enum', enum:Role, default: Role.User, nullable:false })
    role: Role;

    // 해싱된 Refresh Token(로구아웃 처리에 사용)
    @Column({type:'varchar', length:255, nullable:true})
    hashedRefreshToken?: string | null

  
    @OneToMany(() => Post, (post) => post.user)
    post: Post
}