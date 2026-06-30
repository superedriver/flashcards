import { registerEnumType } from '@nestjs/graphql';

export enum DeckVisibility {
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC',
}

registerEnumType(DeckVisibility, {
  name: 'DeckVisibility',
});
