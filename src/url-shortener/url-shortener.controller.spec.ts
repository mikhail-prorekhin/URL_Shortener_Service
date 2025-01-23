import { Test, TestingModule } from '@nestjs/testing';
import { RedirectController } from './url-shortener.controller';
import { UrlShortenerService } from './url-shortener.service';
import { Response } from 'express';

describe('RedirectController', () => {
  let controller: RedirectController;
  let service: UrlShortenerService;

  const mockUrlShortenerService = {
    getOriginalUrl: jest.fn(),
  };

  const mockResponse = () => {
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      redirect: jest.fn(),
      send: jest.fn(),
    };
    return res as Response;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RedirectController],
      providers: [
        {
          provide: UrlShortenerService,
          useValue: mockUrlShortenerService,
        },
      ],
    }).compile();

    controller = module.get<RedirectController>(RedirectController);
    service = module.get<UrlShortenerService>(UrlShortenerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('redirect', () => {
    it('should redirect to the original URL if found', async () => {
      const shortCode = 'abcd';
      const originalUrl = 'https://example.com';
      const res = mockResponse();

      mockUrlShortenerService.getOriginalUrl.mockResolvedValue(originalUrl);

      await controller.redirect(shortCode, res);

      expect(service.getOriginalUrl).toHaveBeenCalledWith(shortCode);
      expect(service.getOriginalUrl).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(301);
      expect(res.redirect).toHaveBeenCalledWith(originalUrl);
    });

    it('should return 404 if the URL is not found', async () => {
      const shortCode = 'abcd';
      const res = mockResponse();

      mockUrlShortenerService.getOriginalUrl.mockResolvedValue(null);

      await controller.redirect(shortCode, res);

      expect(service.getOriginalUrl).toHaveBeenCalledWith(shortCode);
      expect(service.getOriginalUrl).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('URL not found');
    });
  });
});
