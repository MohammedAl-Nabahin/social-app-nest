interface IUserInterface {
  sub?: number;
  id?: number;
  username?: string;
  password?: string;
  email?: string;
  lastPostDate?: Date;
  postsOnLastDate?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export default IUserInterface;
