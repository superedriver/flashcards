import { ErrorCodes } from '../../../../common/errors';
import { SafeUser } from '../../../auth/domain/types';
import { CompleteStudyLanguageOnboardingUseCase } from './complete-study-language-onboarding.use-case';

const safeUser: SafeUser = {
  id: 'user-1',
  email: 'user@example.com',
  role: 'USER',
  emailVerifiedAt: null,
  blockedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

const spanish = {
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
  const findById = jest.fn().mockResolvedValue(safeUser);
  const findByCode = jest.fn().mockImplementation((code: string) =>
    Promise.resolve(
      ['es', 'uk'].includes(code)
        ? {
            code,
            englishName: code,
            nativeName: code,
            flag: '🏳️',
            popularSortOrder: null,
          }
        : null,
    ),
  );
  const findByUserId = jest.fn().mockResolvedValue({
    id: 'settings-1',
    userId: 'user-1',
    nativeLanguage: 'en',
    activeTargetLanguage: null,
  });
  const update = jest.fn().mockResolvedValue({});
  const upsert = jest.fn().mockResolvedValue(spanish);
  const myStudyLanguagesExecute = jest.fn().mockResolvedValue([spanish]);

  const useCase = new CompleteStudyLanguageOnboardingUseCase(
    {
      findById,
      findByEmail: jest.fn(),
      create: jest.fn(),
      markEmailVerified: jest.fn(),
      updatePasswordHash: jest.fn(),
      deleteById: jest.fn(),
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

  return { useCase, upsert, update, findByCode };
}

describe('CompleteStudyLanguageOnboardingUseCase', () => {
  it('sets study language, active target, and native language', async () => {
    const { useCase, upsert, update } = createUseCase();

    const result = await useCase.execute({
      currentUserId: 'user-1',
      targetLanguage: 'es',
      nativeLanguage: 'uk',
    });

    expect(upsert).toHaveBeenCalledWith('user-1', 'es');
    expect(update).toHaveBeenCalledWith({
      userId: 'user-1',
      nativeLanguage: 'uk',
      activeTargetLanguage: 'es',
    });
    expect(result.needsStudyLanguageOnboarding).toBe(false);
    expect(result.studyLanguages).toHaveLength(1);
  });

  it('rejects unknown language codes', async () => {
    const { useCase, findByCode } = createUseCase();
    findByCode.mockResolvedValue(null);

    await expect(
      useCase.execute({
        currentUserId: 'user-1',
        targetLanguage: 'xx',
        nativeLanguage: 'uk',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.LANGUAGE_NOT_FOUND });
  });
});
