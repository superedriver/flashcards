/* eslint-disable */
// @ts-nocheck
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> =
  T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never }
import type * as SchemaTypes from './schema'

import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
import * as ApolloReactHooks from '@apollo/client/react'
const defaultOptions = {} as const
export type AdminDashboardStatsQueryVariables = Exact<{ [key: string]: never }>

export type AdminDashboardStatsQuery = {
  adminDashboardStats: {
    totalUsers: number
    totalDecks: number
    totalPublicDecks: number
    totalCards: number
    totalStudySessions: number
    totalReviews: number
    usersCreatedLast7Days: number
    decksCreatedLast7Days: number
    reviewsSubmittedLast7Days: number
  }
}

export type AdminSearchUsersQueryVariables = Exact<{
  input?: SchemaTypes.AdminSearchUsersInput | null | undefined
}>

export type AdminSearchUsersQuery = {
  adminSearchUsers: {
    total: number
    items: Array<{
      id: string
      email: string
      role: SchemaTypes.UserRole
      emailVerifiedAt: string | null
      blockedAt: string | null
      createdAt: string
      updatedAt: string
    }>
  }
}

export type BlockUserMutationVariables = Exact<{
  userId: string | number
}>

export type BlockUserMutation = {
  blockUser: {
    id: string
    email: string
    role: SchemaTypes.UserRole
    emailVerifiedAt: string | null
    blockedAt: string | null
    createdAt: string
    updatedAt: string
  }
}

export type UnblockUserMutationVariables = Exact<{
  userId: string | number
}>

export type UnblockUserMutation = {
  unblockUser: {
    id: string
    email: string
    role: SchemaTypes.UserRole
    emailVerifiedAt: string | null
    blockedAt: string | null
    createdAt: string
    updatedAt: string
  }
}

export type ModerationQueueQueryVariables = Exact<{
  input?: SchemaTypes.ModerationQueueInput | null | undefined
}>

export type ModerationQueueQuery = {
  moderationQueue: {
    total: number
    items: Array<{
      id: string
      ownerId: string
      ownerEmail: string
      title: string
      description: string | null
      visibility: SchemaTypes.DeckVisibility
      moderationStatus: SchemaTypes.DeckModerationStatus
      isOfficial: boolean
      sourceDeckId: string | null
      cardCount: number
      createdAt: string
      updatedAt: string
    }>
  }
}

export type ApproveDeckMutationVariables = Exact<{
  deckId: string | number
}>

export type ApproveDeckMutation = {
  approveDeck: {
    id: string
    ownerId: string
    ownerEmail: string
    title: string
    description: string | null
    visibility: SchemaTypes.DeckVisibility
    moderationStatus: SchemaTypes.DeckModerationStatus
    isOfficial: boolean
    sourceDeckId: string | null
    cardCount: number
    createdAt: string
    updatedAt: string
  }
}

export type RejectDeckMutationVariables = Exact<{
  deckId: string | number
}>

export type RejectDeckMutation = {
  rejectDeck: {
    id: string
    ownerId: string
    ownerEmail: string
    title: string
    description: string | null
    visibility: SchemaTypes.DeckVisibility
    moderationStatus: SchemaTypes.DeckModerationStatus
    isOfficial: boolean
    sourceDeckId: string | null
    cardCount: number
    createdAt: string
    updatedAt: string
  }
}

export type HideDeckMutationVariables = Exact<{
  deckId: string | number
}>

export type HideDeckMutation = {
  hideDeck: {
    id: string
    ownerId: string
    ownerEmail: string
    title: string
    description: string | null
    visibility: SchemaTypes.DeckVisibility
    moderationStatus: SchemaTypes.DeckModerationStatus
    isOfficial: boolean
    sourceDeckId: string | null
    cardCount: number
    createdAt: string
    updatedAt: string
  }
}

export type SetOfficialDeckMutationVariables = Exact<{
  deckId: string | number
  isOfficial: boolean
}>

export type SetOfficialDeckMutation = {
  setOfficialDeck: {
    id: string
    ownerId: string
    ownerEmail: string
    title: string
    description: string | null
    visibility: SchemaTypes.DeckVisibility
    moderationStatus: SchemaTypes.DeckModerationStatus
    isOfficial: boolean
    sourceDeckId: string | null
    cardCount: number
    createdAt: string
    updatedAt: string
  }
}

export type GenerateCardExamplesMutationVariables = Exact<{
  input: SchemaTypes.GenerateCardExamplesInput
}>

export type GenerateCardExamplesMutation = {
  generateCardExamples: { cardId: string; examples: Array<{ text: string }> }
}

export type SaveGeneratedCardExampleMutationVariables = Exact<{
  input: SchemaTypes.SaveGeneratedCardExampleInput
}>

export type SaveGeneratedCardExampleMutation = {
  saveGeneratedCardExample: {
    card: {
      id: string
      deckId: string
      front: string
      back: string
      example: string | null
      notes: string | null
      position: number
      createdAt: string
      updatedAt: string
    }
  }
}

export type RegisterMutationVariables = Exact<{
  input: SchemaTypes.RegisterInput
}>

export type RegisterMutation = {
  register: {
    accessToken: string
    refreshToken: string | null
    user: {
      id: string
      email: string
      role: SchemaTypes.UserRole
      emailVerifiedAt: string | null
      blockedAt: string | null
      createdAt: string
      updatedAt: string
    }
  }
}

export type LoginMutationVariables = Exact<{
  input: SchemaTypes.LoginInput
}>

export type LoginMutation = {
  login: {
    accessToken: string
    refreshToken: string | null
    user: {
      id: string
      email: string
      role: SchemaTypes.UserRole
      emailVerifiedAt: string | null
      blockedAt: string | null
      createdAt: string
      updatedAt: string
    }
  }
}

export type RefreshTokenMutationVariables = Exact<{
  input: SchemaTypes.RefreshTokenInput
}>

export type RefreshTokenMutation = {
  refreshToken: {
    accessToken: string
    refreshToken: string | null
    user: {
      id: string
      email: string
      role: SchemaTypes.UserRole
      emailVerifiedAt: string | null
      blockedAt: string | null
      createdAt: string
      updatedAt: string
    }
  }
}

export type LogoutMutationVariables = Exact<{
  input: SchemaTypes.LogoutInput
}>

export type LogoutMutation = { logout: boolean }

export type MeQueryVariables = Exact<{ [key: string]: never }>

export type MeQuery = {
  me: {
    id: string
    email: string
    role: SchemaTypes.UserRole
    emailVerifiedAt: string | null
    blockedAt: string | null
    createdAt: string
    updatedAt: string
  }
}

export type VerifyEmailMutationVariables = Exact<{
  input: SchemaTypes.VerifyEmailInput
}>

export type VerifyEmailMutation = {
  verifyEmail: {
    id: string
    email: string
    role: SchemaTypes.UserRole
    emailVerifiedAt: string | null
    blockedAt: string | null
    createdAt: string
    updatedAt: string
  }
}

export type ResendVerificationEmailMutationVariables = Exact<{ [key: string]: never }>

export type ResendVerificationEmailMutation = { resendVerificationEmail: boolean }

export type RequestPasswordResetMutationVariables = Exact<{
  input: SchemaTypes.RequestPasswordResetInput
}>

export type RequestPasswordResetMutation = { requestPasswordReset: boolean }

export type ResetPasswordMutationVariables = Exact<{
  input: SchemaTypes.ResetPasswordInput
}>

export type ResetPasswordMutation = { resetPassword: boolean }

export type PreviewCsvImportMutationVariables = Exact<{
  input: SchemaTypes.PreviewCsvImportInput
}>

export type PreviewCsvImportMutation = {
  previewCsvImport: {
    id: string
    deckId: string
    status: SchemaTypes.CsvImportStatus
    totalRows: number
    validRows: number
    invalidRows: number
    createdAt: string
    confirmedAt: string | null
    expiresAt: string
    previewRows: Array<{
      rowNumber: number
      front: string
      back: string
      example: string | null
      notes: string | null
      isValid: boolean
      errors: Array<{ rowNumber: number; field: string; message: string }>
    }>
    errors: Array<{ rowNumber: number; field: string; message: string }>
  }
}

export type ConfirmCsvImportMutationVariables = Exact<{
  input: SchemaTypes.ConfirmCsvImportInput
}>

export type ConfirmCsvImportMutation = {
  confirmCsvImport: {
    createdCardsCount: number
    import: {
      id: string
      deckId: string
      status: SchemaTypes.CsvImportStatus
      totalRows: number
      validRows: number
      invalidRows: number
      createdAt: string
      confirmedAt: string | null
      expiresAt: string
    }
  }
}

export type CheckCardDuplicatesQueryVariables = Exact<{
  input: SchemaTypes.CheckCardDuplicatesInput
}>

export type CheckCardDuplicatesQuery = {
  checkCardDuplicates: {
    hits: Array<{ index: number; kind: SchemaTypes.CardDuplicateKind; deckTitle: string | null }>
  }
}

export type MyDecksQueryVariables = Exact<{ [key: string]: never }>

export type MyDecksQuery = {
  myDecks: Array<{
    id: string
    ownerId: string
    title: string
    description: string | null
    visibility: SchemaTypes.DeckVisibility
    moderationStatus: SchemaTypes.DeckModerationStatus
    isOfficial: boolean
    sourceDeckId: string | null
    targetLanguage: string | null
    sourceLanguage: string | null
    createdAt: string
    updatedAt: string
  }>
}

export type DecksPageQueryVariables = Exact<{
  input: SchemaTypes.DecksPageInput
}>

export type DecksPageQuery = {
  decksPage: {
    ownDecks: Array<{
      id: string
      ownerId: string
      title: string
      description: string | null
      visibility: SchemaTypes.DeckVisibility
      moderationStatus: SchemaTypes.DeckModerationStatus
      isOfficial: boolean
      sourceDeckId: string | null
      targetLanguage: string | null
      sourceLanguage: string | null
      origin: SchemaTypes.DeckOrigin
      createdAt: string
      updatedAt: string
    }>
    groupDecks: Array<{
      id: string
      ownerId: string
      title: string
      description: string | null
      visibility: SchemaTypes.DeckVisibility
      moderationStatus: SchemaTypes.DeckModerationStatus
      isOfficial: boolean
      sourceDeckId: string | null
      targetLanguage: string | null
      sourceLanguage: string | null
      origin: SchemaTypes.DeckOrigin
      createdAt: string
      updatedAt: string
    }>
    publicDecks: Array<{
      id: string
      ownerId: string
      title: string
      description: string | null
      visibility: SchemaTypes.DeckVisibility
      moderationStatus: SchemaTypes.DeckModerationStatus
      isOfficial: boolean
      sourceDeckId: string | null
      targetLanguage: string | null
      sourceLanguage: string | null
      origin: SchemaTypes.DeckOrigin
      createdAt: string
      updatedAt: string
    }>
    noLanguageDecks: Array<{
      id: string
      ownerId: string
      title: string
      description: string | null
      visibility: SchemaTypes.DeckVisibility
      moderationStatus: SchemaTypes.DeckModerationStatus
      isOfficial: boolean
      sourceDeckId: string | null
      targetLanguage: string | null
      sourceLanguage: string | null
      origin: SchemaTypes.DeckOrigin
      createdAt: string
      updatedAt: string
    }>
  }
}

export type DeckQueryVariables = Exact<{
  id: string
}>

export type DeckQuery = {
  deck: {
    id: string
    ownerId: string
    title: string
    description: string | null
    visibility: SchemaTypes.DeckVisibility
    moderationStatus: SchemaTypes.DeckModerationStatus
    isOfficial: boolean
    sourceDeckId: string | null
    targetLanguage: string | null
    sourceLanguage: string | null
    createdAt: string
    updatedAt: string
  }
}

export type DeckCardsQueryVariables = Exact<{
  deckId: string
}>

export type DeckCardsQuery = {
  deckCards: Array<{
    id: string
    deckId: string
    front: string
    back: string
    example: string | null
    notes: string | null
    position: number
    learningGroup: SchemaTypes.LearningGroup | null
    createdAt: string
    updatedAt: string
  }>
}

export type CreateDeckMutationVariables = Exact<{
  input: SchemaTypes.CreateDeckInput
}>

export type CreateDeckMutation = {
  createDeck: {
    deck: {
      id: string
      ownerId: string
      title: string
      description: string | null
      visibility: SchemaTypes.DeckVisibility
      moderationStatus: SchemaTypes.DeckModerationStatus
      isOfficial: boolean
      sourceDeckId: string | null
      targetLanguage: string | null
      sourceLanguage: string | null
      createdAt: string
      updatedAt: string
    }
    warnings: Array<{ code: SchemaTypes.DeckLanguageWarningCode; message: string }>
  }
}

export type UpdateDeckMutationVariables = Exact<{
  input: SchemaTypes.UpdateDeckInput
}>

export type UpdateDeckMutation = {
  updateDeck: {
    deck: {
      id: string
      ownerId: string
      title: string
      description: string | null
      visibility: SchemaTypes.DeckVisibility
      moderationStatus: SchemaTypes.DeckModerationStatus
      isOfficial: boolean
      sourceDeckId: string | null
      targetLanguage: string | null
      sourceLanguage: string | null
      createdAt: string
      updatedAt: string
    }
    warnings: Array<{ code: SchemaTypes.DeckLanguageWarningCode; message: string }>
  }
}

export type DeleteDeckMutationVariables = Exact<{
  deckId: string
}>

export type DeleteDeckMutation = { deleteDeck: boolean }

export type CreateCardMutationVariables = Exact<{
  input: SchemaTypes.CreateCardInput
}>

export type CreateCardMutation = {
  createCard: {
    id: string
    deckId: string
    front: string
    back: string
    example: string | null
    notes: string | null
    position: number
    createdAt: string
    updatedAt: string
  }
}

export type UpdateCardMutationVariables = Exact<{
  input: SchemaTypes.UpdateCardInput
}>

export type UpdateCardMutation = {
  updateCard: {
    id: string
    deckId: string
    front: string
    back: string
    example: string | null
    notes: string | null
    position: number
    createdAt: string
    updatedAt: string
  }
}

export type DeleteCardMutationVariables = Exact<{
  cardId: string
}>

export type DeleteCardMutation = { deleteCard: boolean }

export type PublishDeckMutationVariables = Exact<{
  deckId: string
}>

export type PublishDeckMutation = {
  publishDeck: {
    id: string
    ownerId: string
    title: string
    description: string | null
    visibility: SchemaTypes.DeckVisibility
    moderationStatus: SchemaTypes.DeckModerationStatus
    isOfficial: boolean
    sourceDeckId: string | null
    createdAt: string
    updatedAt: string
  }
}

export type UnpublishDeckMutationVariables = Exact<{
  deckId: string
}>

export type UnpublishDeckMutation = {
  unpublishDeck: {
    id: string
    ownerId: string
    title: string
    description: string | null
    visibility: SchemaTypes.DeckVisibility
    moderationStatus: SchemaTypes.DeckModerationStatus
    isOfficial: boolean
    sourceDeckId: string | null
    createdAt: string
    updatedAt: string
  }
}

export type MyGroupsQueryVariables = Exact<{ [key: string]: never }>

export type MyGroupsQuery = {
  myGroups: Array<{
    id: string
    name: string
    description: string | null
    createdById: string
    createdAt: string
    updatedAt: string
    myRole: SchemaTypes.GroupRole | null
    memberCount: number | null
    membersPreview: Array<{ userId: string; initials: string }>
  }>
}

export type GroupQueryVariables = Exact<{
  id: string
}>

export type GroupQuery = {
  group: {
    id: string
    name: string
    description: string | null
    createdById: string
    createdAt: string
    updatedAt: string
  }
}

export type CreateGroupMutationVariables = Exact<{
  input: SchemaTypes.CreateGroupInput
}>

export type CreateGroupMutation = {
  createGroup: {
    id: string
    name: string
    description: string | null
    createdById: string
    createdAt: string
    updatedAt: string
  }
}

export type InviteUserToGroupMutationVariables = Exact<{
  input: SchemaTypes.InviteUserToGroupInput
}>

export type InviteUserToGroupMutation = {
  inviteUserToGroup: {
    id: string
    groupId: string
    email: string
    invitedById: string
    status: SchemaTypes.GroupInvitationStatus
    expiresAt: string
    createdAt: string
    acceptedAt: string | null
    declinedAt: string | null
  }
}

export type MyGroupInvitationsQueryVariables = Exact<{ [key: string]: never }>

export type MyGroupInvitationsQuery = {
  myGroupInvitations: Array<{
    id: string
    groupId: string
    email: string
    invitedById: string
    status: SchemaTypes.GroupInvitationStatus
    expiresAt: string
    createdAt: string
    acceptedAt: string | null
    declinedAt: string | null
    groupName: string | null
    invitedByEmail: string | null
    memberCount: number | null
    sharedDeckCount: number | null
  }>
}

export type AcceptGroupInvitationMutationVariables = Exact<{
  invitationId: string
}>

export type AcceptGroupInvitationMutation = {
  acceptGroupInvitation: {
    invitation: {
      id: string
      groupId: string
      email: string
      status: SchemaTypes.GroupInvitationStatus
      acceptedAt: string | null
    }
    member: {
      id: string
      groupId: string
      userId: string
      role: SchemaTypes.GroupRole
      createdAt: string
    }
  }
}

export type DeclineGroupInvitationMutationVariables = Exact<{
  invitationId: string
}>

export type DeclineGroupInvitationMutation = {
  declineGroupInvitation: {
    id: string
    groupId: string
    email: string
    status: SchemaTypes.GroupInvitationStatus
    declinedAt: string | null
  }
}

export type ShareDeckWithGroupMutationVariables = Exact<{
  input: SchemaTypes.ShareDeckWithGroupInput
}>

export type ShareDeckWithGroupMutation = {
  shareDeckWithGroup: {
    share: {
      id: string
      deckId: string
      groupId: string
      permission: SchemaTypes.DeckGroupSharePermission
      createdById: string
      createdAt: string
    }
  }
}

export type GroupSharedDecksQueryVariables = Exact<{
  groupId: string
}>

export type GroupSharedDecksQuery = {
  groupSharedDecks: Array<{
    id: string
    ownerId: string
    title: string
    description: string | null
    visibility: SchemaTypes.DeckVisibility
    moderationStatus: SchemaTypes.DeckModerationStatus
    isOfficial: boolean
    sourceDeckId: string | null
    targetLanguage: string | null
    sourceLanguage: string | null
    createdAt: string
    updatedAt: string
  }>
}

export type CopyGroupDeckMutationVariables = Exact<{
  sourceDeckId: string
}>

export type CopyGroupDeckMutation = {
  copyGroupDeck: {
    deck: {
      id: string
      ownerId: string
      title: string
      description: string | null
      visibility: SchemaTypes.DeckVisibility
      moderationStatus: SchemaTypes.DeckModerationStatus
      isOfficial: boolean
      sourceDeckId: string | null
      targetLanguage: string | null
      sourceLanguage: string | null
      createdAt: string
      updatedAt: string
    }
    cards: Array<{
      id: string
      deckId: string
      front: string
      back: string
      example: string | null
      notes: string | null
      createdAt: string
      updatedAt: string
    }>
  }
}

export type LessonCardFieldsFragment = {
  cardId: string
  deckId: string
  front: string
  back: string
  example: string | null
  notes: string | null
  position: number
  learningStep: number
  learningGroup: SchemaTypes.LearningGroup
  presentationMode: SchemaTypes.ReviewPresentationMode
  reviewState: {
    id: string
    learningStep: number
    longReviewSuccessCount: number
    dueAt: string
    lastReviewedAt: string | null
  }
}

export type StartLessonMutationVariables = Exact<{
  input: SchemaTypes.StartLessonInput
}>

