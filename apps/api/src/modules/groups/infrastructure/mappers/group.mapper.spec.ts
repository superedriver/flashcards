import { toGroup, toGroupWithMyRole } from './group.mapper';

const prismaGroup = {
  id: 'group-1',
  name: 'Study Group',
  description: 'Spanish learners',
  createdById: 'user-1',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-06-01T00:00:00.000Z'),
  deletedAt: null,
};

describe('group.mapper', () => {
  it('toGroup maps all fields from Prisma record', () => {
    expect(toGroup(prismaGroup)).toEqual({
      id: 'group-1',
      name: 'Study Group',
      description: 'Spanish learners',
      createdById: 'user-1',
      createdAt: prismaGroup.createdAt,
      updatedAt: prismaGroup.updatedAt,
      deletedAt: null,
    });
  });

  it('toGroupWithMyRole maps group and myRole', () => {
    expect(toGroupWithMyRole(prismaGroup, 'ADMIN')).toEqual({
      ...toGroup(prismaGroup),
      myRole: 'ADMIN',
    });
  });
});
