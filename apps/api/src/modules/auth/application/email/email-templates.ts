import {
  resolveInterfaceLocale,
  type InterfaceLocale,
} from '../../../../common/i18n/interface-locale';

export type AuthEmailContent = {
  subject: string;
  text: string;
  html: string;
};

type AuthEmailTemplate = {
  subject: string;
  intro: string;
  action: string;
  expiry: string;
  ignore: string;
};

const VERIFICATION_TEMPLATES: Record<InterfaceLocale, AuthEmailTemplate> = {
  en: {
    subject: 'Verify your email',
    intro: 'Please verify your email address for Flashcards.',
    action: 'Verify your email',
    expiry: 'This link expires in 24 hours.',
    ignore: 'If you did not create an account, you can ignore this email.',
  },
  uk: {
    subject: 'Підтвердьте електронну пошту',
    intro: 'Будь ласка, підтвердьте вашу електронну пошту для Flashcards.',
    action: 'Підтвердити електронну пошту',
    expiry: 'Це посилання дійсне 24 години.',
    ignore: 'Якщо ви не створювали обліковий запис, проігноруйте цей лист.',
  },
};

const PASSWORD_RESET_TEMPLATES: Record<InterfaceLocale, AuthEmailTemplate> = {
  en: {
    subject: 'Reset your password',
    intro: 'We received a request to reset your Flashcards password.',
    action: 'Reset your password',
    expiry: 'This link expires in 1 hour.',
    ignore:
      'If you did not request a password reset, you can ignore this email.',
  },
  uk: {
    subject: 'Скиньте пароль',
    intro: 'Ми отримали запит на скидання пароля Flashcards.',
    action: 'Скинути пароль',
    expiry: 'Це посилання дійсне 1 годину.',
    ignore:
      'Якщо ви не надсилали запит на скидання пароля, проігноруйте цей лист.',
  },
};

function buildAuthLink(appWebUrl: string, path: string, token: string): string {
  const baseUrl = appWebUrl.replace(/\/$/, '');

  return `${baseUrl}${path}?token=${encodeURIComponent(token)}`;
}

function buildAuthEmail(
  template: AuthEmailTemplate,
  link: string,
): AuthEmailContent {
  return {
    subject: template.subject,
    text: [
      template.intro,
      '',
      `${template.action}: ${link}`,
      '',
      template.expiry,
      template.ignore,
    ].join('\n'),
    html: [
      `<p>${template.intro}</p>`,
      `<p><a href="${link}">${template.action}</a></p>`,
      `<p>${template.expiry}</p>`,
      `<p>${template.ignore}</p>`,
    ].join('\n'),
  };
}

export function buildVerificationEmail(input: {
  appWebUrl: string;
  locale?: string | null;
  token: string;
}): AuthEmailContent {
  const locale = resolveInterfaceLocale(input.locale);
  const link = buildAuthLink(input.appWebUrl, '/verify-email', input.token);

  return buildAuthEmail(VERIFICATION_TEMPLATES[locale], link);
}

export function buildPasswordResetEmail(input: {
  appWebUrl: string;
  locale?: string | null;
  token: string;
}): AuthEmailContent {
  const locale = resolveInterfaceLocale(input.locale);
  const link = buildAuthLink(input.appWebUrl, '/reset-password', input.token);

  return buildAuthEmail(PASSWORD_RESET_TEMPLATES[locale], link);
}

type GroupInvitationTemplate = {
  subject: string;
  intro: string;
  action: string;
  expiry: string;
};

const GROUP_INVITATION_TEMPLATES: Record<
  InterfaceLocale,
  GroupInvitationTemplate
> = {
  en: {
    subject: 'You are invited to a Flashcards group',
    intro:
      'You have been invited to join the group "{{groupName}}" on Flashcards.',
    action: 'View invitations',
    expiry: 'This invitation expires in 7 days.',
  },
  uk: {
    subject: 'Вас запрошено до групи Flashcards',
    intro: 'Вас запрошено приєднатися до групи «{{groupName}}» у Flashcards.',
    action: 'Переглянути запрошення',
    expiry: 'Це запрошення дійсне 7 днів.',
  },
};

export function buildGroupInvitationEmail(input: {
  appWebUrl: string;
  groupName: string;
  locale?: string | null;
}): AuthEmailContent {
  const locale = resolveInterfaceLocale(input.locale);
  const template = GROUP_INVITATION_TEMPLATES[locale];
  const link = `${input.appWebUrl.replace(/\/$/, '')}/groups/invitations`;
  const intro = template.intro.replace('{{groupName}}', input.groupName);

  return {
    subject: template.subject,
    text: [intro, '', `${template.action}: ${link}`, '', template.expiry].join(
      '\n',
    ),
    html: [
      `<p>${intro}</p>`,
      `<p><a href="${link}">${template.action}</a></p>`,
      `<p>${template.expiry}</p>`,
    ].join('\n'),
  };
}
