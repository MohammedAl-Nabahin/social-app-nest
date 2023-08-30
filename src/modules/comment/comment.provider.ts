import { COMMENT_REPOSITORY } from 'src/common/constants/constant';
import { Comment } from './model/comment.model';

export const commentProviders = [
  {
    provide: COMMENT_REPOSITORY,
    useValue: Comment,
  },
];
