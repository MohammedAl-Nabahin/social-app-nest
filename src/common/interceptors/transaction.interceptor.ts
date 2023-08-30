import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Transaction, Sequelize } from 'sequelize';
import { SEQUELIZE } from '../constants/constant';
import { Observable, catchError, tap } from 'rxjs';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(@Inject(SEQUELIZE) private sequelize: Sequelize) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const transaction: Transaction = await this.sequelize.transaction();
    request.transaction = transaction;

    return next.handle().pipe(
      tap(() => {
        console.log('commit');
        transaction.commit();
      }),
      catchError((err) => {
        console.log('rollback');
        transaction.rollback();
        throw err;
      }),
    );
  }
}
