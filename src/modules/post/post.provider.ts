import { POST_REPOSITORY } from 'src/common/constants/constant';
import { Post } from './model/post.model';

export const postProviders = [
  {
    provide: POST_REPOSITORY,
    useValue: Post,
  },
];
