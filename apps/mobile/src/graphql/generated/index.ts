import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never
}
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never }
const defaultOptions = {} as const
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  DateTime: { input: any; output: any }
}

export type AbandonLessonInput = {
  sessionId: Scalars['String']['input']
}

export type AbandonLessonPayload = {
  __typename?: 'AbandonLessonPayload'
  success: Scalars['Boolean']['output']
}

export type AcceptGroupInvitationPayload = {
  __typename?: 'AcceptGroupInvitationPayload'
  invitation: GroupInvitation
  member: GroupMember
}

export type AdminDashboardStats = {
  __typename?: 'AdminDashboardStats'
  decksCreatedLast7Days: Scalars['Float']['output']
  reviewsSubmittedLast7Days: Scalars['Float']['output']
  totalCards: Scalars['Float']['output']
  totalDecks: Scalars['Float']['output']
  totalPublicDecks: Scalars['Float']['output']
  totalReviews: Scalars['Float']['output']
  totalStudySessions: Scalars['Float']['output']
  totalUsers: Scalars['Float']['output']
  usersCreatedLast7Days: Scalars['Float']['output']
}

export type AdminSearchUsersInput = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  query?: InputMaybe<Scalars['String']['input']>
}

export type AdminUserSearchResult = {
  __typename?: 'AdminUserSearchResult'
  items: Array<AdminUserSummary>
  total: Scalars['Float']['output']
}

export type AdminUserSummary = {
  __typename?: 'AdminUserSummary'
  blockedAt?: Maybe<Scalars['DateTime']['output']>
  createdAt: Scalars['DateTime']['output']
  email: Scalars['String']['output']
  emailVerifiedAt?: Maybe<Scalars['DateTime']['output']>
  id: Scalars['String']['output']
  role: UserRole
  updatedAt: Scalars['DateTime']['output']
}

export type AuthPayloadType = {
  __typename?: 'AuthPayloadType'
  accessToken: Scalars['String']['output']
  refreshToken: Scalars['String']['output']
  user: SafeUser
}

export type Card = {
  __typename?: 'Card'
  back: Scalars['String']['output']
  createdAt: Scalars['DateTime']['output']
  deckId: Scalars['String']['output']
  example?: Maybe<Scalars['String']['output']>
  front: Scalars['String']['output']
  id: Scalars['String']['output']
  notes?: Maybe<Scalars['String']['output']>
  position: Scalars['Int']['output']
  updatedAt: Scalars['DateTime']['output']
}

export type CardReviewState = {
  __typename?: 'CardReviewState'
  cardId: Scalars['String']['output']
  dueAt: Scalars['DateTime']['output']
  easeFactor: Scalars['Float']['output']
  id: Scalars['String']['output']
  intervalDays: Scalars['Int']['output']
  lastReviewedAt?: Maybe<Scalars['DateTime']['output']>
  repetitions: Scalars['Int']['output']
}

export type CompleteLessonInput = {
  sessionId: Scalars['String']['input']
}

export type CompleteLessonPayload = {
  __typename?: 'CompleteLessonPayload'
  completedAt: Scalars['DateTime']['output']
  deckId: Scalars['String']['output']
  dontKnowCount: Scalars['Int']['output']
  knownCount: Scalars['Int']['output']
  reviewedCards: Scalars['Int']['output']
  sessionId: Scalars['String']['output']
  totalCards: Scalars['Int']['output']
}

export type ConfirmCsvImportInput = {
  importId: Scalars['String']['input']
}

export type ConfirmCsvImportPayload = {
  __typename?: 'ConfirmCsvImportPayload'
  createdCardsCount: Scalars['Int']['output']
  import: CsvImport
}

export type CopyPublicDeckPayload = {
  __typename?: 'CopyPublicDeckPayload'
  cards: Array<Card>
  deck: Deck
}

export type CreateCardInput = {
  back: Scalars['String']['input']
  deckId: Scalars['String']['input']
  example?: InputMaybe<Scalars['String']['input']>
  front: Scalars['String']['input']
  notes?: InputMaybe<Scalars['String']['input']>
  position?: InputMaybe<Scalars['Int']['input']>
}

