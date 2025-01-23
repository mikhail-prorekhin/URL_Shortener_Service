import { Test, TestingModule } from '@nestjs/testing';
import { UrlShortenerResolver } from './url-shortener.resolver';
import { UrlShortenerService } from './url-shortener.service';
import { HOST } from '@common/constants';

describe('UrlShortenerResolver', () => {
  let resolver: UrlShortenerResolver;
  let service: UrlShortenerService;

  const mockUrlShortenerService = {
    shortenUrl: jest.fn(),
    getOriginalUrl: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlShortenerResolver,
        {
          provide: UrlShortenerService,
          useValue: mockUrlShortenerService,
        },
      ],
    }).compile();

    resolver = module.get<UrlShortenerResolver>(UrlShortenerResolver);
    service = module.get<UrlShortenerService>(UrlShortenerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('shortenUrl', () => {
    it('should return a shortened URL', async () => {
      const originalUrl = 'https://example.com';
      const shortUrl = '00XXXXX';

      mockUrlShortenerService.shortenUrl.mockResolvedValue(shortUrl);

      const result = await resolver.shortenUrl(originalUrl);
      expect(result).toBe(HOST + shortUrl);
      expect(service.shortenUrl).toHaveBeenCalledWith(originalUrl);
      expect(service.shortenUrl).toHaveBeenCalledTimes(1);
    });
  });

  describe('getOriginalUrl', () => {
    it('should return the original URL', async () => {
      const shortCode = 'abcd';
      const originalUrl = 'https://example.com';

      mockUrlShortenerService.getOriginalUrl.mockResolvedValue(originalUrl);

      const result = await resolver.getOriginalUrl(shortCode);
      expect(result).toBe(originalUrl);
      expect(service.getOriginalUrl).toHaveBeenCalledWith(shortCode);
      expect(service.getOriginalUrl).toHaveBeenCalledTimes(1);
    });

    it('should return null if no URL is found', async () => {
      const shortCode = 'abcd';

      mockUrlShortenerService.getOriginalUrl.mockResolvedValue(null);

      const result = await resolver.getOriginalUrl(shortCode);
      expect(result).toBeNull();
      expect(service.getOriginalUrl).toHaveBeenCalledWith(shortCode);
      expect(service.getOriginalUrl).toHaveBeenCalledTimes(1);
    });
  });
});
