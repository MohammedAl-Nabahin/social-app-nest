import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/common/utils/jwt.strategy';
import * as dotenv from 'dotenv';
import { UserService } from 'src/modules/user/user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/modules/user/model/user.model';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UserService],
  exports: [JwtModule],
})
export class AuthModule {}
