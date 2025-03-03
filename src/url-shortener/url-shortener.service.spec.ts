import { Test, TestingModule } from '@nestjs/testing';
import { UrlShortenerService } from './url-shortener.service';
import { PrismaService } from '../prisma/prisma.service';
import { idToShortCode } from '@utils/converters';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

jest.mock('@utils/converters', () => ({
  idToShortCode: jest.fn(),
}));

describe('UrlShortenerService', () => {
  let service: UrlShortenerService;
  let prisma: PrismaService;

  const mockPrismaService = {
    urlmapping: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  } as unknown as PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlShortenerService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UrlShortenerService>(UrlShortenerService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('shortenUrl', () => {
    it('should throw BadRequestException if originalURL is empty', async () => {
      await expect(service.shortenUrl('')).rejects.toThrow(BadRequestException);
    });

    it('should return an existing shortCode if the original URL is already stored', async () => {
      const originalURL = 'https://example.com';
      const shortCode = 'abc123';
      prisma.urlmapping.findUnique = jest.fn().mockResolvedValue({ shortCode });

      const result = await service.shortenUrl(originalURL);

      expect(result).toBe(shortCode);
      expect(prisma.urlmapping.findUnique).toHaveBeenCalledWith({
        where: { originalURL },
      });
    });

    it('should create a new shortCode if the original URL does not exist', async () => {
      const originalURL = 'https://example.com';
      const generatedId = BigInt(123456);
      const shortCode = 'newCode';

      prisma.urlmapping.findUnique = jest.fn().mockResolvedValue(null);
      (idToShortCode as jest.Mock).mockReturnValue(shortCode);
      prisma.urlmapping.create = jest
        .fn()
        .mockResolvedValue({ originalURL, shortCode });

      jest
        .spyOn(service as any, 'generateShortCode')
        .mockImplementation(() => generatedId);

      const result = await service.shortenUrl(originalURL);

      expect(result).toBe(shortCode);
      expect(prisma.urlmapping.create).toHaveBeenCalledWith({
        data: { originalURL, shortCode },
      });
    });

    it('should throw InternalServerErrorException on database error', async () => {
      const originalURL = 'https://example.com';
      prisma.urlmapping.findUnique = jest
        .fn()
        .mockRejectedValue(new Error('Database error'));

      await expect(service.shortenUrl(originalURL)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getOriginalUrl', () => {
    it('should throw BadRequestException if shortCode is empty', async () => {
      await expect(service.getOriginalUrl('')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return originalURL if shortCode exists', async () => {
      const shortCode = 'abc123';
      const originalURL = 'https://example.com';
      prisma.urlmapping.findUnique = jest
        .fn()
        .mockResolvedValue({ originalURL });

      const result = await service.getOriginalUrl(shortCode);

      expect(result).toBe(originalURL);
      expect(prisma.urlmapping.findUnique).toHaveBeenCalledWith({
        where: { shortCode },
      });
    });

    it('should return null if shortCode does not exist', async () => {
      const shortCode = 'abc123';
      prisma.urlmapping.findUnique = jest.fn().mockResolvedValue(null);

      const result = await service.getOriginalUrl(shortCode);

      expect(result).toBeNull();
    });

    it('should throw InternalServerErrorException on database error', async () => {
      const shortCode = 'abc123';
      prisma.urlmapping.findUnique = jest
        .fn()
        .mockRejectedValue(new Error('Database error'));

      await expect(service.getOriginalUrl(shortCode)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('generateShortCode', () => {
    it('should return a unique short code as bigint', () => {
      const result = (service as any).generateShortCode();
      expect(typeof result).toBe('bigint');
    });
  });
});
