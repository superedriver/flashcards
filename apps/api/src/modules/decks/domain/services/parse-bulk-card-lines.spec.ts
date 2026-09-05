import {
  BULK_BACK_MAX_LENGTH,
  BULK_FRONT_MAX_LENGTH,
} from './normalize-card-pair';
import { parseBulkCardLines } from './parse-bulk-card-lines';

describe('parseBulkCardLines', () => {
  it('parses a happy list in order', () => {
    const result = parseBulkCardLines(
      ['duvet,ковдра', 'safe,сейф', 'river,річка'].join('\n'),
    );

    expect(result.formatErrors).toEqual([]);
    expect(result.tooManyValid).toBe(false);
    expect(result.validPairs).toEqual([
      { back: 'ковдра', front: 'duvet', lineNumber: 1 },
      { back: 'сейф', front: 'safe', lineNumber: 2 },
      { back: 'річка', front: 'river', lineNumber: 3 },
    ]);
  });

  it('skips empty lines as cards but keeps physical line numbers', () => {
    const result = parseBulkCardLines('duvet,ковдра\n\nriver,річка');

    expect(result.formatErrors).toEqual([]);
    expect(result.validPairs).toEqual([
      { back: 'ковдра', front: 'duvet', lineNumber: 1 },
      { back: 'річка', front: 'river', lineNumber: 3 },
    ]);
  });

  it('treats two commas as invalid format and omits the row from validPairs', () => {
    const result = parseBulkCardLines('a,b,c\nok,так');

    expect(result.formatErrors).toEqual([
      { code: 'INVALID_FORMAT', lineNumber: 1 },
    ]);
    expect(result.validPairs).toEqual([
      { back: 'так', front: 'ok', lineNumber: 2 },
    ]);
  });

  it('rejects a missing side', () => {
    const result = parseBulkCardLines(',ковдра\nduvet,');

    expect(result.formatErrors).toEqual([
      { code: 'FRONT_REQUIRED', lineNumber: 1 },
      { code: 'BACK_REQUIRED', lineNumber: 2 },
    ]);
    expect(result.validPairs).toEqual([]);
  });

  it('splits CRLF the same as LF', () => {
    const result = parseBulkCardLines('a,b\r\nc,d');

    expect(result.validPairs).toEqual([
      { back: 'b', front: 'a', lineNumber: 1 },
      { back: 'd', front: 'c', lineNumber: 2 },
    ]);
  });

  it('trims ends and keeps inner spaces', () => {
    const result = parseBulkCardLines('  New  York  ,  Нью  Йорк  ');

    expect(result.validPairs).toEqual([
      { back: 'Нью  Йорк', front: 'New  York', lineNumber: 1 },
    ]);
  });

  it('treats Front,Back as a normal card, not a header', () => {
    const result = parseBulkCardLines('Front,Back\nok,так');

    expect(result.validPairs[0]).toEqual({
      back: 'Back',
      front: 'Front',
      lineNumber: 1,
    });
  });

  it('flags more than 100 valid rows', () => {
    const lines = Array.from(
      { length: 101 },
      (_value, index) => `front${index},back${index}`,
    );
    const result = parseBulkCardLines(lines.join('\n'));

    expect(result.formatErrors).toEqual([]);
    expect(result.validPairs).toHaveLength(101);
    expect(result.tooManyValid).toBe(true);
  });

  it('rejects sides over the createCard length limits', () => {
    const longFront = 'f'.repeat(BULK_FRONT_MAX_LENGTH + 1);
    const longBack = 'b'.repeat(BULK_BACK_MAX_LENGTH + 1);
    const result = parseBulkCardLines(`${longFront},ok\nok,${longBack}`);

    expect(result.formatErrors).toEqual([
      { code: 'FRONT_TOO_LONG', lineNumber: 1 },
      { code: 'BACK_TOO_LONG', lineNumber: 2 },
    ]);
    expect(result.validPairs).toEqual([]);
  });
});
