import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDate,
  IsInt,
} from 'class-validator';

export class CreateCompetitionDto {
  @IsDate()
  start_date: Date;

  @IsArray()
  @ArrayMinSize(4)
  @ArrayMaxSize(4)
  @IsInt({ each: true })
  userIds: number[];
}
