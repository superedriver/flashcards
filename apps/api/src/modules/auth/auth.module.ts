import { Module } from '@nestjs/common';
import { PASSWORD_HASHER } from './application/ports/password-hasher.port';
import { TOKEN_GENERATOR } from './application/ports/token-generator.port';
import { TOKEN_HASHER } from './application/ports/token-hasher.port';
import { Argon2PasswordHasher } from './infrastructure/crypto/argon2-password-hasher';
import { NodeTokenGenerator } from './infrastructure/crypto/node-token-generator';
import { Sha256TokenHasher } from './infrastructure/crypto/sha256-token-hasher';

@Module({
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
  ],
  exports: [PASSWORD_HASHER, TOKEN_GENERATOR, TOKEN_HASHER],
})
export class AuthModule {}
