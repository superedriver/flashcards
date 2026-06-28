import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from '../email/email.module';
import { ACCESS_TOKEN_SERVICE } from './application/ports/access-token-service.port';
import { PASSWORD_HASHER } from './application/ports/password-hasher.port';
import { TOKEN_GENERATOR } from './application/ports/token-generator.port';
import { TOKEN_HASHER } from './application/ports/token-hasher.port';
import { REFRESH_TOKEN_REPOSITORY } from './application/ports/refresh-token-repository.port';
import { EMAIL_VERIFICATION_TOKEN_REPOSITORY } from './application/ports/email-verification-token-repository.port';
import { PASSWORD_RESET_TOKEN_REPOSITORY } from './application/ports/password-reset-token-repository.port';
import { USER_REPOSITORY } from './application/ports/user-repository.port';
import { Argon2PasswordHasher } from './infrastructure/crypto/argon2-password-hasher';
import { NodeTokenGenerator } from './infrastructure/crypto/node-token-generator';
import { Sha256TokenHasher } from './infrastructure/crypto/sha256-token-hasher';
import { JwtAccessTokenService } from './infrastructure/jwt/jwt-access-token.service';
import { PrismaUserRepository } from './infrastructure/persistence/prisma-user.repository';
import { PrismaRefreshTokenRepository } from './infrastructure/persistence/prisma-refresh-token.repository';
import { PrismaEmailVerificationTokenRepository } from './infrastructure/persistence/prisma-email-verification-token.repository';
import { PrismaPasswordResetTokenRepository } from './infrastructure/persistence/prisma-password-reset-token.repository';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { GetMeUseCase } from './application/use-cases/get-me.use-case';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.use-case';
import { LogoutUseCase } from './application/use-cases/logout.use-case';
import { CreateEmailVerificationTokenUseCase } from './application/use-cases/create-email-verification-token.use-case';
import { VerifyEmailUseCase } from './application/use-cases/verify-email.use-case';
import { ResendVerificationEmailUseCase } from './application/use-cases/resend-verification-email.use-case';
import { RequestPasswordResetUseCase } from './application/use-cases/request-password-reset.use-case';
import { AuthResolver } from './presentation/graphql/resolvers/auth.resolver';
import { GqlAuthGuard } from './presentation/graphql/guards/gql-auth.guard';

@Module({
  imports: [
    EmailModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('auth.jwtAccessSecret'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  providers: [
    {
      provide: PASSWORD_HASHER,
      useClass: Argon2PasswordHasher,
    },
    {
      provide: TOKEN_GENERATOR,
      useClass: NodeTokenGenerator,
    },
    {
      provide: TOKEN_HASHER,
      useClass: Sha256TokenHasher,
    },
    {
      provide: ACCESS_TOKEN_SERVICE,
      useClass: JwtAccessTokenService,
    },
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    {
      provide: REFRESH_TOKEN_REPOSITORY,
      useClass: PrismaRefreshTokenRepository,
    },
    {
      provide: EMAIL_VERIFICATION_TOKEN_REPOSITORY,
      useClass: PrismaEmailVerificationTokenRepository,
    },
    {
      provide: PASSWORD_RESET_TOKEN_REPOSITORY,
      useClass: PrismaPasswordResetTokenRepository,
    },
    RegisterUserUseCase,
    LoginUseCase,
    GetMeUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    CreateEmailVerificationTokenUseCase,
    VerifyEmailUseCase,
    ResendVerificationEmailUseCase,
    RequestPasswordResetUseCase,
    AuthResolver,
    GqlAuthGuard,
  ],
  exports: [
    PASSWORD_HASHER,
    TOKEN_GENERATOR,
    TOKEN_HASHER,
    ACCESS_TOKEN_SERVICE,
    USER_REPOSITORY,
    REFRESH_TOKEN_REPOSITORY,
    EMAIL_VERIFICATION_TOKEN_REPOSITORY,
    PASSWORD_RESET_TOKEN_REPOSITORY,
    RegisterUserUseCase,
    LoginUseCase,
    GetMeUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    CreateEmailVerificationTokenUseCase,
    VerifyEmailUseCase,
    ResendVerificationEmailUseCase,
    RequestPasswordResetUseCase,
    GqlAuthGuard,
  ],
})
export class AuthModule {}
