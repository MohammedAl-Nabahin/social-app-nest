import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Delete,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentDto } from './dto/create-comment.dto';
import { UserPrinciple } from 'src/common/decorators/user.decorator';
import IUserInterface from 'src/modules/user/user.interface';
import { Transaction } from 'sequelize';
import { TransactionDecorator } from 'src/common/decorators/transaction.decorator';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enum/role.enum';
import { TransactionInterceptor } from 'src/common/interceptors/transaction.interceptor';

@UseInterceptors(TransactionInterceptor)
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('post/:postId')
  async createComment(
    @Body() { content }: CommentDto,
    @UserPrinciple() user: IUserInterface,
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<any> {
    return this.commentService.createComment({ content }, user.sub, postId);
  }

  @Post('posts/:postId/comment/:parentId')
  async createReply(
    @Body() { content }: CommentDto,
    @UserPrinciple() user: IUserInterface,
    @Param('postId', ParseIntPipe) postId: number,
    @Param('parentId', ParseIntPipe) parentId: number,
    @TransactionDecorator() transaction: Transaction,
  ): Promise<any> {
    return this.commentService.createReply(
      user.sub,
      postId,
      parentId,
      {
        content,
      },
      transaction,
    );
  }

  @Get(':id')
  async getComment(@Param('id') id: number) {
    return this.commentService.getCommentById(id);
  }

  @Get('post/:postId')
  async getCommentsForPost(@Param('postId') postId: number) {
    return this.commentService.getAllCommentsForPost(postId);
  }

  @Delete(':id')
  @Roles(Role.Admin, Role.User)
  async deleteComment(
    @Param('id') commentId: number,
    @UserPrinciple() user: IUserInterface,
    @TransactionDecorator() transaction: Transaction,
  ) {
    return this.commentService.deleteComment(commentId, user.sub, transaction);
  }
}
