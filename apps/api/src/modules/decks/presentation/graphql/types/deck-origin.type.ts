import { registerEnumType } from '@nestjs/graphql';

export enum DeckOrigin {
  OWN = 'OWN',
  GROUP = 'GROUP',
  PUBLIC = 'PUBLIC',
}

registerEnumType(DeckOrigin, {
  name: 'DeckOrigin',
});
