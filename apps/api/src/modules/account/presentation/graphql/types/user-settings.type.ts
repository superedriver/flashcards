import { Field, ObjectType } from '@nestjs/graphql';
import { ThemePreference } from './theme-preference.type';

@ObjectType('UserSettings')
export class UserSettingsType {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field()
  interfaceLocale: string;

  @Field(() => ThemePreference)
  themePreference: ThemePreference;

  @Field()
  notificationsEnabled: boolean;

  @Field()
  reminderTime: string;

  @Field()
  timezone: string;

  @Field()
  audioAutoplayEnabled: boolean;

  @Field()
  lessonSize: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
