import { toGroupMember } from './group-member.mapper';

const prismaMember = {
  id: 'member-1',
  groupId: 'group-1',
  userId: 'user-1',
  role: 'OWNER',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-06-01T00:00:00.000Z'),
};

describe('group-member.mapper', () => {
  it('toGroupMember maps role and timestamps', () => {
    expect(toGroupMember(prismaMember)).toEqual({
      id: 'member-1',
      groupId: 'group-1',
      userId: 'user-1',
      role: 'OWNER',
      createdAt: prismaMember.createdAt,
      updatedAt: prismaMember.updatedAt,
    });
  });

  it('toGroupMember casts role to domain enum', () => {
    expect(toGroupMember({ ...prismaMember, role: 'MEMBER' }).role).toBe(
      'MEMBER',
    );
  });
});
