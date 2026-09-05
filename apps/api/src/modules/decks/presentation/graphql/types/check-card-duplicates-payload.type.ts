import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum CardDuplicateKind {
  CURRENT_DECK = 'CURRENT_DECK',
  OTHER_DECK = 'OTHER_DECK',
  IN_BATCH = 'IN_BATCH',
}

registerEnumType(CardDuplicateKind, {
  name: 'CardDuplicateKind',
});

@ObjectType('CheckCardDuplicateHit')
export class CheckCardDuplicateHitType {
  @Field(() => Int)
  index: number;

  @Field(() => CardDuplicateKind)
  kind: CardDuplicateKind;

  @Field(() => String, { nullable: true })
  deckTitle: string | null;
}

@ObjectType('CheckCardDuplicatesPayload')
export class CheckCardDuplicatesPayloadType {
  @Field(() => [CheckCardDuplicateHitType])
  hits: CheckCardDuplicateHitType[];
}
