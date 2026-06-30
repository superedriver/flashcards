import { ErrorCodes } from '../../../../common/errors';
import { SafeUser } from '../../../auth/domain/types';
import { Deck } from '../../domain/types';
import { CreateDeckInput } from '../ports/deck-repository.port';
import { CreateDeckUseCase } from './create-deck.use-case';

const safeUser: SafeUser = {
  id: 'owner-1',
  email: 'owner@example.com',
  role: 'USER',
  emailVerifiedAt: null,
  blockedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

const deck: Deck = {
  id: 'deck-1',
  ownerId: 'owner-1',
  title: 'Spanish Basics',
  description: null,
  visibility: 'PRIVATE',
  moderationStatus: 'NONE',
  isOfficial: false,
  sourceDeckId: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  deletedAt: null,
};

function createUseCase(options?: { user?: SafeUser | null }) {
  const findById = jest
    .fn()
    .mockResolvedValue(options?.user === undefined ? safeUser : options.user);
  const create = jest
    .fn<Promise<Deck>, [CreateDeckInput]>()
    .mockImplementation((input) =>
      Promise.resolve({
        ...deck,
        ownerId: input.ownerId,
        title: input.title,
        description: input.description ?? null,
      }),
    );

  const useCase = new CreateDeckUseCase(
    {
      findById,
      findByEmail: jest.fn(),
      create: jest.fn(),
      markEmailVerified: jest.fn(),
      updatePasswordHash: jest.fn(),
    },
    {
      create,
      findById: jest.fn(),
      findByOwner: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
    },
  );

  return { useCase, create };
}

describe('CreateDeckUseCase', () => {
  it('rejects missing user with UNAUTHORIZED', async () => {
    const { useCase } = createUseCase({ user: null });

    await expect(
      useCase.execute({ currentUserId: 'missing', title: 'Deck' }),
    ).rejects.toMatchObject({ code: ErrorCodes.UNAUTHORIZED });
  });

  it('rejects blocked user with USER_BLOCKED', async () => {
    const { useCase } = createUseCase({
      user: { ...safeUser, blockedAt: new Date('2026-06-01T00:00:00.000Z') },
    });

    await expect(
      useCase.execute({ currentUserId: 'owner-1', title: 'Deck' }),
    ).rejects.toMatchObject({ code: ErrorCodes.USER_BLOCKED });
  });

  it('trims title and creates deck for owner', async () => {
    const { useCase, create } = createUseCase();

    const result = await useCase.execute({
      currentUserId: 'owner-1',
      title: '  Spanish Basics  ',
    });

    expect(create).toHaveBeenCalledWith({
      ownerId: 'owner-1',
      title: 'Spanish Basics',
      description: undefined,
    });
    expect(result.title).toBe('Spanish Basics');
  });

  it('rejects empty title after trim with VALIDATION_ERROR', async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({ currentUserId: 'owner-1', title: '   ' }),
    ).rejects.toMatchObject({ code: ErrorCodes.VALIDATION_ERROR });
  });

  it('rejects title longer than 120 with VALIDATION_ERROR', async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({ currentUserId: 'owner-1', title: 'a'.repeat(121) }),
    ).rejects.toMatchObject({ code: ErrorCodes.VALIDATION_ERROR });
  });

  it('trims description and passes null when empty', async () => {
    const { useCase, create } = createUseCase();

    await useCase.execute({
      currentUserId: 'owner-1',
      title: 'Deck',
      description: '   ',
    });

    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({ description: null }),
    );
  });

  it('rejects description longer than 1000 with VALIDATION_ERROR', async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({
        currentUserId: 'owner-1',
        title: 'Deck',
        description: 'a'.repeat(1001),
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.VALIDATION_ERROR });
  });

  it('creates deck with ownerId = currentUserId', async () => {
    const { useCase, create } = createUseCase();

    await useCase.execute({ currentUserId: 'owner-1', title: 'Deck' });

    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({ ownerId: 'owner-1' }),
    );
  });
});
