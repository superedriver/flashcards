import { Module } from '@nestjs/common';
import { GROUP_REPOSITORY } from './application/ports/group-repository.port';
import { PrismaGroupRepository } from './infrastructure/persistence/prisma-group.repository';

@Module({
  providers: [
    {
      provide: GROUP_REPOSITORY,
      useClass: PrismaGroupRepository,
    },
  ],
  exports: [GROUP_REPOSITORY],
})
export class GroupsModule {}