export type CreateDeckInput = {
  description?: InputMaybe<Scalars['String']['input']>
  title: Scalars['String']['input']
}

export type CreateGroupInput = {
  description?: InputMaybe<Scalars['String']['input']>
  name: Scalars['String']['input']
}

export type CsvImport = {
  __typename?: 'CsvImport'
  confirmedAt?: Maybe<Scalars['DateTime']['output']>
  createdAt: Scalars['DateTime']['output']
  deckId: Scalars['String']['output']
  errors: Array<CsvImportRowError>
  expiresAt: Scalars['DateTime']['output']
  id: Scalars['String']['output']
  invalidRows: Scalars['Int']['output']
  previewRows: Array<CsvImportPreviewRow>
  status: CsvImportStatus
  totalRows: Scalars['Int']['output']
  validRows: Scalars['Int']['output']
}

export type CsvImportPreviewRow = {
  __typename?: 'CsvImportPreviewRow'
  back: Scalars['String']['output']
  errors: Array<CsvImportRowError>
  example?: Maybe<Scalars['String']['output']>
  front: Scalars['String']['output']
  isValid: Scalars['Boolean']['output']
  notes?: Maybe<Scalars['String']['output']>
  rowNumber: Scalars['Int']['output']
}

export type CsvImportRowError = {
  __typename?: 'CsvImportRowError'
  field: Scalars['String']['output']
  message: Scalars['String']['output']
  rowNumber: Scalars['Int']['output']
}

export enum CsvImportStatus {
  Cancelled = 'CANCELLED',
  Confirmed = 'CONFIRMED',
  Expired = 'EXPIRED',
  Pending = 'PENDING',
}

export type Deck = {
  __typename?: 'Deck'
  createdAt: Scalars['DateTime']['output']
  description?: Maybe<Scalars['String']['output']>
  id: Scalars['String']['output']
  isOfficial: Scalars['Boolean']['output']
  moderationStatus: DeckModerationStatus
  ownerId: Scalars['String']['output']
  sourceDeckId?: Maybe<Scalars['String']['output']>
  title: Scalars['String']['output']
  updatedAt: Scalars['DateTime']['output']
  visibility: DeckVisibility
}

export type DeckGroupShare = {
  __typename?: 'DeckGroupShare'
  createdAt: Scalars['DateTime']['output']
  createdById: Scalars['String']['output']
  deckId: Scalars['String']['output']
  groupId: Scalars['String']['output']
  id: Scalars['String']['output']
  permission: DeckGroupSharePermission
}

export enum DeckGroupSharePermission {
  View = 'VIEW',
}

export type DeckLearningStats = {
  __typename?: 'DeckLearningStats'
  deckId: Scalars['String']['output']
  dueCards: Scalars['Int']['output']
  newCards: Scalars['Int']['output']
  nextDueAt?: Maybe<Scalars['DateTime']['output']>
  reviewedCards: Scalars['Int']['output']
  totalCards: Scalars['Int']['output']
}

export enum DeckModerationStatus {
  Approved = 'APPROVED',
  Hidden = 'HIDDEN',
  None = 'NONE',
  Pending = 'PENDING',
  Rejected = 'REJECTED',
}

export enum DeckVisibility {
  Private = 'PRIVATE',
  Public = 'PUBLIC',
}

export type GenerateCardExamplesInput = {
  cardId: Scalars['String']['input']
  locale?: InputMaybe<Scalars['String']['input']>
}

export type GenerateCardExamplesPayload = {
  __typename?: 'GenerateCardExamplesPayload'
  cardId: Scalars['String']['output']
  examples: Array<GeneratedCardExample>
}

export type GeneratedCardExample = {
  __typename?: 'GeneratedCardExample'
  text: Scalars['String']['output']
}

