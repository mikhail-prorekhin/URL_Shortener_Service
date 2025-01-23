import { Module } from '@nestjs/common';
import { UrlShortenerService } from './url-shortener.service';
import { UrlShortenerResolver } from './url-shortener.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedirectController } from './url-shortener.controller';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { VERSION } from '@common/constants';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      path: `/api/${VERSION}/shortener`,
    }),
  ],
  providers: [UrlShortenerService, UrlShortenerResolver, PrismaService],
  controllers: [RedirectController],
})
export class UrlShortenerModule {}
