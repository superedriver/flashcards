import { Logger } from '@nestjs/common';

import { sanitizeLogMessage } from './sanitize-log-message';

const logger = new Logger('Operational');

export function logApplicationStartup(params: {
  nodeEnv: string;
  port: number;
}): void {
  logger.log(
    `Application started nodeEnv=${params.nodeEnv} port=${params.port} healthPath=/health`,
  );
}

export function logHealthCheck(params: { status: string }): void {
  logger.log(`Health check status=${params.status}`);
}

export function logReminderJobSummary(params: {
  checkedUsers: number;
  notifiedUsers: number;
  sentMessages: number;
  failedMessages: number;
}): void {
  logger.log(
    `Due card reminder job checkedUsers=${params.checkedUsers} notifiedUsers=${params.notifiedUsers} sentMessages=${params.sentMessages} failedMessages=${params.failedMessages}`,
  );
}

export function logEmailDeliverySummary(params: {
  provider: string;
  success: boolean;
  subject: string;
  errorMessage?: string;
}): void {
  const status = params.success ? 'SUCCESS' : 'FAILED';
  const subject = truncate(params.subject, 120);
  const errorSuffix = params.errorMessage
    ? ` error="${truncate(sanitizeLogMessage(params.errorMessage), 200)}"`
    : '';

  logger.log(
    `Email delivery provider=${params.provider} status=${status} subject="${subject}"${errorSuffix}`,
  );
}

export function logAiRequestSummary(params: {
  provider: string;
  feature: string;
  status: 'SUCCESS' | 'FAILED';
  cardId: string;
  errorMessage?: string;
}): void {
  const errorSuffix = params.errorMessage
    ? ` error="${truncate(sanitizeLogMessage(params.errorMessage), 200)}"`
    : '';

  logger.log(
    `AI request provider=${params.provider} feature=${params.feature} status=${params.status} cardId=${params.cardId}${errorSuffix}`,
  );
}

export function logPushDeliverySummary(params: {
  provider: string;
  successCount: number;
  failureCount: number;
  invalidTokenCount: number;
}): void {
  logger.log(
    `Push delivery provider=${params.provider} successCount=${params.successCount} failureCount=${params.failureCount} invalidTokenCount=${params.invalidTokenCount}`,
  );
}

function truncate(value: string, maxLength: number): string {
  const trimmed = value.trim();

  if (trimmed.length <= maxLength) {
    return trimmed;
  }

  return trimmed.slice(0, maxLength);
}