export type Group = {
  __typename?: 'Group'
  createdAt: Scalars['DateTime']['output']
  createdById: Scalars['String']['output']
  description?: Maybe<Scalars['String']['output']>
  id: Scalars['String']['output']
  name: Scalars['String']['output']
  updatedAt: Scalars['DateTime']['output']
}

export type GroupInvitation = {
  __typename?: 'GroupInvitation'
  acceptedAt?: Maybe<Scalars['DateTime']['output']>
  createdAt: Scalars['DateTime']['output']
  declinedAt?: Maybe<Scalars['DateTime']['output']>
  email: Scalars['String']['output']
  expiresAt: Scalars['DateTime']['output']
  groupId: Scalars['String']['output']
  id: Scalars['String']['output']
  invitedById: Scalars['String']['output']
  status: GroupInvitationStatus
}

export enum GroupInvitationStatus {
  Accepted = 'ACCEPTED',
  Cancelled = 'CANCELLED',
  Declined = 'DECLINED',
  Expired = 'EXPIRED',
  Pending = 'PENDING',
}

export type GroupMember = {
  __typename?: 'GroupMember'
  createdAt: Scalars['DateTime']['output']
  groupId: Scalars['String']['output']
  id: Scalars['String']['output']
  role: GroupRole
  userId: Scalars['String']['output']
}

export enum GroupRole {
  Admin = 'ADMIN',
  Member = 'MEMBER',
  Owner = 'OWNER',
}

export type InviteUserToGroupInput = {
  email: Scalars['String']['input']
  groupId: Scalars['String']['input']
}

export type LessonCard = {
  __typename?: 'LessonCard'
  back: Scalars['String']['output']
  cardId: Scalars['String']['output']
  example?: Maybe<Scalars['String']['output']>
  front: Scalars['String']['output']
  notes?: Maybe<Scalars['String']['output']>
  position: Scalars['Int']['output']
  reviewState?: Maybe<CardReviewState>
}

export type LoginInput = {
  email: Scalars['String']['input']
  password: Scalars['String']['input']
}

export type LogoutInput = {
  refreshToken: Scalars['String']['input']
}

export type ModerationDeck = {
  __typename?: 'ModerationDeck'
  cardCount: Scalars['Float']['output']
  createdAt: Scalars['DateTime']['output']
  description?: Maybe<Scalars['String']['output']>
  id: Scalars['String']['output']
  isOfficial: Scalars['Boolean']['output']
  moderationStatus: DeckModerationStatus
  ownerEmail: Scalars['String']['output']
  ownerId: Scalars['String']['output']
  sourceDeckId?: Maybe<Scalars['String']['output']>
  title: Scalars['String']['output']
  updatedAt: Scalars['DateTime']['output']
  visibility: DeckVisibility
}

export type ModerationQueueInput = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  status?: InputMaybe<DeckModerationStatus>
}

export type ModerationQueueResult = {
  __typename?: 'ModerationQueueResult'
  items: Array<ModerationDeck>
  total: Scalars['Float']['output']
}

export type Mutation = {
  __typename?: 'Mutation'
  abandonLesson: AbandonLessonPayload
  acceptGroupInvitation: AcceptGroupInvitationPayload
  approveDeck: ModerationDeck
  blockUser: AdminUserSummary
  completeLesson: CompleteLessonPayload
  confirmCsvImport: ConfirmCsvImportPayload
  copyPublicDeck: CopyPublicDeckPayload
  createCard: Card
  createDeck: Deck
  createGroup: Group
  declineGroupInvitation: GroupInvitation
  deleteCard: Scalars['Boolean']['output']
  deleteDeck: Scalars['Boolean']['output']
  generateCardExamples: GenerateCardExamplesPayload
  hideDeck: ModerationDeck
  inviteUserToGroup: GroupInvitation
  login: AuthPayloadType
  logout: Scalars['Boolean']['output']
  previewCsvImport: CsvImport
  publishDeck: Deck
  refreshToken: AuthPayloadType
  register: AuthPayloadType
  registerPushToken: RegisterPushTokenPayloadType
  rejectDeck: ModerationDeck
  removePushToken: Scalars['Boolean']['output']
  requestPasswordReset: Scalars['Boolean']['output']
  resendVerificationEmail: Scalars['Boolean']['output']
  resetPassword: Scalars['Boolean']['output']
  saveGeneratedCardExample: SaveGeneratedCardExamplePayload
  setOfficialDeck: ModerationDeck
  shareDeckWithGroup: ShareDeckWithGroupPayload
  startLesson: StartLessonPayload
  submitReview: SubmitReviewPayload
  unblockUser: AdminUserSummary
  unpublishDeck: Deck
  updateCard: Card
  updateDeck: Deck
  updateProfile: UserProfile
  updateSettings: UserSettings
  verifyEmail: SafeUser
}

