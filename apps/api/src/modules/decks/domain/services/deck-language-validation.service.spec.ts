import { DeckLanguageValidationService } from './deck-language-validation.service';

describe('DeckLanguageValidationService', () => {
  const service = new DeckLanguageValidationService();

  it('returns SOURCE_TARGET_SAME warning when languages match', () => {
    expect(service.getLanguagePairWarnings('en', 'en')).toEqual([
      {
        code: 'SOURCE_TARGET_SAME',
        message:
          'Target and source language are the same. This is allowed but atypical for translation decks.',
      },
    ]);
  });

  it('returns no warnings when languages differ', () => {
    expect(service.getLanguagePairWarnings('es', 'en')).toEqual([]);
  });
});
