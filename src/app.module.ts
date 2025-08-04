import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import {
  createComplexityRule,
  simpleEstimator,
} from 'graphql-query-complexity';
import { AppController } from './app.controller';
import { InternshipModule } from './internship/internship.module';
import { UserModule } from './user/user.module';
import { RequestModule } from './request/request.module';
import { CategoryModule } from './category/category.module';
import { PrismaModule } from './prisma/prisma.module';
import { TagModule } from './tag/tag.module';
import { TimingInterceptor } from './common/interceptors/timing.interceptor';
import { CacheModule } from '@nestjs/cache-manager';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 3600000, // 1 hour
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      introspection: true,
      context: ({ req }) => ({ req }),
      validationRules: [
        createComplexityRule({
          estimators: [
            simpleEstimator({
              defaultComplexity: 1,
            }),
          ],
          maximumComplexity: 1000,
          onComplete: (complexity: number) => {
            console.log('Query Complexity:', complexity);
          },
        }),
      ],
      formatError: (error) => {
        console.log('GraphQL Error:', error);
        return error;
      },
      debug: true,
    }),
    PrismaModule,
    InternshipModule,
    UserModule,
    RequestModule,
    CategoryModule,
    TagModule,
    StorageModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TimingInterceptor,
    },
  ],
})
export class AppModule {}
