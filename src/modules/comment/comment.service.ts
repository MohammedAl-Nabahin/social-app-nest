import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { Comment } from './model/comment.model';
import { CommentDto } from './dto/create-comment.dto';
import { Transaction } from 'sequelize';
import {
  COMMENT_REPOSITORY,
  USER_REPOSITORY,
} from 'src/common/constants/constant';
import { PostService } from '../post/post.service';

@Injectable()
export class CommentService {
  constructor(
    @Inject(COMMENT_REPOSITORY) private commentModel,
    @Inject(USER_REPOSITORY) private userModel,
    private postService: PostService,
  ) {}

  async createComment(
    { content }: CommentDto,
    userId: number,
    postId: number,
  ): Promise<Comment> {
    await this.postService.getPostById(postId);
    return this.commentModel.create({ userId, postId, content });
  }

  async createReply(
    userId: number,
    postId: number,
    parentId: number,
    { content }: CommentDto,
    transaction: Transaction,
  ): Promise<Comment> {
    await this.postService.getPostById(postId);
    const comment = await this.getCommentById(parentId);
    if (!comment) {
      throw new NotFoundException();
    }
    return this.commentModel.create(
      { userId, postId, parentId, content },
      { transaction },
    );
  }

  async getCommentById(id: number): Promise<Comment> {
    const comment = await this.commentModel.findByPk(id);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  async getAllCommentsForPost(postId: number): Promise<Comment[]> {
    const comments = await this.commentModel.findAll({
      where: {
        parentId: null,
        postId: postId,
      },
    });
    if (!comments.length) {
      throw new HttpException(
        `No comments found for post with ID ${postId}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return comments;
  }

  async deleteComment(
    id: number,
    userId: number,
    transaction: Transaction,
  ): Promise<void> {
    const user = await this.userModel.findByPk(userId);
    const comment = await this.getCommentById(id);
    if (comment.userId == user.id) {
      comment.deletedBy = userId;
      await this.commentModel.destroy({
        where: { id },
        transaction,
      });
    } else {
      throw new HttpException(
        'you cant delete this comment',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
