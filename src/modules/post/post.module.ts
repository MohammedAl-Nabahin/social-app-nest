import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import * as dotenv from 'dotenv';
import { AuthService } from 'src/modules/auth/auth.service';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { postProviders } from './post.provider';
import { userProviders } from '../user/user.provider';

dotenv.config();

@Module({
  imports: [UserModule, AuthModule],
  controllers: [PostController],
  providers: [PostService, AuthService, ...postProviders, ...userProviders],
  exports: [PostService],
})
export class PostModule {}
