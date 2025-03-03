import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { idToShortCode } from '@utils/converters';
import { CONTAINER_ID, NODE_ID, START_DATE } from '@common/constants';

@Injectable()
export class UrlShortenerService {
  countPerTick = 0;
  lastTick = 0;

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

      const shortCode = idToShortCode(this.generateShortCode());

      await this.prisma.urlmapping.create({
        data: {
          originalURL,
          shortCode: shortCode,
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

  private generateShortCode(): bigint {
    const currentDate = new Date().valueOf();
    if (this.lastTick != currentDate) {
      this.countPerTick = 0;
      this.lastTick = currentDate;
    } else {
      this.countPerTick++;
    }
    const differenceInMilliseconds = BigInt(currentDate - START_DATE);

    return (
      (((((differenceInMilliseconds << 4n) + BigInt(NODE_ID)) << 3n) +
        BigInt(CONTAINER_ID)) <<
        8n) +
      BigInt(this.countPerTick)
    );
  }
}
