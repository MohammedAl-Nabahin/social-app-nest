import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdatePostDTO {
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  content: string;

  isEdited?: boolean;
  updatedAt?: Date;
}
