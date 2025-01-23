import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';
import { idToShortCode } from '@utils/converters';

@Injectable()
export class UrlShortenerService {
  constructor(private readonly prisma: PrismaService) {}

  async shortenUrl(originalURL: string): Promise<string> {
    if (!originalURL) {
      throw new BadRequestException('Original URL cannot be empty.');
    }
    try {
      const existRecord = await this.prisma.urlmapping.findUnique({
        where: { originalURL },
      });
      if (existRecord?.shortCode) {
        return existRecord.shortCode;
      }

      const tempShortCode = this.generateTempShortCode();

      const newRecord = await this.prisma.urlmapping.create({
        data: {
          originalURL,
          shortCode: tempShortCode,
        },
      });
      const shortCode = idToShortCode(newRecord.id);
      await this.prisma.urlmapping.update({
        where: {
          id: newRecord.id,
        },
        data: {
          shortCode,
        },
      });

      return shortCode;
    } catch (error) {
      console.error('Error while shortening URL:', error);
      throw new InternalServerErrorException('Failed to shorten the URL.');
    }
  }

  async getOriginalUrl(shortCode: string): Promise<string | null> {
    if (!shortCode) {
      throw new BadRequestException('Short code cannot be empty.');
    }
    try {
      const existRecord = await this.prisma.urlmapping.findUnique({
        where: { shortCode },
      });
      return existRecord?.originalURL || null;
    } catch (error) {
      console.error('Error while retrieving original URL:', error);
      throw new InternalServerErrorException(
        'Failed to retrieve the original URL.',
      );
    }
  }

  private generateTempShortCode(): string {
    return crypto.randomBytes(3).toString('hex');
  }
}
