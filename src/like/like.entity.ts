import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/user/user.entity';
import { Competition } from 'src/competition/competition.entity';

@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.likes, { eager: true })
  user: User;

  @ManyToOne(() => Competition, (competition) => competition.likes, {
    eager: true,
  })
  competition: Competition;

  @CreateDateColumn()
  createdAt: Date;
}
