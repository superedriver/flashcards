import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { ThrottlerModule } from '@nestjs/throttler';
import { GqlThrottlerGuard } from './common/guards/gql-throttler.guard';
import depthLimit from 'graphql-depth-limit';

const GRAPHQL_MAX_DEPTH = 7;
import {
  aiConfig,
  appConfig,
  authConfig,
  databaseConfig,
  emailConfig,
  pushConfig,
} from './config';
import { formatGraphQLError } from './common/errors';
import { HstsMiddleware } from './common/http/hsts.middleware';
import { RootResolver } from './presentation/graphql/root.resolver';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { AccountModule } from './modules/account/account.module';
import { DecksModule } from './modules/decks/decks.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { CsvImportModule } from './modules/csv-import/csv-import.module';
import { GroupsModule } from './modules/groups/groups.module';
import { LanguagesModule } from './modules/languages/languages.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AdminModule } from './modules/admin/admin.module';
import { AiModule } from './modules/ai/ai.module';
import { EmailModule } from './modules/email/email.module';
import { PrismaModule } from './infrastructure/prisma';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        authConfig,
        databaseConfig,
        emailConfig,
        aiConfig,
        pushConfig,
      ],
    }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }]),
    PrismaModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      playground: process.env.NODE_ENV !== 'production',
      formatError: formatGraphQLError,
      validationRules: [depthLimit(GRAPHQL_MAX_DEPTH)],
      context: ({ req, res }: { req: unknown; res: unknown }) => ({ req, res }),
    }),
    HealthModule,
    AuthModule,
    AccountModule,
    DecksModule,
    LessonsModule,
    CsvImportModule,
    GroupsModule,
    LanguagesModule,
    NotificationsModule,
    AdminModule,
    AiModule,
    EmailModule,
  ],
  controllers: [],
  providers: [
    RootResolver,
    HstsMiddleware,
    { provide: APP_GUARD, useClass: GqlThrottlerGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(HstsMiddleware).forRoutes('*');
  }
}
