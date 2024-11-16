import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    const userCount = await this.usersRepository.count();
    if (userCount === 0) {
      const defaultUsers = [
        {
          account: 'emma_wilson',
          name: 'Emma Wilson',
          age: 25,
          country: 'United Kingdom',
          mbti: 'ENFJ',
          hobby: 'Photography, Yoga',
          about: 'Passionate photographer and yoga enthusiast',
          profileImage: 'default_female_1.jpeg',
        },
        {
          account: 'carlos_rodriguez',
          name: 'Carlos Rodriguez',
          age: 28,
          country: 'Spain',
          mbti: 'ISTP',
          hobby: 'Soccer, Guitar',
          about: 'Soccer player and music lover',
          profileImage: 'default_male_1.jpeg',
        },
        {
          account: 'yuki_tanaka',
          name: 'Yuki Tanaka',
          age: 23,
          country: 'Japan',
          mbti: 'INTJ',
          hobby: 'Reading, Calligraphy',
          about: 'Book lover and traditional art enthusiast',
          profileImage: 'default_female_2.jpeg',
        },
        {
          account: 'alexander_kim',
          name: 'Alexander Kim',
          age: 30,
          country: 'South Korea',
          mbti: 'ENTP',
          hobby: 'Gaming, Cooking',
          about: 'Professional gamer and amateur chef',
          profileImage: 'default_male_2.jpeg',
        },
        {
          account: 'sophia_chen',
          name: 'Sophia Chen',
          age: 27,
          country: 'Taiwan',
          mbti: 'ISFJ',
          hobby: 'Dancing, Painting',
          about: 'Contemporary dancer and visual artist',
          profileImage: 'default_female_3.jpeg',
        },
        {
          account: 'lucas_mueller',
          name: 'Lucas Mueller',
          age: 32,
          country: 'Germany',
          mbti: 'ESTJ',
          hobby: 'Hiking, Photography',
          about: 'Nature enthusiast and adventure seeker',
          profileImage: 'default_male_3.jpeg',
        },
        {
          account: 'olivia_brown',
          name: 'Olivia Brown',
          age: 24,
          country: 'Australia',
          mbti: 'INFP',
          hobby: 'Writing, Music',
          about: 'Aspiring novelist and piano player',
          profileImage: 'default_female_4.jpeg',
        },
        {
          account: 'marco_rossi',
          name: 'Marco Rossi',
          age: 29,
          country: 'Italy',
          mbti: 'ESTP',
          hobby: 'Cooking, Wine tasting',
          about: 'Food lover and wine connoisseur',
          profileImage: 'default_male_4.jpeg',
        },
        {
          account: 'nina_petrova',
          name: 'Nina Petrova',
          age: 26,
          country: 'Russia',
          mbti: 'ENFP',
          hobby: 'Ice skating, Painting',
          about: 'Former figure skater and art lover',
          profileImage: 'default_female_5.jpeg',
        },
        {
          account: 'david_singh',
          name: 'David Singh',
          age: 31,
          country: 'India',
          mbti: 'ISTJ',
          hobby: 'Cricket, Meditation',
          about: 'Sports enthusiast and mindfulness practitioner',
          profileImage: 'default_male_5.jpeg',
        },
        {
          account: 'lisa_anderson',
          name: 'Lisa Anderson',
          age: 28,
          country: 'Canada',
          mbti: 'ESFJ',
          hobby: 'Skiing, Baking',
          about: 'Winter sports lover and pastry chef',
          profileImage: 'default_female_6.jpeg',
        },
      ];
      await this.usersRepository.save(defaultUsers);
      console.log('Default users added!');
    }
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  findOneByAccount(account: string): Promise<User> {
    return this.usersRepository.findOneBy({ account });
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }

  async update(id: number, user: Partial<User>): Promise<User> {
    const existingUser = await this.usersRepository.preload({
      id: id,
      ...user,
    });
    if (!existingUser) {
      throw new Error(`User with ID ${id} not found`);
    }
    return this.usersRepository.save(existingUser);
  }

  async remove(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new Error(`User with ID ${id} not found`);
    }
  }
}
