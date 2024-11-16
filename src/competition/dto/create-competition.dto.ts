import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDate,
  IsInt,
} from 'class-validator';

export class CreateCompetitionDto {
  @Type(() => Date)
  @IsDate()
  start_date: Date;

  @IsArray()
  @ArrayMinSize(4)
  @ArrayMaxSize(4)
  @IsInt({ each: true })
  userIds: number[];
}
