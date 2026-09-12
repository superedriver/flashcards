import { ErrorCodes } from '../../../../common/errors';
import { AuthUser, SafeUser } from '../../domain/types';
import { GetMeUseCase } from './get-me.use-case';

const authUser: AuthUser = {
  id: 'user-1',
  email: 'test@example.com',
  role: 'USER',
};

const safeUser: SafeUser = {
  id: 'user-1',
  email: 'test@example.com',
  role: 'USER',
  emailVerifiedAt: null,
  blockedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

function createUseCase(options?: { user?: SafeUser | null }) {
  const findById = jest
    .fn()
    .mockResolvedValue(options?.user === undefined ? safeUser : options.user);

  const useCase = new GetMeUseCase({
    findById,
    findByEmail: jest.fn(),
    create: jest.fn(),
    markEmailVerified: jest.fn(),
    updatePasswordHash: jest.fn(),
    deleteById: jest.fn(),
  });

  return { useCase, findById };
}

describe('GetMeUseCase', () => {
  it('throws UNAUTHORIZED when user is missing', async () => {
    const { useCase } = createUseCase({ user: null });

    await expect(useCase.execute(authUser)).rejects.toMatchObject({
      code: ErrorCodes.UNAUTHORIZED,
    });
  });

  it('returns the user when not blocked', async () => {
    const { useCase } = createUseCase();

    await expect(useCase.execute(authUser)).resolves.toEqual(safeUser);
  });

  it('returns the user when blockedAt is set', async () => {
    const blockedAt = new Date('2026-01-02T00:00:00.000Z');
    const blockedUser = { ...safeUser, blockedAt };
    const { useCase } = createUseCase({ user: blockedUser });

    const result = await useCase.execute(authUser);

    expect(result).toEqual(blockedUser);
    expect(result.blockedAt).toEqual(blockedAt);
  });
});
