import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from '@common/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);
}

bootstrap()
  .then(() => {
    console.log('App is running on %s port', PORT);
  })
  .catch((err) => {
    console.error('Error during bootstrap:', err);
  });
