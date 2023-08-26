import { IsNotEmpty, IsEmail, Length, IsString } from 'class-validator';

export class LogInDTO {
  @IsNotEmpty()
  @IsString()
  @Length(6, 12)
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
