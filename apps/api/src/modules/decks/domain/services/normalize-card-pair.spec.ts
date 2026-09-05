import { cardPairsMatch, normalizeCardPair } from './normalize-card-pair';

describe('normalizeCardPair', () => {
  it('trims outer whitespace and folds case', () => {
    expect(normalizeCardPair('  Hello  ', '  Світ  ')).toEqual({
      front: 'hello',
      back: 'світ',
    });
  });

  it('keeps inner whitespace', () => {
    expect(normalizeCardPair('New  York', 'Нью  Йорк')).toEqual({
      front: 'new  york',
      back: 'нью  йорк',
    });
  });
});

describe('cardPairsMatch', () => {
  it('matches case-insensitively after trim', () => {
    expect(cardPairsMatch('Hello', 'Світ', ' hello ', 'світ')).toBe(true);
  });

  it('does not match the same front with a different back', () => {
    expect(cardPairsMatch('river', 'річка', 'river', 'ріка')).toBe(false);
  });
});
