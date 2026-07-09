import { AiResolver } from './ai.resolver';

describe('AiResolver', () => {
  it('passes locale from GraphQL input to generateCardExamples use case', async () => {
    const execute = jest.fn().mockResolvedValue({
      cardId: 'card-1',
      examples: [{ text: 'example' }],
    });
    const resolver = new AiResolver(
      { execute } as never,
      { execute: jest.fn() } as never,
    );

    await resolver.generateCardExamples(
      { id: 'user-1', email: 'user@example.com', role: 'USER' },
      { cardId: 'card-1', locale: 'uk' },
    );

    expect(execute).toHaveBeenCalledWith({
      currentUser: { id: 'user-1', email: 'user@example.com', role: 'USER' },
      cardId: 'card-1',
      locale: 'uk',
    });
  });
});
