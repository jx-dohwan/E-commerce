import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { RolesGuard } from 'src/core/guard/roles.guard';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { Post as p} from 'src/entities/posts/post.entity';
import { CurrentUser } from 'src/core/decorator/currentUser.decorator';

@Controller('posts')
@UseGuards(AccessTokenGuard) 
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('/')
  async createPost(@Body() createPostDto: CreatePostDto,  @CurrentUser() user: any) {
    return this.postsService.create(createPostDto)
  }

  @Delete(':id')
  remove(@Param('id') id:p['id'], @CurrentUser() user:any) {
    return this.postsService.remove(id, user);
  }



  // @Post()
  // create(@Body() createPostDto: CreatePostDto) {
  //   return this.postsService.create(createPostDto);
  // }

  // @Get()
  // findAll() {
  //   return this.postsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.postsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
  //   return this.postsService.update(+id, updatePostDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.postsService.remove(+id);
  // }
}
