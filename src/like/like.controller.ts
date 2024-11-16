import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { Like } from './like.entity';
import { AddLikeDto } from './dto/add-like.dto';

@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  /**
   * 특정 컴피티션의 참가자에게 좋아요를 추가합니다.
   * POST /likes
   * Body:
   * {
   *   "fromUserId": number,
   *   "toUserId": number,
   *   "competitionId": number
   * }
   */
  @Post()
  async addLike(@Body() addLikeDto: AddLikeDto): Promise<Like> {
    return this.likeService.addLike(addLikeDto);
  }

  /**
   * 특정 컴피티션의 모든 좋아요를 조회합니다.
   * GET /likes/competition/:competitionId
   * 또는 특정 유저가 받은 좋아요를 조회하려면 `toUserId` 쿼리 파라미터 사용
   * 예: GET /likes/competition/1?toUserId=2
   */
  @Get('competition/:competitionId')
  async getLikesForCompetition(
    @Param('competitionId', ParseIntPipe) competitionId: number,
    @Query('toUserId') toUserId?: string,
  ): Promise<Like[]> {
    const parsedToUserId = toUserId ? parseInt(toUserId, 10) : undefined;
    if (toUserId && isNaN(parsedToUserId)) {
      throw new BadRequestException('toUserId must be a number');
    }
    return this.likeService.getLikesForCompetition(
      competitionId,
      parsedToUserId,
    );
  }

  /**
   * 특정 컴피티션의 특정 유저가 누른 좋아요를 조회합니다.
   * GET /likes/competition/:competitionId/fromUserId/1
   */
  @Get('competition/:competitionId/fromUserId/:fromUserId')
  async getLikeByCompetitionAndFromUser(
    @Param('competitionId', ParseIntPipe) competitionId: number,
    @Param('fromUserId', ParseIntPipe) fromUserId: number,
  ): Promise<Like> {
    return this.likeService.getLikeByCompetitionAndFromUser(
      competitionId,
      fromUserId,
    );
  }
}
