export type Card = {
  id: string;
  deckId: string;
  front: string;
  back: string;
  example: string | null;
  notes: string | null;
  position: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};
