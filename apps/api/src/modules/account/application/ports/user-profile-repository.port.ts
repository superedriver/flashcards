import { UserProfile } from '../../domain/types';

export const USER_PROFILE_REPOSITORY = Symbol('USER_PROFILE_REPOSITORY');

export type UpdateUserProfileInput = {
  userId: string;
  displayName?: string | null;
  avatarUrl?: string | null;
};

export type UserProfileRepositoryPort = {
  findByUserId(userId: string): Promise<UserProfile | null>;
  createForUser(userId: string): Promise<UserProfile>;
  update(input: UpdateUserProfileInput): Promise<UserProfile>;
};
