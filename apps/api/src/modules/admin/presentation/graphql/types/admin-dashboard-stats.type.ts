import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('AdminDashboardStats')
export class AdminDashboardStatsType {
  @Field()
  totalUsers: number;

  @Field()
  totalDecks: number;

  @Field()
  totalPublicDecks: number;

  @Field()
  totalCards: number;

  @Field()
  totalStudySessions: number;

  @Field()
  totalReviews: number;

  @Field()
  usersCreatedLast7Days: number;

  @Field()
  decksCreatedLast7Days: number;

  @Field()
  reviewsSubmittedLast7Days: number;
}
