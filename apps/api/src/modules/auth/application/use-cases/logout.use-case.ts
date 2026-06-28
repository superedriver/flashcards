import { Inject, Injectable } from '@nestjs/common';
import {
  REFRESH_TOKEN_REPOSITORY,
  RefreshTokenRepositoryPort,
} from '../ports/refresh-token-repository.port';
import { TOKEN_HASHER, TokenHasherPort } from '../ports/token-hasher.port';

export type LogoutInput = {
  refreshToken: string;
};

export type LogoutResult = {
  success: boolean;
};

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(TOKEN_HASHER)
    private readonly tokenHasher: TokenHasherPort,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: RefreshTokenRepositoryPort,
  ) {}

  async execute(input: LogoutInput): Promise<LogoutResult> {
    const tokenHash = this.tokenHasher.hash(input.refreshToken);
    const activeToken =
      await this.refreshTokenRepository.findActiveByHash(tokenHash);

    if (activeToken) {
      await this.refreshTokenRepository.revokeById(activeToken.id);
    }

    return { success: true };
  }
}
