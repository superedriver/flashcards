export const TOKEN_HASHER = Symbol('TOKEN_HASHER');

export type TokenHasherPort = {
  hash(token: string): string;
};
