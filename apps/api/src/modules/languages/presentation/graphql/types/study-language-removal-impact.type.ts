import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('StudyLanguageRemovalImpact')
export class StudyLanguageRemovalImpactType {
  @Field(() => Int)
  affectedDeckCount: number;
}
