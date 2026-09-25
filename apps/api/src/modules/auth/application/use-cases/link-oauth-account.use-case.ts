import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import appleSignin from 'apple-signin-auth';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import {
  OAUTH_ACCOUNT_REPOSITORY,
  OAuthAccountRepositoryPort,
} from '../ports/oauth-account-repository.port';

export type LinkOAuthAccountInput = {
  userId: string;
  provider: 'google' | 'apple';
  token: string;
};

export type LinkOAuthAccountResult = {
  provider: string;
  providerUid: string;
};

@Injectable()
export class LinkOAuthAccountUseCase {
  private readonly googleClient: OAuth2Client;

  constructor(
    private readonly config: ConfigService,
    @Inject(OAUTH_ACCOUNT_REPOSITORY)
    private readonly oauthAccountRepository: OAuthAccountRepositoryPort,
  ) {
    const googleClientId = this.config.get<string>('auth.googleClientId') ?? '';
    this.googleClient = new OAuth2Client(googleClientId);
  }

  async execute(input: LinkOAuthAccountInput): Promise<LinkOAuthAccountResult> {
    let providerUid: string;

    if (input.provider === 'google') {
      const clientId = this.config.get<string>('auth.googleClientId');

      if (!clientId) {
        throw new ApplicationError(
          ErrorCodes.VALIDATION_ERROR,
          'Google OAuth is not configured',
        );
      }

      try {
        const ticket = await this.googleClient.verifyIdToken({
          idToken: input.token,
          audience: clientId,
        });

        const payload = ticket.getPayload();

        if (!payload?.sub) {
          throw new Error('Missing sub in Google token payload');
        }

        providerUid = payload.sub;
      } catch {
        throw new ApplicationError(
          ErrorCodes.UNAUTHORIZED,
          'Invalid Google token',
        );
      }
    } else {
      const clientId = this.config.get<string>('auth.appleClientId');

      if (!clientId) {
        throw new ApplicationError(
          ErrorCodes.VALIDATION_ERROR,
          'Apple Sign In is not configured',
        );
      }

      try {
        const payload = await appleSignin.verifyIdToken(input.token, {
          audience: clientId,
          ignoreExpiration: false,
        });

        if (!payload.sub) {
          throw new Error('Missing sub in Apple token payload');
        }

        providerUid = payload.sub;
      } catch {
        throw new ApplicationError(
          ErrorCodes.UNAUTHORIZED,
          'Invalid Apple identity token',
        );
      }
    }

    const existing = await this.oauthAccountRepository.findByProviderUid(
      input.provider,
      providerUid,
    );

    if (existing) {
      if (existing.userId !== input.userId) {
        throw new ApplicationError(
          ErrorCodes.VALIDATION_ERROR,
          'This account is already linked to another user',
        );
      }

      return { provider: input.provider, providerUid };
    }

    await this.oauthAccountRepository.create({
      userId: input.userId,
      provider: input.provider,
      providerUid,
      email: null,
    });

    return { provider: input.provider, providerUid };
  }
}
