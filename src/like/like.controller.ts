import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { Like } from './like.entity';
import { LikeService } from './like.service';

@Controller('like')
export class LikeController {
  constructor(private likeService: LikeService) {}

  /**
   * Add a like to a competition by a user.
   * POST /likes
   */
  @Post()
  async addLike(
    @Body('userId', ParseIntPipe) userId: number,
    @Body('competitionId', ParseIntPipe) competitionId: number,
  ): Promise<Like> {
    return this.likeService.addLike(userId, competitionId);
  }

  /**
   * Get all likes for a specific competition.
   * GET /likes/competition/:competitionId
   */
  @Get('competition/:competitionId')
  async getLikesForCompetition(
    @Param('competitionId', ParseIntPipe) competitionId: number,
  ): Promise<Like[]> {
    return this.likeService.getLikesForCompetition(competitionId);
  }
}