export type StartLessonMutation = {
  startLesson: {
    sessionId: string | null
    deckId: string | null
    scope: SchemaTypes.StudySessionScope
    lessonSize: number
    totalCards: number
    cards: Array<{
      cardId: string
      deckId: string
      front: string
      back: string
      example: string | null
      notes: string | null
      position: number
      learningStep: number
      learningGroup: SchemaTypes.LearningGroup
      presentationMode: SchemaTypes.ReviewPresentationMode
      reviewState: {
        id: string
        learningStep: number
        longReviewSuccessCount: number
        dueAt: string
        lastReviewedAt: string | null
      }
    }>
  }
}

export type StartHomeLessonMutationVariables = Exact<{
  input: SchemaTypes.StartHomeLessonInput
}>

export type StartHomeLessonMutation = {
  startHomeLesson: {
    sessionId: string | null
    deckId: string | null
    scope: SchemaTypes.StudySessionScope
    lessonSize: number
    totalCards: number
    cards: Array<{
      cardId: string
      deckId: string
      front: string
      back: string
      example: string | null
      notes: string | null
      position: number
      learningStep: number
      learningGroup: SchemaTypes.LearningGroup
      presentationMode: SchemaTypes.ReviewPresentationMode
      reviewState: {
        id: string
        learningStep: number
        longReviewSuccessCount: number
        dueAt: string
        lastReviewedAt: string | null
      }
    }>
  }
}

export type SubmitReviewMutationVariables = Exact<{
  input: SchemaTypes.SubmitReviewInput
}>

export type SubmitReviewMutation = {
  submitReview: {
    sessionId: string
    cardId: string
    reviewedCards: number
    reviewState: {
      id: string
      learningStep: number
      longReviewSuccessCount: number
      dueAt: string
      lastReviewedAt: string | null
    }
    nextCard: {
      cardId: string
      deckId: string
      front: string
      back: string
      example: string | null
      notes: string | null
      position: number
      learningStep: number
      learningGroup: SchemaTypes.LearningGroup
      presentationMode: SchemaTypes.ReviewPresentationMode
      reviewState: {
        id: string
        learningStep: number
        longReviewSuccessCount: number
        dueAt: string
        lastReviewedAt: string | null
      }
    } | null
  }
}

export type DisableAudioOnlyMutationVariables = Exact<{
  input: SchemaTypes.DisableAudioOnlyInput
}>

export type DisableAudioOnlyMutation = {
  disableAudioOnly: {
    cardId: string
    deckId: string
    front: string
    back: string
    example: string | null
    notes: string | null
    position: number
    learningStep: number
    learningGroup: SchemaTypes.LearningGroup
    presentationMode: SchemaTypes.ReviewPresentationMode
    reviewState: {
      id: string
      learningStep: number
      longReviewSuccessCount: number
      dueAt: string
      lastReviewedAt: string | null
    }
  }
}

export type CompleteLessonMutationVariables = Exact<{
  input: SchemaTypes.CompleteLessonInput
}>

export type CompleteLessonMutation = {
  completeLesson: {
    sessionId: string
    deckId: string | null
    totalCards: number
    reviewedCards: number
    knownCount: number
    dontKnowCount: number
    completedAt: string
  }
}

export type AbandonLessonMutationVariables = Exact<{
  input: SchemaTypes.AbandonLessonInput
}>

export type AbandonLessonMutation = { abandonLesson: { success: boolean } }

export type DeckLearningStatsQueryVariables = Exact<{
  deckId: string
}>

export type DeckLearningStatsQuery = {
  deckLearningStats: {
    deckId: string
    totalCards: number
    toLearnCount: number
    practicedCount: number
    learnedCount: number
    dueCount: number
    nextDueAt: string | null
  }
}

export type HomeLearningProgressQueryVariables = Exact<{ [key: string]: never }>

export type HomeLearningProgressQuery = {
  homeLearningProgress: {
    activeTargetLanguage: string | null
    toLearnCount: number
    practicedCount: number
    learnedCount: number
    dueCount: number
    totalCardCount: number
  }
}

export type RegisterPushTokenMutationVariables = Exact<{
  input: SchemaTypes.RegisterPushTokenInput
}>

export type RegisterPushTokenMutation = { registerPushToken: { success: boolean } }

export type RemovePushTokenMutationVariables = Exact<{
  input: SchemaTypes.RemovePushTokenInput
}>

export type RemovePushTokenMutation = { removePushToken: boolean }

export type ProfileMeQueryVariables = Exact<{ [key: string]: never }>

export type ProfileMeQuery = {
  me: {
    id: string
    email: string
    role: SchemaTypes.UserRole
    emailVerifiedAt: string | null
    blockedAt: string | null
    createdAt: string
    updatedAt: string
  }
}

export type DeleteAccountMutationVariables = Exact<{ [key: string]: never }>

export type DeleteAccountMutation = { deleteAccount: boolean }

export type PublicDecksQueryVariables = Exact<{
  input?: SchemaTypes.PublicDecksInput | null | undefined
}>

export type PublicDecksQuery = {
  publicDecks: {
    total: number
    items: Array<{
      id: string
      ownerId: string
      title: string
      description: string | null
      visibility: SchemaTypes.DeckVisibility
      moderationStatus: SchemaTypes.DeckModerationStatus
      isOfficial: boolean
      sourceDeckId: string | null
      targetLanguage: string | null
      sourceLanguage: string | null
      createdAt: string
      updatedAt: string
    }>
  }
}

export type PublicDeckQueryVariables = Exact<{
  deckId: string
}>

export type PublicDeckQuery = {
  publicDeck: {
    id: string
    ownerId: string
    title: string
    description: string | null
    visibility: SchemaTypes.DeckVisibility
    moderationStatus: SchemaTypes.DeckModerationStatus
    isOfficial: boolean
    sourceDeckId: string | null
    targetLanguage: string | null
    sourceLanguage: string | null
    createdAt: string
    updatedAt: string
  }
}

export type PublicDeckCardsQueryVariables = Exact<{
  deckId: string
}>

export type PublicDeckCardsQuery = {
  publicDeckCards: Array<{
    id: string
    deckId: string
    front: string
    back: string
    example: string | null
    notes: string | null
    position: number
    createdAt: string
    updatedAt: string
  }>
}

export type CopyPublicDeckMutationVariables = Exact<{
  sourceDeckId: string
}>

export type CopyPublicDeckMutation = {
  copyPublicDeck: {
    deck: {
      id: string
      ownerId: string
      title: string
      description: string | null
      visibility: SchemaTypes.DeckVisibility
      moderationStatus: SchemaTypes.DeckModerationStatus
      isOfficial: boolean
      sourceDeckId: string | null
      createdAt: string
      updatedAt: string
    }
    cards: Array<{
      id: string
      deckId: string
      front: string
      back: string
      example: string | null
      notes: string | null
      position: number
      createdAt: string
      updatedAt: string
    }>
  }
}

export type MySettingsQueryVariables = Exact<{ [key: string]: never }>

export type MySettingsQuery = {
  myAccount: {
    settings: {
      userId: string
      interfaceLocale: string
      lessonSize: number
      notificationsEnabled: boolean
      reminderTime: string
      timezone: string
      nativeLanguage: string
      createdAt: string
      updatedAt: string
    }
  }
}

export type UpdateMySettingsMutationVariables = Exact<{
  input: SchemaTypes.UpdateSettingsInput
}>

export type UpdateMySettingsMutation = {
  updateSettings: {
    userId: string
    interfaceLocale: string
    lessonSize: number
    notificationsEnabled: boolean
    reminderTime: string
    timezone: string
    nativeLanguage: string
    createdAt: string
    updatedAt: string
  }
}

export type LanguagesQueryVariables = Exact<{
  search?: string | null | undefined
}>

export type LanguagesQuery = {
  languages: Array<{
    code: string
    englishName: string
    nativeName: string
    flag: string
    popularSortOrder: number | null
  }>
}

export type MyStudyLanguagesQueryVariables = Exact<{ [key: string]: never }>

export type MyStudyLanguagesQuery = {
  myStudyLanguages: Array<{
    languageCode: string
    isActive: boolean
    createdAt: string
    language: {
      code: string
      englishName: string
      nativeName: string
      flag: string
      popularSortOrder: number | null
    }
  }>
}

export type StudyLanguageBootstrapQueryVariables = Exact<{ [key: string]: never }>

export type StudyLanguageBootstrapQuery = {
  myAccount: {
    needsStudyLanguageOnboarding: boolean
    settings: { activeTargetLanguage: string | null; nativeLanguage: string }
    studyLanguages: Array<{
      languageCode: string
      isActive: boolean
      createdAt: string
      language: {
        code: string
        englishName: string
        nativeName: string
        flag: string
        popularSortOrder: number | null
      }
    }>
  }
}

export type StudyLanguageRemovalImpactQueryVariables = Exact<{
  languageCode: string
}>

export type StudyLanguageRemovalImpactQuery = {
  studyLanguageRemovalImpact: { affectedDeckCount: number }
}

export type AddStudyLanguageMutationVariables = Exact<{
  languageCode: string
}>

export type AddStudyLanguageMutation = {
  addStudyLanguage: {
    languageCode: string
    isActive: boolean
    createdAt: string
    language: {
      code: string
      englishName: string
      nativeName: string
      flag: string
      popularSortOrder: number | null
    }
  }
}

export type RemoveStudyLanguageMutationVariables = Exact<{
  languageCode: string
}>

export type RemoveStudyLanguageMutation = {
  removeStudyLanguage: Array<{
    languageCode: string
    isActive: boolean
    createdAt: string
    language: {
      code: string
      englishName: string
      nativeName: string
      flag: string
      popularSortOrder: number | null
    }
  }>
}

export type SetActiveTargetLanguageMutationVariables = Exact<{
  languageCode: string
}>

export type SetActiveTargetLanguageMutation = {
  setActiveTargetLanguage: Array<{
    languageCode: string
    isActive: boolean
    createdAt: string
    language: {
      code: string
      englishName: string
      nativeName: string
      flag: string
      popularSortOrder: number | null
    }
  }>
}

export type CompleteStudyLanguageOnboardingMutationVariables = Exact<{
  input: SchemaTypes.CompleteStudyLanguageOnboardingInput
}>

export type CompleteStudyLanguageOnboardingMutation = {
  completeStudyLanguageOnboarding: {
    needsStudyLanguageOnboarding: boolean
    studyLanguages: Array<{
      languageCode: string
      isActive: boolean
      createdAt: string
      language: {
        code: string
        englishName: string
        nativeName: string
        flag: string
        popularSortOrder: number | null
      }
    }>
  }
}

export type StartPublicDeckCopyPreviewMutationVariables = Exact<{
  input: SchemaTypes.StartPublicDeckCopyPreviewInput
}>

export type StartPublicDeckCopyPreviewMutation = {
  startPublicDeckCopyPreview: {
    id: string
    type: SchemaTypes.DeckPreviewSessionType
    status: SchemaTypes.DeckPreviewSessionStatus
    sourceDeckId: string | null
    targetLanguage: string
    chosenSourceLanguage: string
    expiresAt: string
    createdAt: string
    updatedAt: string
    cards: Array<{
      sourceCardId: string | null
      front: string
      back: string
      example: string | null
      backError: string | null
      exampleError: string | null
    }>
  }
}

export type StartGroupDeckCopyPreviewMutationVariables = Exact<{
  input: SchemaTypes.StartGroupDeckCopyPreviewInput
}>

export type StartGroupDeckCopyPreviewMutation = {
  startGroupDeckCopyPreview: {
    id: string
    type: SchemaTypes.DeckPreviewSessionType
    status: SchemaTypes.DeckPreviewSessionStatus
    sourceDeckId: string | null
    targetLanguage: string
    chosenSourceLanguage: string
    expiresAt: string
    createdAt: string
    updatedAt: string
    cards: Array<{
      sourceCardId: string | null
      front: string
      back: string
      example: string | null
      backError: string | null
      exampleError: string | null
    }>
  }
}

export type ActiveDeckPreviewQueryVariables = Exact<{ [key: string]: never }>

export type ActiveDeckPreviewQuery = {
  activeDeckPreview: {
    id: string
    type: SchemaTypes.DeckPreviewSessionType
    status: SchemaTypes.DeckPreviewSessionStatus
    sourceDeckId: string | null
    targetLanguage: string
    chosenSourceLanguage: string
    expiresAt: string
    createdAt: string
    updatedAt: string
    cards: Array<{
      sourceCardId: string | null
      front: string
      back: string
      example: string | null
      backError: string | null
      exampleError: string | null
    }>
  } | null
}

export type UpdateDeckPreviewCardMutationVariables = Exact<{
  input: SchemaTypes.UpdateDeckPreviewCardInput
}>

export type UpdateDeckPreviewCardMutation = {
  updateDeckPreviewCard: {
    id: string
    type: SchemaTypes.DeckPreviewSessionType
    status: SchemaTypes.DeckPreviewSessionStatus
    sourceDeckId: string | null
    targetLanguage: string
    chosenSourceLanguage: string
    expiresAt: string
    createdAt: string
    updatedAt: string
    cards: Array<{
      sourceCardId: string | null
      front: string
      back: string
      example: string | null
      backError: string | null
      exampleError: string | null
    }>
  }
}

export type ConfirmDeckPreviewMutationVariables = Exact<{
  sessionId: string
}>

export type ConfirmDeckPreviewMutation = {
  confirmDeckPreview: {
    deck: {
      id: string
      ownerId: string
      title: string
      description: string | null
      visibility: SchemaTypes.DeckVisibility
      moderationStatus: SchemaTypes.DeckModerationStatus
      isOfficial: boolean
      sourceDeckId: string | null
      targetLanguage: string | null
      sourceLanguage: string | null
      createdAt: string
      updatedAt: string
    }
    cards: Array<{
      id: string
      deckId: string
      front: string
      back: string
      example: string | null
      notes: string | null
      position: number
      createdAt: string
      updatedAt: string
    }>
  }
}

export type CancelDeckPreviewMutationVariables = Exact<{
  sessionId: string
}>

export type CancelDeckPreviewMutation = { cancelDeckPreview: boolean }

export type StartDeckRegeneratePreviewMutationVariables = Exact<{
  input: SchemaTypes.StartDeckRegeneratePreviewInput
}>

export type StartDeckRegeneratePreviewMutation = {
  startDeckRegeneratePreview: {
    id: string
    type: SchemaTypes.DeckPreviewSessionType
    status: SchemaTypes.DeckPreviewSessionStatus
    sourceDeckId: string | null
    targetLanguage: string
    chosenSourceLanguage: string
    expiresAt: string
    createdAt: string
    updatedAt: string
    cards: Array<{
      sourceCardId: string | null
      front: string
      back: string
      example: string | null
      backError: string | null
      exampleError: string | null
    }>
  }
}

export type AccountLocaleQueryVariables = Exact<{ [key: string]: never }>

export type AccountLocaleQuery = { myAccount: { settings: { interfaceLocale: string } } }

export const LessonCardFieldsFragmentDoc = gql`
  fragment LessonCardFields on LessonCard {
    cardId
    deckId
    front
    back
    example
    notes
    position
    learningStep
    learningGroup
    presentationMode
    reviewState {
      id
      learningStep
      longReviewSuccessCount
      dueAt
      lastReviewedAt
    }
  }
`
export const AdminDashboardStatsDocument = gql`
  query AdminDashboardStats {
    adminDashboardStats {
      totalUsers
      totalDecks
      totalPublicDecks
      totalCards
      totalStudySessions
      totalReviews
      usersCreatedLast7Days
      decksCreatedLast7Days
      reviewsSubmittedLast7Days
    }
  }
`

/**
 * __useAdminDashboardStatsQuery__
 *
 * To run a query within a React component, call `useAdminDashboardStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminDashboardStatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminDashboardStatsQuery({
 *   variables: {
 *   },
 * });
 */
export function useAdminDashboardStatsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    AdminDashboardStatsQuery,
    AdminDashboardStatsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<AdminDashboardStatsQuery, AdminDashboardStatsQueryVariables>(
    AdminDashboardStatsDocument,
    options,
  )
}
export function useAdminDashboardStatsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    AdminDashboardStatsQuery,
    AdminDashboardStatsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<AdminDashboardStatsQuery, AdminDashboardStatsQueryVariables>(
    AdminDashboardStatsDocument,
    options,
  )
}
// @ts-ignore
export function useAdminDashboardStatsSuspenseQuery(
  baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<
    AdminDashboardStatsQuery,
    AdminDashboardStatsQueryVariables
  >,
): ApolloReactHooks.UseSuspenseQueryResult<
  AdminDashboardStatsQuery,
  AdminDashboardStatsQueryVariables
>
export function useAdminDashboardStatsSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<
        AdminDashboardStatsQuery,
        AdminDashboardStatsQueryVariables
      >,
): ApolloReactHooks.UseSuspenseQueryResult<
  AdminDashboardStatsQuery | undefined,
  AdminDashboardStatsQueryVariables
>
export function useAdminDashboardStatsSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<
        AdminDashboardStatsQuery,
        AdminDashboardStatsQueryVariables
      >,
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<
    AdminDashboardStatsQuery,
    AdminDashboardStatsQueryVariables
  >(AdminDashboardStatsDocument, options)
}
export type AdminDashboardStatsQueryHookResult = ReturnType<typeof useAdminDashboardStatsQuery>
export type AdminDashboardStatsLazyQueryHookResult = ReturnType<
  typeof useAdminDashboardStatsLazyQuery
>
export type AdminDashboardStatsSuspenseQueryHookResult = ReturnType<
  typeof useAdminDashboardStatsSuspenseQuery
>
export type AdminDashboardStatsQueryResult = Apollo.QueryResult<
  AdminDashboardStatsQuery,
  AdminDashboardStatsQueryVariables
>
export const AdminSearchUsersDocument = gql`
  query AdminSearchUsers($input: AdminSearchUsersInput) {
    adminSearchUsers(input: $input) {
      items {
        id
        email
        role
        emailVerifiedAt
        blockedAt
        createdAt
        updatedAt
      }
      total
    }
  }
`

