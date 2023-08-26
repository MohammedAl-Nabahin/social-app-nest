import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Dialect, Sequelize, Transaction } from 'sequelize';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const sequelizeOptions = {
      dialect: process.env.DB_DIALECT as Dialect,
      host: process.env.DB_HOST,
      port: Number(process.env.PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    };
    const sequelize = new Sequelize(sequelizeOptions as any);

    const transaction: Transaction = await sequelize.transaction();

    try {
      const result = next.handle();
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
