import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { UserModule } from '../user/user.module';
import { PostModule } from '../post/post.module';
import { userProviders } from '../user/user.provider';
import { commentProviders } from './comment.provider';
import { postProviders } from '../post/post.provider';

@Module({
  imports: [UserModule, PostModule],
  controllers: [CommentController],
  providers: [
    CommentService,
    ...userProviders,
    ...commentProviders,
    ...postProviders,
  ],
  exports: [CommentService],
})
export class CommentModule {}