/**
 * __useAdminSearchUsersQuery__
 *
 * To run a query within a React component, call `useAdminSearchUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminSearchUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminSearchUsersQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminSearchUsersQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    AdminSearchUsersQuery,
    AdminSearchUsersQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<AdminSearchUsersQuery, AdminSearchUsersQueryVariables>(
    AdminSearchUsersDocument,
    options,
  )
}
export function useAdminSearchUsersLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    AdminSearchUsersQuery,
    AdminSearchUsersQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<AdminSearchUsersQuery, AdminSearchUsersQueryVariables>(
    AdminSearchUsersDocument,
    options,
  )
}
// @ts-ignore
export function useAdminSearchUsersSuspenseQuery(
  baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<
    AdminSearchUsersQuery,
    AdminSearchUsersQueryVariables
  >,
): ApolloReactHooks.UseSuspenseQueryResult<AdminSearchUsersQuery, AdminSearchUsersQueryVariables>
export function useAdminSearchUsersSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<
        AdminSearchUsersQuery,
        AdminSearchUsersQueryVariables
      >,
): ApolloReactHooks.UseSuspenseQueryResult<
  AdminSearchUsersQuery | undefined,
  AdminSearchUsersQueryVariables
>
export function useAdminSearchUsersSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<
        AdminSearchUsersQuery,
        AdminSearchUsersQueryVariables
      >,
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<AdminSearchUsersQuery, AdminSearchUsersQueryVariables>(
    AdminSearchUsersDocument,
    options,
  )
}
export type AdminSearchUsersQueryHookResult = ReturnType<typeof useAdminSearchUsersQuery>
export type AdminSearchUsersLazyQueryHookResult = ReturnType<typeof useAdminSearchUsersLazyQuery>
export type AdminSearchUsersSuspenseQueryHookResult = ReturnType<
  typeof useAdminSearchUsersSuspenseQuery
>
export type AdminSearchUsersQueryResult = Apollo.QueryResult<
  AdminSearchUsersQuery,
  AdminSearchUsersQueryVariables
>
export const BlockUserDocument = gql`
  mutation BlockUser($userId: ID!) {
    blockUser(userId: $userId) {
      id
      email
      role
      emailVerifiedAt
      blockedAt
      createdAt
      updatedAt
    }
  }
`
export type BlockUserMutationFn = Apollo.MutationFunction<
  BlockUserMutation,
  BlockUserMutationVariables
>

/**
 * __useBlockUserMutation__
 *
 * To run a mutation, you first call `useBlockUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBlockUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [blockUserMutation, { data, loading, error }] = useBlockUserMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useBlockUserMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<BlockUserMutation, BlockUserMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<BlockUserMutation, BlockUserMutationVariables>(
    BlockUserDocument,
    options,
  )
}
export type BlockUserMutationHookResult = ReturnType<typeof useBlockUserMutation>
export type BlockUserMutationResult = Apollo.MutationResult<BlockUserMutation>
export type BlockUserMutationOptions = Apollo.BaseMutationOptions<
  BlockUserMutation,
  BlockUserMutationVariables
>
export const UnblockUserDocument = gql`
  mutation UnblockUser($userId: ID!) {
    unblockUser(userId: $userId) {
      id
      email
      role
      emailVerifiedAt
      blockedAt
      createdAt
      updatedAt
    }
  }
`
export type UnblockUserMutationFn = Apollo.MutationFunction<
  UnblockUserMutation,
  UnblockUserMutationVariables
>

/**
 * __useUnblockUserMutation__
 *
 * To run a mutation, you first call `useUnblockUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnblockUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unblockUserMutation, { data, loading, error }] = useUnblockUserMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useUnblockUserMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UnblockUserMutation,
    UnblockUserMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<UnblockUserMutation, UnblockUserMutationVariables>(
    UnblockUserDocument,
    options,
  )
}
export type UnblockUserMutationHookResult = ReturnType<typeof useUnblockUserMutation>
export type UnblockUserMutationResult = Apollo.MutationResult<UnblockUserMutation>
export type UnblockUserMutationOptions = Apollo.BaseMutationOptions<
  UnblockUserMutation,
  UnblockUserMutationVariables
>
export const ModerationQueueDocument = gql`
  query ModerationQueue($input: ModerationQueueInput) {
    moderationQueue(input: $input) {
      items {
        id
        ownerId
        ownerEmail
        title
        description
        visibility
        moderationStatus
        isOfficial
        sourceDeckId
        cardCount
        createdAt
        updatedAt
      }
      total
    }
  }
`

/**
 * __useModerationQueueQuery__
 *
 * To run a query within a React component, call `useModerationQueueQuery` and pass it any options that fit your needs.
 * When your component renders, `useModerationQueueQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useModerationQueueQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useModerationQueueQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ModerationQueueQuery,
    ModerationQueueQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<ModerationQueueQuery, ModerationQueueQueryVariables>(
    ModerationQueueDocument,
    options,
  )
}
export function useModerationQueueLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ModerationQueueQuery,
    ModerationQueueQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<ModerationQueueQuery, ModerationQueueQueryVariables>(
    ModerationQueueDocument,
    options,
  )
}
// @ts-ignore
export function useModerationQueueSuspenseQuery(
  baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<
    ModerationQueueQuery,
    ModerationQueueQueryVariables
  >,
): ApolloReactHooks.UseSuspenseQueryResult<ModerationQueueQuery, ModerationQueueQueryVariables>
export function useModerationQueueSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<
        ModerationQueueQuery,
        ModerationQueueQueryVariables
      >,
): ApolloReactHooks.UseSuspenseQueryResult<
  ModerationQueueQuery | undefined,
  ModerationQueueQueryVariables
>
export function useModerationQueueSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<
        ModerationQueueQuery,
        ModerationQueueQueryVariables
      >,
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<ModerationQueueQuery, ModerationQueueQueryVariables>(
    ModerationQueueDocument,
    options,
  )
}
export type ModerationQueueQueryHookResult = ReturnType<typeof useModerationQueueQuery>
export type ModerationQueueLazyQueryHookResult = ReturnType<typeof useModerationQueueLazyQuery>
export type ModerationQueueSuspenseQueryHookResult = ReturnType<
  typeof useModerationQueueSuspenseQuery
>
export type ModerationQueueQueryResult = Apollo.QueryResult<
  ModerationQueueQuery,
  ModerationQueueQueryVariables
>
export const ApproveDeckDocument = gql`
  mutation ApproveDeck($deckId: ID!) {
    approveDeck(deckId: $deckId) {
      id
      ownerId
      ownerEmail
      title
      description
      visibility
      moderationStatus
      isOfficial
      sourceDeckId
      cardCount
      createdAt
      updatedAt
    }
  }
`
export type ApproveDeckMutationFn = Apollo.MutationFunction<
  ApproveDeckMutation,
  ApproveDeckMutationVariables
>

/**
 * __useApproveDeckMutation__
 *
 * To run a mutation, you first call `useApproveDeckMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useApproveDeckMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [approveDeckMutation, { data, loading, error }] = useApproveDeckMutation({
 *   variables: {
 *      deckId: // value for 'deckId'
 *   },
 * });
 */
export function useApproveDeckMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    ApproveDeckMutation,
    ApproveDeckMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<ApproveDeckMutation, ApproveDeckMutationVariables>(
    ApproveDeckDocument,
    options,
  )
}
export type ApproveDeckMutationHookResult = ReturnType<typeof useApproveDeckMutation>
export type ApproveDeckMutationResult = Apollo.MutationResult<ApproveDeckMutation>
export type ApproveDeckMutationOptions = Apollo.BaseMutationOptions<
  ApproveDeckMutation,
  ApproveDeckMutationVariables
>
export const RejectDeckDocument = gql`
  mutation RejectDeck($deckId: ID!) {
    rejectDeck(deckId: $deckId) {
      id
      ownerId
      ownerEmail
      title
      description
      visibility
      moderationStatus
      isOfficial
      sourceDeckId
      cardCount
      createdAt
      updatedAt
    }
  }
`
export type RejectDeckMutationFn = Apollo.MutationFunction<
  RejectDeckMutation,
  RejectDeckMutationVariables
>

/**
 * __useRejectDeckMutation__
 *
 * To run a mutation, you first call `useRejectDeckMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRejectDeckMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [rejectDeckMutation, { data, loading, error }] = useRejectDeckMutation({
 *   variables: {
 *      deckId: // value for 'deckId'
 *   },
 * });
 */
export function useRejectDeckMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    RejectDeckMutation,
    RejectDeckMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<RejectDeckMutation, RejectDeckMutationVariables>(
    RejectDeckDocument,
    options,
  )
}
export type RejectDeckMutationHookResult = ReturnType<typeof useRejectDeckMutation>
export type RejectDeckMutationResult = Apollo.MutationResult<RejectDeckMutation>
export type RejectDeckMutationOptions = Apollo.BaseMutationOptions<
  RejectDeckMutation,
  RejectDeckMutationVariables
>
export const HideDeckDocument = gql`
  mutation HideDeck($deckId: ID!) {
    hideDeck(deckId: $deckId) {
      id
      ownerId
      ownerEmail
      title
      description
      visibility
      moderationStatus
      isOfficial
      sourceDeckId
      cardCount
      createdAt
      updatedAt
    }
  }
`
export type HideDeckMutationFn = Apollo.MutationFunction<
  HideDeckMutation,
  HideDeckMutationVariables
>

/**
 * __useHideDeckMutation__
 *
 * To run a mutation, you first call `useHideDeckMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useHideDeckMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [hideDeckMutation, { data, loading, error }] = useHideDeckMutation({
 *   variables: {
 *      deckId: // value for 'deckId'
 *   },
 * });
 */
export function useHideDeckMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<HideDeckMutation, HideDeckMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<HideDeckMutation, HideDeckMutationVariables>(
    HideDeckDocument,
    options,
  )
}
export type HideDeckMutationHookResult = ReturnType<typeof useHideDeckMutation>
export type HideDeckMutationResult = Apollo.MutationResult<HideDeckMutation>
export type HideDeckMutationOptions = Apollo.BaseMutationOptions<
  HideDeckMutation,
  HideDeckMutationVariables
>
export const SetOfficialDeckDocument = gql`
  mutation SetOfficialDeck($deckId: ID!, $isOfficial: Boolean!) {
    setOfficialDeck(deckId: $deckId, isOfficial: $isOfficial) {
      id
      ownerId
      ownerEmail
      title
      description
      visibility
      moderationStatus
      isOfficial
      sourceDeckId
      cardCount
      createdAt
      updatedAt
    }
  }
`
export type SetOfficialDeckMutationFn = Apollo.MutationFunction<
  SetOfficialDeckMutation,
  SetOfficialDeckMutationVariables
>

/**
 * __useSetOfficialDeckMutation__
 *
 * To run a mutation, you first call `useSetOfficialDeckMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetOfficialDeckMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setOfficialDeckMutation, { data, loading, error }] = useSetOfficialDeckMutation({
 *   variables: {
 *      deckId: // value for 'deckId'
 *      isOfficial: // value for 'isOfficial'
 *   },
 * });
 */
export function useSetOfficialDeckMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    SetOfficialDeckMutation,
    SetOfficialDeckMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<SetOfficialDeckMutation, SetOfficialDeckMutationVariables>(
    SetOfficialDeckDocument,
    options,
  )
}
export type SetOfficialDeckMutationHookResult = ReturnType<typeof useSetOfficialDeckMutation>
export type SetOfficialDeckMutationResult = Apollo.MutationResult<SetOfficialDeckMutation>
export type SetOfficialDeckMutationOptions = Apollo.BaseMutationOptions<
  SetOfficialDeckMutation,
  SetOfficialDeckMutationVariables
>
export const GenerateCardExamplesDocument = gql`
  mutation GenerateCardExamples($input: GenerateCardExamplesInput!) {
    generateCardExamples(input: $input) {
      cardId
      examples {
        text
      }
    }
  }
`
export type GenerateCardExamplesMutationFn = Apollo.MutationFunction<
  GenerateCardExamplesMutation,
  GenerateCardExamplesMutationVariables
>

/**
 * __useGenerateCardExamplesMutation__
 *
 * To run a mutation, you first call `useGenerateCardExamplesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGenerateCardExamplesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [generateCardExamplesMutation, { data, loading, error }] = useGenerateCardExamplesMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGenerateCardExamplesMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    GenerateCardExamplesMutation,
    GenerateCardExamplesMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    GenerateCardExamplesMutation,
    GenerateCardExamplesMutationVariables
  >(GenerateCardExamplesDocument, options)
}
export type GenerateCardExamplesMutationHookResult = ReturnType<
  typeof useGenerateCardExamplesMutation
>
export type GenerateCardExamplesMutationResult = Apollo.MutationResult<GenerateCardExamplesMutation>
export type GenerateCardExamplesMutationOptions = Apollo.BaseMutationOptions<
  GenerateCardExamplesMutation,
  GenerateCardExamplesMutationVariables
>
export const SaveGeneratedCardExampleDocument = gql`
  mutation SaveGeneratedCardExample($input: SaveGeneratedCardExampleInput!) {
    saveGeneratedCardExample(input: $input) {
      card {
        id
        deckId
        front
        back
        example
        notes
        position
        createdAt
        updatedAt
      }
    }
  }
`
export type SaveGeneratedCardExampleMutationFn = Apollo.MutationFunction<
  SaveGeneratedCardExampleMutation,
  SaveGeneratedCardExampleMutationVariables
>

/**
 * __useSaveGeneratedCardExampleMutation__
 *
 * To run a mutation, you first call `useSaveGeneratedCardExampleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveGeneratedCardExampleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveGeneratedCardExampleMutation, { data, loading, error }] = useSaveGeneratedCardExampleMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSaveGeneratedCardExampleMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    SaveGeneratedCardExampleMutation,
    SaveGeneratedCardExampleMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    SaveGeneratedCardExampleMutation,
    SaveGeneratedCardExampleMutationVariables
  >(SaveGeneratedCardExampleDocument, options)
}
export type SaveGeneratedCardExampleMutationHookResult = ReturnType<
  typeof useSaveGeneratedCardExampleMutation
>
export type SaveGeneratedCardExampleMutationResult =
  Apollo.MutationResult<SaveGeneratedCardExampleMutation>
export type SaveGeneratedCardExampleMutationOptions = Apollo.BaseMutationOptions<
  SaveGeneratedCardExampleMutation,
  SaveGeneratedCardExampleMutationVariables
>
export const RegisterDocument = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      accessToken
      refreshToken
      user {
        id
        email
        role
        emailVerifiedAt
        blockedAt
        createdAt
        updatedAt
      }
    }
  }
`
export type RegisterMutationFn = Apollo.MutationFunction<
  RegisterMutation,
  RegisterMutationVariables
>

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRegisterMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<RegisterMutation, RegisterMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<RegisterMutation, RegisterMutationVariables>(
    RegisterDocument,
    options,
  )
}
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>
export type RegisterMutationOptions = Apollo.BaseMutationOptions<
  RegisterMutation,
  RegisterMutationVariables
>
export const LoginDocument = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      refreshToken
      user {
        id
        email
        role
        emailVerifiedAt
        blockedAt
        createdAt
        updatedAt
      }
    }
  }
`
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLoginMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<LoginMutation, LoginMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options)
}
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>
export const RefreshTokenDocument = gql`
  mutation RefreshToken($input: RefreshTokenInput!) {
    refreshToken(input: $input) {
      accessToken
      refreshToken
      user {
        id
        email
        role
        emailVerifiedAt
        blockedAt
        createdAt
        updatedAt
      }
    }
  }
`
export type RefreshTokenMutationFn = Apollo.MutationFunction<
  RefreshTokenMutation,
  RefreshTokenMutationVariables
>

/**
 * __useRefreshTokenMutation__
 *
 * To run a mutation, you first call `useRefreshTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRefreshTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [refreshTokenMutation, { data, loading, error }] = useRefreshTokenMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRefreshTokenMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    RefreshTokenMutation,
    RefreshTokenMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<RefreshTokenMutation, RefreshTokenMutationVariables>(
    RefreshTokenDocument,
    options,
  )
}
export type RefreshTokenMutationHookResult = ReturnType<typeof useRefreshTokenMutation>
export type RefreshTokenMutationResult = Apollo.MutationResult<RefreshTokenMutation>
export type RefreshTokenMutationOptions = Apollo.BaseMutationOptions<
  RefreshTokenMutation,
  RefreshTokenMutationVariables
>
export const LogoutDocument = gql`
  mutation Logout($input: LogoutInput!) {
    logout(input: $input)
  }
`
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLogoutMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<LogoutMutation, LogoutMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<LogoutMutation, LogoutMutationVariables>(
    LogoutDocument,
    options,
  )
}
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>
export type LogoutMutationOptions = Apollo.BaseMutationOptions<
  LogoutMutation,
  LogoutMutationVariables
>
export const MeDocument = gql`
  query Me {
    me {
      id
      email
      role
      emailVerifiedAt
      blockedAt
      createdAt
      updatedAt
    }
  }
`

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<MeQuery, MeQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<MeQuery, MeQueryVariables>(MeDocument, options)
}
export function useMeLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MeQuery, MeQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options)
}
// @ts-ignore
export function useMeSuspenseQuery(
  baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>,
): ApolloReactHooks.UseSuspenseQueryResult<MeQuery, MeQueryVariables>
export function useMeSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>,
): ApolloReactHooks.UseSuspenseQueryResult<MeQuery | undefined, MeQueryVariables>
export function useMeSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>,
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<MeQuery, MeQueryVariables>(MeDocument, options)
}
export type MeQueryHookResult = ReturnType<typeof useMeQuery>
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>
export type MeSuspenseQueryHookResult = ReturnType<typeof useMeSuspenseQuery>
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>
export const VerifyEmailDocument = gql`
  mutation VerifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      id
      email
      role
      emailVerifiedAt
      blockedAt
      createdAt
      updatedAt
    }
  }
`
export type VerifyEmailMutationFn = Apollo.MutationFunction<
  VerifyEmailMutation,
  VerifyEmailMutationVariables
>

/**
 * __useVerifyEmailMutation__
 *
 * To run a mutation, you first call `useVerifyEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifyEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyEmailMutation, { data, loading, error }] = useVerifyEmailMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useVerifyEmailMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    VerifyEmailMutation,
    VerifyEmailMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<VerifyEmailMutation, VerifyEmailMutationVariables>(
    VerifyEmailDocument,
    options,
  )
}
export type VerifyEmailMutationHookResult = ReturnType<typeof useVerifyEmailMutation>
export type VerifyEmailMutationResult = Apollo.MutationResult<VerifyEmailMutation>
export type VerifyEmailMutationOptions = Apollo.BaseMutationOptions<
  VerifyEmailMutation,
  VerifyEmailMutationVariables
>
export const ResendVerificationEmailDocument = gql`
  mutation ResendVerificationEmail {
    resendVerificationEmail
  }
`
export type ResendVerificationEmailMutationFn = Apollo.MutationFunction<
  ResendVerificationEmailMutation,
  ResendVerificationEmailMutationVariables
>

/**
 * __useResendVerificationEmailMutation__
 *
 * To run a mutation, you first call `useResendVerificationEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResendVerificationEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resendVerificationEmailMutation, { data, loading, error }] = useResendVerificationEmailMutation({
 *   variables: {
 *   },
 * });
 */
export function useResendVerificationEmailMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    ResendVerificationEmailMutation,
    ResendVerificationEmailMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    ResendVerificationEmailMutation,
    ResendVerificationEmailMutationVariables
  >(ResendVerificationEmailDocument, options)
}
export type ResendVerificationEmailMutationHookResult = ReturnType<
  typeof useResendVerificationEmailMutation
>
export type ResendVerificationEmailMutationResult =
  Apollo.MutationResult<ResendVerificationEmailMutation>
export type ResendVerificationEmailMutationOptions = Apollo.BaseMutationOptions<
  ResendVerificationEmailMutation,
  ResendVerificationEmailMutationVariables
>
export const RequestPasswordResetDocument = gql`
  mutation RequestPasswordReset($input: RequestPasswordResetInput!) {
    requestPasswordReset(input: $input)
  }
`
export type RequestPasswordResetMutationFn = Apollo.MutationFunction<
  RequestPasswordResetMutation,
  RequestPasswordResetMutationVariables
>

