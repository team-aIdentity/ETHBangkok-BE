import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from './like.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Competition } from 'src/competition/competition.entity';
import { CompetitionService } from 'src/competition/competition.service';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Competition)
    private competitionRepository: Repository<Competition>,

    private competitionService: CompetitionService,
  ) {}

  async addLike(userId: number, competitionId: number): Promise<Like> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const competition = await this.competitionRepository.findOne({
      where: { id: competitionId },
      relations: ['likes'],
    });
    if (!competition) {
      throw new NotFoundException(
        `Competition with ID ${competitionId} not found`,
      );
    }

    if (competition.end_date) {
      throw new BadRequestException('Competition has already ended.');
    }

    // Check if the user is part of the competition
    if (competition.users.some((u) => u.id === userId)) {
      throw new BadRequestException(
        'User should be not part of this competition.',
      );
    }

    // Check if the user has already liked the competition
    const existingLike = await this.likeRepository.findOne({
      where: { user: { id: userId }, competition: { id: competitionId } },
    });
    if (existingLike) {
      throw new BadRequestException('User has already liked this competition.');
    }

    const like = this.likeRepository.create({
      user,
      competition,
    });

    await this.likeRepository.save(like);

    // Check if the competition has reached 30 likes
    const totalLikes = await this.likeRepository.count({
      where: { competition: { id: competitionId } },
    });

    if (totalLikes >= 30) {
      await this.competitionService.endCompetition(competitionId);
    }

    return like;
  }

  async getLikesForCompetition(competitionId: number): Promise<Like[]> {
    return this.likeRepository.find({
      where: { competition: { id: competitionId } },
      relations: ['user'],
    });
  }
}
