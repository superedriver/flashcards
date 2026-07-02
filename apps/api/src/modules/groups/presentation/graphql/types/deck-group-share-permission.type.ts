import { registerEnumType } from '@nestjs/graphql';

export enum DeckGroupSharePermission {
  VIEW = 'VIEW',
}

registerEnumType(DeckGroupSharePermission, {
  name: 'DeckGroupSharePermission',
});
