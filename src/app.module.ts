import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { createComplexityRule, simpleEstimator } from 'graphql-query-complexity';
import { AppController } from './app.controller';
import { InternshipModule } from './internship/internship.module';
import { UserModule } from './user/user.module';
import { RequestModule } from './request/request.module';
import { CategoryModule } from './category/category.module';
import { PrismaModule } from './prisma/prisma.module';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [
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
  ],
  controllers: [AppController],
})
export class AppModule {}
