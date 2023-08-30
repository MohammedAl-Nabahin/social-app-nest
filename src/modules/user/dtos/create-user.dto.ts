import { IsNotEmpty, IsEmail, Length, IsString } from 'class-validator';
import { Role } from 'src/common/enum/role.enum';

export class UserDTO {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 12)
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  lastPostDate?: Date;

  role?: Role;
}
