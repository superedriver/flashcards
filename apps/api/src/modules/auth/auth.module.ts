import { Module } from '@nestjs/common';
import { PASSWORD_HASHER } from './application/ports/password-hasher.port';
import { Argon2PasswordHasher } from './infrastructure/crypto/argon2-password-hasher';

@Module({
  providers: [
    {
      provide: PASSWORD_HASHER,
      useClass: Argon2PasswordHasher,
    },
  ],
  exports: [PASSWORD_HASHER],
})
export class AuthModule {}
