import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Competition } from 'src/competition/competition.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Competition])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
