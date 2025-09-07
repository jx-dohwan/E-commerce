import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository } from "src/common/repositories/base.repository";
import { Post } from "src/entities/posts/post.entity";
import { Repository } from "typeorm";


@Injectable()
export class PostsRepository extends BaseRepository<Post> {
    constructor(
        @InjectRepository(Post)
        private readonly PostsRepo: Repository<Post>,
    ) {
        super(PostsRepo)
    }
}