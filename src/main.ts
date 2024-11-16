import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import { DataSource } from 'typeorm';

const reset = async (dataSource: DataSource) => {
  await dataSource.synchronize(true);
  console.log('데이터베이스가 초기화되었습니다.');
};

async function bootstrap() {
  const uploadPath = './uploads/images';
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);

  // await reset(dataSource);

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