/**
 * __useRequestPasswordResetMutation__
 *
 * To run a mutation, you first call `useRequestPasswordResetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRequestPasswordResetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [requestPasswordResetMutation, { data, loading, error }] = useRequestPasswordResetMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRequestPasswordResetMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    RequestPasswordResetMutation,
    RequestPasswordResetMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    RequestPasswordResetMutation,
    RequestPasswordResetMutationVariables
  >(RequestPasswordResetDocument, options)
}
export type RequestPasswordResetMutationHookResult = ReturnType<
  typeof useRequestPasswordResetMutation
>
export type RequestPasswordResetMutationResult = Apollo.MutationResult<RequestPasswordResetMutation>
export type RequestPasswordResetMutationOptions = Apollo.BaseMutationOptions<
  RequestPasswordResetMutation,
  RequestPasswordResetMutationVariables
>
export const ResetPasswordDocument = gql`
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input)
  }
`
export type ResetPasswordMutationFn = Apollo.MutationFunction<
  ResetPasswordMutation,
  ResetPasswordMutationVariables
>

/**
 * __useResetPasswordMutation__
 *
 * To run a mutation, you first call `useResetPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetPasswordMutation, { data, loading, error }] = useResetPasswordMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useResetPasswordMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    ResetPasswordMutation,
    ResetPasswordMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(
    ResetPasswordDocument,
    options,
  )
}
export type ResetPasswordMutationHookResult = ReturnType<typeof useResetPasswordMutation>
export type ResetPasswordMutationResult = Apollo.MutationResult<ResetPasswordMutation>
export type ResetPasswordMutationOptions = Apollo.BaseMutationOptions<
  ResetPasswordMutation,
  ResetPasswordMutationVariables
>
export const PreviewCsvImportDocument = gql`
  mutation PreviewCsvImport($input: PreviewCsvImportInput!) {
    previewCsvImport(input: $input) {
      id
      deckId
      status
      totalRows
      validRows
      invalidRows
      previewRows {
        rowNumber
        front
        back
        example
        notes
        isValid
        errors {
          rowNumber
          field
          message
        }
      }
      errors {
        rowNumber
        field
        message
      }
      createdAt
      confirmedAt
      expiresAt
    }
  }
`
export type PreviewCsvImportMutationFn = Apollo.MutationFunction<
  PreviewCsvImportMutation,
  PreviewCsvImportMutationVariables
>

/**
 * __usePreviewCsvImportMutation__
 *
 * To run a mutation, you first call `usePreviewCsvImportMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePreviewCsvImportMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [previewCsvImportMutation, { data, loading, error }] = usePreviewCsvImportMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePreviewCsvImportMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    PreviewCsvImportMutation,
    PreviewCsvImportMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<PreviewCsvImportMutation, PreviewCsvImportMutationVariables>(
    PreviewCsvImportDocument,
    options,
  )
}
export type PreviewCsvImportMutationHookResult = ReturnType<typeof usePreviewCsvImportMutation>
export type PreviewCsvImportMutationResult = Apollo.MutationResult<PreviewCsvImportMutation>
export type PreviewCsvImportMutationOptions = Apollo.BaseMutationOptions<
  PreviewCsvImportMutation,
  PreviewCsvImportMutationVariables
>
export const ConfirmCsvImportDocument = gql`
  mutation ConfirmCsvImport($input: ConfirmCsvImportInput!) {
    confirmCsvImport(input: $input) {
      import {
        id
        deckId
        status
        totalRows
        validRows
        invalidRows
        createdAt
        confirmedAt
        expiresAt
      }
      createdCardsCount
    }
  }
`
export type ConfirmCsvImportMutationFn = Apollo.MutationFunction<
  ConfirmCsvImportMutation,
  ConfirmCsvImportMutationVariables
>

/**
 * __useConfirmCsvImportMutation__
 *
 * To run a mutation, you first call `useConfirmCsvImportMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useConfirmCsvImportMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [confirmCsvImportMutation, { data, loading, error }] = useConfirmCsvImportMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useConfirmCsvImportMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    ConfirmCsvImportMutation,
    ConfirmCsvImportMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<ConfirmCsvImportMutation, ConfirmCsvImportMutationVariables>(
    ConfirmCsvImportDocument,
    options,
  )
}
export type ConfirmCsvImportMutationHookResult = ReturnType<typeof useConfirmCsvImportMutation>
export type ConfirmCsvImportMutationResult = Apollo.MutationResult<ConfirmCsvImportMutation>
export type ConfirmCsvImportMutationOptions = Apollo.BaseMutationOptions<
  ConfirmCsvImportMutation,
  ConfirmCsvImportMutationVariables
>
export const CheckCardDuplicatesDocument = gql`
  query CheckCardDuplicates($input: CheckCardDuplicatesInput!) {
    checkCardDuplicates(input: $input) {
      hits {
        index
        kind
        deckTitle
      }
    }
  }
`

/**
 * __useCheckCardDuplicatesQuery__
 *
 * To run a query within a React component, call `useCheckCardDuplicatesQuery` and pass it any options that fit your needs.
 * When your component renders, `useCheckCardDuplicatesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCheckCardDuplicatesQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCheckCardDuplicatesQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    CheckCardDuplicatesQuery,
    CheckCardDuplicatesQueryVariables
  > &
    ({ variables: CheckCardDuplicatesQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<CheckCardDuplicatesQuery, CheckCardDuplicatesQueryVariables>(
    CheckCardDuplicatesDocument,
    options,
  )
}
export function useCheckCardDuplicatesLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    CheckCardDuplicatesQuery,
    CheckCardDuplicatesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<CheckCardDuplicatesQuery, CheckCardDuplicatesQueryVariables>(
    CheckCardDuplicatesDocument,
    options,
  )
}
// @ts-ignore
export function useCheckCardDuplicatesSuspenseQuery(
  baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<
    CheckCardDuplicatesQuery,
    CheckCardDuplicatesQueryVariables
  >,
): ApolloReactHooks.UseSuspenseQueryResult<
  CheckCardDuplicatesQuery,
  CheckCardDuplicatesQueryVariables
>
export function useCheckCardDuplicatesSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<
        CheckCardDuplicatesQuery,
        CheckCardDuplicatesQueryVariables
      >,
): ApolloReactHooks.UseSuspenseQueryResult<
  CheckCardDuplicatesQuery | undefined,
  CheckCardDuplicatesQueryVariables
>
export function useCheckCardDuplicatesSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<
        CheckCardDuplicatesQuery,
        CheckCardDuplicatesQueryVariables
      >,
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<
    CheckCardDuplicatesQuery,
    CheckCardDuplicatesQueryVariables
  >(CheckCardDuplicatesDocument, options)
}
export type CheckCardDuplicatesQueryHookResult = ReturnType<typeof useCheckCardDuplicatesQuery>
export type CheckCardDuplicatesLazyQueryHookResult = ReturnType<
  typeof useCheckCardDuplicatesLazyQuery
>
export type CheckCardDuplicatesSuspenseQueryHookResult = ReturnType<
  typeof useCheckCardDuplicatesSuspenseQuery
>
export type CheckCardDuplicatesQueryResult = Apollo.QueryResult<
  CheckCardDuplicatesQuery,
  CheckCardDuplicatesQueryVariables
>
export const MyDecksDocument = gql`
  query MyDecks {
    myDecks {
      id
      ownerId
      title
      description
      visibility
      moderationStatus
      isOfficial
      sourceDeckId
      targetLanguage
      sourceLanguage
      createdAt
      updatedAt
    }
  }
`

/**
 * __useMyDecksQuery__
 *
 * To run a query within a React component, call `useMyDecksQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyDecksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyDecksQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyDecksQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<MyDecksQuery, MyDecksQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<MyDecksQuery, MyDecksQueryVariables>(MyDecksDocument, options)
}
export function useMyDecksLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MyDecksQuery, MyDecksQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<MyDecksQuery, MyDecksQueryVariables>(
    MyDecksDocument,
    options,
  )
}
// @ts-ignore
export function useMyDecksSuspenseQuery(
  baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<MyDecksQuery, MyDecksQueryVariables>,
): ApolloReactHooks.UseSuspenseQueryResult<MyDecksQuery, MyDecksQueryVariables>
export function useMyDecksSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<MyDecksQuery, MyDecksQueryVariables>,
): ApolloReactHooks.UseSuspenseQueryResult<MyDecksQuery | undefined, MyDecksQueryVariables>
export function useMyDecksSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<MyDecksQuery, MyDecksQueryVariables>,
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<MyDecksQuery, MyDecksQueryVariables>(
    MyDecksDocument,
    options,
  )
}
export type MyDecksQueryHookResult = ReturnType<typeof useMyDecksQuery>
export type MyDecksLazyQueryHookResult = ReturnType<typeof useMyDecksLazyQuery>
export type MyDecksSuspenseQueryHookResult = ReturnType<typeof useMyDecksSuspenseQuery>
export type MyDecksQueryResult = Apollo.QueryResult<MyDecksQuery, MyDecksQueryVariables>
export const DecksPageDocument = gql`
  query DecksPage($input: DecksPageInput!) {
    decksPage(input: $input) {
      ownDecks {
        id
        ownerId
        title
        description
        visibility
        moderationStatus
        isOfficial
        sourceDeckId
        targetLanguage
        sourceLanguage
        origin
        createdAt
        updatedAt
      }
      groupDecks {
        id
        ownerId
        title
        description
        visibility
        moderationStatus
        isOfficial
        sourceDeckId
        targetLanguage
        sourceLanguage
        origin
        createdAt
        updatedAt
      }
      publicDecks {
        id
        ownerId
        title
        description
        visibility
        moderationStatus
        isOfficial
        sourceDeckId
        targetLanguage
        sourceLanguage
        origin
        createdAt
        updatedAt
      }
      noLanguageDecks {
        id
        ownerId
        title
        description
        visibility
        moderationStatus
        isOfficial
        sourceDeckId
        targetLanguage
        sourceLanguage
        origin
        createdAt
        updatedAt
      }
    }
  }
`

/**
 * __useDecksPageQuery__
 *
 * To run a query within a React component, call `useDecksPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useDecksPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDecksPageQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDecksPageQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<DecksPageQuery, DecksPageQueryVariables> &
    ({ variables: DecksPageQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<DecksPageQuery, DecksPageQueryVariables>(
    DecksPageDocument,
    options,
  )
}
export function useDecksPageLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<DecksPageQuery, DecksPageQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<DecksPageQuery, DecksPageQueryVariables>(
    DecksPageDocument,
    options,
  )
}
// @ts-ignore
export function useDecksPageSuspenseQuery(
  baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<DecksPageQuery, DecksPageQueryVariables>,
): ApolloReactHooks.UseSuspenseQueryResult<DecksPageQuery, DecksPageQueryVariables>
export function useDecksPageSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<DecksPageQuery, DecksPageQueryVariables>,
): ApolloReactHooks.UseSuspenseQueryResult<DecksPageQuery | undefined, DecksPageQueryVariables>
export function useDecksPageSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<DecksPageQuery, DecksPageQueryVariables>,
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<DecksPageQuery, DecksPageQueryVariables>(
    DecksPageDocument,
    options,
  )
}
export type DecksPageQueryHookResult = ReturnType<typeof useDecksPageQuery>
export type DecksPageLazyQueryHookResult = ReturnType<typeof useDecksPageLazyQuery>
export type DecksPageSuspenseQueryHookResult = ReturnType<typeof useDecksPageSuspenseQuery>
export type DecksPageQueryResult = Apollo.QueryResult<DecksPageQuery, DecksPageQueryVariables>
export const DeckDocument = gql`
  query Deck($id: String!) {
    deck(id: $id) {
      id
      ownerId
      title
      description
      visibility
      moderationStatus
      isOfficial
      sourceDeckId
      targetLanguage
      sourceLanguage
      createdAt
      updatedAt
    }
  }
`

/**
 * __useDeckQuery__
 *
 * To run a query within a React component, call `useDeckQuery` and pass it any options that fit your needs.
 * When your component renders, `useDeckQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDeckQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeckQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<DeckQuery, DeckQueryVariables> &
    ({ variables: DeckQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<DeckQuery, DeckQueryVariables>(DeckDocument, options)
}
export function useDeckLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<DeckQuery, DeckQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<DeckQuery, DeckQueryVariables>(DeckDocument, options)
}
// @ts-ignore
export function useDeckSuspenseQuery(
  baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<DeckQuery, DeckQueryVariables>,
): ApolloReactHooks.UseSuspenseQueryResult<DeckQuery, DeckQueryVariables>
export function useDeckSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<DeckQuery, DeckQueryVariables>,
): ApolloReactHooks.UseSuspenseQueryResult<DeckQuery | undefined, DeckQueryVariables>
export function useDeckSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<DeckQuery, DeckQueryVariables>,
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<DeckQuery, DeckQueryVariables>(DeckDocument, options)
}
export type DeckQueryHookResult = ReturnType<typeof useDeckQuery>
export type DeckLazyQueryHookResult = ReturnType<typeof useDeckLazyQuery>
export type DeckSuspenseQueryHookResult = ReturnType<typeof useDeckSuspenseQuery>
export type DeckQueryResult = Apollo.QueryResult<DeckQuery, DeckQueryVariables>
export const DeckCardsDocument = gql`
  query DeckCards($deckId: String!) {
    deckCards(deckId: $deckId) {
      id
      deckId
      front
      back
      example
      notes
      position
      learningGroup
      createdAt
      updatedAt
    }
  }
`

/**
 * __useDeckCardsQuery__
 *
 * To run a query within a React component, call `useDeckCardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useDeckCardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDeckCardsQuery({
 *   variables: {
 *      deckId: // value for 'deckId'
 *   },
 * });
 */
export function useDeckCardsQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<DeckCardsQuery, DeckCardsQueryVariables> &
    ({ variables: DeckCardsQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<DeckCardsQuery, DeckCardsQueryVariables>(
    DeckCardsDocument,
    options,
  )
}
export function useDeckCardsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<DeckCardsQuery, DeckCardsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<DeckCardsQuery, DeckCardsQueryVariables>(
    DeckCardsDocument,
    options,
  )
}
// @ts-ignore
export function useDeckCardsSuspenseQuery(
  baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<DeckCardsQuery, DeckCardsQueryVariables>,
): ApolloReactHooks.UseSuspenseQueryResult<DeckCardsQuery, DeckCardsQueryVariables>
export function useDeckCardsSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<DeckCardsQuery, DeckCardsQueryVariables>,
): ApolloReactHooks.UseSuspenseQueryResult<DeckCardsQuery | undefined, DeckCardsQueryVariables>
export function useDeckCardsSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<DeckCardsQuery, DeckCardsQueryVariables>,
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<DeckCardsQuery, DeckCardsQueryVariables>(
    DeckCardsDocument,
    options,
  )
}
export type DeckCardsQueryHookResult = ReturnType<typeof useDeckCardsQuery>
export type DeckCardsLazyQueryHookResult = ReturnType<typeof useDeckCardsLazyQuery>
export type DeckCardsSuspenseQueryHookResult = ReturnType<typeof useDeckCardsSuspenseQuery>
export type DeckCardsQueryResult = Apollo.QueryResult<DeckCardsQuery, DeckCardsQueryVariables>
export const CreateDeckDocument = gql`
  mutation CreateDeck($input: CreateDeckInput!) {
    createDeck(input: $input) {
      deck {
        id
        ownerId
        title
        description
        visibility
        moderationStatus
        isOfficial
        sourceDeckId
        targetLanguage
        sourceLanguage
        createdAt
        updatedAt
      }
      warnings {
        code
        message
      }
    }
  }
`
export type CreateDeckMutationFn = Apollo.MutationFunction<
  CreateDeckMutation,
  CreateDeckMutationVariables
>

/**
 * __useCreateDeckMutation__
 *
 * To run a mutation, you first call `useCreateDeckMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDeckMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDeckMutation, { data, loading, error }] = useCreateDeckMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateDeckMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateDeckMutation,
    CreateDeckMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<CreateDeckMutation, CreateDeckMutationVariables>(
    CreateDeckDocument,
    options,
  )
}
export type CreateDeckMutationHookResult = ReturnType<typeof useCreateDeckMutation>
export type CreateDeckMutationResult = Apollo.MutationResult<CreateDeckMutation>
export type CreateDeckMutationOptions = Apollo.BaseMutationOptions<
  CreateDeckMutation,
  CreateDeckMutationVariables
>
export const UpdateDeckDocument = gql`
  mutation UpdateDeck($input: UpdateDeckInput!) {
    updateDeck(input: $input) {
      deck {
        id
        ownerId
        title
        description
        visibility
        moderationStatus
        isOfficial
        sourceDeckId
        targetLanguage
        sourceLanguage
        createdAt
        updatedAt
      }
      warnings {
        code
        message
      }
    }
  }
`
export type UpdateDeckMutationFn = Apollo.MutationFunction<
  UpdateDeckMutation,
  UpdateDeckMutationVariables
>

/**
 * __useUpdateDeckMutation__
 *
 * To run a mutation, you first call `useUpdateDeckMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateDeckMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateDeckMutation, { data, loading, error }] = useUpdateDeckMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateDeckMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpdateDeckMutation,
    UpdateDeckMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<UpdateDeckMutation, UpdateDeckMutationVariables>(
    UpdateDeckDocument,
    options,
  )
}
export type UpdateDeckMutationHookResult = ReturnType<typeof useUpdateDeckMutation>
export type UpdateDeckMutationResult = Apollo.MutationResult<UpdateDeckMutation>
export type UpdateDeckMutationOptions = Apollo.BaseMutationOptions<
  UpdateDeckMutation,
  UpdateDeckMutationVariables
>
export const DeleteDeckDocument = gql`
  mutation DeleteDeck($deckId: String!) {
    deleteDeck(deckId: $deckId)
  }
`
export type DeleteDeckMutationFn = Apollo.MutationFunction<
  DeleteDeckMutation,
  DeleteDeckMutationVariables
>

/**
 * __useDeleteDeckMutation__
 *
 * To run a mutation, you first call `useDeleteDeckMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteDeckMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteDeckMutation, { data, loading, error }] = useDeleteDeckMutation({
 *   variables: {
 *      deckId: // value for 'deckId'
 *   },
 * });
 */
export function useDeleteDeckMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    DeleteDeckMutation,
    DeleteDeckMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<DeleteDeckMutation, DeleteDeckMutationVariables>(
    DeleteDeckDocument,
    options,
  )
}
export type DeleteDeckMutationHookResult = ReturnType<typeof useDeleteDeckMutation>
export type DeleteDeckMutationResult = Apollo.MutationResult<DeleteDeckMutation>
export type DeleteDeckMutationOptions = Apollo.BaseMutationOptions<
  DeleteDeckMutation,
  DeleteDeckMutationVariables
>
export const CreateCardDocument = gql`
  mutation CreateCard($input: CreateCardInput!) {
    createCard(input: $input) {
      id
      deckId
      front
      back
      example
      notes
      position
      createdAt
      updatedAt
    }
  }
`
export type CreateCardMutationFn = Apollo.MutationFunction<
  CreateCardMutation,
  CreateCardMutationVariables
>

/**
 * __useCreateCardMutation__
 *
 * To run a mutation, you first call `useCreateCardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCardMutation, { data, loading, error }] = useCreateCardMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateCardMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateCardMutation,
    CreateCardMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<CreateCardMutation, CreateCardMutationVariables>(
    CreateCardDocument,
    options,
  )
}
export type CreateCardMutationHookResult = ReturnType<typeof useCreateCardMutation>
export type CreateCardMutationResult = Apollo.MutationResult<CreateCardMutation>
export type CreateCardMutationOptions = Apollo.BaseMutationOptions<
  CreateCardMutation,
  CreateCardMutationVariables
>
export const UpdateCardDocument = gql`
  mutation UpdateCard($input: UpdateCardInput!) {
    updateCard(input: $input) {
      id
      deckId
      front
      back
      example
      notes
      position
      createdAt
      updatedAt
    }
  }
`
export type UpdateCardMutationFn = Apollo.MutationFunction<
  UpdateCardMutation,
  UpdateCardMutationVariables
>

/**
 * __useUpdateCardMutation__
 *
 * To run a mutation, you first call `useUpdateCardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCardMutation, { data, loading, error }] = useUpdateCardMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateCardMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpdateCardMutation,
    UpdateCardMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<UpdateCardMutation, UpdateCardMutationVariables>(
    UpdateCardDocument,
    options,
  )
}
export type UpdateCardMutationHookResult = ReturnType<typeof useUpdateCardMutation>
export type UpdateCardMutationResult = Apollo.MutationResult<UpdateCardMutation>
export type UpdateCardMutationOptions = Apollo.BaseMutationOptions<
  UpdateCardMutation,
  UpdateCardMutationVariables
>
export const DeleteCardDocument = gql`
  mutation DeleteCard($cardId: String!) {
    deleteCard(cardId: $cardId)
  }
`
export type DeleteCardMutationFn = Apollo.MutationFunction<
  DeleteCardMutation,
  DeleteCardMutationVariables
>

/**
 * __useDeleteCardMutation__
 *
 * To run a mutation, you first call `useDeleteCardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCardMutation, { data, loading, error }] = useDeleteCardMutation({
 *   variables: {
 *      cardId: // value for 'cardId'
 *   },
 * });
 */
