import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import {
  aiConfig,
  appConfig,
  authConfig,
  databaseConfig,
  emailConfig,
  pushConfig,
} from './config';
import { RootResolver } from './presentation/graphql/root.resolver';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { AccountModule } from './modules/account/account.module';
import { DecksModule } from './modules/decks/decks.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { CsvImportModule } from './modules/csv-import/csv-import.module';
import { GroupsModule } from './modules/groups/groups.module';
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
    PrismaModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      playground: process.env.NODE_ENV !== 'production',
    }),
    HealthModule,
    AuthModule,
    AccountModule,
    DecksModule,
    LessonsModule,
    CsvImportModule,
    GroupsModule,
    NotificationsModule,
    AdminModule,
    AiModule,
    EmailModule,
  ],
  controllers: [],
  providers: [RootResolver],
})
export class AppModule {}
