import { DeckLanguageWarning } from '../types/deck-language-warning.type';

export class DeckLanguageValidationService {
  getLanguagePairWarnings(
    targetLanguage: string,
    sourceLanguage: string,
  ): DeckLanguageWarning[] {
    if (targetLanguage !== sourceLanguage) {
      return [];
    }

    return [
      {
        code: 'SOURCE_TARGET_SAME',
        message:
          'Target and source language are the same. This is allowed but atypical for translation decks.',
      },
    ];
  }
}
