import { User } from 'src/user/user.entity';
import {
  Column,
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

  @OneToMany(() => Like, (like) => like.competition)
  likes: Like[];
}
