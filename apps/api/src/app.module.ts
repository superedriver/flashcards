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
} from './config';
import { RootResolver } from './presentation/graphql/root.resolver';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { AccountModule } from './modules/account/account.module';
import { EmailModule } from './modules/email/email.module';
import { PrismaModule } from './infrastructure/prisma';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, databaseConfig, emailConfig, aiConfig],
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
    EmailModule,
  ],
  controllers: [],
  providers: [RootResolver],
})
export class AppModule {}
