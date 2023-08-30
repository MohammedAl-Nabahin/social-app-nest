import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO } from '../user/dtos/create-user.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { LogInDTO } from './dtos/login.dto';
import { Transaction } from 'sequelize';
import { TransactionDecorator } from 'src/common/decorators/transaction.decorator';
import { TransactionInterceptor } from 'src/common/interceptors/transaction.interceptor';

@UseInterceptors(TransactionInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  async login(@Body() user: LogInDTO) {
    return this.authService.login(user);
  }

  @Post('signup')
  @Public()
  async register(
    @Body() userDTO: UserDTO,
    @TransactionDecorator() transaction: Transaction,
  ) {
    return this.authService.register(userDTO, transaction);
  }
}
