import { ErrorCodes } from '../../../../common/errors';
import { SafeUser } from '../../../auth/domain/types';
import { DeleteAccountUseCase } from './delete-account.use-case';

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
  const deleteById = jest.fn().mockResolvedValue(undefined);
  const upsertByEmail = jest.fn().mockResolvedValue(undefined);

  const useCase = new DeleteAccountUseCase(
    {
      findById,
      findByEmail: jest.fn(),
      create: jest.fn(),
      markEmailVerified: jest.fn(),
      updatePasswordHash: jest.fn(),
      deleteById,
    },
    {
      upsertByEmail,
      existsByEmail: jest.fn(),
      deleteByEmail: jest.fn(),
    },
  );

  return { useCase, findById, deleteById, upsertByEmail };
}

describe('DeleteAccountUseCase', () => {
  it('calls deleteById for the current user', async () => {
    const { useCase, deleteById, upsertByEmail } = createUseCase();

    await useCase.execute({ userId: 'user-1' });

    expect(deleteById).toHaveBeenCalledWith('user-1');
    expect(upsertByEmail).not.toHaveBeenCalled();
  });

  it('rejects missing user with UNAUTHORIZED and does not delete', async () => {
    const { useCase, deleteById, upsertByEmail } = createUseCase({
      user: null,
    });

    await expect(useCase.execute({ userId: 'missing' })).rejects.toMatchObject({
      code: ErrorCodes.UNAUTHORIZED,
    });
    expect(deleteById).not.toHaveBeenCalled();
    expect(upsertByEmail).not.toHaveBeenCalled();
  });

  it('deletes a blocked user and upserts blocked identity', async () => {
    const blockedUser = {
      ...safeUser,
      blockedAt: new Date('2026-06-01T00:00:00.000Z'),
    };
    const { useCase, deleteById, upsertByEmail } = createUseCase({
      user: blockedUser,
    });

    await useCase.execute({ userId: 'user-1' });

    expect(upsertByEmail).toHaveBeenCalledWith('test@example.com');
    expect(deleteById).toHaveBeenCalledWith('user-1');
  });
});
