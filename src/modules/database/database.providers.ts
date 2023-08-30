import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { Post } from '../post/model/post.model';
import { Comment } from '../comment/model/comment.model';
import { User } from '../user/model/user.model';
import { DATABASE, SEQUELIZE } from 'src/common/constants/constant';
import { Logger } from '@nestjs/common';

const logger = new Logger();

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async (configService: ConfigService) => {
      const config = configService.get(DATABASE);
      const sequelize = new Sequelize(config);
      sequelize.addModels([User, Post, Comment]);

      sequelize
        .authenticate()
        .then(() => {
          logger.log('Database connection established');
        })
        .catch((error) => {
          logger.error(`Database Connection Error: ${error.message}`);
        });

      return sequelize;
    },

    inject: [ConfigService],
  },
];
