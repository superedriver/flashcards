import { UserStudyLanguageListItem } from '../../domain/types';
import { SetActiveTargetLanguageUseCase } from './set-active-target-language.use-case';

const spanish: UserStudyLanguageListItem = {
  id: 'study-1',
  userId: 'user-1',
  languageCode: 'es',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  isActive: true,
  language: {
    code: 'es',
    englishName: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    popularSortOrder: 2,
  },
};

function createUseCase() {
  const findById = jest.fn().mockResolvedValue({
    id: 'user-1',
    blockedAt: null,
  });
  const findByCode = jest.fn().mockResolvedValue(spanish.language);
  const findByUserId = jest.fn().mockResolvedValue({
    id: 'settings-1',
    userId: 'user-1',
    activeTargetLanguage: null,
  });
  const update = jest.fn().mockResolvedValue({
    id: 'settings-1',
    userId: 'user-1',
    activeTargetLanguage: 'es',
  });
  const upsert = jest.fn().mockResolvedValue({
    id: 'study-1',
    userId: 'user-1',
    languageCode: 'es',
    createdAt: spanish.createdAt,
    language: spanish.language,
  });
  const myStudyLanguagesExecute = jest.fn().mockResolvedValue([spanish]);

  const useCase = new SetActiveTargetLanguageUseCase(
    {
      findById,
      findByEmail: jest.fn(),
      create: jest.fn(),
      markEmailVerified: jest.fn(),
      updatePasswordHash: jest.fn(),
    },
    {
      findAll: jest.fn(),
      findByCode,
    },
    {
      findByUserId,
      createForUser: jest.fn(),
      update,
      findWithNotificationsEnabled: jest.fn(),
    },
    {
      findByUserId: jest.fn(),
      findByUserIdAndCode: jest.fn(),
      upsert,
      delete: jest.fn(),
    },
    {
      execute: myStudyLanguagesExecute,
    } as never,
  );

  return {
    useCase,
    upsert,
    update,
    myStudyLanguagesExecute,
    findByCode,
  };
}

describe('SetActiveTargetLanguageUseCase', () => {
  it('upserts study language and updates activeTargetLanguage', async () => {
    const { useCase, upsert, update, myStudyLanguagesExecute } =
      createUseCase();

    await expect(
      useCase.execute({ currentUserId: 'user-1', languageCode: 'es' }),
    ).resolves.toEqual([spanish]);

    expect(upsert).toHaveBeenCalledWith('user-1', 'es');
    expect(update).toHaveBeenCalledWith({
      userId: 'user-1',
      activeTargetLanguage: 'es',
    });
    expect(myStudyLanguagesExecute).toHaveBeenCalledWith({
      currentUserId: 'user-1',
    });
  });
});
