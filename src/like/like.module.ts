import { Module } from '@nestjs/common';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './like.entity';
import { User } from 'src/user/user.entity';
import { Competition } from 'src/competition/competition.entity';
import { CompetitionService } from 'src/competition/competition.service';

@Module({
  imports: [TypeOrmModule.forFeature([Like, User, Competition])],
  controllers: [LikeController],
  providers: [LikeService, CompetitionService],
})
export class LikeModule {}
