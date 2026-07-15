import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum DeckPreviewSessionTypeEnum {
  COPY_PUBLIC = 'COPY_PUBLIC',
  COPY_GROUP = 'COPY_GROUP',
  REGENERATE_DECK = 'REGENERATE_DECK',
}

export enum DeckPreviewSessionStatusEnum {
  GENERATING = 'GENERATING',
  READY = 'READY',
  EXPIRED = 'EXPIRED',
}

registerEnumType(DeckPreviewSessionTypeEnum, {
  name: 'DeckPreviewSessionType',
});

registerEnumType(DeckPreviewSessionStatusEnum, {
  name: 'DeckPreviewSessionStatus',
});

@ObjectType('DeckPreviewSessionCard')
export class DeckPreviewSessionCardType {
  @Field({ nullable: true })
  sourceCardId?: string;

  @Field()
  front: string;

  @Field()
  back: string;

  @Field(() => String, { nullable: true })
  example: string | null;

  @Field({ nullable: true })
  backError?: string;

  @Field({ nullable: true })
  exampleError?: string;
}

@ObjectType('DeckPreviewSession')
export class DeckPreviewSessionType {
  @Field()
  id: string;

  @Field(() => DeckPreviewSessionTypeEnum)
  type: DeckPreviewSessionTypeEnum;

  @Field(() => DeckPreviewSessionStatusEnum)
  status: DeckPreviewSessionStatusEnum;

  @Field(() => String, { nullable: true })
  sourceDeckId: string | null;

  @Field()
  targetLanguage: string;

  @Field()
  chosenSourceLanguage: string;

  @Field(() => [DeckPreviewSessionCardType])
  cards: DeckPreviewSessionCardType[];

  @Field()
  expiresAt: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
