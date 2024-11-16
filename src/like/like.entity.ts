import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { User } from 'src/user/user.entity';
import { Competition } from 'src/competition/competition.entity';

@Entity()
@Unique(['fromUser', 'toUser', 'competition'])
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 좋아요를 누른 유저
   */
  @ManyToOne(() => User, (user) => user.likesGiven, {
    eager: true,
    onDelete: 'CASCADE',
  })
  fromUser: User;

  /**
   * 좋아요를 받은 유저
   */
  @ManyToOne(() => User, (user) => user.likesReceived, {
    eager: true,
    onDelete: 'CASCADE',
  })
  toUser: User;

  /**
   * 해당 좋아요가 속한 컴피티션
   */
  @ManyToOne(() => Competition, (competition) => competition.likes, {
    onDelete: 'CASCADE',
  })
  competition: Competition;

  @CreateDateColumn()
  createdAt: Date;
}
