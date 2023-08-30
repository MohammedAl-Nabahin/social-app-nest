import {
  Column,
  Model,
  Table,
  HasMany,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Post } from 'src/modules/post/model/post.model';
import { User } from 'src/modules/user/model/user.model';

@Table({ paranoid: true, tableName: 'comments' })
export class Comment extends Model<Comment> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.NUMBER,
  })
  id?: number;

  @ForeignKey(() => Comment)
  @Column
  parentId: number;

  @BelongsTo(() => Comment, 'parentId')
  parent: Comment;

  @HasMany(() => Comment, 'parentId')
  replies: Comment[];

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @Column
  content: string;

  @ForeignKey(() => Post)
  @Column
  postId: number;

  @BelongsTo(() => Post)
  post: Post;

  @Column({ type: DataType.DATE })
  createdAt: Date;

  @Column({ type: DataType.DATE })
  updatedAt: Date;

  @Column({ type: DataType.DATE })
  deletedAt: Date;

  @Column
  createdBy?: number;

  @Column
  updatedBy?: number;

  @Column
  deletedBy?: number;
}
