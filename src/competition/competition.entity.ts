import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Competition {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('timestamptz', { nullable: true })
  start_date?: Date;

  @Column('timestamptz', { nullable: true })
  end_date?: Date;

  @ManyToMany(() => User, (user) => user.competitions)
  users: User[];

  @ManyToOne(() => User, (user) => user.winningCompetitions, { nullable: true })
  winner?: User;
}
