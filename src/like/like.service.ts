import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from './like.entity';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Competition } from 'src/competition/competition.entity';
import { CompetitionService } from 'src/competition/competition.service';
import { AddLikeDto } from './dto/add-like.dto';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Competition)
    private competitionsRepository: Repository<Competition>,

    @Inject(forwardRef(() => CompetitionService))
    private competitionService: CompetitionService,

    private dataSource: DataSource,
  ) {}

  /**
   * 특정 컴피티션의 참가자에게 좋아요를 추가합니다.
   * @param fromUserId 좋아요를 누르는 유저 ID
   * @param toUserId 좋아요를 받는 유저 ID
   * @param competitionId 컴피티션 ID
   */
  async addLike(addLikeDto: AddLikeDto): Promise<Like> {
    return await this.dataSource.transaction(async (manager) => {
      // 좋아요를 누르는 유저 찾기
      const fromUser = await manager.findOne(User, {
        where: { id: addLikeDto.fromUserId },
      });
      if (!fromUser) {
        throw new NotFoundException(
          `User with ID ${addLikeDto.fromUserId} not found`,
        );
      }

      // 좋아요를 받는 유저 찾기
      const toUser = await manager.findOne(User, {
        where: { id: addLikeDto.toUserId },
      });
      if (!toUser) {
        throw new NotFoundException(
          `User with ID ${addLikeDto.toUserId} not found`,
        );
      }

      // 컴피티션 찾기
      const competition = await manager.findOne(Competition, {
        where: { id: addLikeDto.competitionId },
        relations: ['users', 'likes'],
      });
      if (!competition) {
        throw new NotFoundException(
          `Competition with ID ${addLikeDto.competitionId} not found`,
        );
      }

      if (competition.end_date) {
        throw new BadRequestException('Competition has already ended.');
      }

      // 좋아요를 받는 유저가 컴피티션에 참가하고 있는지 확인
      const isParticipant = competition.users.some(
        (user) => user.id === addLikeDto.toUserId,
      );
      if (!isParticipant) {
        throw new BadRequestException(
          'The user is not a participant of this competition.',
        );
      }

      // 자신에게 좋아요를 누를 수 없는지 확인 (옵션)
      if (addLikeDto.fromUserId === addLikeDto.toUserId) {
        throw new BadRequestException('Users cannot like themselves.');
      }

      // 이미 좋아요를 눌렀는지 확인
      const existingLike = await manager.findOne(Like, {
        where: {
          fromUser: { id: addLikeDto.fromUserId },
          toUser: { id: addLikeDto.toUserId },
          competition: { id: addLikeDto.competitionId },
        },
      });
      if (existingLike) {
        throw new BadRequestException(
          'You have already liked this user in this competition.',
        );
      }

      const like = manager.create(Like, {
        fromUser,
        toUser,
        competition,
      });

      await manager.save(like);

      // 총 좋아요 수 확인하여 컴피티션 종료 여부 결정
      const totalLikes = await manager.count(Like, {
        where: { competition: { id: addLikeDto.competitionId } },
      });

      if (totalLikes >= 30 && !competition.end_date) {
        await this.competitionService.endCompetition(addLikeDto.competitionId);
      }

      return like;
    });
  }

  /**
   * 특정 컴피티션에서 특정 유저가 받은 좋아요 목록을 조회합니다.
   * @param competitionId 컴피티션 ID
   * @param toUserId 좋아요를 받은 유저 ID (옵션)
   */
  async getLikesForCompetition(
    competitionId: number,
    toUserId?: number,
  ): Promise<Like[]> {
    return await this.dataSource.transaction(async (manager) => {
      const where: any = { competition: { id: competitionId } };
      if (toUserId) {
        where.toUser = { id: toUserId };
      }
      return manager.find(Like, {
        where,
        relations: ['fromUser', 'toUser'],
      });
    });
  }
}
