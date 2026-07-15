import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DecksPageInput {
  @Field()
  activeTargetLanguage: string;
}
