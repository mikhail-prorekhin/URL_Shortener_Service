import { Test, TestingModule } from '@nestjs/testing';
import { UrlShortenerService } from './url-shortener.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { idToShortCode } from '@utils/converters';

jest.mock('@utils/converters');

describe('UrlShortenerService', () => {
  let service: UrlShortenerService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlShortenerService,
        {
          provide: PrismaService,
          useValue: {
            urlmapping: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UrlShortenerService>(UrlShortenerService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('shortenUrl', () => {
    it('should throw BadRequestException if originalURL is empty', async () => {
      await expect(service.shortenUrl('')).rejects.toThrow(BadRequestException);
    });

    it('should return existing shortCode if URL already exists', async () => {
      const mockShortCode = 'mockShortCode';
      jest.spyOn(prisma.urlmapping, 'findUnique').mockResolvedValueOnce({
        id: 1,
        originalURL: 'https://example.com',
        shortCode: mockShortCode,
      });

      const result = await service.shortenUrl('https://example.com');
      expect(result).toBe(mockShortCode);
    });

    it('should generate a new shortCode and save it in the database', async () => {
      const mockTempShortCode = 'tempCode';
      const mockShortCode = 'shortCode123';
      jest.spyOn(crypto, 'randomBytes').mockReturnValue({
        toString: () => mockTempShortCode,
      } as unknown as void);

      (idToShortCode as jest.Mock).mockReturnValue(mockShortCode);

      jest.spyOn(prisma.urlmapping, 'create').mockResolvedValueOnce({
        id: 1,
        originalURL: 'https://example.com',
        shortCode: mockTempShortCode,
      });
      jest.spyOn(prisma.urlmapping, 'update').mockResolvedValueOnce({
        id: 1,
        originalURL: 'https://example.com',
        shortCode: mockShortCode,
      });

      const result = await service.shortenUrl('https://example.com');
      expect(result).toBe(mockShortCode);
      expect(prisma.urlmapping.create).toHaveBeenCalledWith({
        data: {
          originalURL: 'https://example.com',
          shortCode: mockTempShortCode,
        },
      });
      expect(prisma.urlmapping.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { shortCode: mockShortCode },
      });

      expect(1).toBe(1);
    });

    it('should throw InternalServerErrorException on database error', async () => {
      jest
        .spyOn(prisma.urlmapping, 'findUnique')
        .mockRejectedValueOnce(new Error('DB error'));
      await expect(service.shortenUrl('https://example.com')).rejects.toThrow(
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

    it('should return the original URL if the shortCode exists', async () => {
      jest.spyOn(prisma.urlmapping, 'findUnique').mockResolvedValueOnce({
        id: 1,
        originalURL: 'https://example.com',
        shortCode: 'shortCode123',
      });

      const result = await service.getOriginalUrl('shortCode123');
      expect(result).toBe('https://example.com');
    });

    it('should return null if the shortCode does not exist', async () => {
      jest.spyOn(prisma.urlmapping, 'findUnique').mockResolvedValueOnce(null);

      const result = await service.getOriginalUrl('nonExistentCode');
      expect(result).toBeNull();
    });

    it('should throw InternalServerErrorException on database error', async () => {
      jest
        .spyOn(prisma.urlmapping, 'findUnique')
        .mockRejectedValueOnce(new Error('DB error'));

      await expect(service.getOriginalUrl('shortCode123')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
