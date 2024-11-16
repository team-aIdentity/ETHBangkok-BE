import { forwardRef, Module } from '@nestjs/common';
import { CompetitionService } from './competition.service';
import { CompetitionController } from './competition.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Competition } from './competition.entity';
import { QueueService } from './queue.service';
import { User } from 'src/user/user.entity';
import { LikeModule } from 'src/like/like.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Competition, User]),
    forwardRef(() => LikeModule),
  ],
  providers: [CompetitionService, QueueService],
  controllers: [CompetitionController],
  exports: [CompetitionService],
})
export class CompetitionModule {}
