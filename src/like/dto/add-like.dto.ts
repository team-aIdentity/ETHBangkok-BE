import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddLikeDto {
  @IsNumber()
  @IsNotEmpty()
  competitionId: number;

  @IsNumber()
  @IsNotEmpty()
  toUserId: number;

  @IsNumber()
  @IsNotEmpty()
  fromUserId: number;
}
