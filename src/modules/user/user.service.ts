import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './model/user.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async getUserById(userId: string): Promise<User> {
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
