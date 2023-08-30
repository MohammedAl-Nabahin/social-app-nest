import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/model/user.model';
import { UserDTO } from '../user/dtos/create-user.dto';
import { compare, encode } from 'src/common/utils/bcrypt';
import { LogInDTO } from './dtos/login.dto';
import { Op, Transaction } from 'sequelize';
import { USER_REPOSITORY } from 'src/common/constants/constant';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    @Inject(USER_REPOSITORY)
    private readonly userModel,
  ) {}

  async register(userDTO: UserDTO, transaction: Transaction): Promise<User> {
    const newUser = await this.userModel.findOne({
      where: {
        [Op.or]: [{ username: userDTO.username }, { email: userDTO.email }],
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
    this.logger.log('Signed Up');
    return this.userModel.create(newUserDTO, { transaction });
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
      id: user.id,
      role: user.role,
      username: user.username,
      email: user.email,
    };

    const payload = {
      ...User,
    };
    const accessToken = this.jwtService.sign(payload);
    this.logger.log('Logged In');
    return { accessToken };
  }

  async validateUserById(id: number): Promise<User | null> {
    return this.userModel.findByPk(id);
  }
}
