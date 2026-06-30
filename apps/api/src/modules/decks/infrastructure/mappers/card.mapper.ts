import { Card } from '../../domain/types';

type PrismaCardRecord = {
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

export function toCard(card: PrismaCardRecord): Card {
  return {
    id: card.id,
    deckId: card.deckId,
    front: card.front,
    back: card.back,
    example: card.example,
    notes: card.notes,
    position: card.position,
    createdAt: card.createdAt,
    updatedAt: card.updatedAt,
    deletedAt: card.deletedAt,
  };
}
