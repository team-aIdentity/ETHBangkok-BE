import { Module } from '@nestjs/common';
import { CompetitionService } from './competition.service';
import { CompetitionController } from './competition.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Competition } from './competition.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Competition])],
  providers: [CompetitionService],
  controllers: [CompetitionController],
})
export class CompetitionModule {}
