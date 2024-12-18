import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Competition } from './competition.entity';
import { User } from 'src/user/user.entity';
import { CreateCompetitionDto } from './dto/create-competition.dto';

@Injectable()
export class CompetitionService {
  constructor(
    @InjectRepository(Competition)
    private competitionsRepository: Repository<Competition>,
    private dataSource: DataSource,

    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await Competition.createDummyCompetitions(this.dataSource);
  }

  findAll(): Promise<Competition[]> {
    return this.competitionsRepository.find({
      relations: ['users', 'winner', 'likes'],
    });
  }

  findOne(id: number): Promise<Competition> {
    return this.competitionsRepository.findOne({
      where: { id },
      relations: ['users', 'winner', 'likes'],
    });
  }

  async create(
    createCompetitionDto: CreateCompetitionDto,
  ): Promise<Competition> {
    const { start_date, userIds } = createCompetitionDto;
    const users = await this.usersRepository.findBy({ id: In(userIds) });

    if (users.length !== 4) {
      throw new NotFoundException(
        'Exactly four users are required to create a competition',
      );
    }

    const competition = this.competitionsRepository.create({
      start_date,
      users,
    });

    return this.competitionsRepository.save(competition);
  }

  async update(
    id: number,
    competition: Partial<Competition>,
  ): Promise<Competition> {
    const existingCompetition = await this.competitionsRepository.preload({
      id: id,
      ...competition,
    });

    if (!existingCompetition) {
      throw new NotFoundException(`Competition with ID ${id} not found`);
    }

    return this.competitionsRepository.save(existingCompetition);
  }

  async remove(id: number): Promise<void> {
    const result = await this.competitionsRepository.delete(id);
    if (result.affected == 0) {
      throw new NotFoundException(`Competition with ID ${id} not found`);
    }
  }

  async createCompetitionFromQueue(userIds: number[]): Promise<Competition> {
    const users = await this.usersRepository.findBy({ id: In(userIds) });
    if (users.length !== 4) {
      throw new NotFoundException('Not enough users to create a competition');
    }

    const competitionData: CreateCompetitionDto = {
      start_date: new Date(),
      userIds: userIds,
    };

    return this.create(competitionData);
  }

  /**
   * 컴피티션을 종료하고 우승자를 선정합니다.
   * @param competitionId 컴피티션 ID
   */
  async endCompetition(competitionId: number): Promise<Competition> {
    const competition = await this.competitionsRepository.findOne({
      where: { id: competitionId },
      relations: ['likes', 'users', 'winner'],
    });

    if (!competition) {
      throw new NotFoundException(
        `Competition with ID ${competitionId} not found`,
      );
    }

    if (competition.end_date) {
      throw new NotFoundException('Competition has already ended.');
    }

    // 각 참가자별 좋아요 수 집계
    const likeCounts: { [userId: number]: number } = {};

    competition.likes.forEach((like) => {
      const userId = like.toUser.id;
      if (likeCounts[userId]) {
        likeCounts[userId]++;
      } else {
        likeCounts[userId] = 1;
      }
    });

    // 가장 많은 좋아요를 받은 유저 찾기
    let winnerId: number | null = null;
    let maxLikes = -1;

    for (const [userId, count] of Object.entries(likeCounts)) {
      if (count > maxLikes) {
        maxLikes = count;
        winnerId = parseInt(userId, 10);
      }
    }

    // 우승자 할당
    if (winnerId) {
      const winner = competition.users.find((user) => user.id === winnerId);
      competition.winner = winner;
    }

    // 종료일자 설정
    competition.end_date = new Date();

    return this.competitionsRepository.save(competition);
  }
}
