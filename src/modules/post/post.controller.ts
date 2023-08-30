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
import { UserPrinciple } from 'src/common/decorators/user.decorator';
import IUserInterface from 'src/modules/user/user.interface';
import { UpdatePostDTO } from './dtos/update-post.dto';
import { TransactionDecorator } from 'src/common/decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enum/role.enum';
import { TransactionInterceptor } from 'src/common/interceptors/transaction.interceptor';

@UseInterceptors(TransactionInterceptor)
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async createPost(
    @Body() post: PostDTO,
    @UserPrinciple() user: IUserInterface,
    @TransactionDecorator() transaction: Transaction,
  ): Promise<any> {
    return this.postService.createPost(user.sub, post.content, transaction);
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
  @Roles(Role.Admin)
  async editPost(
    @Param('id') id: number,
    @Body() updatedPost: UpdatePostDTO,
    @UserPrinciple() user: IUserInterface,
    @TransactionDecorator() transaction: Transaction,
  ) {
    return this.postService.editPost(id, user.sub, updatedPost, transaction);
  }

  @Delete(':id')
  async deletePost(
    @Param('id') id: number,
    @UserPrinciple() user: IUserInterface,
    @TransactionDecorator() transaction: Transaction,
  ) {
    this.postService.deletePost(id, user.sub, transaction);
  }
}
