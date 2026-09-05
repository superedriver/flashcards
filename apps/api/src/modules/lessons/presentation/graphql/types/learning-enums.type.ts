import { registerEnumType } from '@nestjs/graphql';

export enum LearningGroupGql {
  TO_LEARN = 'TO_LEARN',
  PRACTICED = 'PRACTICED',
  LEARNED = 'LEARNED',
}

registerEnumType(LearningGroupGql, {
  name: 'LearningGroup',
});

export enum ReviewPresentationModeGql {
  TARGET_TEXT_AUDIO = 'TARGET_TEXT_AUDIO',
  SOURCE_TEXT = 'SOURCE_TEXT',
  TARGET_AUDIO_ONLY = 'TARGET_AUDIO_ONLY',
  TARGET_TEXT = 'TARGET_TEXT',
}

registerEnumType(ReviewPresentationModeGql, {
  name: 'ReviewPresentationMode',
});
