import { useTranslation } from 'react-i18next'

import type { MyGroupInvitationsQuery } from '@/graphql/generated'
import { EmptyState } from '@/ui/components'

import { GroupInvitationListItem } from './group-invitation-list-item'

type GroupInvitationListProps = {
  invitations: MyGroupInvitationsQuery['myGroupInvitations']
  isSubmitting?: boolean
  onAccept?: (invitationId: string) => void
  onDecline?: (invitationId: string) => void
}

export function GroupInvitationList({
  invitations,
  isSubmitting = false,
  onAccept,
  onDecline,
}: GroupInvitationListProps) {
  const { t } = useTranslation()

  if (invitations.length === 0) {
    return <EmptyState message={t('groups.invitations.empty')} />
  }

  return (
    <>
      {invitations.map((invitation) => (
        <GroupInvitationListItem
          key={invitation.id}
          invitation={invitation}
          isSubmitting={isSubmitting}
          onAccept={onAccept}
          onDecline={onDecline}
        />
      ))}
    </>
  )
}
