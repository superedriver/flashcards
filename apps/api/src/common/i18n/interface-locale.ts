export type InterfaceLocale = 'en' | 'uk';

export function resolveInterfaceLocale(
  interfaceLocale: string | null | undefined,
): InterfaceLocale {
  return interfaceLocale === 'uk' ? 'uk' : 'en';
}
