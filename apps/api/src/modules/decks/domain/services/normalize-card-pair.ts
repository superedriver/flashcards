export const BULK_CARD_MAX_VALID_ROWS = 100;
export const BULK_FRONT_MAX_LENGTH = 2000;
export const BULK_BACK_MAX_LENGTH = 4000;

export type NormalizedCardPair = {
  front: string;
  back: string;
};

export function normalizeCardPair(
  front: string,
  back: string,
): NormalizedCardPair {
  return {
    front: front.trim().toLowerCase(),
    back: back.trim().toLowerCase(),
  };
}

export function cardPairsMatch(
  leftFront: string,
  leftBack: string,
  rightFront: string,
  rightBack: string,
): boolean {
  const left = normalizeCardPair(leftFront, leftBack);
  const right = normalizeCardPair(rightFront, rightBack);

  return left.front === right.front && left.back === right.back;
}
