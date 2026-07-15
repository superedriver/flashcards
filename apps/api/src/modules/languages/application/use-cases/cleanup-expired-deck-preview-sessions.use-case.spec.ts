import { CleanupExpiredDeckPreviewSessionsUseCase } from '../../application/use-cases/cleanup-expired-deck-preview-sessions.use-case';

function createUseCase(deletedCount = 0) {
  const deleteExpiredSessions = jest.fn().mockResolvedValue(deletedCount);

  const useCase = new CleanupExpiredDeckPreviewSessionsUseCase({
    create: jest.fn(),
    findById: jest.fn(),
    findActiveByUserId: jest.fn(),
    updateCards: jest.fn(),
    updateStatus: jest.fn(),
    delete: jest.fn(),
    deleteExpiredSessions,
  });

  return { useCase, deleteExpiredSessions };
}

describe('CleanupExpiredDeckPreviewSessionsUseCase', () => {
  it('deletes expired sessions via repository', async () => {
    const now = new Date('2026-01-15T12:00:00.000Z');
    const { useCase, deleteExpiredSessions } = createUseCase(3);

    await expect(useCase.execute({ now })).resolves.toEqual({
      deletedCount: 3,
    });

    expect(deleteExpiredSessions).toHaveBeenCalledWith(now);
  });
});