export type MutationAbandonLessonArgs = {
  input: AbandonLessonInput
}

export type MutationAcceptGroupInvitationArgs = {
  invitationId: Scalars['String']['input']
}

export type MutationApproveDeckArgs = {
  deckId: Scalars['ID']['input']
}

export type MutationBlockUserArgs = {
  userId: Scalars['ID']['input']
}

export type MutationCompleteLessonArgs = {
  input: CompleteLessonInput
}

export type MutationConfirmCsvImportArgs = {
  input: ConfirmCsvImportInput
}

export type MutationCopyPublicDeckArgs = {
  sourceDeckId: Scalars['String']['input']
}

export type MutationCreateCardArgs = {
  input: CreateCardInput
}

export type MutationCreateDeckArgs = {
  input: CreateDeckInput
}

export type MutationCreateGroupArgs = {
  input: CreateGroupInput
}

export type MutationDeclineGroupInvitationArgs = {
  invitationId: Scalars['String']['input']
}

export type MutationDeleteCardArgs = {
  cardId: Scalars['String']['input']
}

export type MutationDeleteDeckArgs = {
  deckId: Scalars['String']['input']
}

export type MutationGenerateCardExamplesArgs = {
  input: GenerateCardExamplesInput
}

export type MutationHideDeckArgs = {
  deckId: Scalars['ID']['input']
}

export type MutationInviteUserToGroupArgs = {
  input: InviteUserToGroupInput
}

export type MutationLoginArgs = {
  input: LoginInput
}

export type MutationLogoutArgs = {
  input: LogoutInput
}

export type MutationPreviewCsvImportArgs = {
  input: PreviewCsvImportInput
}

export type MutationPublishDeckArgs = {
  deckId: Scalars['String']['input']
}

export type MutationRefreshTokenArgs = {
  input: RefreshTokenInput
}

export type MutationRegisterArgs = {
  input: RegisterInput
}

export type MutationRegisterPushTokenArgs = {
  input: RegisterPushTokenInput
}

export type MutationRejectDeckArgs = {
  deckId: Scalars['ID']['input']
}

export type MutationRemovePushTokenArgs = {
  input: RemovePushTokenInput
}

export type MutationRequestPasswordResetArgs = {
  input: RequestPasswordResetInput
}

export type MutationResetPasswordArgs = {
  input: ResetPasswordInput
}

export type MutationSaveGeneratedCardExampleArgs = {
  input: SaveGeneratedCardExampleInput
}

export type MutationSetOfficialDeckArgs = {
  deckId: Scalars['ID']['input']
  isOfficial: Scalars['Boolean']['input']
}

export type MutationShareDeckWithGroupArgs = {
  input: ShareDeckWithGroupInput
}

export type MutationStartLessonArgs = {
  input: StartLessonInput
}

export type MutationSubmitReviewArgs = {
  input: SubmitReviewInput
}

export type MutationUnblockUserArgs = {
  userId: Scalars['ID']['input']
}

export type MutationUnpublishDeckArgs = {
  deckId: Scalars['String']['input']
}

export type MutationUpdateCardArgs = {
  input: UpdateCardInput
}

export type MutationUpdateDeckArgs = {
  input: UpdateDeckInput
}

export type MutationUpdateProfileArgs = {
  input: UpdateProfileInput
}

export type MutationUpdateSettingsArgs = {
  input: UpdateSettingsInput
}

