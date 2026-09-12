export const BLOCKED_IDENTITY_REPOSITORY = Symbol(
  'BLOCKED_IDENTITY_REPOSITORY',
);

export type BlockedIdentityRepositoryPort = {
  upsertByEmail(email: string): Promise<void>;
  existsByEmail(email: string): Promise<boolean>;
  deleteByEmail(email: string): Promise<void>;
};
