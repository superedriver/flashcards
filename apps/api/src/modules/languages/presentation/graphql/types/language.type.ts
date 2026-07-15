import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('Language')
export class LanguageType {
  @Field()
  code: string;

  @Field()
  englishName: string;

  @Field()
  nativeName: string;

  @Field()
  flag: string;

  @Field(() => Int, { nullable: true })
  popularSortOrder: number | null;
}
