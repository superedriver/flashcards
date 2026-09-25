export const OAUTH_ACCOUNT_REPOSITORY = Symbol('OAUTH_ACCOUNT_REPOSITORY');

export type OAuthAccount = {
  id: string;
  userId: string;
  provider: string;
  providerUid: string;
  email: string | null;
};

export type CreateOAuthAccountInput = {
  userId: string;
  provider: string;
  providerUid: string;
  email: string | null;
};

export type OAuthAccountRepositoryPort = {
  findByProviderUid(
    provider: string,
    providerUid: string,
  ): Promise<OAuthAccount | null>;
  create(input: CreateOAuthAccountInput): Promise<OAuthAccount>;
};
