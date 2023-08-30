import { Module } from '@nestjs/common';
import { postGateWay } from './events.gateway';
import { UserModule } from '../user/user.module';
import { PostModule } from '../post/post.module';
import { postProviders } from '../post/post.provider';
import { userProviders } from '../user/user.provider';

@Module({
  imports: [UserModule, PostModule],
  providers: [postGateWay, ...postProviders, ...userProviders],
})
export class EventsModule {}
