import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UrlShortenerService } from './url-shortener.service';
import { HOST } from '@common/constants';

@Resolver()
export class UrlShortenerResolver {
  constructor(private readonly urlShortenerService: UrlShortenerService) {}

  @Mutation(() => String)
  async shortenUrl(@Args('originalUrl') originalUrl: string): Promise<string> {
    const code = await this.urlShortenerService.shortenUrl(originalUrl);
    return HOST + code;
  }

  @Query(() => String, { nullable: true })
  async getOriginalUrl(
    @Args('shortCode') shortCode: string,
  ): Promise<string | null> {
    return await this.urlShortenerService.getOriginalUrl(shortCode);
  }
}
