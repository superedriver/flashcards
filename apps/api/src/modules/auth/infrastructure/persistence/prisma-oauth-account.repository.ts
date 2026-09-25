import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma';
import {
  CreateOAuthAccountInput,
  OAuthAccount,
  OAuthAccountRepositoryPort,
} from '../../application/ports/oauth-account-repository.port';

@Injectable()
export class PrismaOAuthAccountRepository implements OAuthAccountRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findByProviderUid(
    provider: string,
    providerUid: string,
  ): Promise<OAuthAccount | null> {
    const account = await this.prisma.oAuthAccount.findUnique({
      where: { provider_providerUid: { provider, providerUid } },
    });

    return account;
  }

  async create(input: CreateOAuthAccountInput): Promise<OAuthAccount> {
    return this.prisma.oAuthAccount.create({ data: input });
  }
}
