import { registerEnumType } from '@nestjs/graphql';

export enum StudySessionStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  ABANDONED = 'ABANDONED',
}

registerEnumType(StudySessionStatus, {
  name: 'StudySessionStatus',
});
