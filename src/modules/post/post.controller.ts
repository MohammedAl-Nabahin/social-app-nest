import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { PostDTO } from './dtos/create-post.dto';
import { User } from 'src/common/decorators/user.decorator';
import IUserInterface from 'src/modules/user/user.interface';
import { UpdatePostDTO } from './dtos/update-post.dto';
import { TransactionInterceptor } from 'src/common/providers/interceptors/transaction.interceptor';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseInterceptors(new TransactionInterceptor())
  async createPost(
    @Body() post: PostDTO,
    @User() user: IUserInterface,
  ): Promise<any> {
    return this.postService.createPost(user.sub, post.content);
  }

  @Get(':id')
  async getPost(@Param('id') id: number) {
    return this.postService.getPostById(id);
  }

  @Get()
  async getRandomPosts() {
    return this.postService.getPosts();
  }

  @Patch(':id')
  @UseInterceptors(new TransactionInterceptor())
  async editPost(
    @Param('id') id: number,
    @Body() updatedPost: UpdatePostDTO,
    @User() user: IUserInterface,
  ) {
    return this.postService.editPost(id, user.sub, updatedPost);
  }

  @Delete(':id')
  @UseInterceptors(new TransactionInterceptor())
  async deletePost(@Param('id') id: number, @User() user: IUserInterface) {
    this.postService.deletePost(id, user.sub);
  }
}
