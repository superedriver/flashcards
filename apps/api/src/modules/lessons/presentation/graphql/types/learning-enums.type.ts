import { registerEnumType } from '@nestjs/graphql';

export enum LearningGroupGql {
  TO_LEARN = 'TO_LEARN',
  PRACTICED = 'PRACTICED',
  LEARNED = 'LEARNED',
}

registerEnumType(LearningGroupGql, {
  name: 'LearningGroup',
});

export enum PromptDirectionGql {
  FRONT_TO_BACK = 'FRONT_TO_BACK',
  BACK_TO_FRONT = 'BACK_TO_FRONT',
}

registerEnumType(PromptDirectionGql, {
  name: 'PromptDirection',
});
