export const EMAIL_VERIFICATION_TOKEN_REPOSITORY = Symbol(
  'EMAIL_VERIFICATION_TOKEN_REPOSITORY',
);

export type CreateEmailVerificationTokenInput = {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
};

export type EmailVerificationTokenRecord = {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  usedAt: Date | null;
  createdAt: Date;
};

export type EmailVerificationTokenRepositoryPort = {
  create(
    input: CreateEmailVerificationTokenInput,
  ): Promise<EmailVerificationTokenRecord>;
  findValidByHash(
    tokenHash: string,
  ): Promise<EmailVerificationTokenRecord | null>;
  markUsed(id: string): Promise<void>;
  revokeActiveForUser(userId: string): Promise<void>;
};
