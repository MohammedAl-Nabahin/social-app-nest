import { IsNotEmpty, IsEmail, Length, IsString } from 'class-validator';

export class UpdateUserDTO {
  @IsNotEmpty()
  @IsString()
  username?: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 12)
  password?: string;

  @IsNotEmpty()
  @IsEmail()
  email?: string;
}
