import { IsString } from "class-validator";
import { plainToInstance } from "class-transformer";
import { Post } from "src/entities/posts/post.entity";

export class CreatePostDto {
    @IsString()
    title: string;

    @IsString()
    content: string;

    toSchema(): Post {
        return plainToInstance(Post, this);
    }

}
