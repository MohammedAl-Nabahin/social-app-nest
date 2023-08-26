import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { PostService } from '../post/post.service';
import { Server, Socket } from 'socket.io';
import { Post } from '../post/model/post.model';
import { NOTFOUND } from 'dns';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class postGateWay {
  constructor(private readonly postService: PostService) {}

  @WebSocketServer()
  server: Server;

  private socketIds: Set<string> = new Set();

  handleConnection(socket: Socket) {
    this.socketIds.add(socket.id);
  }

  @SubscribeMessage('viewPost')
  async handleView(
    @MessageBody() post: Post,
    @ConnectedSocket() socket: Socket,
  ) {
    const data = await this.postService.addWatcher(post.id);

    if (!post) {
      return NOTFOUND;
    }
    data;

    const socketId = socket.id;
    this.handleConnection(socket);
    console.log(`Client with socket ID ${socketId} viewed post ${post.id}`);

    return 'View Post successful';
  }
}
