import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  EMAIL_PROVIDER,
  EmailProviderPort,
} from '../../../email/application/ports/email-provider.port';
import { buildPasswordResetEmail } from '../email/email-templates';
import {
  PASSWORD_RESET_TOKEN_REPOSITORY,
  PasswordResetTokenRepositoryPort,
} from '../ports/password-reset-token-repository.port';
import {
  TOKEN_GENERATOR,
  TokenGeneratorPort,
} from '../ports/token-generator.port';
import { TOKEN_HASHER, TokenHasherPort } from '../ports/token-hasher.port';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../ports/user-repository.port';

export type RequestPasswordResetInput = {
  email: string;
};

export type RequestPasswordResetResult = {
  success: boolean;
};

const PASSWORD_RESET_TOKEN_EXPIRY_HOURS = 1;

@Injectable()
export class RequestPasswordResetUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(PASSWORD_RESET_TOKEN_REPOSITORY)
    private readonly passwordResetTokenRepository: PasswordResetTokenRepositoryPort,
    @Inject(TOKEN_GENERATOR)
    private readonly tokenGenerator: TokenGeneratorPort,
    @Inject(TOKEN_HASHER)
    private readonly tokenHasher: TokenHasherPort,
    @Inject(EMAIL_PROVIDER)
    private readonly emailProvider: EmailProviderPort,
    private readonly configService: ConfigService,
  ) {}

  async execute(
    input: RequestPasswordResetInput,
  ): Promise<RequestPasswordResetResult> {
    const email = input.email.trim().toLowerCase();
    const user = await this.userRepository.findByEmail(email);

    if (!user || user.blockedAt !== null) {
      return { success: true };
    }

    await this.passwordResetTokenRepository.revokeActiveForUser(user.id);

    const rawToken = this.tokenGenerator.generateRefreshToken();
    const tokenHash = this.tokenHasher.hash(rawToken);

    const expiresAt = new Date();
    expiresAt.setHours(
      expiresAt.getHours() + PASSWORD_RESET_TOKEN_EXPIRY_HOURS,
    );

    await this.passwordResetTokenRepository.create({
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    const appWebUrl = this.configService.getOrThrow<string>('app.webUrl');
    const emailContent = buildPasswordResetEmail({
      appWebUrl,
      token: rawToken,
    });

    await this.emailProvider.send({
      to: user.email,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    });

    return { success: true };
  }
}