export function useDeleteCardMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    DeleteCardMutation,
    DeleteCardMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<DeleteCardMutation, DeleteCardMutationVariables>(
    DeleteCardDocument,
    options,
  )
}
export type DeleteCardMutationHookResult = ReturnType<typeof useDeleteCardMutation>
export type DeleteCardMutationResult = Apollo.MutationResult<DeleteCardMutation>
export type DeleteCardMutationOptions = Apollo.BaseMutationOptions<
  DeleteCardMutation,
  DeleteCardMutationVariables
>
export const PublishDeckDocument = gql`
  mutation PublishDeck($deckId: String!) {
    publishDeck(deckId: $deckId) {
      id
      ownerId
      title
      description
      visibility
      moderationStatus
      isOfficial
      sourceDeckId
      createdAt
      updatedAt
    }
  }
`
export type PublishDeckMutationFn = Apollo.MutationFunction<
  PublishDeckMutation,
  PublishDeckMutationVariables
>

/**
 * __usePublishDeckMutation__
 *
 * To run a mutation, you first call `usePublishDeckMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePublishDeckMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [publishDeckMutation, { data, loading, error }] = usePublishDeckMutation({
 *   variables: {
 *      deckId: // value for 'deckId'
 *   },
 * });
 */
export function usePublishDeckMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    PublishDeckMutation,
    PublishDeckMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<PublishDeckMutation, PublishDeckMutationVariables>(
    PublishDeckDocument,
    options,
  )
}
export type PublishDeckMutationHookResult = ReturnType<typeof usePublishDeckMutation>
export type PublishDeckMutationResult = Apollo.MutationResult<PublishDeckMutation>
export type PublishDeckMutationOptions = Apollo.BaseMutationOptions<
  PublishDeckMutation,
  PublishDeckMutationVariables
>
export const UnpublishDeckDocument = gql`
  mutation UnpublishDeck($deckId: String!) {
    unpublishDeck(deckId: $deckId) {
      id
      ownerId
      title
      description
      visibility
      moderationStatus
      isOfficial
      sourceDeckId
      createdAt
      updatedAt
    }
  }
`
export type UnpublishDeckMutationFn = Apollo.MutationFunction<
  UnpublishDeckMutation,
  UnpublishDeckMutationVariables
>

/**
 * __useUnpublishDeckMutation__
 *
 * To run a mutation, you first call `useUnpublishDeckMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnpublishDeckMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unpublishDeckMutation, { data, loading, error }] = useUnpublishDeckMutation({
 *   variables: {
 *      deckId: // value for 'deckId'
 *   },
 * });
 */
export function useUnpublishDeckMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UnpublishDeckMutation,
    UnpublishDeckMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<UnpublishDeckMutation, UnpublishDeckMutationVariables>(
    UnpublishDeckDocument,
    options,
  )
}
export type UnpublishDeckMutationHookResult = ReturnType<typeof useUnpublishDeckMutation>
export type UnpublishDeckMutationResult = Apollo.MutationResult<UnpublishDeckMutation>
export type UnpublishDeckMutationOptions = Apollo.BaseMutationOptions<
  UnpublishDeckMutation,
  UnpublishDeckMutationVariables
>
export const MyGroupsDocument = gql`
  query MyGroups {
    myGroups {
      id
      name
      description
      createdById
      createdAt
      updatedAt
      myRole
      memberCount
      membersPreview {
        userId
        initials
      }
    }
  }
`

/**
 * __useMyGroupsQuery__
 *
 * To run a query within a React component, call `useMyGroupsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyGroupsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyGroupsQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyGroupsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<MyGroupsQuery, MyGroupsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<MyGroupsQuery, MyGroupsQueryVariables>(MyGroupsDocument, options)
}
export function useMyGroupsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MyGroupsQuery, MyGroupsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<MyGroupsQuery, MyGroupsQueryVariables>(
    MyGroupsDocument,
    options,
  )
}
// @ts-ignore
export function useMyGroupsSuspenseQuery(
  baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<MyGroupsQuery, MyGroupsQueryVariables>,
): ApolloReactHooks.UseSuspenseQueryResult<MyGroupsQuery, MyGroupsQueryVariables>
export function useMyGroupsSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<MyGroupsQuery, MyGroupsQueryVariables>,
): ApolloReactHooks.UseSuspenseQueryResult<MyGroupsQuery | undefined, MyGroupsQueryVariables>
export function useMyGroupsSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<MyGroupsQuery, MyGroupsQueryVariables>,
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<MyGroupsQuery, MyGroupsQueryVariables>(
    MyGroupsDocument,
    options,
  )
}
export type MyGroupsQueryHookResult = ReturnType<typeof useMyGroupsQuery>
export type MyGroupsLazyQueryHookResult = ReturnType<typeof useMyGroupsLazyQuery>
export type MyGroupsSuspenseQueryHookResult = ReturnType<typeof useMyGroupsSuspenseQuery>
export type MyGroupsQueryResult = Apollo.QueryResult<MyGroupsQuery, MyGroupsQueryVariables>
export const GroupDocument = gql`
  query Group($id: String!) {
    group(id: $id) {
      id
      name
      description
      createdById
      createdAt
      updatedAt
    }
  }
`

/**
 * __useGroupQuery__
 *
 * To run a query within a React component, call `useGroupQuery` and pass it any options that fit your needs.
 * When your component renders, `useGroupQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGroupQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGroupQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<GroupQuery, GroupQueryVariables> &
    ({ variables: GroupQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<GroupQuery, GroupQueryVariables>(GroupDocument, options)
}
export function useGroupLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GroupQuery, GroupQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<GroupQuery, GroupQueryVariables>(GroupDocument, options)
}
// @ts-ignore
export function useGroupSuspenseQuery(
  baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GroupQuery, GroupQueryVariables>,
): ApolloReactHooks.UseSuspenseQueryResult<GroupQuery, GroupQueryVariables>
export function useGroupSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<GroupQuery, GroupQueryVariables>,
): ApolloReactHooks.UseSuspenseQueryResult<GroupQuery | undefined, GroupQueryVariables>
export function useGroupSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<GroupQuery, GroupQueryVariables>,
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<GroupQuery, GroupQueryVariables>(GroupDocument, options)
}
export type GroupQueryHookResult = ReturnType<typeof useGroupQuery>
export type GroupLazyQueryHookResult = ReturnType<typeof useGroupLazyQuery>
export type GroupSuspenseQueryHookResult = ReturnType<typeof useGroupSuspenseQuery>
export type GroupQueryResult = Apollo.QueryResult<GroupQuery, GroupQueryVariables>
export const CreateGroupDocument = gql`
  mutation CreateGroup($input: CreateGroupInput!) {
    createGroup(input: $input) {
      id
      name
      description
      createdById
      createdAt
      updatedAt
    }
  }
`
export type CreateGroupMutationFn = Apollo.MutationFunction<
  CreateGroupMutation,
  CreateGroupMutationVariables
>

/**
 * __useCreateGroupMutation__
 *
 * To run a mutation, you first call `useCreateGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createGroupMutation, { data, loading, error }] = useCreateGroupMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateGroupMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateGroupMutation,
    CreateGroupMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<CreateGroupMutation, CreateGroupMutationVariables>(
    CreateGroupDocument,
    options,
  )
}
export type CreateGroupMutationHookResult = ReturnType<typeof useCreateGroupMutation>
export type CreateGroupMutationResult = Apollo.MutationResult<CreateGroupMutation>
export type CreateGroupMutationOptions = Apollo.BaseMutationOptions<
  CreateGroupMutation,
  CreateGroupMutationVariables
>
export const InviteUserToGroupDocument = gql`
  mutation InviteUserToGroup($input: InviteUserToGroupInput!) {
    inviteUserToGroup(input: $input) {
      id
      groupId
      email
      invitedById
      status
      expiresAt
      createdAt
      acceptedAt
      declinedAt
    }
  }
`
export type InviteUserToGroupMutationFn = Apollo.MutationFunction<
  InviteUserToGroupMutation,
  InviteUserToGroupMutationVariables
>

/**
 * __useInviteUserToGroupMutation__
 *
 * To run a mutation, you first call `useInviteUserToGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInviteUserToGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [inviteUserToGroupMutation, { data, loading, error }] = useInviteUserToGroupMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useInviteUserToGroupMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    InviteUserToGroupMutation,
    InviteUserToGroupMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    InviteUserToGroupMutation,
    InviteUserToGroupMutationVariables
  >(InviteUserToGroupDocument, options)
}
export type InviteUserToGroupMutationHookResult = ReturnType<typeof useInviteUserToGroupMutation>
export type InviteUserToGroupMutationResult = Apollo.MutationResult<InviteUserToGroupMutation>
export type InviteUserToGroupMutationOptions = Apollo.BaseMutationOptions<
  InviteUserToGroupMutation,
  InviteUserToGroupMutationVariables
>
export const MyGroupInvitationsDocument = gql`
  query MyGroupInvitations {
    myGroupInvitations {
      id
      groupId
      email
      invitedById
      status
      expiresAt
      createdAt
      acceptedAt
      declinedAt
      groupName
      invitedByEmail
      memberCount
      sharedDeckCount
    }
  }
`

/**
 * __useMyGroupInvitationsQuery__
 *
 * To run a query within a React component, call `useMyGroupInvitationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyGroupInvitationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyGroupInvitationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyGroupInvitationsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    MyGroupInvitationsQuery,
    MyGroupInvitationsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<MyGroupInvitationsQuery, MyGroupInvitationsQueryVariables>(
    MyGroupInvitationsDocument,
    options,
  )
}
export function useMyGroupInvitationsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    MyGroupInvitationsQuery,
    MyGroupInvitationsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<MyGroupInvitationsQuery, MyGroupInvitationsQueryVariables>(
    MyGroupInvitationsDocument,
    options,
  )
}
// @ts-ignore
export function useMyGroupInvitationsSuspenseQuery(
  baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<
    MyGroupInvitationsQuery,
    MyGroupInvitationsQueryVariables
  >,
): ApolloReactHooks.UseSuspenseQueryResult<
  MyGroupInvitationsQuery,
  MyGroupInvitationsQueryVariables
>
export function useMyGroupInvitationsSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<
        MyGroupInvitationsQuery,
        MyGroupInvitationsQueryVariables
      >,
): ApolloReactHooks.UseSuspenseQueryResult<
  MyGroupInvitationsQuery | undefined,
  MyGroupInvitationsQueryVariables
>
export function useMyGroupInvitationsSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<
        MyGroupInvitationsQuery,
        MyGroupInvitationsQueryVariables
      >,
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<
    MyGroupInvitationsQuery,
    MyGroupInvitationsQueryVariables
  >(MyGroupInvitationsDocument, options)
}
export type MyGroupInvitationsQueryHookResult = ReturnType<typeof useMyGroupInvitationsQuery>
export type MyGroupInvitationsLazyQueryHookResult = ReturnType<
  typeof useMyGroupInvitationsLazyQuery
>
export type MyGroupInvitationsSuspenseQueryHookResult = ReturnType<
  typeof useMyGroupInvitationsSuspenseQuery
>
export type MyGroupInvitationsQueryResult = Apollo.QueryResult<
  MyGroupInvitationsQuery,
  MyGroupInvitationsQueryVariables
>
export const AcceptGroupInvitationDocument = gql`
  mutation AcceptGroupInvitation($invitationId: String!) {
    acceptGroupInvitation(invitationId: $invitationId) {
      invitation {
        id
        groupId
        email
        status
        acceptedAt
      }
      member {
        id
        groupId
        userId
        role
        createdAt
      }
    }
  }
`
export type AcceptGroupInvitationMutationFn = Apollo.MutationFunction<
  AcceptGroupInvitationMutation,
  AcceptGroupInvitationMutationVariables
>

/**
 * __useAcceptGroupInvitationMutation__
 *
 * To run a mutation, you first call `useAcceptGroupInvitationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptGroupInvitationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptGroupInvitationMutation, { data, loading, error }] = useAcceptGroupInvitationMutation({
 *   variables: {
 *      invitationId: // value for 'invitationId'
 *   },
 * });
 */
export function useAcceptGroupInvitationMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    AcceptGroupInvitationMutation,
    AcceptGroupInvitationMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    AcceptGroupInvitationMutation,
    AcceptGroupInvitationMutationVariables
  >(AcceptGroupInvitationDocument, options)
}
export type AcceptGroupInvitationMutationHookResult = ReturnType<
  typeof useAcceptGroupInvitationMutation
>
export type AcceptGroupInvitationMutationResult =
  Apollo.MutationResult<AcceptGroupInvitationMutation>
export type AcceptGroupInvitationMutationOptions = Apollo.BaseMutationOptions<
  AcceptGroupInvitationMutation,
  AcceptGroupInvitationMutationVariables
>
export const DeclineGroupInvitationDocument = gql`
  mutation DeclineGroupInvitation($invitationId: String!) {
    declineGroupInvitation(invitationId: $invitationId) {
      id
      groupId
      email
      status
      declinedAt
    }
  }
`
export type DeclineGroupInvitationMutationFn = Apollo.MutationFunction<
  DeclineGroupInvitationMutation,
  DeclineGroupInvitationMutationVariables
>

/**
 * __useDeclineGroupInvitationMutation__
 *
 * To run a mutation, you first call `useDeclineGroupInvitationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeclineGroupInvitationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [declineGroupInvitationMutation, { data, loading, error }] = useDeclineGroupInvitationMutation({
 *   variables: {
 *      invitationId: // value for 'invitationId'
 *   },
 * });
 */
export function useDeclineGroupInvitationMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    DeclineGroupInvitationMutation,
    DeclineGroupInvitationMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    DeclineGroupInvitationMutation,
    DeclineGroupInvitationMutationVariables
  >(DeclineGroupInvitationDocument, options)
}
export type DeclineGroupInvitationMutationHookResult = ReturnType<
  typeof useDeclineGroupInvitationMutation
>
export type DeclineGroupInvitationMutationResult =
  Apollo.MutationResult<DeclineGroupInvitationMutation>
export type DeclineGroupInvitationMutationOptions = Apollo.BaseMutationOptions<
  DeclineGroupInvitationMutation,
  DeclineGroupInvitationMutationVariables
>
export const ShareDeckWithGroupDocument = gql`
  mutation ShareDeckWithGroup($input: ShareDeckWithGroupInput!) {
    shareDeckWithGroup(input: $input) {
      share {
        id
        deckId
        groupId
        permission
        createdById
        createdAt
      }
    }
  }
`
export type ShareDeckWithGroupMutationFn = Apollo.MutationFunction<
  ShareDeckWithGroupMutation,
  ShareDeckWithGroupMutationVariables
>

/**
 * __useShareDeckWithGroupMutation__
 *
 * To run a mutation, you first call `useShareDeckWithGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useShareDeckWithGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [shareDeckWithGroupMutation, { data, loading, error }] = useShareDeckWithGroupMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useShareDeckWithGroupMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    ShareDeckWithGroupMutation,
    ShareDeckWithGroupMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    ShareDeckWithGroupMutation,
    ShareDeckWithGroupMutationVariables
  >(ShareDeckWithGroupDocument, options)
}
export type ShareDeckWithGroupMutationHookResult = ReturnType<typeof useShareDeckWithGroupMutation>
export type ShareDeckWithGroupMutationResult = Apollo.MutationResult<ShareDeckWithGroupMutation>
export type ShareDeckWithGroupMutationOptions = Apollo.BaseMutationOptions<
  ShareDeckWithGroupMutation,
  ShareDeckWithGroupMutationVariables
>
export const GroupSharedDecksDocument = gql`
  query GroupSharedDecks($groupId: String!) {
    groupSharedDecks(groupId: $groupId) {
      id
      ownerId
      title
      description
      visibility
      moderationStatus
      isOfficial
      sourceDeckId
      targetLanguage
      sourceLanguage
      createdAt
      updatedAt
    }
  }
`

/**
 * __useGroupSharedDecksQuery__
 *
 * To run a query within a React component, call `useGroupSharedDecksQuery` and pass it any options that fit your needs.
 * When your component renders, `useGroupSharedDecksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGroupSharedDecksQuery({
 *   variables: {
 *      groupId: // value for 'groupId'
 *   },
 * });
 */
export function useGroupSharedDecksQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    GroupSharedDecksQuery,
    GroupSharedDecksQueryVariables
  > &
    ({ variables: GroupSharedDecksQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<GroupSharedDecksQuery, GroupSharedDecksQueryVariables>(
    GroupSharedDecksDocument,
    options,
  )
}
export function useGroupSharedDecksLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GroupSharedDecksQuery,
    GroupSharedDecksQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<GroupSharedDecksQuery, GroupSharedDecksQueryVariables>(
    GroupSharedDecksDocument,
    options,
  )
}
// @ts-ignore
export function useGroupSharedDecksSuspenseQuery(
  baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<
    GroupSharedDecksQuery,
    GroupSharedDecksQueryVariables
  >,
): ApolloReactHooks.UseSuspenseQueryResult<GroupSharedDecksQuery, GroupSharedDecksQueryVariables>
export function useGroupSharedDecksSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<
        GroupSharedDecksQuery,
        GroupSharedDecksQueryVariables
      >,
): ApolloReactHooks.UseSuspenseQueryResult<
  GroupSharedDecksQuery | undefined,
  GroupSharedDecksQueryVariables
>
export function useGroupSharedDecksSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<
        GroupSharedDecksQuery,
        GroupSharedDecksQueryVariables
      >,
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<GroupSharedDecksQuery, GroupSharedDecksQueryVariables>(
    GroupSharedDecksDocument,
    options,
  )
}
export type GroupSharedDecksQueryHookResult = ReturnType<typeof useGroupSharedDecksQuery>
export type GroupSharedDecksLazyQueryHookResult = ReturnType<typeof useGroupSharedDecksLazyQuery>
export type GroupSharedDecksSuspenseQueryHookResult = ReturnType<
  typeof useGroupSharedDecksSuspenseQuery
>
export type GroupSharedDecksQueryResult = Apollo.QueryResult<
  GroupSharedDecksQuery,
  GroupSharedDecksQueryVariables
>
export const CopyGroupDeckDocument = gql`
  mutation CopyGroupDeck($sourceDeckId: String!) {
    copyGroupDeck(sourceDeckId: $sourceDeckId) {
      deck {
        id
        ownerId
        title
        description
        visibility
        moderationStatus
        isOfficial
        sourceDeckId
        targetLanguage
        sourceLanguage
        createdAt
        updatedAt
      }
      cards {
        id
        deckId
        front
        back
        example
        notes
        createdAt
        updatedAt
      }
    }
  }
`
export type CopyGroupDeckMutationFn = Apollo.MutationFunction<
  CopyGroupDeckMutation,
  CopyGroupDeckMutationVariables
>

/**
 * __useCopyGroupDeckMutation__
 *
 * To run a mutation, you first call `useCopyGroupDeckMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCopyGroupDeckMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [copyGroupDeckMutation, { data, loading, error }] = useCopyGroupDeckMutation({
 *   variables: {
 *      sourceDeckId: // value for 'sourceDeckId'
 *   },
 * });
 */
export function useCopyGroupDeckMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CopyGroupDeckMutation,
    CopyGroupDeckMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<CopyGroupDeckMutation, CopyGroupDeckMutationVariables>(
    CopyGroupDeckDocument,
    options,
  )
}
export type CopyGroupDeckMutationHookResult = ReturnType<typeof useCopyGroupDeckMutation>
export type CopyGroupDeckMutationResult = Apollo.MutationResult<CopyGroupDeckMutation>
export type CopyGroupDeckMutationOptions = Apollo.BaseMutationOptions<
  CopyGroupDeckMutation,
  CopyGroupDeckMutationVariables
