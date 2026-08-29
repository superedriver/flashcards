export function memberInitials(
  displayName: string | null | undefined,
  email: string,
): string {
  const fromName = displayName?.trim().charAt(0);

  if (fromName) {
    return fromName.toUpperCase();
  }

  const localPart = email.split('@')[0] ?? '';
  const fromEmail = localPart.charAt(0);

  return fromEmail ? fromEmail.toUpperCase() : '?';
}
