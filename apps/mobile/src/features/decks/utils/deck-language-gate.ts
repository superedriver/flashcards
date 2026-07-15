import { confirmAction } from '@/features/decks/utils/confirm-destructive'
import { i18n } from '@/i18n'

export function deckNeedsLanguageAssignment(deck: {
  targetLanguage?: string | null
  sourceLanguage?: string | null
}): boolean {
  return !deck.targetLanguage || !deck.sourceLanguage
}

export function promptAssignLanguages(onAssign: () => void): void {
  confirmAction(
    i18n.t('decks.assignLanguages.gateTitle'),
    i18n.t('decks.assignLanguages.gateMessage'),
    onAssign,
  )
}
