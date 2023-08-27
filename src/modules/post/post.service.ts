import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './model/post.model';
import { User } from 'src/modules/user/model/user.model';
import { UpdatePostDTO } from './dtos/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post) private postModel: typeof Post,
    @InjectModel(User) private userModel: typeof User,
  ) {}

  async createPost(userId: number, content: string): Promise<Post> {
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const currentDate = new Date();

    if (
      user.lastPostDate.setHours(0, 0, 0, 0) ==
        currentDate.setHours(0, 0, 0, 0) &&
      user.postsOnLastDate == 5
    ) {
      throw new BadRequestException('User has reached the daily post limit');
    }

    const post = await this.postModel.create({ userId, content });

    if (
      user.lastPostDate.setHours(0, 0, 0, 0) < currentDate.setHours(0, 0, 0, 0)
    ) {
      user.postsOnLastDate = 1;
      user.lastPostDate = new Date();
    } else {
      user.postsOnLastDate++;
    }

    await user.save();

    return post;
  }

  async getPostById(id: number): Promise<Post> {
    const post = await this.postModel.findByPk(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async getPosts(): Promise<Post[]> {
    const posts = await this.postModel.findAll({
      order: [['createdAt', 'DESC']],
      limit: 500,
    });
    const randomPosts = this.getRandomPosts(posts, 100);

    return randomPosts;
  }

  async editPost(
    id: number,
    userId: number,
    updatedPost: UpdatePostDTO,
  ): Promise<Post> {
    const post = await this.postModel.findByPk(id);
    const oldData = post.content;

    const [affectedCount] = await this.postModel.update(updatedPost, {
      where: { id, userId },
    });

    if (affectedCount === 0) {
      throw new ForbiddenException('You can`t edit this Post');
    }

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (!post.editFlag) {
      post.editFlag = [];
    }

    const oldPost = {
      timestamp: new Date(),
      content: oldData,
    };

    const edits = JSON.stringify([post.editFlag, oldPost]);
    post.editFlag = JSON.parse(edits);
    post.isEdited = true;

    await post.save();

    await post.update({
      ...updatedPost,
    });

    return this.postModel.findByPk(id);
  }

  async deletePost(id: number, userId: number): Promise<void> {
    const user = await this.userModel.findByPk(userId);
    const post = await this.getPostById(id);

    if (post.watchers > 0) {
      throw new ForbiddenException(
        'Cannot delete a post that has been watched',
      );
    }

    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (post.userId == user.id) {
      await post.destroy();
    } else {
      throw new HttpException(
        'you  cant delete this comment',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async addWatcher(postId: number): Promise<Post> {
    const post = await this.postModel.findByPk(postId);
    if (!post) {
      throw new NotFoundException();
    }

    post.watchers++;
    await post.save();
    return post;
  }

  //get random limited posts
  private getRandomPosts(posts: Post[], limit: number): Post[] {
    const shuffle = posts.slice();
    for (let i = shuffle.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffle[i], shuffle[j]] = [shuffle[j], shuffle[i]];
    }
    return shuffle.slice(0, limit);
  }
}
