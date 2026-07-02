import { Field, ObjectType } from '@nestjs/graphql';
import { GeneratedCardExampleType } from './generated-card-example.type';

@ObjectType('GenerateCardExamplesPayload')
export class GenerateCardExamplesPayloadType {
  @Field()
  cardId: string;

  @Field(() => [GeneratedCardExampleType])
  examples: GeneratedCardExampleType[];
}
