import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO } from '../user/dtos/create-user.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { TransactionInterceptor } from 'src/common/providers/interceptors/transaction.interceptor';
import { LogInDTO } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @UseInterceptors(TransactionInterceptor)
  async login(@Body() user: LogInDTO) {
    return this.authService.login(user);
  }

  @Post('signup')
  @Public()
  @UseInterceptors(TransactionInterceptor)
  async register(@Body() userDTO: UserDTO) {
    return this.authService.register(userDTO);
  }
}
