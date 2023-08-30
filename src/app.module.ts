import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './modules/database/database.module';
import { PostModule } from './modules/post/post.module';
import { CommentModule } from './modules/comment/comment.module';
import { UserModule } from './modules/user/user.module';
import { EventsModule } from './modules/events/event.module';
import { ConfigModule } from '@nestjs/config';
import config from 'config';

@Module({
  imports: [
    ConfigModule.forRoot({ load: config, isGlobal: true }),
    DatabaseModule,
    AuthModule,
    PostModule,
    CommentModule,
    UserModule,
    EventsModule,
  ],
})
export class AppModule {}
