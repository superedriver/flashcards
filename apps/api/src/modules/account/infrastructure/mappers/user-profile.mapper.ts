import { UserProfile } from '../../domain/types';

type PrismaUserProfileRecord = {
  id: string;
  userId: string;
  displayName: string | null;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export function toUserProfile(profile: PrismaUserProfileRecord): UserProfile {
  return {
    id: profile.id,
    userId: profile.userId,
    displayName: profile.displayName,
    avatarUrl: profile.avatarUrl,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };
}
