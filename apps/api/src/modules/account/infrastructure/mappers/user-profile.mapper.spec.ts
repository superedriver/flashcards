import { toUserProfile } from './user-profile.mapper';

const prismaProfile = {
  id: 'profile-1',
  userId: 'user-1',
  displayName: 'Maks',
  avatarUrl: 'https://example.com/avatar.png',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-06-01T00:00:00.000Z'),
};

describe('user-profile.mapper', () => {
  it('toUserProfile maps all fields from Prisma record', () => {
    expect(toUserProfile(prismaProfile)).toEqual({
      id: 'profile-1',
      userId: 'user-1',
      displayName: 'Maks',
      avatarUrl: 'https://example.com/avatar.png',
      createdAt: prismaProfile.createdAt,
      updatedAt: prismaProfile.updatedAt,
    });
  });
});
