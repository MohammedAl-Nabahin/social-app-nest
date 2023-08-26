import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Post } from './model/post.model';
import { User } from 'src/modules/user/model/user.model';
import { UserService } from 'src/modules/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { JwtStrategy } from 'src/common/utils/jwt.strategy';
import { AuthService } from 'src/modules/auth/auth.service';

dotenv.config();

@Module({
  imports: [
    SequelizeModule.forFeature([Post]),
    SequelizeModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [PostController],
  providers: [PostService, UserService, JwtStrategy, AuthService],
})
export class PostModule {}
