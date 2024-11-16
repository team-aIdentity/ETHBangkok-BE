import { IsInt, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  account: string;

  @IsString()
  name: string;

  @IsInt()
  age: number;

  @IsString()
  country: string;

  @IsString()
  mbti: string;

  @IsString()
  hobby: string;

  @IsString()
  about: string;

  @IsString()
  profileImage: string;
}
