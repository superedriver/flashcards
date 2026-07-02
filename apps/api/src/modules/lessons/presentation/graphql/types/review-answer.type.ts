import { registerEnumType } from '@nestjs/graphql';

export enum ReviewAnswer {
  KNOW = 'KNOW',
  DONT_KNOW = 'DONT_KNOW',
}

registerEnumType(ReviewAnswer, {
  name: 'ReviewAnswer',
});
