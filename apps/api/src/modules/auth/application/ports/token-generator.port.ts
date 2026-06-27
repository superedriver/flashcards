export const TOKEN_GENERATOR = Symbol('TOKEN_GENERATOR');

export type TokenGeneratorPort = {
  generateRefreshToken(): string;
};
