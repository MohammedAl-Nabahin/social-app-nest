import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Comment } from './model/comment.model';
import { PostService } from 'src/modules/post/post.service';
import { CommentDto } from './dto/create-comment.dto';
import { User } from '../user/model/user.model';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment) private commentModel: typeof Comment,
    @InjectModel(User) private userModel: typeof User,
    @Inject(forwardRef(() => PostService))
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
  ): Promise<Comment> {
    await this.postService.getPostById(postId);
    const comment = await this.getCommentById(parentId);
    if (!comment) {
      throw new NotFoundException();
    }
    return this.commentModel.create({ userId, postId, parentId, content });
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

  async deleteComment(id: number, userId: number): Promise<void> {
    const user = await this.userModel.findByPk(userId);
    const comment = await this.getCommentById(id);
    if (comment.userId == user.id) {
      await comment.destroy();
    } else {
      throw new HttpException(
        'you  cant delete this comment',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
