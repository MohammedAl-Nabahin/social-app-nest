import { Module, ValidationPipe } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './modules/Config/database.module';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { AuthGuard } from './common/guards/auth.guard';
import { PostModule } from './modules/post/post.module';
import { CommentModule } from './modules/comment/comment.module';
import { UserModule } from './modules/user/user.module';
import { EventsModule } from './modules/events/event.module';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    PostModule,
    CommentModule,
    UserModule,
    EventsModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
