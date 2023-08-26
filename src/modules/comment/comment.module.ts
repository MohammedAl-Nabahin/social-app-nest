import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Comment } from './model/comment.model';
import { PostService } from 'src/modules/post/post.service';
import { Post } from 'src/modules/post/model/post.model';
import { User } from 'src/modules/user/model/user.model';
import { UserService } from 'src/modules/user/user.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Comment]),
    SequelizeModule.forFeature([Post]),
    SequelizeModule.forFeature([User]),
  ],
  controllers: [CommentController],
  providers: [CommentService, PostService, UserService],
  exports: [CommentService],
})
export class CommentModule {}
