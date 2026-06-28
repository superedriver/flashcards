import { toRefreshTokenRecord } from './refresh-token.mapper';

const prismaRefreshToken = {
  id: 'refresh-1',
  userId: 'user-1',
  tokenHash: 'token-hash',
  expiresAt: new Date('2026-12-31T00:00:00.000Z'),
  revokedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
};

describe('refresh-token.mapper', () => {
  it('toRefreshTokenRecord maps refresh token fields correctly', () => {
    expect(toRefreshTokenRecord(prismaRefreshToken)).toEqual({
      id: 'refresh-1',
      userId: 'user-1',
      tokenHash: 'token-hash',
      expiresAt: prismaRefreshToken.expiresAt,
      revokedAt: null,
      createdAt: prismaRefreshToken.createdAt,
    });
  });
});
