import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import {
  USER_SETTINGS_REPOSITORY,
  UserSettingsRepositoryPort,
} from '../../../account/application/ports/user-settings-repository.port';
import {
  EMAIL_PROVIDER,
  EmailProviderPort,
} from '../../../email/application/ports/email-provider.port';
import { buildGroupInvitationEmail } from '../../../auth/application/email/email-templates';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../../auth/application/ports/user-repository.port';
import { AuthUser } from '../../../auth/domain/types';
import { GroupPermissionService } from '../../domain/services/group-permission.service';
import { normalizeGroupEmail } from '../../domain/utils/normalize-group-email';
import { GroupInvitation } from '../../domain/types';
import {
  GROUP_INVITATION_REPOSITORY,
  GroupInvitationRepositoryPort,
} from '../ports/group-invitation-repository.port';
import {
  GROUP_REPOSITORY,
  GroupRepositoryPort,
} from '../ports/group-repository.port';

export type InviteUserToGroupUseCaseInput = {
  currentUser: AuthUser;
  groupId: string;
  email: string;
};

export type InviteUserToGroupUseCaseResult = GroupInvitation;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INVITATION_EXPIRY_DAYS = 7;

@Injectable()
export class InviteUserToGroupUseCase {
  private readonly groupPermissionService = new GroupPermissionService();

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(GROUP_REPOSITORY)
    private readonly groupRepository: GroupRepositoryPort,
    @Inject(GROUP_INVITATION_REPOSITORY)
    private readonly groupInvitationRepository: GroupInvitationRepositoryPort,
    @Inject(USER_SETTINGS_REPOSITORY)
    private readonly userSettingsRepository: UserSettingsRepositoryPort,
    @Inject(EMAIL_PROVIDER)
    private readonly emailProvider: EmailProviderPort,
    private readonly configService: ConfigService,
  ) {}

  async execute(
    input: InviteUserToGroupUseCaseInput,
  ): Promise<InviteUserToGroupUseCaseResult> {
    const user = await this.userRepository.findById(input.currentUser.id);

    if (!user) {
      throw new ApplicationError(ErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    if (user.blockedAt !== null) {
      throw new ApplicationError(ErrorCodes.USER_BLOCKED, 'User is blocked');
    }

    const group = await this.groupRepository.findById(input.groupId);

    if (!group) {
      throw new ApplicationError(ErrorCodes.GROUP_NOT_FOUND, 'Group not found');
    }

    const myMember = await this.groupRepository.findMember({
      groupId: input.groupId,
      userId: input.currentUser.id,
    });

    if (!this.groupPermissionService.canInviteToGroup(myMember)) {
      throw new ApplicationError(ErrorCodes.GROUP_FORBIDDEN, 'Group forbidden');
    }

    const email = normalizeGroupEmail(input.email);

    if (!email || !EMAIL_REGEX.test(email)) {
      throw new ApplicationError(
        ErrorCodes.VALIDATION_ERROR,
        'Invalid email format',
      );
    }

    const existingInvitation =
      await this.groupInvitationRepository.findPendingByGroupAndEmail({
        groupId: input.groupId,
        email,
      });

    if (existingInvitation) {
      throw new ApplicationError(
        ErrorCodes.GROUP_INVITATION_INVALID,
        'A pending invitation already exists for this email',
      );
    }

    const expiresAt = new Date(
      Date.now() + INVITATION_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    );

    const invitation = await this.groupInvitationRepository.create({
      groupId: input.groupId,
      email,
      invitedById: input.currentUser.id,
      expiresAt,
    });

    const invitee = await this.userRepository.findByEmail(email);
    const inviteeSettings = invitee
      ? await this.userSettingsRepository.findByUserId(invitee.id)
      : null;
    const appWebUrl = this.configService.getOrThrow<string>('app.webUrl');
    const emailContent = buildGroupInvitationEmail({
      appWebUrl,
      groupName: group.name,
      locale: inviteeSettings?.interfaceLocale,
    });

    await this.emailProvider.send({
      to: email,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    });

    return invitation;
  }
}
