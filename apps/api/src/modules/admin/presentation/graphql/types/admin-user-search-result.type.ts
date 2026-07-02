import { Field, ObjectType } from '@nestjs/graphql';
import { AdminUserSummaryType } from './admin-user-summary.type';

@ObjectType('AdminUserSearchResult')
export class AdminUserSearchResultType {
  @Field(() => [AdminUserSummaryType])
  items: AdminUserSummaryType[];

  @Field()
  total: number;
}
