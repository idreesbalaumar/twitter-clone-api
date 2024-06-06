import { IsString, IsNotEmpty, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateTweetDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsArray()
  @ArrayNotEmpty()
  users: number[]; // array of user IDs
}
