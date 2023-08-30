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
import { Comment } from 'src/modules/comment/model/comment.model';
import { User } from 'src/modules/user/model/user.model';

@Table({ paranoid: true, tableName: 'posts' })
export class Post extends Model<Post> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.NUMBER,
  })
  id?: number;

  @Column
  content: string;

  @Column({ type: DataType.NUMBER, defaultValue: 0 })
  watchers: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isEdited: boolean;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => Comment)
  comment: Comment[];

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  editFlag: { timestamp: Date; content: string }[];

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

// get() {
//   const value = this.getDataValue('editFlag');
//   try {
//     return JSON.parse(value);
//   } catch (error) {
//     return error;
//   }
// },
// set(value: { timestamp: Date; content: string }[]) {
//   this.setDataValue('editFlag', JSON.stringify(value));
// },
