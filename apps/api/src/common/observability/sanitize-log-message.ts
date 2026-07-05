const REDACTIONS: Array<{ pattern: RegExp; replacement: string }> = [
  { pattern: /Bearer\s+\S+/gi, replacement: 'Bearer [REDACTED]' },
  {
    pattern: /ExpoPushToken\[[^\]]+\]/gi,
    replacement: 'ExpoPushToken[REDACTED]',
  },
  { pattern: /token=[^&\s]+/gi, replacement: 'token=[REDACTED]' },
  {
    pattern: /postgresql:\/\/[^\s]+/gi,
    replacement: 'postgresql://[REDACTED]',
  },
  {
    pattern: /(api[_-]?key|authorization|password|secret)\s*[:=]\s*\S+/gi,
    replacement: '$1=[REDACTED]',
  },
];

export function sanitizeLogMessage(value: unknown): string {
  const message = value instanceof Error ? value.message : String(value);

  return REDACTIONS.reduce(
    (sanitized, { pattern, replacement }) =>
      sanitized.replace(pattern, replacement),
    message,
  );
}
