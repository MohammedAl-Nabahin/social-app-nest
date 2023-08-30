import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/common/utils/jwt.strategy';
import { UserModule } from '../user/user.module';
import * as dotenv from 'dotenv';
import { userProviders } from '../user/user.provider';
import { databaseProviders } from '../database/database.providers';

dotenv.config();

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ...userProviders, ...databaseProviders],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
