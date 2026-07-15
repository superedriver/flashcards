import {
  toDeckPreviewSession,
  toDeckPreviewSessionCardsJson,
} from './deck-preview-session.mapper';

describe('deck-preview-session.mapper', () => {
  const prismaSession = {
    id: 'session-1',
    userId: 'user-1',
    type: 'COPY_PUBLIC',
    status: 'GENERATING',
    sourceDeckId: 'deck-1',
    targetLanguage: 'es',
    chosenSourceLanguage: 'uk',
    cards: [
      {
        sourceCardId: 'card-1',
        front: 'hello',
        back: 'hola',
        example: 'Hello world',
      },
    ],
    expiresAt: new Date('2026-01-16T12:00:00.000Z'),
    createdAt: new Date('2026-01-15T12:00:00.000Z'),
    updatedAt: new Date('2026-01-15T12:00:00.000Z'),
  };

  it('toDeckPreviewSession maps cards JSON', () => {
    expect(toDeckPreviewSession(prismaSession)).toEqual({
      id: 'session-1',
      userId: 'user-1',
      type: 'COPY_PUBLIC',
      status: 'GENERATING',
      sourceDeckId: 'deck-1',
      targetLanguage: 'es',
      chosenSourceLanguage: 'uk',
      cards: [
        {
          sourceCardId: 'card-1',
          front: 'hello',
          back: 'hola',
          example: 'Hello world',
        },
      ],
      expiresAt: prismaSession.expiresAt,
      createdAt: prismaSession.createdAt,
      updatedAt: prismaSession.updatedAt,
    });
  });

  it('toDeckPreviewSessionCardsJson omits empty optional fields', () => {
    expect(
      toDeckPreviewSessionCardsJson([
        {
          front: 'hello',
          back: 'hola',
          example: null,
        },
      ]),
    ).toEqual([
      {
        front: 'hello',
        back: 'hola',
        example: null,
      },
    ]);
  });
});