export type MutationVerifyEmailArgs = {
  input: VerifyEmailInput
}

export type MyAccount = {
  __typename?: 'MyAccount'
  profile: UserProfile
  settings: UserSettings
  user: SafeUser
}

export type PreviewCsvImportInput = {
  csvText: Scalars['String']['input']
  deckId: Scalars['String']['input']
}

export type PublicDeckSearchResult = {
  __typename?: 'PublicDeckSearchResult'
  items: Array<Deck>
  total: Scalars['Int']['output']
}

export type PublicDecksInput = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  query?: InputMaybe<Scalars['String']['input']>
}

export type Query = {
  __typename?: 'Query'
  adminDashboardStats: AdminDashboardStats
  adminSearchUsers: AdminUserSearchResult
  /** GraphQL transport health check. */
  apiStatus: Scalars['String']['output']
  deck: Deck
  deckCards: Array<Card>
  deckLearningStats: DeckLearningStats
  group: Group
  groupSharedDecks: Array<Deck>
  me: SafeUser
  moderationQueue: ModerationQueueResult
  myAccount: MyAccount
  myDecks: Array<Deck>
  myGroupInvitations: Array<GroupInvitation>
  myGroups: Array<Group>
  publicDeck: Deck
  publicDeckCards: Array<Card>
  publicDecks: PublicDeckSearchResult
}

export type QueryAdminSearchUsersArgs = {
  input?: InputMaybe<AdminSearchUsersInput>
}

export type QueryDeckArgs = {
  id: Scalars['String']['input']
}

export type QueryDeckCardsArgs = {
  deckId: Scalars['String']['input']
}

export type QueryDeckLearningStatsArgs = {
  deckId: Scalars['String']['input']
}

export type QueryGroupArgs = {
  id: Scalars['String']['input']
}

export type QueryGroupSharedDecksArgs = {
  groupId: Scalars['String']['input']
}

export type QueryModerationQueueArgs = {
  input?: InputMaybe<ModerationQueueInput>
}

export type QueryPublicDeckArgs = {
  deckId: Scalars['String']['input']
}

export type QueryPublicDeckCardsArgs = {
  deckId: Scalars['String']['input']
}

export type QueryPublicDecksArgs = {
  input?: InputMaybe<PublicDecksInput>
}

export type RefreshTokenInput = {
  refreshToken: Scalars['String']['input']
}

export type RegisterInput = {
  email: Scalars['String']['input']
  password: Scalars['String']['input']
}

export type RegisterPushTokenInput = {
  deviceId?: InputMaybe<Scalars['String']['input']>
  platform?: InputMaybe<Scalars['String']['input']>
  token: Scalars['String']['input']
}

export type RegisterPushTokenPayloadType = {
  __typename?: 'RegisterPushTokenPayloadType'
  success: Scalars['Boolean']['output']
}

export type RemovePushTokenInput = {
  token: Scalars['String']['input']
}

export type RequestPasswordResetInput = {
  email: Scalars['String']['input']
}

export type ResetPasswordInput = {
  newPassword: Scalars['String']['input']
  token: Scalars['String']['input']
}

export enum ReviewAnswer {
  DontKnow = 'DONT_KNOW',
  Know = 'KNOW',
}

export type SafeUser = {
  __typename?: 'SafeUser'
  blockedAt?: Maybe<Scalars['DateTime']['output']>
  createdAt: Scalars['DateTime']['output']
  email: Scalars['String']['output']
  emailVerifiedAt?: Maybe<Scalars['DateTime']['output']>
  id: Scalars['String']['output']
  role: UserRole
  updatedAt: Scalars['DateTime']['output']
}

export type SaveGeneratedCardExampleInput = {
  cardId: Scalars['String']['input']
  exampleText: Scalars['String']['input']
}

export type SaveGeneratedCardExamplePayload = {
  __typename?: 'SaveGeneratedCardExamplePayload'
  card: Card
}

export type ShareDeckWithGroupInput = {
  deckId: Scalars['String']['input']
  groupId: Scalars['String']['input']
}

