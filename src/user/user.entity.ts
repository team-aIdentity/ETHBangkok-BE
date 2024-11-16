import { Competition } from 'src/competition/competition.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  account: string;

  @Column({ length: 100 })
  name: string;

  @Column('int')
  age: number;

  @Column({ length: 100 })
  country: string;

  @Column({ length: 100 })
  mbti: string;

  @Column({ length: 500, nullable: true })
  hobby?: string;

  @Column({ length: 1000, nullable: true })
  about?: string;

  @Column({ length: 255 })
  profileImage: string;

  @ManyToMany(() => Competition, (competition) => competition.users)
  competitions: Competition[];

  @OneToMany(() => Competition, (competition) => competition.winner)
  winningCompetitions: Competition[];
}
