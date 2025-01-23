import { Controller, Get, Param, Res } from '@nestjs/common';
import { UrlShortenerService } from './url-shortener.service';
import { Response } from 'express';

@Controller()
export class RedirectController {
  constructor(private readonly urlShortenerService: UrlShortenerService) {}

  @Get(':shortCode')
  async redirect(@Param('shortCode') shortCode: string, @Res() res: Response) {
    const originalUrl =
      await this.urlShortenerService.getOriginalUrl(shortCode);

    if (originalUrl) {
      res.status(301).redirect(originalUrl);
    } else {
      res.status(404).send('URL not found');
    }
  }
}