>
export const StartLessonDocument = gql`
  mutation StartLesson($input: StartLessonInput!) {
    startLesson(input: $input) {
      sessionId
      deckId
      scope
      lessonSize
      totalCards
      cards {
        ...LessonCardFields
      }
    }
  }
  ${LessonCardFieldsFragmentDoc}
`
export type StartLessonMutationFn = Apollo.MutationFunction<
  StartLessonMutation,
  StartLessonMutationVariables
>

/**
 * __useStartLessonMutation__
 *
 * To run a mutation, you first call `useStartLessonMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStartLessonMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [startLessonMutation, { data, loading, error }] = useStartLessonMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useStartLessonMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    StartLessonMutation,
    StartLessonMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<StartLessonMutation, StartLessonMutationVariables>(
    StartLessonDocument,
    options,
  )
}
export type StartLessonMutationHookResult = ReturnType<typeof useStartLessonMutation>
export type StartLessonMutationResult = Apollo.MutationResult<StartLessonMutation>
export type StartLessonMutationOptions = Apollo.BaseMutationOptions<
  StartLessonMutation,
  StartLessonMutationVariables
>
export const StartHomeLessonDocument = gql`
  mutation StartHomeLesson($input: StartHomeLessonInput!) {
    startHomeLesson(input: $input) {
      sessionId
      deckId
      scope
      lessonSize
      totalCards
      cards {
        ...LessonCardFields
      }
    }
  }
  ${LessonCardFieldsFragmentDoc}
`
export type StartHomeLessonMutationFn = Apollo.MutationFunction<
  StartHomeLessonMutation,
  StartHomeLessonMutationVariables
>

/**
 * __useStartHomeLessonMutation__
 *
 * To run a mutation, you first call `useStartHomeLessonMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStartHomeLessonMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [startHomeLessonMutation, { data, loading, error }] = useStartHomeLessonMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useStartHomeLessonMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    StartHomeLessonMutation,
    StartHomeLessonMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<StartHomeLessonMutation, StartHomeLessonMutationVariables>(
    StartHomeLessonDocument,
    options,
  )
}
export type StartHomeLessonMutationHookResult = ReturnType<typeof useStartHomeLessonMutation>
export type StartHomeLessonMutationResult = Apollo.MutationResult<StartHomeLessonMutation>
export type StartHomeLessonMutationOptions = Apollo.BaseMutationOptions<
  StartHomeLessonMutation,
  StartHomeLessonMutationVariables
>
export const SubmitReviewDocument = gql`
  mutation SubmitReview($input: SubmitReviewInput!) {
    submitReview(input: $input) {
      sessionId
      cardId
      reviewedCards
      reviewState {
        id
        learningStep
        longReviewSuccessCount
        dueAt
        lastReviewedAt
      }
      nextCard {
        ...LessonCardFields
      }
    }
  }
  ${LessonCardFieldsFragmentDoc}
`
export type SubmitReviewMutationFn = Apollo.MutationFunction<
  SubmitReviewMutation,
  SubmitReviewMutationVariables
>

/**
 * __useSubmitReviewMutation__
 *
 * To run a mutation, you first call `useSubmitReviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSubmitReviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [submitReviewMutation, { data, loading, error }] = useSubmitReviewMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSubmitReviewMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    SubmitReviewMutation,
    SubmitReviewMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<SubmitReviewMutation, SubmitReviewMutationVariables>(
    SubmitReviewDocument,
    options,
  )
}
export type SubmitReviewMutationHookResult = ReturnType<typeof useSubmitReviewMutation>
export type SubmitReviewMutationResult = Apollo.MutationResult<SubmitReviewMutation>
export type SubmitReviewMutationOptions = Apollo.BaseMutationOptions<
  SubmitReviewMutation,
  SubmitReviewMutationVariables
>
export const DisableAudioOnlyDocument = gql`
  mutation DisableAudioOnly($input: DisableAudioOnlyInput!) {
    disableAudioOnly(input: $input) {
      ...LessonCardFields
    }
  }
  ${LessonCardFieldsFragmentDoc}
`
export type DisableAudioOnlyMutationFn = Apollo.MutationFunction<
  DisableAudioOnlyMutation,
  DisableAudioOnlyMutationVariables
>

/**
 * __useDisableAudioOnlyMutation__
 *
 * To run a mutation, you first call `useDisableAudioOnlyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDisableAudioOnlyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [disableAudioOnlyMutation, { data, loading, error }] = useDisableAudioOnlyMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDisableAudioOnlyMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    DisableAudioOnlyMutation,
    DisableAudioOnlyMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<DisableAudioOnlyMutation, DisableAudioOnlyMutationVariables>(
    DisableAudioOnlyDocument,
    options,
  )
}
export type DisableAudioOnlyMutationHookResult = ReturnType<typeof useDisableAudioOnlyMutation>
export type DisableAudioOnlyMutationResult = Apollo.MutationResult<DisableAudioOnlyMutation>
export type DisableAudioOnlyMutationOptions = Apollo.BaseMutationOptions<
  DisableAudioOnlyMutation,
  DisableAudioOnlyMutationVariables
>
export const CompleteLessonDocument = gql`
  mutation CompleteLesson($input: CompleteLessonInput!) {
    completeLesson(input: $input) {
      sessionId
      deckId
      totalCards
      reviewedCards
      knownCount
      dontKnowCount
      completedAt
    }
  }
`
export type CompleteLessonMutationFn = Apollo.MutationFunction<
  CompleteLessonMutation,
  CompleteLessonMutationVariables
>

/**
 * __useCompleteLessonMutation__
 *
 * To run a mutation, you first call `useCompleteLessonMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCompleteLessonMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [completeLessonMutation, { data, loading, error }] = useCompleteLessonMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCompleteLessonMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CompleteLessonMutation,
    CompleteLessonMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<CompleteLessonMutation, CompleteLessonMutationVariables>(
    CompleteLessonDocument,
    options,
  )
}
export type CompleteLessonMutationHookResult = ReturnType<typeof useCompleteLessonMutation>
export type CompleteLessonMutationResult = Apollo.MutationResult<CompleteLessonMutation>
export type CompleteLessonMutationOptions = Apollo.BaseMutationOptions<
  CompleteLessonMutation,
  CompleteLessonMutationVariables
>
export const AbandonLessonDocument = gql`
  mutation AbandonLesson($input: AbandonLessonInput!) {
    abandonLesson(input: $input) {
      success
    }
  }
`
export type AbandonLessonMutationFn = Apollo.MutationFunction<
  AbandonLessonMutation,
  AbandonLessonMutationVariables
>

/**
 * __useAbandonLessonMutation__
 *
 * To run a mutation, you first call `useAbandonLessonMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAbandonLessonMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [abandonLessonMutation, { data, loading, error }] = useAbandonLessonMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAbandonLessonMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    AbandonLessonMutation,
    AbandonLessonMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<AbandonLessonMutation, AbandonLessonMutationVariables>(
    AbandonLessonDocument,
    options,
  )
}
export type AbandonLessonMutationHookResult = ReturnType<typeof useAbandonLessonMutation>
export type AbandonLessonMutationResult = Apollo.MutationResult<AbandonLessonMutation>
export type AbandonLessonMutationOptions = Apollo.BaseMutationOptions<
  AbandonLessonMutation,
  AbandonLessonMutationVariables
>
export const DeckLearningStatsDocument = gql`
  query DeckLearningStats($deckId: String!) {
    deckLearningStats(deckId: $deckId) {
      deckId
      totalCards
      toLearnCount
      practicedCount
      learnedCount
      dueCount
      nextDueAt
    }
  }
`

/**
 * __useDeckLearningStatsQuery__
 *
 * To run a query within a React component, call `useDeckLearningStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useDeckLearningStatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDeckLearningStatsQuery({
 *   variables: {
 *      deckId: // value for 'deckId'
 *   },
 * });
 */
export function useDeckLearningStatsQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    DeckLearningStatsQuery,
    DeckLearningStatsQueryVariables
  > &
    ({ variables: DeckLearningStatsQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<DeckLearningStatsQuery, DeckLearningStatsQueryVariables>(
    DeckLearningStatsDocument,
    options,
  )
}
export function useDeckLearningStatsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    DeckLearningStatsQuery,
    DeckLearningStatsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<DeckLearningStatsQuery, DeckLearningStatsQueryVariables>(
    DeckLearningStatsDocument,
    options,
  )
}
// @ts-ignore
export function useDeckLearningStatsSuspenseQuery(
  baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<
    DeckLearningStatsQuery,
    DeckLearningStatsQueryVariables
  >,
): ApolloReactHooks.UseSuspenseQueryResult<DeckLearningStatsQuery, DeckLearningStatsQueryVariables>
export function useDeckLearningStatsSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<
        DeckLearningStatsQuery,
        DeckLearningStatsQueryVariables
      >,
): ApolloReactHooks.UseSuspenseQueryResult<
  DeckLearningStatsQuery | undefined,
  DeckLearningStatsQueryVariables
>
export function useDeckLearningStatsSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<
        DeckLearningStatsQuery,
        DeckLearningStatsQueryVariables
      >,
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<DeckLearningStatsQuery, DeckLearningStatsQueryVariables>(
    DeckLearningStatsDocument,
    options,
  )
}
export type DeckLearningStatsQueryHookResult = ReturnType<typeof useDeckLearningStatsQuery>
export type DeckLearningStatsLazyQueryHookResult = ReturnType<typeof useDeckLearningStatsLazyQuery>
export type DeckLearningStatsSuspenseQueryHookResult = ReturnType<
  typeof useDeckLearningStatsSuspenseQuery
>
export type DeckLearningStatsQueryResult = Apollo.QueryResult<
  DeckLearningStatsQuery,
  DeckLearningStatsQueryVariables
>
export const HomeLearningProgressDocument = gql`
  query HomeLearningProgress {
    homeLearningProgress {
      activeTargetLanguage
      toLearnCount
      practicedCount
      learnedCount
      dueCount
      totalCardCount
    }
  }
`

/**
 * __useHomeLearningProgressQuery__
 *
 * To run a query within a React component, call `useHomeLearningProgressQuery` and pass it any options that fit your needs.
 * When your component renders, `useHomeLearningProgressQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHomeLearningProgressQuery({
 *   variables: {
 *   },
 * });
 */
export function useHomeLearningProgressQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    HomeLearningProgressQuery,
    HomeLearningProgressQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<HomeLearningProgressQuery, HomeLearningProgressQueryVariables>(
    HomeLearningProgressDocument,
    options,
  )
}
export function useHomeLearningProgressLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    HomeLearningProgressQuery,
    HomeLearningProgressQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<
    HomeLearningProgressQuery,
    HomeLearningProgressQueryVariables
  >(HomeLearningProgressDocument, options)
}
// @ts-ignore
export function useHomeLearningProgressSuspenseQuery(
  baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<
    HomeLearningProgressQuery,
    HomeLearningProgressQueryVariables
  >,
): ApolloReactHooks.UseSuspenseQueryResult<
  HomeLearningProgressQuery,
  HomeLearningProgressQueryVariables
>
export function useHomeLearningProgressSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<
        HomeLearningProgressQuery,
        HomeLearningProgressQueryVariables
      >,
): ApolloReactHooks.UseSuspenseQueryResult<
  HomeLearningProgressQuery | undefined,
  HomeLearningProgressQueryVariables
>
export function useHomeLearningProgressSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<
        HomeLearningProgressQuery,
        HomeLearningProgressQueryVariables
      >,
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<
    HomeLearningProgressQuery,
    HomeLearningProgressQueryVariables
  >(HomeLearningProgressDocument, options)
}
export type HomeLearningProgressQueryHookResult = ReturnType<typeof useHomeLearningProgressQuery>
export type HomeLearningProgressLazyQueryHookResult = ReturnType<
  typeof useHomeLearningProgressLazyQuery
>
export type HomeLearningProgressSuspenseQueryHookResult = ReturnType<
  typeof useHomeLearningProgressSuspenseQuery
>
export type HomeLearningProgressQueryResult = Apollo.QueryResult<
  HomeLearningProgressQuery,
  HomeLearningProgressQueryVariables
>
export const RegisterPushTokenDocument = gql`
  mutation RegisterPushToken($input: RegisterPushTokenInput!) {
    registerPushToken(input: $input) {
      success
    }
  }
`
export type RegisterPushTokenMutationFn = Apollo.MutationFunction<
  RegisterPushTokenMutation,
  RegisterPushTokenMutationVariables
>

/**
 * __useRegisterPushTokenMutation__
 *
 * To run a mutation, you first call `useRegisterPushTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterPushTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerPushTokenMutation, { data, loading, error }] = useRegisterPushTokenMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRegisterPushTokenMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    RegisterPushTokenMutation,
    RegisterPushTokenMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    RegisterPushTokenMutation,
    RegisterPushTokenMutationVariables
  >(RegisterPushTokenDocument, options)
}
export type RegisterPushTokenMutationHookResult = ReturnType<typeof useRegisterPushTokenMutation>
export type RegisterPushTokenMutationResult = Apollo.MutationResult<RegisterPushTokenMutation>
export type RegisterPushTokenMutationOptions = Apollo.BaseMutationOptions<
  RegisterPushTokenMutation,
  RegisterPushTokenMutationVariables
>
export const RemovePushTokenDocument = gql`
  mutation RemovePushToken($input: RemovePushTokenInput!) {
    removePushToken(input: $input)
  }
`
export type RemovePushTokenMutationFn = Apollo.MutationFunction<
  RemovePushTokenMutation,
  RemovePushTokenMutationVariables
>

/**
 * __useRemovePushTokenMutation__
 *
 * To run a mutation, you first call `useRemovePushTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemovePushTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removePushTokenMutation, { data, loading, error }] = useRemovePushTokenMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRemovePushTokenMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    RemovePushTokenMutation,
    RemovePushTokenMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<RemovePushTokenMutation, RemovePushTokenMutationVariables>(
    RemovePushTokenDocument,
    options,
  )
}
export type RemovePushTokenMutationHookResult = ReturnType<typeof useRemovePushTokenMutation>
export type RemovePushTokenMutationResult = Apollo.MutationResult<RemovePushTokenMutation>
export type RemovePushTokenMutationOptions = Apollo.BaseMutationOptions<
  RemovePushTokenMutation,
  RemovePushTokenMutationVariables
>
export const ProfileMeDocument = gql`
  query ProfileMe {
    me {
      id
      email
      role
      emailVerifiedAt
      blockedAt
      createdAt
      updatedAt
    }
  }
`

/**
 * __useProfileMeQuery__
 *
 * To run a query within a React component, call `useProfileMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useProfileMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProfileMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useProfileMeQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<ProfileMeQuery, ProfileMeQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<ProfileMeQuery, ProfileMeQueryVariables>(
    ProfileMeDocument,
    options,
  )
}
export function useProfileMeLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ProfileMeQuery, ProfileMeQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<ProfileMeQuery, ProfileMeQueryVariables>(
    ProfileMeDocument,
    options,
  )
}
// @ts-ignore
export function useProfileMeSuspenseQuery(
  baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<ProfileMeQuery, ProfileMeQueryVariables>,
): ApolloReactHooks.UseSuspenseQueryResult<ProfileMeQuery, ProfileMeQueryVariables>
export function useProfileMeSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<ProfileMeQuery, ProfileMeQueryVariables>,
): ApolloReactHooks.UseSuspenseQueryResult<ProfileMeQuery | undefined, ProfileMeQueryVariables>
export function useProfileMeSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<ProfileMeQuery, ProfileMeQueryVariables>,
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<ProfileMeQuery, ProfileMeQueryVariables>(
    ProfileMeDocument,
    options,
  )
}
export type ProfileMeQueryHookResult = ReturnType<typeof useProfileMeQuery>
export type ProfileMeLazyQueryHookResult = ReturnType<typeof useProfileMeLazyQuery>
export type ProfileMeSuspenseQueryHookResult = ReturnType<typeof useProfileMeSuspenseQuery>
export type ProfileMeQueryResult = Apollo.QueryResult<ProfileMeQuery, ProfileMeQueryVariables>
export const DeleteAccountDocument = gql`
  mutation DeleteAccount {
    deleteAccount
  }
`
export type DeleteAccountMutationFn = Apollo.MutationFunction<
  DeleteAccountMutation,
  DeleteAccountMutationVariables
>

/**
 * __useDeleteAccountMutation__
 *
 * To run a mutation, you first call `useDeleteAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAccountMutation, { data, loading, error }] = useDeleteAccountMutation({
 *   variables: {
 *   },
 * });
 */
export function useDeleteAccountMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    DeleteAccountMutation,
    DeleteAccountMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<DeleteAccountMutation, DeleteAccountMutationVariables>(
    DeleteAccountDocument,
    options,
  )
}
export type DeleteAccountMutationHookResult = ReturnType<typeof useDeleteAccountMutation>
export type DeleteAccountMutationResult = Apollo.MutationResult<DeleteAccountMutation>
export type DeleteAccountMutationOptions = Apollo.BaseMutationOptions<
  DeleteAccountMutation,
  DeleteAccountMutationVariables
>
export const PublicDecksDocument = gql`
  query PublicDecks($input: PublicDecksInput) {
    publicDecks(input: $input) {
      items {
        id
        ownerId
        title
        description
        visibility
        moderationStatus
        isOfficial
        sourceDeckId
        targetLanguage
        sourceLanguage
        createdAt
        updatedAt
      }
      total
    }
  }
`

/**
 * __usePublicDecksQuery__
 *
 * To run a query within a React component, call `usePublicDecksQuery` and pass it any options that fit your needs.
 * When your component renders, `usePublicDecksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePublicDecksQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePublicDecksQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<PublicDecksQuery, PublicDecksQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<PublicDecksQuery, PublicDecksQueryVariables>(
    PublicDecksDocument,
    options,
  )
}
export function usePublicDecksLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<PublicDecksQuery, PublicDecksQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<PublicDecksQuery, PublicDecksQueryVariables>(
    PublicDecksDocument,
    options,
  )
}
// @ts-ignore
export function usePublicDecksSuspenseQuery(
  baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<
    PublicDecksQuery,
    PublicDecksQueryVariables
  >,
): ApolloReactHooks.UseSuspenseQueryResult<PublicDecksQuery, PublicDecksQueryVariables>
export function usePublicDecksSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<PublicDecksQuery, PublicDecksQueryVariables>,
): ApolloReactHooks.UseSuspenseQueryResult<PublicDecksQuery | undefined, PublicDecksQueryVariables>
export function usePublicDecksSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<PublicDecksQuery, PublicDecksQueryVariables>,
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<PublicDecksQuery, PublicDecksQueryVariables>(
    PublicDecksDocument,
    options,
  )
}
export type PublicDecksQueryHookResult = ReturnType<typeof usePublicDecksQuery>
export type PublicDecksLazyQueryHookResult = ReturnType<typeof usePublicDecksLazyQuery>
export type PublicDecksSuspenseQueryHookResult = ReturnType<typeof usePublicDecksSuspenseQuery>
export type PublicDecksQueryResult = Apollo.QueryResult<PublicDecksQuery, PublicDecksQueryVariables>
export const PublicDeckDocument = gql`
  query PublicDeck($deckId: String!) {
    publicDeck(deckId: $deckId) {
      id
      ownerId
      title
      description
      visibility
      moderationStatus
      isOfficial
      sourceDeckId
      targetLanguage
      sourceLanguage
      createdAt
      updatedAt
    }
  }
`

/**
 * __usePublicDeckQuery__
 *
 * To run a query within a React component, call `usePublicDeckQuery` and pass it any options that fit your needs.
 * When your component renders, `usePublicDeckQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePublicDeckQuery({
 *   variables: {
 *      deckId: // value for 'deckId'
 *   },
 * });
 */
