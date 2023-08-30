import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './model/user.model';
import { USER_REPOSITORY } from 'src/common/constants/constant';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userModel,
  ) {}

  async getUserById(userId: number): Promise<User> {
    const user = await this.userModel.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