export type ShareDeckWithGroupPayload = {
  __typename?: 'ShareDeckWithGroupPayload'
  share: DeckGroupShare
}

export type StartLessonInput = {
  deckId: Scalars['String']['input']
  lessonSize?: InputMaybe<Scalars['Int']['input']>
}

export type StartLessonPayload = {
  __typename?: 'StartLessonPayload'
  cards: Array<LessonCard>
  deckId: Scalars['String']['output']
  lessonSize: Scalars['Int']['output']
  sessionId?: Maybe<Scalars['String']['output']>
  totalCards: Scalars['Int']['output']
}

export type SubmitReviewInput = {
  answer: ReviewAnswer
  cardId: Scalars['String']['input']
  sessionId: Scalars['String']['input']
}

export type SubmitReviewPayload = {
  __typename?: 'SubmitReviewPayload'
  cardId: Scalars['String']['output']
  reviewState: CardReviewState
  reviewedCards: Scalars['Int']['output']
  sessionId: Scalars['String']['output']
}

export enum ThemePreference {
  Dark = 'DARK',
  Light = 'LIGHT',
  System = 'SYSTEM',
}

export type UpdateCardInput = {
  back?: InputMaybe<Scalars['String']['input']>
  cardId: Scalars['String']['input']
  example?: InputMaybe<Scalars['String']['input']>
  front?: InputMaybe<Scalars['String']['input']>
  notes?: InputMaybe<Scalars['String']['input']>
  position?: InputMaybe<Scalars['Int']['input']>
}

export type UpdateDeckInput = {
  deckId: Scalars['String']['input']
  description?: InputMaybe<Scalars['String']['input']>
  title?: InputMaybe<Scalars['String']['input']>
}

export type UpdateProfileInput = {
  avatarUrl?: InputMaybe<Scalars['String']['input']>
  displayName?: InputMaybe<Scalars['String']['input']>
}

export type UpdateSettingsInput = {
  audioAutoplayEnabled?: InputMaybe<Scalars['Boolean']['input']>
  interfaceLocale?: InputMaybe<Scalars['String']['input']>
  lessonSize?: InputMaybe<Scalars['Int']['input']>
  notificationsEnabled?: InputMaybe<Scalars['Boolean']['input']>
  reminderTime?: InputMaybe<Scalars['String']['input']>
  themePreference?: InputMaybe<ThemePreference>
  timezone?: InputMaybe<Scalars['String']['input']>
}

export type UserProfile = {
  __typename?: 'UserProfile'
  avatarUrl?: Maybe<Scalars['String']['output']>
  createdAt: Scalars['DateTime']['output']
  displayName?: Maybe<Scalars['String']['output']>
  id: Scalars['String']['output']
  updatedAt: Scalars['DateTime']['output']
  userId: Scalars['String']['output']
}

export enum UserRole {
  Admin = 'ADMIN',
  Moderator = 'MODERATOR',
  User = 'USER',
}

export type UserSettings = {
  __typename?: 'UserSettings'
  audioAutoplayEnabled: Scalars['Boolean']['output']
  createdAt: Scalars['DateTime']['output']
  id: Scalars['String']['output']
  interfaceLocale: Scalars['String']['output']
  lessonSize: Scalars['Float']['output']
  notificationsEnabled: Scalars['Boolean']['output']
  reminderTime: Scalars['String']['output']
  themePreference: ThemePreference
  timezone: Scalars['String']['output']
  updatedAt: Scalars['DateTime']['output']
  userId: Scalars['String']['output']
}

export type VerifyEmailInput = {
  token: Scalars['String']['input']
}

export type RegisterMutationVariables = Exact<{
  input: RegisterInput
}>

export type RegisterMutation = {
  __typename?: 'Mutation'
  register: {
    __typename?: 'AuthPayloadType'
    accessToken: string
    refreshToken: string
    user: {
      __typename?: 'SafeUser'
      id: string
      email: string
      role: UserRole
      emailVerifiedAt?: any | null
      blockedAt?: any | null
      createdAt: any
      updatedAt: any
    }
  }
}