export function usePublicDeckQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<PublicDeckQuery, PublicDeckQueryVariables> &
    ({ variables: PublicDeckQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<PublicDeckQuery, PublicDeckQueryVariables>(
    PublicDeckDocument,
    options,
  )
}
export function usePublicDeckLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<PublicDeckQuery, PublicDeckQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<PublicDeckQuery, PublicDeckQueryVariables>(
    PublicDeckDocument,
    options,
  )
}
// @ts-ignore
export function usePublicDeckSuspenseQuery(
  baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<
    PublicDeckQuery,
    PublicDeckQueryVariables
  >,
): ApolloReactHooks.UseSuspenseQueryResult<PublicDeckQuery, PublicDeckQueryVariables>
export function usePublicDeckSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<PublicDeckQuery, PublicDeckQueryVariables>,
): ApolloReactHooks.UseSuspenseQueryResult<PublicDeckQuery | undefined, PublicDeckQueryVariables>
export function usePublicDeckSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<PublicDeckQuery, PublicDeckQueryVariables>,
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<PublicDeckQuery, PublicDeckQueryVariables>(
    PublicDeckDocument,
    options,
  )
}
export type PublicDeckQueryHookResult = ReturnType<typeof usePublicDeckQuery>
export type PublicDeckLazyQueryHookResult = ReturnType<typeof usePublicDeckLazyQuery>
export type PublicDeckSuspenseQueryHookResult = ReturnType<typeof usePublicDeckSuspenseQuery>
export type PublicDeckQueryResult = Apollo.QueryResult<PublicDeckQuery, PublicDeckQueryVariables>
export const PublicDeckCardsDocument = gql`
  query PublicDeckCards($deckId: String!) {
    publicDeckCards(deckId: $deckId) {
      id
      deckId
      front
      back
      example
      notes
      position
      createdAt
      updatedAt
    }
  }
`

/**
 * __usePublicDeckCardsQuery__
 *
 * To run a query within a React component, call `usePublicDeckCardsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePublicDeckCardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePublicDeckCardsQuery({
 *   variables: {
 *      deckId: // value for 'deckId'
 *   },
 * });
 */
export function usePublicDeckCardsQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    PublicDeckCardsQuery,
    PublicDeckCardsQueryVariables
  > &
    ({ variables: PublicDeckCardsQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<PublicDeckCardsQuery, PublicDeckCardsQueryVariables>(
    PublicDeckCardsDocument,
    options,
  )
}
export function usePublicDeckCardsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    PublicDeckCardsQuery,
    PublicDeckCardsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<PublicDeckCardsQuery, PublicDeckCardsQueryVariables>(
    PublicDeckCardsDocument,
    options,
  )
}
// @ts-ignore
export function usePublicDeckCardsSuspenseQuery(
  baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<
    PublicDeckCardsQuery,
    PublicDeckCardsQueryVariables
  >,
): ApolloReactHooks.UseSuspenseQueryResult<PublicDeckCardsQuery, PublicDeckCardsQueryVariables>
export function usePublicDeckCardsSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<
        PublicDeckCardsQuery,
        PublicDeckCardsQueryVariables
      >,
): ApolloReactHooks.UseSuspenseQueryResult<
  PublicDeckCardsQuery | undefined,
  PublicDeckCardsQueryVariables
>
export function usePublicDeckCardsSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<
        PublicDeckCardsQuery,
        PublicDeckCardsQueryVariables
      >,
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<PublicDeckCardsQuery, PublicDeckCardsQueryVariables>(
    PublicDeckCardsDocument,
    options,
  )
}
export type PublicDeckCardsQueryHookResult = ReturnType<typeof usePublicDeckCardsQuery>
export type PublicDeckCardsLazyQueryHookResult = ReturnType<typeof usePublicDeckCardsLazyQuery>
export type PublicDeckCardsSuspenseQueryHookResult = ReturnType<
  typeof usePublicDeckCardsSuspenseQuery
>
export type PublicDeckCardsQueryResult = Apollo.QueryResult<
  PublicDeckCardsQuery,
  PublicDeckCardsQueryVariables
>
export const CopyPublicDeckDocument = gql`
  mutation CopyPublicDeck($sourceDeckId: String!) {
    copyPublicDeck(sourceDeckId: $sourceDeckId) {
      deck {
        id
        ownerId
        title
        description
        visibility
        moderationStatus
        isOfficial
        sourceDeckId
        createdAt
        updatedAt
      }
      cards {
        id
        deckId
        front
        back
        example
        notes
        position
        createdAt
        updatedAt
      }
    }
  }
`
export type CopyPublicDeckMutationFn = Apollo.MutationFunction<
  CopyPublicDeckMutation,
  CopyPublicDeckMutationVariables
>

/**
 * __useCopyPublicDeckMutation__
 *
 * To run a mutation, you first call `useCopyPublicDeckMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCopyPublicDeckMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [copyPublicDeckMutation, { data, loading, error }] = useCopyPublicDeckMutation({
 *   variables: {
 *      sourceDeckId: // value for 'sourceDeckId'
 *   },
 * });
 */
export function useCopyPublicDeckMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CopyPublicDeckMutation,
    CopyPublicDeckMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<CopyPublicDeckMutation, CopyPublicDeckMutationVariables>(
    CopyPublicDeckDocument,
    options,
  )
}
export type CopyPublicDeckMutationHookResult = ReturnType<typeof useCopyPublicDeckMutation>
export type CopyPublicDeckMutationResult = Apollo.MutationResult<CopyPublicDeckMutation>
export type CopyPublicDeckMutationOptions = Apollo.BaseMutationOptions<
  CopyPublicDeckMutation,
  CopyPublicDeckMutationVariables
>
export const MySettingsDocument = gql`
  query MySettings {
    myAccount {
      settings {
        userId
        interfaceLocale
        lessonSize
        notificationsEnabled
        reminderTime
        timezone
        nativeLanguage
        createdAt
        updatedAt
      }
    }
  }
`

/**
 * __useMySettingsQuery__
 *
 * To run a query within a React component, call `useMySettingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMySettingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMySettingsQuery({
 *   variables: {
 *   },
 * });
 */
export function useMySettingsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<MySettingsQuery, MySettingsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<MySettingsQuery, MySettingsQueryVariables>(
    MySettingsDocument,
    options,
  )
}
export function useMySettingsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MySettingsQuery, MySettingsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<MySettingsQuery, MySettingsQueryVariables>(
    MySettingsDocument,
    options,
  )
}
// @ts-ignore
export function useMySettingsSuspenseQuery(
  baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<
    MySettingsQuery,
    MySettingsQueryVariables
  >,
): ApolloReactHooks.UseSuspenseQueryResult<MySettingsQuery, MySettingsQueryVariables>
export function useMySettingsSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<MySettingsQuery, MySettingsQueryVariables>,
): ApolloReactHooks.UseSuspenseQueryResult<MySettingsQuery | undefined, MySettingsQueryVariables>
export function useMySettingsSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<MySettingsQuery, MySettingsQueryVariables>,
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<MySettingsQuery, MySettingsQueryVariables>(
    MySettingsDocument,
    options,
  )
}
export type MySettingsQueryHookResult = ReturnType<typeof useMySettingsQuery>
export type MySettingsLazyQueryHookResult = ReturnType<typeof useMySettingsLazyQuery>
export type MySettingsSuspenseQueryHookResult = ReturnType<typeof useMySettingsSuspenseQuery>
export type MySettingsQueryResult = Apollo.QueryResult<MySettingsQuery, MySettingsQueryVariables>
export const UpdateMySettingsDocument = gql`
  mutation UpdateMySettings($input: UpdateSettingsInput!) {
    updateSettings(input: $input) {
      userId
      interfaceLocale
      lessonSize
      notificationsEnabled
      reminderTime
      timezone
      nativeLanguage
      createdAt
      updatedAt
    }
  }
`
export type UpdateMySettingsMutationFn = Apollo.MutationFunction<
  UpdateMySettingsMutation,
  UpdateMySettingsMutationVariables
>

/**
 * __useUpdateMySettingsMutation__
 *
 * To run a mutation, you first call `useUpdateMySettingsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMySettingsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMySettingsMutation, { data, loading, error }] = useUpdateMySettingsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateMySettingsMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpdateMySettingsMutation,
    UpdateMySettingsMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<UpdateMySettingsMutation, UpdateMySettingsMutationVariables>(
    UpdateMySettingsDocument,
    options,
  )
}
export type UpdateMySettingsMutationHookResult = ReturnType<typeof useUpdateMySettingsMutation>
export type UpdateMySettingsMutationResult = Apollo.MutationResult<UpdateMySettingsMutation>
export type UpdateMySettingsMutationOptions = Apollo.BaseMutationOptions<
  UpdateMySettingsMutation,
  UpdateMySettingsMutationVariables
>
export const LanguagesDocument = gql`
  query Languages($search: String) {
    languages(search: $search) {
      code
      englishName
      nativeName
      flag
      popularSortOrder
    }
  }
`

/**
 * __useLanguagesQuery__
 *
 * To run a query within a React component, call `useLanguagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useLanguagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLanguagesQuery({
 *   variables: {
 *      search: // value for 'search'
 *   },
 * });
 */
export function useLanguagesQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<LanguagesQuery, LanguagesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<LanguagesQuery, LanguagesQueryVariables>(
    LanguagesDocument,
    options,
  )
}
export function useLanguagesLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<LanguagesQuery, LanguagesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<LanguagesQuery, LanguagesQueryVariables>(
    LanguagesDocument,
    options,
  )
}
// @ts-ignore
export function useLanguagesSuspenseQuery(
  baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<LanguagesQuery, LanguagesQueryVariables>,
): ApolloReactHooks.UseSuspenseQueryResult<LanguagesQuery, LanguagesQueryVariables>
export function useLanguagesSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<LanguagesQuery, LanguagesQueryVariables>,
): ApolloReactHooks.UseSuspenseQueryResult<LanguagesQuery | undefined, LanguagesQueryVariables>
export function useLanguagesSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<LanguagesQuery, LanguagesQueryVariables>,
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<LanguagesQuery, LanguagesQueryVariables>(
    LanguagesDocument,
    options,
  )
}
export type LanguagesQueryHookResult = ReturnType<typeof useLanguagesQuery>
export type LanguagesLazyQueryHookResult = ReturnType<typeof useLanguagesLazyQuery>
export type LanguagesSuspenseQueryHookResult = ReturnType<typeof useLanguagesSuspenseQuery>
export type LanguagesQueryResult = Apollo.QueryResult<LanguagesQuery, LanguagesQueryVariables>
export const MyStudyLanguagesDocument = gql`
  query MyStudyLanguages {
    myStudyLanguages {
      languageCode
      isActive
      createdAt
      language {
        code
        englishName
        nativeName
        flag
        popularSortOrder
      }
    }
  }
`

/**
 * __useMyStudyLanguagesQuery__
 *
 * To run a query within a React component, call `useMyStudyLanguagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyStudyLanguagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyStudyLanguagesQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyStudyLanguagesQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    MyStudyLanguagesQuery,
    MyStudyLanguagesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<MyStudyLanguagesQuery, MyStudyLanguagesQueryVariables>(
    MyStudyLanguagesDocument,
    options,
  )
}
export function useMyStudyLanguagesLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    MyStudyLanguagesQuery,
    MyStudyLanguagesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<MyStudyLanguagesQuery, MyStudyLanguagesQueryVariables>(
    MyStudyLanguagesDocument,
    options,
  )
}
// @ts-ignore
export function useMyStudyLanguagesSuspenseQuery(
  baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<
    MyStudyLanguagesQuery,
    MyStudyLanguagesQueryVariables
  >,
): ApolloReactHooks.UseSuspenseQueryResult<MyStudyLanguagesQuery, MyStudyLanguagesQueryVariables>
export function useMyStudyLanguagesSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<
        MyStudyLanguagesQuery,
        MyStudyLanguagesQueryVariables
      >,
): ApolloReactHooks.UseSuspenseQueryResult<
  MyStudyLanguagesQuery | undefined,
  MyStudyLanguagesQueryVariables
>
export function useMyStudyLanguagesSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<
        MyStudyLanguagesQuery,
        MyStudyLanguagesQueryVariables
      >,
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<MyStudyLanguagesQuery, MyStudyLanguagesQueryVariables>(
    MyStudyLanguagesDocument,
    options,
  )
}
export type MyStudyLanguagesQueryHookResult = ReturnType<typeof useMyStudyLanguagesQuery>
export type MyStudyLanguagesLazyQueryHookResult = ReturnType<typeof useMyStudyLanguagesLazyQuery>
export type MyStudyLanguagesSuspenseQueryHookResult = ReturnType<
  typeof useMyStudyLanguagesSuspenseQuery
>
export type MyStudyLanguagesQueryResult = Apollo.QueryResult<
  MyStudyLanguagesQuery,
  MyStudyLanguagesQueryVariables
>
export const StudyLanguageBootstrapDocument = gql`
  query StudyLanguageBootstrap {
    myAccount {
      needsStudyLanguageOnboarding
      settings {
        activeTargetLanguage
        nativeLanguage
      }
      studyLanguages {
        languageCode
        isActive
        createdAt
        language {
          code
          englishName
          nativeName
          flag
          popularSortOrder
        }
      }
    }
  }
`

/**
 * __useStudyLanguageBootstrapQuery__
 *
 * To run a query within a React component, call `useStudyLanguageBootstrapQuery` and pass it any options that fit your needs.
 * When your component renders, `useStudyLanguageBootstrapQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStudyLanguageBootstrapQuery({
 *   variables: {
 *   },
 * });
 */
export function useStudyLanguageBootstrapQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    StudyLanguageBootstrapQuery,
    StudyLanguageBootstrapQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<
    StudyLanguageBootstrapQuery,
    StudyLanguageBootstrapQueryVariables
  >(StudyLanguageBootstrapDocument, options)
}
export function useStudyLanguageBootstrapLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    StudyLanguageBootstrapQuery,
    StudyLanguageBootstrapQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<
    StudyLanguageBootstrapQuery,
    StudyLanguageBootstrapQueryVariables
  >(StudyLanguageBootstrapDocument, options)
}
// @ts-ignore
export function useStudyLanguageBootstrapSuspenseQuery(
  baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<
    StudyLanguageBootstrapQuery,
    StudyLanguageBootstrapQueryVariables
  >,
): ApolloReactHooks.UseSuspenseQueryResult<
  StudyLanguageBootstrapQuery,
  StudyLanguageBootstrapQueryVariables
>
export function useStudyLanguageBootstrapSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<
        StudyLanguageBootstrapQuery,
        StudyLanguageBootstrapQueryVariables
      >,
): ApolloReactHooks.UseSuspenseQueryResult<
  StudyLanguageBootstrapQuery | undefined,
  StudyLanguageBootstrapQueryVariables
>
export function useStudyLanguageBootstrapSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<
        StudyLanguageBootstrapQuery,
        StudyLanguageBootstrapQueryVariables
      >,
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<
    StudyLanguageBootstrapQuery,
    StudyLanguageBootstrapQueryVariables
  >(StudyLanguageBootstrapDocument, options)
}
export type StudyLanguageBootstrapQueryHookResult = ReturnType<
  typeof useStudyLanguageBootstrapQuery
>
export type StudyLanguageBootstrapLazyQueryHookResult = ReturnType<
  typeof useStudyLanguageBootstrapLazyQuery
>
export type StudyLanguageBootstrapSuspenseQueryHookResult = ReturnType<
  typeof useStudyLanguageBootstrapSuspenseQuery
>
export type StudyLanguageBootstrapQueryResult = Apollo.QueryResult<
  StudyLanguageBootstrapQuery,
  StudyLanguageBootstrapQueryVariables
>
export const StudyLanguageRemovalImpactDocument = gql`
  query StudyLanguageRemovalImpact($languageCode: String!) {
    studyLanguageRemovalImpact(languageCode: $languageCode) {
      affectedDeckCount
    }
  }
`

/**
 * __useStudyLanguageRemovalImpactQuery__
 *
 * To run a query within a React component, call `useStudyLanguageRemovalImpactQuery` and pass it any options that fit your needs.
 * When your component renders, `useStudyLanguageRemovalImpactQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStudyLanguageRemovalImpactQuery({
 *   variables: {
 *      languageCode: // value for 'languageCode'
 *   },
 * });
 */
export function useStudyLanguageRemovalImpactQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    StudyLanguageRemovalImpactQuery,
    StudyLanguageRemovalImpactQueryVariables
  > &
    ({ variables: StudyLanguageRemovalImpactQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<
    StudyLanguageRemovalImpactQuery,
    StudyLanguageRemovalImpactQueryVariables
  >(StudyLanguageRemovalImpactDocument, options)
}
export function useStudyLanguageRemovalImpactLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    StudyLanguageRemovalImpactQuery,
    StudyLanguageRemovalImpactQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<
    StudyLanguageRemovalImpactQuery,
    StudyLanguageRemovalImpactQueryVariables
  >(StudyLanguageRemovalImpactDocument, options)
}
// @ts-ignore
export function useStudyLanguageRemovalImpactSuspenseQuery(
  baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<
    StudyLanguageRemovalImpactQuery,
    StudyLanguageRemovalImpactQueryVariables
  >,
): ApolloReactHooks.UseSuspenseQueryResult<
  StudyLanguageRemovalImpactQuery,
  StudyLanguageRemovalImpactQueryVariables
>
export function useStudyLanguageRemovalImpactSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<
        StudyLanguageRemovalImpactQuery,
        StudyLanguageRemovalImpactQueryVariables
      >,
): ApolloReactHooks.UseSuspenseQueryResult<
  StudyLanguageRemovalImpactQuery | undefined,
  StudyLanguageRemovalImpactQueryVariables
>
export function useStudyLanguageRemovalImpactSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<
        StudyLanguageRemovalImpactQuery,
        StudyLanguageRemovalImpactQueryVariables
      >,
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<
    StudyLanguageRemovalImpactQuery,
    StudyLanguageRemovalImpactQueryVariables
  >(StudyLanguageRemovalImpactDocument, options)
}
export type StudyLanguageRemovalImpactQueryHookResult = ReturnType<
  typeof useStudyLanguageRemovalImpactQuery
>
export type StudyLanguageRemovalImpactLazyQueryHookResult = ReturnType<
  typeof useStudyLanguageRemovalImpactLazyQuery
>
export type StudyLanguageRemovalImpactSuspenseQueryHookResult = ReturnType<
  typeof useStudyLanguageRemovalImpactSuspenseQuery
>
export type StudyLanguageRemovalImpactQueryResult = Apollo.QueryResult<
  StudyLanguageRemovalImpactQuery,
  StudyLanguageRemovalImpactQueryVariables
>
export const AddStudyLanguageDocument = gql`
  mutation AddStudyLanguage($languageCode: String!) {
    addStudyLanguage(languageCode: $languageCode) {
      languageCode
      isActive
      createdAt
      language {
        code
        englishName
        nativeName
        flag
        popularSortOrder
      }
    }
  }
`
export type AddStudyLanguageMutationFn = Apollo.MutationFunction<
  AddStudyLanguageMutation,
  AddStudyLanguageMutationVariables
>

/**
 * __useAddStudyLanguageMutation__
 *
 * To run a mutation, you first call `useAddStudyLanguageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddStudyLanguageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addStudyLanguageMutation, { data, loading, error }] = useAddStudyLanguageMutation({
 *   variables: {
 *      languageCode: // value for 'languageCode'
 *   },
 * });
 */
