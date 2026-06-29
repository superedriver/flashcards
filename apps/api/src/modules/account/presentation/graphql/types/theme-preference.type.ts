import { registerEnumType } from '@nestjs/graphql';

export enum ThemePreference {
  SYSTEM = 'SYSTEM',
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}

registerEnumType(ThemePreference, {
  name: 'ThemePreference',
});
