import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { CompetitionModule } from './competition/competition.module';
import { UploadModule } from './upload/upload.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Competition } from './competition/competition.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'aidenteti1234!',
      database: 'wantti',
      entities: [User, Competition],
      synchronize: true,
    }),
    UserModule,
    CompetitionModule,
    UploadModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads', 'images'),
      serveRoot: '/image',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
