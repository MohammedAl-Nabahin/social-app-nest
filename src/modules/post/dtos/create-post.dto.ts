import { IsNotEmpty, IsString, Length } from 'class-validator';

export class PostDTO {
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  content: string;

  userId: number;
}
