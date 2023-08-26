import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentDto } from './dto/create-comment.dto';
import { User } from 'src/common/decorators/user.decorator';
import IUserInterface from 'src/modules/user/user.interface';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('post/:postId')
  async createComment(
    @Body() { content }: CommentDto,
    @User() user: IUserInterface,
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<any> {
    return this.commentService.createComment({ content }, user.sub, postId);
  }

  @Post('posts/:postId/comment/:parentId')
  async createReply(
    @Body() { content }: CommentDto,
    @User() user: IUserInterface,
    @Param('postId', ParseIntPipe) postId: number,
    @Param('parentId', ParseIntPipe) parentId: number,
  ): Promise<any> {
    return this.commentService.createReply(user.sub, postId, parentId, {
      content,
    });
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
  async deleteComment(
    @Param('id') commentId: number,
    @User() user: IUserInterface,
  ) {
    return this.commentService.deleteComment(commentId, user.sub);
  }
}
