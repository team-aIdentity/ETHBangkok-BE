import { User } from 'src/user/user.entity';
import {
  Column,
  DataSource,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Like } from 'src/like/like.entity';

@Entity()
export class Competition {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('timestamptz', { nullable: true })
  start_date?: Date;

  @Column('timestamptz', { nullable: true })
  end_date?: Date;

  @ManyToMany(() => User, (user) => user.competitions)
  @JoinTable()
  users: User[];

  @ManyToOne(() => User, (user) => user.winningCompetitions, { nullable: true })
  winner?: User;

  /**
   * 해당 컴피티션에 속한 좋아요
   */
  @OneToMany(() => Like, (like) => like.competition)
  likes: Like[];

  static async createDummyCompetitions(connection: DataSource) {
    const competitionRepo = connection.getRepository(Competition);
    const userRepo = connection.getRepository(User);

    // 이미 데이터가 있는지 확인
    const count = await competitionRepo.count();
    if (count > 0) return;

    // 유저 데이터 가져오기
    const users = await userRepo.find();
    if (users.length === 0) return;

    // 더미 데이터 생성 및 저장
    const competitions = Array(2)
      .fill(null)
      .map((_, i) => {
        const competition = new Competition();
        competition.start_date = new Date();
        const startIdx = i * 4;
        competition.users = users.slice(startIdx, startIdx + 4);
        return competition;
      });

    await competitionRepo.save(competitions);
  }
}