export type LoginMutationVariables = Exact<{
  input: LoginInput
}>

export type LoginMutation = {
  __typename?: 'Mutation'
  login: {
    __typename?: 'AuthPayloadType'
    accessToken: string
    refreshToken: string
    user: {
      __typename?: 'SafeUser'
      id: string
      email: string
      role: UserRole
      emailVerifiedAt?: any | null
      blockedAt?: any | null
      createdAt: any
      updatedAt: any
    }
  }
}

export type RefreshTokenMutationVariables = Exact<{
  input: RefreshTokenInput
}>

export type RefreshTokenMutation = {
  __typename?: 'Mutation'
  refreshToken: {
    __typename?: 'AuthPayloadType'
    accessToken: string
    refreshToken: string
    user: {
      __typename?: 'SafeUser'
      id: string
      email: string
      role: UserRole
      emailVerifiedAt?: any | null
      blockedAt?: any | null
      createdAt: any
      updatedAt: any
    }
  }
}

export type LogoutMutationVariables = Exact<{
  input: LogoutInput
}>

export type LogoutMutation = { __typename?: 'Mutation'; logout: boolean }

export type MeQueryVariables = Exact<{ [key: string]: never }>

export type MeQuery = {
  __typename?: 'Query'
  me: {
    __typename?: 'SafeUser'
    id: string
    email: string
    role: UserRole
    emailVerifiedAt?: any | null
    blockedAt?: any | null
    createdAt: any
    updatedAt: any
  }
}

export type VerifyEmailMutationVariables = Exact<{
  input: VerifyEmailInput
}>

export type VerifyEmailMutation = {
  __typename?: 'Mutation'
  verifyEmail: {
    __typename?: 'SafeUser'
    id: string
    email: string
    role: UserRole
    emailVerifiedAt?: any | null
    blockedAt?: any | null
    createdAt: any
    updatedAt: any
  }
}

export type ResendVerificationEmailMutationVariables = Exact<{ [key: string]: never }>

export type ResendVerificationEmailMutation = {
  __typename?: 'Mutation'
  resendVerificationEmail: boolean
}

export type RequestPasswordResetMutationVariables = Exact<{
  input: RequestPasswordResetInput
}>

export type RequestPasswordResetMutation = {
  __typename?: 'Mutation'
  requestPasswordReset: boolean
}

export type ResetPasswordMutationVariables = Exact<{
  input: ResetPasswordInput
}>

export type ResetPasswordMutation = { __typename?: 'Mutation'; resetPassword: boolean }

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
  baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options)
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
  baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options)
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
  baseOptions?: Apollo.MutationHookOptions<RefreshTokenMutation, RefreshTokenMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<RefreshTokenMutation, RefreshTokenMutationVariables>(
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
  baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options)
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
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options)
}
export function useMeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options)
}
// @ts-ignore
export function useMeSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>,
): Apollo.UseSuspenseQueryResult<MeQuery, MeQueryVariables>
export function useMeSuspenseQuery(
  baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>,
): Apollo.UseSuspenseQueryResult<MeQuery | undefined, MeQueryVariables>
export function useMeSuspenseQuery(
  baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<MeQuery, MeQueryVariables>(MeDocument, options)
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
  baseOptions?: Apollo.MutationHookOptions<VerifyEmailMutation, VerifyEmailMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<VerifyEmailMutation, VerifyEmailMutationVariables>(
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
  baseOptions?: Apollo.MutationHookOptions<
    ResendVerificationEmailMutation,
    ResendVerificationEmailMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
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
  baseOptions?: Apollo.MutationHookOptions<
    RequestPasswordResetMutation,
    RequestPasswordResetMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<RequestPasswordResetMutation, RequestPasswordResetMutationVariables>(
    RequestPasswordResetDocument,
    options,
  )
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
  baseOptions?: Apollo.MutationHookOptions<ResetPasswordMutation, ResetPasswordMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(
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
