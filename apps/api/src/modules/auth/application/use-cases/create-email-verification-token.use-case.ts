import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  EMAIL_PROVIDER,
  EmailProviderPort,
} from '../../../email/application/ports/email-provider.port';
import { buildVerificationEmail } from '../email/email-templates';
import {
  EMAIL_VERIFICATION_TOKEN_REPOSITORY,
  EmailVerificationTokenRepositoryPort,
} from '../ports/email-verification-token-repository.port';
import {
  TOKEN_GENERATOR,
  TokenGeneratorPort,
} from '../ports/token-generator.port';
import { TOKEN_HASHER, TokenHasherPort } from '../ports/token-hasher.port';

export type CreateEmailVerificationTokenInput = {
  userId: string;
  email: string;
};

export type CreateEmailVerificationTokenResult = {
  success: boolean;
};

const VERIFICATION_TOKEN_EXPIRY_HOURS = 24;

@Injectable()
export class CreateEmailVerificationTokenUseCase {
  constructor(
    @Inject(EMAIL_VERIFICATION_TOKEN_REPOSITORY)
    private readonly emailVerificationTokenRepository: EmailVerificationTokenRepositoryPort,
    @Inject(TOKEN_GENERATOR)
    private readonly tokenGenerator: TokenGeneratorPort,
    @Inject(TOKEN_HASHER)
    private readonly tokenHasher: TokenHasherPort,
    @Inject(EMAIL_PROVIDER)
    private readonly emailProvider: EmailProviderPort,
    private readonly configService: ConfigService,
  ) {}

  async execute(
    input: CreateEmailVerificationTokenInput,
  ): Promise<CreateEmailVerificationTokenResult> {
    await this.emailVerificationTokenRepository.revokeActiveForUser(
      input.userId,
    );

    const rawToken = this.tokenGenerator.generateRefreshToken();
    const tokenHash = this.tokenHasher.hash(rawToken);

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + VERIFICATION_TOKEN_EXPIRY_HOURS);

    await this.emailVerificationTokenRepository.create({
      userId: input.userId,
      tokenHash,
      expiresAt,
    });

    const appWebUrl = this.configService.getOrThrow<string>('app.webUrl');
    const emailContent = buildVerificationEmail({
      appWebUrl,
      token: rawToken,
    });

    await this.emailProvider.send({
      to: input.email,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    });

    return { success: true };
  }
}
