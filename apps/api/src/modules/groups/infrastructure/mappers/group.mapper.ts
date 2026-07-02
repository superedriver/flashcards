import { Group, GroupRole } from '../../domain/types';

type PrismaGroupRecord = {
  id: string;
  name: string;
  description: string | null;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export function toGroup(group: PrismaGroupRecord): Group {
  return {
    id: group.id,
    name: group.name,
    description: group.description,
    createdById: group.createdById,
    createdAt: group.createdAt,
    updatedAt: group.updatedAt,
    deletedAt: group.deletedAt,
  };
}

export function toGroupWithMyRole(
  group: PrismaGroupRecord,
  myRole: GroupRole,
): Group & { myRole: GroupRole } {
  return {
    ...toGroup(group),
    myRole,
  };
}
