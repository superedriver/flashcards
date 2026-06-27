import { AuthUser } from '../../domain/types';

export const ACCESS_TOKEN_SERVICE = Symbol('ACCESS_TOKEN_SERVICE');

export type AccessTokenServicePort = {
  sign(user: AuthUser): Promise<string>;
  verify(token: string): Promise<AuthUser>;
};
