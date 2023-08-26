import { Module } from '@nestjs/common';
import { postGateWay } from './events.gateway';
import { PostService } from '../post/post.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Post } from '../post/model/post.model';
import { User } from '../user/model/user.model';

@Module({
  imports: [SequelizeModule.forFeature([Post, User])],
  providers: [postGateWay, PostService],
})
export class EventsModule {}
