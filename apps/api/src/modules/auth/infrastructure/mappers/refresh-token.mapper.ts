import { RefreshTokenRecord } from '../../application/ports/refresh-token-repository.port';

type PrismaRefreshTokenRecord = {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
};

export function toRefreshTokenRecord(
  token: PrismaRefreshTokenRecord,
): RefreshTokenRecord {
  return {
    id: token.id,
    userId: token.userId,
    tokenHash: token.tokenHash,
    expiresAt: token.expiresAt,
    revokedAt: token.revokedAt,
    createdAt: token.createdAt,
  };
}
