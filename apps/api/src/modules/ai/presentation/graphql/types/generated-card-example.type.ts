import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('GeneratedCardExample')
export class GeneratedCardExampleType {
  @Field()
  text: string;
}