export function useAddStudyLanguageMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    AddStudyLanguageMutation,
    AddStudyLanguageMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<AddStudyLanguageMutation, AddStudyLanguageMutationVariables>(
    AddStudyLanguageDocument,
    options,
  )
}
export type AddStudyLanguageMutationHookResult = ReturnType<typeof useAddStudyLanguageMutation>
export type AddStudyLanguageMutationResult = Apollo.MutationResult<AddStudyLanguageMutation>
export type AddStudyLanguageMutationOptions = Apollo.BaseMutationOptions<
  AddStudyLanguageMutation,
  AddStudyLanguageMutationVariables
>
export const RemoveStudyLanguageDocument = gql`
  mutation RemoveStudyLanguage($languageCode: String!) {
    removeStudyLanguage(languageCode: $languageCode) {
      languageCode
      isActive
      createdAt
      language {
        code
        englishName
        nativeName
        flag
        popularSortOrder
      }
    }
  }
`
export type RemoveStudyLanguageMutationFn = Apollo.MutationFunction<
  RemoveStudyLanguageMutation,
  RemoveStudyLanguageMutationVariables
>

/**
 * __useRemoveStudyLanguageMutation__
 *
 * To run a mutation, you first call `useRemoveStudyLanguageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveStudyLanguageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeStudyLanguageMutation, { data, loading, error }] = useRemoveStudyLanguageMutation({
 *   variables: {
 *      languageCode: // value for 'languageCode'
 *   },
 * });
 */
export function useRemoveStudyLanguageMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    RemoveStudyLanguageMutation,
    RemoveStudyLanguageMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    RemoveStudyLanguageMutation,
    RemoveStudyLanguageMutationVariables
  >(RemoveStudyLanguageDocument, options)
}
export type RemoveStudyLanguageMutationHookResult = ReturnType<
  typeof useRemoveStudyLanguageMutation
>
export type RemoveStudyLanguageMutationResult = Apollo.MutationResult<RemoveStudyLanguageMutation>
export type RemoveStudyLanguageMutationOptions = Apollo.BaseMutationOptions<
  RemoveStudyLanguageMutation,
  RemoveStudyLanguageMutationVariables
>
export const SetActiveTargetLanguageDocument = gql`
  mutation SetActiveTargetLanguage($languageCode: String!) {
    setActiveTargetLanguage(languageCode: $languageCode) {
      languageCode
      isActive
      createdAt
      language {
        code
        englishName
        nativeName
        flag
        popularSortOrder
      }
    }
  }
`
export type SetActiveTargetLanguageMutationFn = Apollo.MutationFunction<
  SetActiveTargetLanguageMutation,
  SetActiveTargetLanguageMutationVariables
>

/**
 * __useSetActiveTargetLanguageMutation__
 *
 * To run a mutation, you first call `useSetActiveTargetLanguageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetActiveTargetLanguageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setActiveTargetLanguageMutation, { data, loading, error }] = useSetActiveTargetLanguageMutation({
 *   variables: {
 *      languageCode: // value for 'languageCode'
 *   },
 * });
 */
export function useSetActiveTargetLanguageMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    SetActiveTargetLanguageMutation,
    SetActiveTargetLanguageMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    SetActiveTargetLanguageMutation,
    SetActiveTargetLanguageMutationVariables
  >(SetActiveTargetLanguageDocument, options)
}
export type SetActiveTargetLanguageMutationHookResult = ReturnType<
  typeof useSetActiveTargetLanguageMutation
>
export type SetActiveTargetLanguageMutationResult =
  Apollo.MutationResult<SetActiveTargetLanguageMutation>
export type SetActiveTargetLanguageMutationOptions = Apollo.BaseMutationOptions<
  SetActiveTargetLanguageMutation,
  SetActiveTargetLanguageMutationVariables
>
export const CompleteStudyLanguageOnboardingDocument = gql`
  mutation CompleteStudyLanguageOnboarding($input: CompleteStudyLanguageOnboardingInput!) {
    completeStudyLanguageOnboarding(input: $input) {
      needsStudyLanguageOnboarding
      studyLanguages {
        languageCode
        isActive
        createdAt
        language {
          code
          englishName
          nativeName
          flag
          popularSortOrder
        }
      }
    }
  }
`
export type CompleteStudyLanguageOnboardingMutationFn = Apollo.MutationFunction<
  CompleteStudyLanguageOnboardingMutation,
  CompleteStudyLanguageOnboardingMutationVariables
>

/**
 * __useCompleteStudyLanguageOnboardingMutation__
 *
 * To run a mutation, you first call `useCompleteStudyLanguageOnboardingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCompleteStudyLanguageOnboardingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [completeStudyLanguageOnboardingMutation, { data, loading, error }] = useCompleteStudyLanguageOnboardingMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCompleteStudyLanguageOnboardingMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CompleteStudyLanguageOnboardingMutation,
    CompleteStudyLanguageOnboardingMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    CompleteStudyLanguageOnboardingMutation,
    CompleteStudyLanguageOnboardingMutationVariables
  >(CompleteStudyLanguageOnboardingDocument, options)
}
export type CompleteStudyLanguageOnboardingMutationHookResult = ReturnType<
  typeof useCompleteStudyLanguageOnboardingMutation
>
export type CompleteStudyLanguageOnboardingMutationResult =
  Apollo.MutationResult<CompleteStudyLanguageOnboardingMutation>
export type CompleteStudyLanguageOnboardingMutationOptions = Apollo.BaseMutationOptions<
  CompleteStudyLanguageOnboardingMutation,
  CompleteStudyLanguageOnboardingMutationVariables
>
export const StartPublicDeckCopyPreviewDocument = gql`
  mutation StartPublicDeckCopyPreview($input: StartPublicDeckCopyPreviewInput!) {
    startPublicDeckCopyPreview(input: $input) {
      id
      type
      status
      sourceDeckId
      targetLanguage
      chosenSourceLanguage
      cards {
        sourceCardId
        front
        back
        example
        backError
        exampleError
      }
      expiresAt
      createdAt
      updatedAt
    }
  }
`
export type StartPublicDeckCopyPreviewMutationFn = Apollo.MutationFunction<
  StartPublicDeckCopyPreviewMutation,
  StartPublicDeckCopyPreviewMutationVariables
>

/**
 * __useStartPublicDeckCopyPreviewMutation__
 *
 * To run a mutation, you first call `useStartPublicDeckCopyPreviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStartPublicDeckCopyPreviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [startPublicDeckCopyPreviewMutation, { data, loading, error }] = useStartPublicDeckCopyPreviewMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useStartPublicDeckCopyPreviewMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    StartPublicDeckCopyPreviewMutation,
    StartPublicDeckCopyPreviewMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    StartPublicDeckCopyPreviewMutation,
    StartPublicDeckCopyPreviewMutationVariables
  >(StartPublicDeckCopyPreviewDocument, options)
}
export type StartPublicDeckCopyPreviewMutationHookResult = ReturnType<
  typeof useStartPublicDeckCopyPreviewMutation
>
export type StartPublicDeckCopyPreviewMutationResult =
  Apollo.MutationResult<StartPublicDeckCopyPreviewMutation>
export type StartPublicDeckCopyPreviewMutationOptions = Apollo.BaseMutationOptions<
  StartPublicDeckCopyPreviewMutation,
  StartPublicDeckCopyPreviewMutationVariables
>
export const StartGroupDeckCopyPreviewDocument = gql`
  mutation StartGroupDeckCopyPreview($input: StartGroupDeckCopyPreviewInput!) {
    startGroupDeckCopyPreview(input: $input) {
      id
      type
      status
      sourceDeckId
      targetLanguage
      chosenSourceLanguage
      cards {
        sourceCardId
        front
        back
        example
        backError
        exampleError
      }
      expiresAt
      createdAt
      updatedAt
    }
  }
`
export type StartGroupDeckCopyPreviewMutationFn = Apollo.MutationFunction<
  StartGroupDeckCopyPreviewMutation,
  StartGroupDeckCopyPreviewMutationVariables
>

/**
 * __useStartGroupDeckCopyPreviewMutation__
 *
 * To run a mutation, you first call `useStartGroupDeckCopyPreviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStartGroupDeckCopyPreviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [startGroupDeckCopyPreviewMutation, { data, loading, error }] = useStartGroupDeckCopyPreviewMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useStartGroupDeckCopyPreviewMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    StartGroupDeckCopyPreviewMutation,
    StartGroupDeckCopyPreviewMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    StartGroupDeckCopyPreviewMutation,
    StartGroupDeckCopyPreviewMutationVariables
  >(StartGroupDeckCopyPreviewDocument, options)
}
export type StartGroupDeckCopyPreviewMutationHookResult = ReturnType<
  typeof useStartGroupDeckCopyPreviewMutation
>
export type StartGroupDeckCopyPreviewMutationResult =
  Apollo.MutationResult<StartGroupDeckCopyPreviewMutation>
export type StartGroupDeckCopyPreviewMutationOptions = Apollo.BaseMutationOptions<
  StartGroupDeckCopyPreviewMutation,
  StartGroupDeckCopyPreviewMutationVariables
>
export const ActiveDeckPreviewDocument = gql`
  query ActiveDeckPreview {
    activeDeckPreview {
      id
      type
      status
      sourceDeckId
      targetLanguage
      chosenSourceLanguage
      cards {
        sourceCardId
        front
        back
        example
        backError
        exampleError
      }
      expiresAt
      createdAt
      updatedAt
    }
  }
`

/**
 * __useActiveDeckPreviewQuery__
 *
 * To run a query within a React component, call `useActiveDeckPreviewQuery` and pass it any options that fit your needs.
 * When your component renders, `useActiveDeckPreviewQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useActiveDeckPreviewQuery({
 *   variables: {
 *   },
 * });
 */
export function useActiveDeckPreviewQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ActiveDeckPreviewQuery,
    ActiveDeckPreviewQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<ActiveDeckPreviewQuery, ActiveDeckPreviewQueryVariables>(
    ActiveDeckPreviewDocument,
    options,
  )
}
export function useActiveDeckPreviewLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ActiveDeckPreviewQuery,
    ActiveDeckPreviewQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<ActiveDeckPreviewQuery, ActiveDeckPreviewQueryVariables>(
    ActiveDeckPreviewDocument,
    options,
  )
}
// @ts-ignore
export function useActiveDeckPreviewSuspenseQuery(
  baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<
    ActiveDeckPreviewQuery,
    ActiveDeckPreviewQueryVariables
  >,
): ApolloReactHooks.UseSuspenseQueryResult<ActiveDeckPreviewQuery, ActiveDeckPreviewQueryVariables>
export function useActiveDeckPreviewSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<
        ActiveDeckPreviewQuery,
        ActiveDeckPreviewQueryVariables
      >,
): ApolloReactHooks.UseSuspenseQueryResult<
  ActiveDeckPreviewQuery | undefined,
  ActiveDeckPreviewQueryVariables
>
export function useActiveDeckPreviewSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<
        ActiveDeckPreviewQuery,
        ActiveDeckPreviewQueryVariables
      >,
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<ActiveDeckPreviewQuery, ActiveDeckPreviewQueryVariables>(
    ActiveDeckPreviewDocument,
    options,
  )
}
export type ActiveDeckPreviewQueryHookResult = ReturnType<typeof useActiveDeckPreviewQuery>
export type ActiveDeckPreviewLazyQueryHookResult = ReturnType<typeof useActiveDeckPreviewLazyQuery>
export type ActiveDeckPreviewSuspenseQueryHookResult = ReturnType<
  typeof useActiveDeckPreviewSuspenseQuery
>
export type ActiveDeckPreviewQueryResult = Apollo.QueryResult<
  ActiveDeckPreviewQuery,
  ActiveDeckPreviewQueryVariables
>
export const UpdateDeckPreviewCardDocument = gql`
  mutation UpdateDeckPreviewCard($input: UpdateDeckPreviewCardInput!) {
    updateDeckPreviewCard(input: $input) {
      id
      type
      status
      sourceDeckId
      targetLanguage
      chosenSourceLanguage
      cards {
        sourceCardId
        front
        back
        example
        backError
        exampleError
      }
      expiresAt
      createdAt
      updatedAt
    }
  }
`
export type UpdateDeckPreviewCardMutationFn = Apollo.MutationFunction<
  UpdateDeckPreviewCardMutation,
  UpdateDeckPreviewCardMutationVariables
>

/**
 * __useUpdateDeckPreviewCardMutation__
 *
 * To run a mutation, you first call `useUpdateDeckPreviewCardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateDeckPreviewCardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateDeckPreviewCardMutation, { data, loading, error }] = useUpdateDeckPreviewCardMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateDeckPreviewCardMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpdateDeckPreviewCardMutation,
    UpdateDeckPreviewCardMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    UpdateDeckPreviewCardMutation,
    UpdateDeckPreviewCardMutationVariables
  >(UpdateDeckPreviewCardDocument, options)
}
export type UpdateDeckPreviewCardMutationHookResult = ReturnType<
  typeof useUpdateDeckPreviewCardMutation
>
export type UpdateDeckPreviewCardMutationResult =
  Apollo.MutationResult<UpdateDeckPreviewCardMutation>
export type UpdateDeckPreviewCardMutationOptions = Apollo.BaseMutationOptions<
  UpdateDeckPreviewCardMutation,
  UpdateDeckPreviewCardMutationVariables
>
export const ConfirmDeckPreviewDocument = gql`
  mutation ConfirmDeckPreview($sessionId: String!) {
    confirmDeckPreview(sessionId: $sessionId) {
      deck {
        id
        ownerId
        title
        description
        visibility
        moderationStatus
        isOfficial
        sourceDeckId
        targetLanguage
        sourceLanguage
        createdAt
        updatedAt
      }
      cards {
        id
        deckId
        front
        back
        example
        notes
        position
        createdAt
        updatedAt
      }
    }
  }
`
export type ConfirmDeckPreviewMutationFn = Apollo.MutationFunction<
  ConfirmDeckPreviewMutation,
  ConfirmDeckPreviewMutationVariables
>

/**
 * __useConfirmDeckPreviewMutation__
 *
 * To run a mutation, you first call `useConfirmDeckPreviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useConfirmDeckPreviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [confirmDeckPreviewMutation, { data, loading, error }] = useConfirmDeckPreviewMutation({
 *   variables: {
 *      sessionId: // value for 'sessionId'
 *   },
 * });
 */
export function useConfirmDeckPreviewMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    ConfirmDeckPreviewMutation,
    ConfirmDeckPreviewMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    ConfirmDeckPreviewMutation,
    ConfirmDeckPreviewMutationVariables
  >(ConfirmDeckPreviewDocument, options)
}
export type ConfirmDeckPreviewMutationHookResult = ReturnType<typeof useConfirmDeckPreviewMutation>
export type ConfirmDeckPreviewMutationResult = Apollo.MutationResult<ConfirmDeckPreviewMutation>
export type ConfirmDeckPreviewMutationOptions = Apollo.BaseMutationOptions<
  ConfirmDeckPreviewMutation,
  ConfirmDeckPreviewMutationVariables
>
export const CancelDeckPreviewDocument = gql`
  mutation CancelDeckPreview($sessionId: String!) {
    cancelDeckPreview(sessionId: $sessionId)
  }
`
export type CancelDeckPreviewMutationFn = Apollo.MutationFunction<
  CancelDeckPreviewMutation,
  CancelDeckPreviewMutationVariables
>

/**
 * __useCancelDeckPreviewMutation__
 *
 * To run a mutation, you first call `useCancelDeckPreviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelDeckPreviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelDeckPreviewMutation, { data, loading, error }] = useCancelDeckPreviewMutation({
 *   variables: {
 *      sessionId: // value for 'sessionId'
 *   },
 * });
 */
export function useCancelDeckPreviewMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CancelDeckPreviewMutation,
    CancelDeckPreviewMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    CancelDeckPreviewMutation,
    CancelDeckPreviewMutationVariables
  >(CancelDeckPreviewDocument, options)
}
export type CancelDeckPreviewMutationHookResult = ReturnType<typeof useCancelDeckPreviewMutation>
export type CancelDeckPreviewMutationResult = Apollo.MutationResult<CancelDeckPreviewMutation>
export type CancelDeckPreviewMutationOptions = Apollo.BaseMutationOptions<
  CancelDeckPreviewMutation,
  CancelDeckPreviewMutationVariables
>
export const StartDeckRegeneratePreviewDocument = gql`
  mutation StartDeckRegeneratePreview($input: StartDeckRegeneratePreviewInput!) {
    startDeckRegeneratePreview(input: $input) {
      id
      type
      status
      sourceDeckId
      targetLanguage
      chosenSourceLanguage
      cards {
        sourceCardId
        front
        back
        example
        backError
        exampleError
      }
      expiresAt
      createdAt
      updatedAt
    }
  }
`
export type StartDeckRegeneratePreviewMutationFn = Apollo.MutationFunction<
  StartDeckRegeneratePreviewMutation,
  StartDeckRegeneratePreviewMutationVariables
>

/**
 * __useStartDeckRegeneratePreviewMutation__
 *
 * To run a mutation, you first call `useStartDeckRegeneratePreviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStartDeckRegeneratePreviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [startDeckRegeneratePreviewMutation, { data, loading, error }] = useStartDeckRegeneratePreviewMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useStartDeckRegeneratePreviewMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    StartDeckRegeneratePreviewMutation,
    StartDeckRegeneratePreviewMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    StartDeckRegeneratePreviewMutation,
    StartDeckRegeneratePreviewMutationVariables
  >(StartDeckRegeneratePreviewDocument, options)
}
export type StartDeckRegeneratePreviewMutationHookResult = ReturnType<
  typeof useStartDeckRegeneratePreviewMutation
>
export type StartDeckRegeneratePreviewMutationResult =
  Apollo.MutationResult<StartDeckRegeneratePreviewMutation>
export type StartDeckRegeneratePreviewMutationOptions = Apollo.BaseMutationOptions<
  StartDeckRegeneratePreviewMutation,
  StartDeckRegeneratePreviewMutationVariables
>
export const AccountLocaleDocument = gql`
  query AccountLocale {
    myAccount {
      settings {
        interfaceLocale
      }
    }
  }
`

/**
 * __useAccountLocaleQuery__
 *
 * To run a query within a React component, call `useAccountLocaleQuery` and pass it any options that fit your needs.
 * When your component renders, `useAccountLocaleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAccountLocaleQuery({
 *   variables: {
 *   },
 * });
 */
export function useAccountLocaleQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<AccountLocaleQuery, AccountLocaleQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<AccountLocaleQuery, AccountLocaleQueryVariables>(
    AccountLocaleDocument,
    options,
  )
}
export function useAccountLocaleLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    AccountLocaleQuery,
    AccountLocaleQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<AccountLocaleQuery, AccountLocaleQueryVariables>(
    AccountLocaleDocument,
    options,
  )
}
// @ts-ignore
export function useAccountLocaleSuspenseQuery(
  baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<
    AccountLocaleQuery,
    AccountLocaleQueryVariables
  >,
): ApolloReactHooks.UseSuspenseQueryResult<AccountLocaleQuery, AccountLocaleQueryVariables>
export function useAccountLocaleSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<AccountLocaleQuery, AccountLocaleQueryVariables>,
): ApolloReactHooks.UseSuspenseQueryResult<
  AccountLocaleQuery | undefined,
  AccountLocaleQueryVariables
>
export function useAccountLocaleSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<AccountLocaleQuery, AccountLocaleQueryVariables>,
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<AccountLocaleQuery, AccountLocaleQueryVariables>(
    AccountLocaleDocument,
    options,
  )
}
export type AccountLocaleQueryHookResult = ReturnType<typeof useAccountLocaleQuery>
export type AccountLocaleLazyQueryHookResult = ReturnType<typeof useAccountLocaleLazyQuery>
export type AccountLocaleSuspenseQueryHookResult = ReturnType<typeof useAccountLocaleSuspenseQuery>
export type AccountLocaleQueryResult = Apollo.QueryResult<
  AccountLocaleQuery,
  AccountLocaleQueryVariables
>
