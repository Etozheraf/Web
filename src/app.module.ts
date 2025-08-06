import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
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
import { AuthModule } from './auth/auth.module';
import { ConfigService } from '@nestjs/config';
import { AuthModuleConfig } from './auth/config.interface';
import { AuthGuard } from './auth/guards/auth.guard';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (
        configService: ConfigService,
      ): AuthModuleConfig => ({
        connectionURI: configService.get<string>('SUPERTOKENS_CONNECTION_URI') || '',
        apiKey: configService.get<string>('SUPERTOKENS_API_KEY'),
      }),
      inject: [ConfigService],
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
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    }
  ],
})
export class AppModule {}
