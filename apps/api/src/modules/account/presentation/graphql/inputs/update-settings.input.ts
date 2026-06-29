import { Field, InputType, Int } from '@nestjs/graphql';
import { ThemePreference } from '../types/theme-preference.type';

@InputType()
export class UpdateSettingsInput {
  @Field({ nullable: true })
  interfaceLocale?: string;

  @Field(() => ThemePreference, { nullable: true })
  themePreference?: ThemePreference;

  @Field({ nullable: true })
  notificationsEnabled?: boolean;

  @Field({ nullable: true })
  reminderTime?: string;

  @Field({ nullable: true })
  timezone?: string;

  @Field({ nullable: true })
  audioAutoplayEnabled?: boolean;

  @Field(() => Int, { nullable: true })
  lessonSize?: number;
}
