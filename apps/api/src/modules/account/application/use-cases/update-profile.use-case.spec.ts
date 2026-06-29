import { ErrorCodes } from '../../../../common/errors';
import { SafeUser } from '../../../auth/domain/types';
import { UserProfile } from '../../domain/types';
import { UpdateUserProfileInput } from '../ports/user-profile-repository.port';
import { UpdateProfileUseCase } from './update-profile.use-case';

const safeUser: SafeUser = {
  id: 'user-1',
  email: 'test@example.com',
  role: 'USER',
  emailVerifiedAt: null,
  blockedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

const profile: UserProfile = {
  id: 'profile-1',
  userId: 'user-1',
  displayName: 'Old Name',
  avatarUrl: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

function createUseCase(options?: {
  user?: SafeUser | null;
  profile?: UserProfile | null;
}) {
  const findById = jest
    .fn()
    .mockResolvedValue(options?.user === undefined ? safeUser : options.user);
  const findByUserId = jest
    .fn()
    .mockResolvedValue(
      options?.profile === undefined ? profile : options.profile,
    );
  const createForUser = jest.fn().mockResolvedValue(profile);
  const update = jest
    .fn<Promise<UserProfile>, [UpdateUserProfileInput]>()
    .mockImplementation((input) =>
      Promise.resolve({
        ...profile,
        displayName:
          input.displayName !== undefined
            ? input.displayName
            : profile.displayName,
        avatarUrl:
          input.avatarUrl !== undefined ? input.avatarUrl : profile.avatarUrl,
      }),
    );

  const useCase = new UpdateProfileUseCase(
    {
      findById,
      findByEmail: jest.fn(),
      create: jest.fn(),
      markEmailVerified: jest.fn(),
      updatePasswordHash: jest.fn(),
    },
    {
      findByUserId,
      createForUser,
      update,
    },
  );

  return { useCase, findByUserId, createForUser, update };
}

describe('UpdateProfileUseCase', () => {
  it('rejects missing user with UNAUTHORIZED', async () => {
    const { useCase } = createUseCase({ user: null });

    await expect(
      useCase.execute({ userId: 'missing', displayName: 'Name' }),
    ).rejects.toMatchObject({
      code: ErrorCodes.UNAUTHORIZED,
    });
  });

  it('rejects blocked user with USER_BLOCKED', async () => {
    const { useCase } = createUseCase({
      user: { ...safeUser, blockedAt: new Date() },
    });

    await expect(
      useCase.execute({ userId: 'user-1', displayName: 'Name' }),
    ).rejects.toMatchObject({
      code: ErrorCodes.USER_BLOCKED,
    });
  });

  it('trims displayName and updates profile', async () => {
    const { useCase, update } = createUseCase();

    const result = await useCase.execute({
      userId: 'user-1',
      displayName: '  Maks  ',
    });

    expect(update).toHaveBeenCalledWith({
      userId: 'user-1',
      displayName: 'Maks',
    });
    expect(result.displayName).toBe('Maks');
  });

  it('empty displayName after trim becomes null', async () => {
    const { useCase, update } = createUseCase();

    await useCase.execute({
      userId: 'user-1',
      displayName: '   ',
    });

    expect(update).toHaveBeenCalledWith({
      userId: 'user-1',
      displayName: null,
    });
  });

  it('rejects displayName longer than 80 with VALIDATION_ERROR', async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({
        userId: 'user-1',
        displayName: 'a'.repeat(81),
      }),
    ).rejects.toMatchObject({
      code: ErrorCodes.VALIDATION_ERROR,
    });
  });

  it('updates avatarUrl with valid http/https URL', async () => {
    const { useCase, update } = createUseCase();

    const result = await useCase.execute({
      userId: 'user-1',
      avatarUrl: ' https://example.com/avatar.png ',
    });

    expect(update).toHaveBeenCalledWith({
      userId: 'user-1',
      avatarUrl: 'https://example.com/avatar.png',
    });
    expect(result.avatarUrl).toBe('https://example.com/avatar.png');
  });

  it('rejects invalid avatarUrl with VALIDATION_ERROR', async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({
        userId: 'user-1',
        avatarUrl: 'not-a-url',
      }),
    ).rejects.toMatchObject({
      code: ErrorCodes.VALIDATION_ERROR,
    });
  });

  it('rejects avatarUrl longer than 500 with VALIDATION_ERROR', async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({
        userId: 'user-1',
        avatarUrl: `https://example.com/${'a'.repeat(500)}`,
      }),
    ).rejects.toMatchObject({
      code: ErrorCodes.VALIDATION_ERROR,
    });
  });

  it('creates profile when missing, then updates', async () => {
    const { useCase, createForUser, update } = createUseCase({
      profile: null,
    });

    await useCase.execute({
      userId: 'user-1',
      displayName: 'Maks',
    });

    expect(createForUser).toHaveBeenCalledWith('user-1');
    expect(update).toHaveBeenCalledWith({
      userId: 'user-1',
      displayName: 'Maks',
    });
  });

  it('updates only provided fields', async () => {
    const { useCase, update } = createUseCase();

    await useCase.execute({
      userId: 'user-1',
      displayName: 'Maks',
    });

    expect(update).toHaveBeenCalledWith({
      userId: 'user-1',
      displayName: 'Maks',
    });
    const [callInput] = update.mock.calls[0] as [UpdateUserProfileInput];
    expect(callInput).not.toHaveProperty('avatarUrl');
  });
});
