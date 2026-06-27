import { SafeUser } from '../../domain/types';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export type UserWithPassword = SafeUser & {
  passwordHash: string | null;
};

export type CreateUserInput = {
  email: string;
  passwordHash: string;
};

export type UserRepositoryPort = {
  findById(id: string): Promise<SafeUser | null>;
  findByEmail(email: string): Promise<UserWithPassword | null>;
  create(input: CreateUserInput): Promise<SafeUser>;
};
