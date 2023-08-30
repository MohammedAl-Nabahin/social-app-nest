import {
  Column,
  Model,
  Table,
  HasMany,
  DataType,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';
import { Role } from 'src/common/enum/role.enum';
import { Comment } from 'src/modules/comment/model/comment.model';
import { Post } from 'src/modules/post/model/post.model';

@Table({ paranoid: true, tableName: 'users' })
export class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @HasMany(() => Post)
  tasks: Post[];

  @HasMany(() => Comment)
  comments: Comment[];

  @Column({ type: DataType.DATE, allowNull: true })
  lastPostDate?: Date;

  @Column({ type: DataType.NUMBER, defaultValue: 0 })
  postsOnLastDate: number;

  @Column
  role: Role;

  @Column
  createdAt?: Date;

  @Column
  updatedAt?: Date;

  @Column
  deletedAt?: Date;

  @Column
  createdBy?: number;

  @Column
  updatedBy?: number;

  @Column
  deletedBy?: number;
}
