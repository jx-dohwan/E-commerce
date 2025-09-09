import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRepository } from './repository/posts.repository';
import { Post } from 'src/entities/posts/post.entity';
import { Role } from 'src/constants/role';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository){}

  async create(createPostDto: CreatePostDto) {
    const post = await this.postsRepository.create(createPostDto.toSchema());
    return post;
  }

  async remove(postId:Post['id'], requester: {sub: string; role: Role}) {
    const post = await this.postsRepository.findOne(postId);
    if (!post) throw new NotFoundException('post not found');

    const isOwner = post.user?.id === requester.sub;
    const isAdmin = requester.role === Role.Admin;

    if (!isOwner && !isAdmin) throw new ForbiddenException('not allowed');

    await this.postsRepository.remove(postId);
    return {ok: true};
  }

  // findAll() {
  //   return `This action returns all posts`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} post`;
  // }

  // update(id: number, updatePostDto: UpdatePostDto) {
  //   return `This action updates a #${id} post`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} post`;
  // }
}
