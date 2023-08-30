import { USER_REPOSITORY } from 'src/common/constants/constant';
import { User } from './model/user.model';

export const userProviders = [
  {
    provide: USER_REPOSITORY,
    useValue: User,
  },
];
