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

  const useCase = new DeleteAccountUseCase({
    findById,
    findByEmail: jest.fn(),
    create: jest.fn(),
    markEmailVerified: jest.fn(),
    updatePasswordHash: jest.fn(),
    deleteById,
  });

  return { useCase, findById, deleteById };
}

describe('DeleteAccountUseCase', () => {
  it('calls deleteById for the current user', async () => {
    const { useCase, deleteById } = createUseCase();

    await useCase.execute({ userId: 'user-1' });

    expect(deleteById).toHaveBeenCalledWith('user-1');
  });

  it('rejects missing user with UNAUTHORIZED and does not delete', async () => {
    const { useCase, deleteById } = createUseCase({ user: null });

    await expect(useCase.execute({ userId: 'missing' })).rejects.toMatchObject({
      code: ErrorCodes.UNAUTHORIZED,
    });
    expect(deleteById).not.toHaveBeenCalled();
  });

  it('rejects blocked user with USER_BLOCKED and does not delete', async () => {
    const { useCase, deleteById } = createUseCase({
      user: { ...safeUser, blockedAt: new Date('2026-06-01T00:00:00.000Z') },
    });

    await expect(useCase.execute({ userId: 'user-1' })).rejects.toMatchObject({
      code: ErrorCodes.USER_BLOCKED,
    });
    expect(deleteById).not.toHaveBeenCalled();
  });
});
