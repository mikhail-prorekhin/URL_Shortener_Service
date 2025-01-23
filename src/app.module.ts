import { Module } from '@nestjs/common';
import { UrlShortenerModule } from './url-shortener/url-shortener.module';

@Module({
  imports: [UrlShortenerModule],
})
export class AppModule {}
