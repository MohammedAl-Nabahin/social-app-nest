import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/model/user.model';
import { UserDTO } from '../user/dtos/create-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { compare, encode } from 'src/common/utils/bcrypt';
import { LogInDTO } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async register(userDTO: UserDTO): Promise<User> {
    const newUser = await this.userModel.findOne({
      where: {
        username: userDTO.username,
        email: userDTO.email,
      },
    });

    if (newUser) {
      throw new HttpException(
        'There is a user with the same name or email',
        HttpStatus.FORBIDDEN,
      );
    }
    const hashedPassword = encode(userDTO.password);
    const newUserDTO: UserDTO = {
      ...userDTO,
      password: hashedPassword,
    };

    // const SignUpUser = this.userModel.create(newUserDTO);

    // const User = {
    //   sub: (await SignUpUser).id,
    //   username: (await SignUpUser).username,
    //   email: (await SignUpUser).email,
    // };

    // const payload = {
    //   ...User,
    // };
    // const accessToken = this.jwtService.sign(payload);
    // return { accessToken };

    return this.userModel.create(newUserDTO);
  }

  async login(userDTO: LogInDTO): Promise<{ accessToken: string }> {
    const user = await this.userModel.findOne({
      where: {
        email: userDTO.email.toLowerCase(),
      },
    });
    if (!user || !compare(userDTO.password, user.password)) {
      throw new HttpException(
        'Invalid credentials, email or password is wrong',
        HttpStatus.BAD_REQUEST,
      );
    }

    const User = {
      sub: user.id,
      username: user.username,
      email: user.email,
    };

    const payload = {
      ...User,
    };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  async validateUserById(id: number): Promise<User | null> {
    return this.userModel.findByPk(id);
  }
}
