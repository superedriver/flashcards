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
  refreshToken?: Maybe<Scalars['String']['output']>
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

export type CompleteStudyLanguageOnboardingInput = {
  nativeLanguage: Scalars['String']['input']
  targetLanguage: Scalars['String']['input']
}

export type CompleteStudyLanguageOnboardingPayload = {
  __typename?: 'CompleteStudyLanguageOnboardingPayload'
  needsStudyLanguageOnboarding: Scalars['Boolean']['output']
  studyLanguages: Array<UserStudyLanguage>
}

export type ConfirmCsvImportInput = {
  importId: Scalars['String']['input']
}

export type ConfirmCsvImportPayload = {
  __typename?: 'ConfirmCsvImportPayload'
  createdCardsCount: Scalars['Int']['output']
  import: CsvImport
}

export type ConfirmDeckPreviewPayload = {
  __typename?: 'ConfirmDeckPreviewPayload'
  cards: Array<Card>
  deck: Deck
}

export type CopyGroupDeckPayload = {
  __typename?: 'CopyGroupDeckPayload'
  cards: Array<Card>
  deck: Deck
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
  sourceLanguage?: InputMaybe<Scalars['String']['input']>
  targetLanguage: Scalars['String']['input']
  title: Scalars['String']['input']
}

export type CreateDeckPayload = {
  __typename?: 'CreateDeckPayload'
  deck: Deck
  warnings: Array<DeckLanguageWarning>
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
  sourceLanguage?: Maybe<Scalars['String']['output']>
  targetLanguage?: Maybe<Scalars['String']['output']>
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

export type DeckLanguageWarning = {
  __typename?: 'DeckLanguageWarning'
  code: DeckLanguageWarningCode
  message: Scalars['String']['output']
}

export enum DeckLanguageWarningCode {
  SourceTargetSame = 'SOURCE_TARGET_SAME',
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

export enum DeckOrigin {
  Group = 'GROUP',
  Own = 'OWN',
  Public = 'PUBLIC',
}

export type DeckPreviewSession = {
  __typename?: 'DeckPreviewSession'
  cards: Array<DeckPreviewSessionCard>
  chosenSourceLanguage: Scalars['String']['output']
  createdAt: Scalars['DateTime']['output']
  expiresAt: Scalars['DateTime']['output']
  id: Scalars['String']['output']
  sourceDeckId?: Maybe<Scalars['String']['output']>
  status: DeckPreviewSessionStatus
  targetLanguage: Scalars['String']['output']
  type: DeckPreviewSessionType
  updatedAt: Scalars['DateTime']['output']
}

export type DeckPreviewSessionCard = {
  __typename?: 'DeckPreviewSessionCard'
  back: Scalars['String']['output']
  backError?: Maybe<Scalars['String']['output']>
  example?: Maybe<Scalars['String']['output']>
  exampleError?: Maybe<Scalars['String']['output']>
  front: Scalars['String']['output']
  sourceCardId?: Maybe<Scalars['String']['output']>
}

export enum DeckPreviewSessionStatus {
  Expired = 'EXPIRED',
  Generating = 'GENERATING',
  Ready = 'READY',
}

export enum DeckPreviewSessionType {
  CopyGroup = 'COPY_GROUP',
  CopyPublic = 'COPY_PUBLIC',
  RegenerateDeck = 'REGENERATE_DECK',
}

export enum DeckVisibility {
  Private = 'PRIVATE',
  Public = 'PUBLIC',
}

export type DecksPageDeck = {
  __typename?: 'DecksPageDeck'
  createdAt: Scalars['DateTime']['output']
  description?: Maybe<Scalars['String']['output']>
  id: Scalars['String']['output']
  isOfficial: Scalars['Boolean']['output']
  moderationStatus: DeckModerationStatus
  origin: DeckOrigin
  ownerId: Scalars['String']['output']
  sourceDeckId?: Maybe<Scalars['String']['output']>
  sourceLanguage?: Maybe<Scalars['String']['output']>
  targetLanguage?: Maybe<Scalars['String']['output']>
  title: Scalars['String']['output']
  updatedAt: Scalars['DateTime']['output']
  visibility: DeckVisibility
}

export type DecksPageInput = {
  activeTargetLanguage: Scalars['String']['input']
}

export type DecksPageResult = {
  __typename?: 'DecksPageResult'
  groupDecks: Array<DecksPageDeck>
  noLanguageDecks: Array<DecksPageDeck>
  ownDecks: Array<DecksPageDeck>
  publicDecks: Array<DecksPageDeck>
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

export type Language = {
  __typename?: 'Language'
  code: Scalars['String']['output']
  englishName: Scalars['String']['output']
  flag: Scalars['String']['output']
  nativeName: Scalars['String']['output']
  popularSortOrder?: Maybe<Scalars['Int']['output']>
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
  refreshToken?: InputMaybe<Scalars['String']['input']>
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
  addStudyLanguage: UserStudyLanguage
  approveDeck: ModerationDeck
  blockUser: AdminUserSummary
  cancelDeckPreview: Scalars['Boolean']['output']
  completeLesson: CompleteLessonPayload
  completeStudyLanguageOnboarding: CompleteStudyLanguageOnboardingPayload
  confirmCsvImport: ConfirmCsvImportPayload
  confirmDeckPreview: ConfirmDeckPreviewPayload
  copyGroupDeck: CopyGroupDeckPayload
  copyPublicDeck: CopyPublicDeckPayload
  createCard: Card
  createDeck: CreateDeckPayload
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
  removeStudyLanguage: Array<UserStudyLanguage>
  requestPasswordReset: Scalars['Boolean']['output']
  resendVerificationEmail: Scalars['Boolean']['output']
  resetPassword: Scalars['Boolean']['output']
  saveGeneratedCardExample: SaveGeneratedCardExamplePayload
  setActiveTargetLanguage: Array<UserStudyLanguage>
  setOfficialDeck: ModerationDeck
  shareDeckWithGroup: ShareDeckWithGroupPayload
  startDeckRegeneratePreview: DeckPreviewSession
  startGroupDeckCopyPreview: DeckPreviewSession
  startLesson: StartLessonPayload
  startPublicDeckCopyPreview: DeckPreviewSession
  submitReview: SubmitReviewPayload
  unblockUser: AdminUserSummary
  unpublishDeck: Deck
  updateCard: Card
  updateDeck: UpdateDeckPayload
  updateDeckPreviewCard: DeckPreviewSession
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

export type MutationAddStudyLanguageArgs = {
  languageCode: Scalars['String']['input']
}

export type MutationApproveDeckArgs = {
  deckId: Scalars['ID']['input']
}

export type MutationBlockUserArgs = {
  userId: Scalars['ID']['input']
}

export type MutationCancelDeckPreviewArgs = {
  sessionId: Scalars['String']['input']
}

export type MutationCompleteLessonArgs = {
  input: CompleteLessonInput
}

export type MutationCompleteStudyLanguageOnboardingArgs = {
  input: CompleteStudyLanguageOnboardingInput
}

export type MutationConfirmCsvImportArgs = {
  input: ConfirmCsvImportInput
}

export type MutationConfirmDeckPreviewArgs = {
  sessionId: Scalars['String']['input']
}

export type MutationCopyGroupDeckArgs = {
  sourceDeckId: Scalars['String']['input']
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

export type MutationRemoveStudyLanguageArgs = {
  languageCode: Scalars['String']['input']
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

export type MutationSetActiveTargetLanguageArgs = {
  languageCode: Scalars['String']['input']
}

export type MutationSetOfficialDeckArgs = {
  deckId: Scalars['ID']['input']
  isOfficial: Scalars['Boolean']['input']
}

export type MutationShareDeckWithGroupArgs = {
  input: ShareDeckWithGroupInput
}

export type MutationStartDeckRegeneratePreviewArgs = {
  input: StartDeckRegeneratePreviewInput
}

export type MutationStartGroupDeckCopyPreviewArgs = {
  input: StartGroupDeckCopyPreviewInput
}

export type MutationStartLessonArgs = {
  input: StartLessonInput
}

export type MutationStartPublicDeckCopyPreviewArgs = {
  input: StartPublicDeckCopyPreviewInput
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

export type MutationUpdateDeckPreviewCardArgs = {
  input: UpdateDeckPreviewCardInput
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
  needsStudyLanguageOnboarding: Scalars['Boolean']['output']
  profile: UserProfile
  settings: UserSettings
  studyLanguages: Array<UserStudyLanguage>
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
  targetLanguage?: InputMaybe<Scalars['String']['input']>
}

export type Query = {
  __typename?: 'Query'
  activeDeckPreview?: Maybe<DeckPreviewSession>
  adminDashboardStats: AdminDashboardStats
  adminSearchUsers: AdminUserSearchResult
  /** GraphQL transport health check. */
  apiStatus: Scalars['String']['output']
  deck: Deck
  deckCards: Array<Card>
  deckLearningStats: DeckLearningStats
  decksPage: DecksPageResult
  group: Group
  groupSharedDecks: Array<Deck>
  languages: Array<Language>
  me: SafeUser
  moderationQueue: ModerationQueueResult
  myAccount: MyAccount
  myDecks: Array<Deck>
  myGroupInvitations: Array<GroupInvitation>
  myGroups: Array<Group>
  myStudyLanguages: Array<UserStudyLanguage>
  publicDeck: Deck
  publicDeckCards: Array<Card>
  publicDecks: PublicDeckSearchResult
  studyLanguageRemovalImpact: StudyLanguageRemovalImpact
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

export type QueryDecksPageArgs = {
  input: DecksPageInput
}

export type QueryGroupArgs = {
  id: Scalars['String']['input']
}

export type QueryGroupSharedDecksArgs = {
  groupId: Scalars['String']['input']
}

export type QueryLanguagesArgs = {
  search?: InputMaybe<Scalars['String']['input']>
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

export type QueryStudyLanguageRemovalImpactArgs = {
  languageCode: Scalars['String']['input']
}

export type RefreshTokenInput = {
  refreshToken?: InputMaybe<Scalars['String']['input']>
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

export type StartDeckRegeneratePreviewInput = {
  chosenSourceLanguage: Scalars['String']['input']
  discardActive?: InputMaybe<Scalars['Boolean']['input']>
  sourceDeckId: Scalars['String']['input']
}

export type StartGroupDeckCopyPreviewInput = {
  chosenSourceLanguage: Scalars['String']['input']
  discardActive?: InputMaybe<Scalars['Boolean']['input']>
  sourceDeckId: Scalars['String']['input']
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

export type StartPublicDeckCopyPreviewInput = {
  chosenSourceLanguage: Scalars['String']['input']
  discardActive?: InputMaybe<Scalars['Boolean']['input']>
  sourceDeckId: Scalars['String']['input']
}

export type StudyLanguageRemovalImpact = {
  __typename?: 'StudyLanguageRemovalImpact'
  affectedDeckCount: Scalars['Int']['output']
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
  sourceLanguage?: InputMaybe<Scalars['String']['input']>
  targetLanguage?: InputMaybe<Scalars['String']['input']>
  title?: InputMaybe<Scalars['String']['input']>
}

export type UpdateDeckPayload = {
  __typename?: 'UpdateDeckPayload'
  deck: Deck
  warnings: Array<DeckLanguageWarning>
}

export type UpdateDeckPreviewCardInput = {
  back?: InputMaybe<Scalars['String']['input']>
  cardIndex: Scalars['Int']['input']
  example?: InputMaybe<Scalars['String']['input']>
  sessionId: Scalars['String']['input']
}

export type UpdateProfileInput = {
  avatarUrl?: InputMaybe<Scalars['String']['input']>
  displayName?: InputMaybe<Scalars['String']['input']>
}

export type UpdateSettingsInput = {
  audioAutoplayEnabled?: InputMaybe<Scalars['Boolean']['input']>
  interfaceLocale?: InputMaybe<Scalars['String']['input']>
  lessonSize?: InputMaybe<Scalars['Int']['input']>
  nativeLanguage?: InputMaybe<Scalars['String']['input']>
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
  activeTargetLanguage?: Maybe<Scalars['String']['output']>
  audioAutoplayEnabled: Scalars['Boolean']['output']
  createdAt: Scalars['DateTime']['output']
  id: Scalars['String']['output']
  interfaceLocale: Scalars['String']['output']
  lessonSize: Scalars['Float']['output']
  nativeLanguage: Scalars['String']['output']
  notificationsEnabled: Scalars['Boolean']['output']
  reminderTime: Scalars['String']['output']
  themePreference: ThemePreference
  timezone: Scalars['String']['output']
  updatedAt: Scalars['DateTime']['output']
  userId: Scalars['String']['output']
}

export type UserStudyLanguage = {
  __typename?: 'UserStudyLanguage'
  createdAt: Scalars['DateTime']['output']
  isActive: Scalars['Boolean']['output']
  language: Language
  languageCode: Scalars['String']['output']
}

export type VerifyEmailInput = {
  token: Scalars['String']['input']
}

export type AdminDashboardStatsQueryVariables = Exact<{ [key: string]: never }>

export type AdminDashboardStatsQuery = {
  __typename?: 'Query'
  adminDashboardStats: {
    __typename?: 'AdminDashboardStats'
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
  input?: InputMaybe<AdminSearchUsersInput>
}>

export type AdminSearchUsersQuery = {
  __typename?: 'Query'
  adminSearchUsers: {
    __typename?: 'AdminUserSearchResult'
    total: number
    items: Array<{
      __typename?: 'AdminUserSummary'
      id: string
      email: string
      role: UserRole
      emailVerifiedAt?: any | null
      blockedAt?: any | null
      createdAt: any
      updatedAt: any
    }>
  }
}

export type BlockUserMutationVariables = Exact<{
  userId: Scalars['ID']['input']
}>

export type BlockUserMutation = {
  __typename?: 'Mutation'
  blockUser: {
    __typename?: 'AdminUserSummary'
    id: string
    email: string
    role: UserRole
    emailVerifiedAt?: any | null
    blockedAt?: any | null
    createdAt: any
    updatedAt: any
  }
}

export type UnblockUserMutationVariables = Exact<{
  userId: Scalars['ID']['input']
}>

export type UnblockUserMutation = {
  __typename?: 'Mutation'
  unblockUser: {
    __typename?: 'AdminUserSummary'
    id: string
    email: string
    role: UserRole
    emailVerifiedAt?: any | null
    blockedAt?: any | null
    createdAt: any
    updatedAt: any
  }
}

export type ModerationQueueQueryVariables = Exact<{
  input?: InputMaybe<ModerationQueueInput>
}>

export type ModerationQueueQuery = {
  __typename?: 'Query'
  moderationQueue: {
    __typename?: 'ModerationQueueResult'
    total: number
    items: Array<{
      __typename?: 'ModerationDeck'
      id: string
      ownerId: string
      ownerEmail: string
      title: string
      description?: string | null
      visibility: DeckVisibility
      moderationStatus: DeckModerationStatus
      isOfficial: boolean
      sourceDeckId?: string | null
      cardCount: number
      createdAt: any
      updatedAt: any
    }>
  }
}

export type ApproveDeckMutationVariables = Exact<{
  deckId: Scalars['ID']['input']
}>

export type ApproveDeckMutation = {
  __typename?: 'Mutation'
  approveDeck: {
    __typename?: 'ModerationDeck'
    id: string
    ownerId: string
    ownerEmail: string
    title: string
    description?: string | null
    visibility: DeckVisibility
    moderationStatus: DeckModerationStatus
    isOfficial: boolean
    sourceDeckId?: string | null
    cardCount: number
    createdAt: any
    updatedAt: any
  }
}

export type RejectDeckMutationVariables = Exact<{
  deckId: Scalars['ID']['input']
}>

export type RejectDeckMutation = {
  __typename?: 'Mutation'
  rejectDeck: {
    __typename?: 'ModerationDeck'
    id: string
    ownerId: string
    ownerEmail: string
    title: string
    description?: string | null
    visibility: DeckVisibility
    moderationStatus: DeckModerationStatus
    isOfficial: boolean
    sourceDeckId?: string | null
    cardCount: number
    createdAt: any
    updatedAt: any
  }
}

export type HideDeckMutationVariables = Exact<{
  deckId: Scalars['ID']['input']
}>

export type HideDeckMutation = {
  __typename?: 'Mutation'
  hideDeck: {
    __typename?: 'ModerationDeck'
    id: string
    ownerId: string
    ownerEmail: string
    title: string
    description?: string | null
    visibility: DeckVisibility
    moderationStatus: DeckModerationStatus
    isOfficial: boolean
    sourceDeckId?: string | null
    cardCount: number
    createdAt: any
    updatedAt: any
  }
}

export type SetOfficialDeckMutationVariables = Exact<{
  deckId: Scalars['ID']['input']
  isOfficial: Scalars['Boolean']['input']
}>

export type SetOfficialDeckMutation = {
  __typename?: 'Mutation'
  setOfficialDeck: {
    __typename?: 'ModerationDeck'
    id: string
    ownerId: string
    ownerEmail: string
    title: string
    description?: string | null
    visibility: DeckVisibility
    moderationStatus: DeckModerationStatus
    isOfficial: boolean
    sourceDeckId?: string | null
    cardCount: number
    createdAt: any
    updatedAt: any
  }
}

export type GenerateCardExamplesMutationVariables = Exact<{
  input: GenerateCardExamplesInput
}>

export type GenerateCardExamplesMutation = {
  __typename?: 'Mutation'
  generateCardExamples: {
    __typename?: 'GenerateCardExamplesPayload'
    cardId: string
    examples: Array<{ __typename?: 'GeneratedCardExample'; text: string }>
  }
}

export type SaveGeneratedCardExampleMutationVariables = Exact<{
  input: SaveGeneratedCardExampleInput
}>

export type SaveGeneratedCardExampleMutation = {
  __typename?: 'Mutation'
  saveGeneratedCardExample: {
    __typename?: 'SaveGeneratedCardExamplePayload'
    card: {
      __typename?: 'Card'
      id: string
      deckId: string
      front: string
      back: string
      example?: string | null
      notes?: string | null
      position: number
      createdAt: any
      updatedAt: any
    }
  }
}

export type RegisterMutationVariables = Exact<{
  input: RegisterInput
}>

export type RegisterMutation = {
  __typename?: 'Mutation'
  register: {
    __typename?: 'AuthPayloadType'
    accessToken: string
    refreshToken?: string | null
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
    refreshToken?: string | null
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
    refreshToken?: string | null
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

export type PreviewCsvImportMutationVariables = Exact<{
  input: PreviewCsvImportInput
}>

export type PreviewCsvImportMutation = {
  __typename?: 'Mutation'
  previewCsvImport: {
    __typename?: 'CsvImport'
    id: string
    deckId: string
    status: CsvImportStatus
    totalRows: number
    validRows: number
    invalidRows: number
    createdAt: any
    confirmedAt?: any | null
    expiresAt: any
    previewRows: Array<{
      __typename?: 'CsvImportPreviewRow'
      rowNumber: number
      front: string
      back: string
      example?: string | null
      notes?: string | null
      isValid: boolean
      errors: Array<{
        __typename?: 'CsvImportRowError'
        rowNumber: number
        field: string
        message: string
      }>
    }>
    errors: Array<{
      __typename?: 'CsvImportRowError'
      rowNumber: number
      field: string
      message: string
    }>
  }
}

export type ConfirmCsvImportMutationVariables = Exact<{
  input: ConfirmCsvImportInput
}>

export type ConfirmCsvImportMutation = {
  __typename?: 'Mutation'
  confirmCsvImport: {
    __typename?: 'ConfirmCsvImportPayload'
    createdCardsCount: number
    import: {
      __typename?: 'CsvImport'
      id: string
      deckId: string
      status: CsvImportStatus
      totalRows: number
      validRows: number
      invalidRows: number
      createdAt: any
      confirmedAt?: any | null
      expiresAt: any
    }
  }
}

export type MyDecksQueryVariables = Exact<{ [key: string]: never }>

export type MyDecksQuery = {
  __typename?: 'Query'
  myDecks: Array<{
    __typename?: 'Deck'
    id: string
    ownerId: string
    title: string
    description?: string | null
    visibility: DeckVisibility
    moderationStatus: DeckModerationStatus
    isOfficial: boolean
    sourceDeckId?: string | null
    targetLanguage?: string | null
    sourceLanguage?: string | null
    createdAt: any
    updatedAt: any
  }>
}

export type DecksPageQueryVariables = Exact<{
  input: DecksPageInput
}>

export type DecksPageQuery = {
  __typename?: 'Query'
  decksPage: {
    __typename?: 'DecksPageResult'
    ownDecks: Array<{
      __typename?: 'DecksPageDeck'
      id: string
      ownerId: string
      title: string
      description?: string | null
      visibility: DeckVisibility
      moderationStatus: DeckModerationStatus
      isOfficial: boolean
      sourceDeckId?: string | null
      targetLanguage?: string | null
      sourceLanguage?: string | null
      origin: DeckOrigin
      createdAt: any
      updatedAt: any
    }>
    groupDecks: Array<{
      __typename?: 'DecksPageDeck'
      id: string
      ownerId: string
      title: string
      description?: string | null
      visibility: DeckVisibility
      moderationStatus: DeckModerationStatus
      isOfficial: boolean
      sourceDeckId?: string | null
      targetLanguage?: string | null
      sourceLanguage?: string | null
      origin: DeckOrigin
      createdAt: any
      updatedAt: any
    }>
    publicDecks: Array<{
      __typename?: 'DecksPageDeck'
      id: string
      ownerId: string
      title: string
      description?: string | null
      visibility: DeckVisibility
      moderationStatus: DeckModerationStatus
      isOfficial: boolean
      sourceDeckId?: string | null
      targetLanguage?: string | null
      sourceLanguage?: string | null
      origin: DeckOrigin
      createdAt: any
      updatedAt: any
    }>
    noLanguageDecks: Array<{
      __typename?: 'DecksPageDeck'
      id: string
      ownerId: string
      title: string
      description?: string | null
      visibility: DeckVisibility
      moderationStatus: DeckModerationStatus
      isOfficial: boolean
      sourceDeckId?: string | null
      targetLanguage?: string | null
      sourceLanguage?: string | null
      origin: DeckOrigin
      createdAt: any
      updatedAt: any
    }>
  }
}

export type DeckQueryVariables = Exact<{
  id: Scalars['String']['input']
}>

export type DeckQuery = {
  __typename?: 'Query'
  deck: {
    __typename?: 'Deck'
    id: string
    ownerId: string
    title: string
    description?: string | null
    visibility: DeckVisibility
    moderationStatus: DeckModerationStatus
    isOfficial: boolean
    sourceDeckId?: string | null
    targetLanguage?: string | null
    sourceLanguage?: string | null
    createdAt: any
    updatedAt: any
  }
}

export type DeckCardsQueryVariables = Exact<{
  deckId: Scalars['String']['input']
}>

export type DeckCardsQuery = {
  __typename?: 'Query'
  deckCards: Array<{
    __typename?: 'Card'
    id: string
    deckId: string
    front: string
    back: string
    example?: string | null
    notes?: string | null
    position: number
    createdAt: any
    updatedAt: any
  }>
}

export type CreateDeckMutationVariables = Exact<{
  input: CreateDeckInput
}>

export type CreateDeckMutation = {
  __typename?: 'Mutation'
  createDeck: {
    __typename?: 'CreateDeckPayload'
    deck: {
      __typename?: 'Deck'
      id: string
      ownerId: string
      title: string
      description?: string | null
      visibility: DeckVisibility
      moderationStatus: DeckModerationStatus
      isOfficial: boolean
      sourceDeckId?: string | null
      targetLanguage?: string | null
      sourceLanguage?: string | null
      createdAt: any
      updatedAt: any
    }
    warnings: Array<{
      __typename?: 'DeckLanguageWarning'
      code: DeckLanguageWarningCode
      message: string
    }>
  }
}

export type UpdateDeckMutationVariables = Exact<{
  input: UpdateDeckInput
}>

export type UpdateDeckMutation = {
  __typename?: 'Mutation'
  updateDeck: {
    __typename?: 'UpdateDeckPayload'
    deck: {
      __typename?: 'Deck'
      id: string
      ownerId: string
      title: string
      description?: string | null
      visibility: DeckVisibility
      moderationStatus: DeckModerationStatus
      isOfficial: boolean
      sourceDeckId?: string | null
      targetLanguage?: string | null
      sourceLanguage?: string | null
      createdAt: any
      updatedAt: any
    }
    warnings: Array<{
      __typename?: 'DeckLanguageWarning'
      code: DeckLanguageWarningCode
      message: string
    }>
  }
}

export type DeleteDeckMutationVariables = Exact<{
  deckId: Scalars['String']['input']
}>

export type DeleteDeckMutation = { __typename?: 'Mutation'; deleteDeck: boolean }

export type CreateCardMutationVariables = Exact<{
  input: CreateCardInput
}>

export type CreateCardMutation = {
  __typename?: 'Mutation'
  createCard: {
    __typename?: 'Card'
    id: string
    deckId: string
    front: string
    back: string
    example?: string | null
    notes?: string | null
    position: number
    createdAt: any
    updatedAt: any
  }
}

export type UpdateCardMutationVariables = Exact<{
  input: UpdateCardInput
}>

export type UpdateCardMutation = {
  __typename?: 'Mutation'
  updateCard: {
    __typename?: 'Card'
    id: string
    deckId: string
    front: string
    back: string
    example?: string | null
    notes?: string | null
    position: number
    createdAt: any
    updatedAt: any
  }
}

export type DeleteCardMutationVariables = Exact<{
  cardId: Scalars['String']['input']
}>

export type DeleteCardMutation = { __typename?: 'Mutation'; deleteCard: boolean }

export type PublishDeckMutationVariables = Exact<{
  deckId: Scalars['String']['input']
}>

export type PublishDeckMutation = {
  __typename?: 'Mutation'
  publishDeck: {
    __typename?: 'Deck'
    id: string
    ownerId: string
    title: string
    description?: string | null
    visibility: DeckVisibility
    moderationStatus: DeckModerationStatus
    isOfficial: boolean
    sourceDeckId?: string | null
    createdAt: any
    updatedAt: any
  }
}

export type UnpublishDeckMutationVariables = Exact<{
  deckId: Scalars['String']['input']
}>

export type UnpublishDeckMutation = {
  __typename?: 'Mutation'
  unpublishDeck: {
    __typename?: 'Deck'
    id: string
    ownerId: string
    title: string
    description?: string | null
    visibility: DeckVisibility
    moderationStatus: DeckModerationStatus
    isOfficial: boolean
    sourceDeckId?: string | null
    createdAt: any
    updatedAt: any
  }
}

export type MyGroupsQueryVariables = Exact<{ [key: string]: never }>

export type MyGroupsQuery = {
  __typename?: 'Query'
  myGroups: Array<{
    __typename?: 'Group'
    id: string
    name: string
    description?: string | null
    createdById: string
    createdAt: any
    updatedAt: any
  }>
}

export type GroupQueryVariables = Exact<{
  id: Scalars['String']['input']
}>

export type GroupQuery = {
  __typename?: 'Query'
  group: {
    __typename?: 'Group'
    id: string
    name: string
    description?: string | null
    createdById: string
    createdAt: any
    updatedAt: any
  }
}

export type CreateGroupMutationVariables = Exact<{
  input: CreateGroupInput
}>

export type CreateGroupMutation = {
  __typename?: 'Mutation'
  createGroup: {
    __typename?: 'Group'
    id: string
    name: string
    description?: string | null
    createdById: string
    createdAt: any
    updatedAt: any
  }
}

export type InviteUserToGroupMutationVariables = Exact<{
  input: InviteUserToGroupInput
}>

export type InviteUserToGroupMutation = {
  __typename?: 'Mutation'
  inviteUserToGroup: {
    __typename?: 'GroupInvitation'
    id: string
    groupId: string
    email: string
    invitedById: string
    status: GroupInvitationStatus
    expiresAt: any
    createdAt: any
    acceptedAt?: any | null
    declinedAt?: any | null
  }
}

export type MyGroupInvitationsQueryVariables = Exact<{ [key: string]: never }>

export type MyGroupInvitationsQuery = {
  __typename?: 'Query'
  myGroupInvitations: Array<{
    __typename?: 'GroupInvitation'
    id: string
    groupId: string
    email: string
    invitedById: string
    status: GroupInvitationStatus
    expiresAt: any
    createdAt: any
    acceptedAt?: any | null
    declinedAt?: any | null
  }>
}

export type AcceptGroupInvitationMutationVariables = Exact<{
  invitationId: Scalars['String']['input']
}>

export type AcceptGroupInvitationMutation = {
  __typename?: 'Mutation'
  acceptGroupInvitation: {
    __typename?: 'AcceptGroupInvitationPayload'
    invitation: {
      __typename?: 'GroupInvitation'
      id: string
      groupId: string
      email: string
      status: GroupInvitationStatus
      acceptedAt?: any | null
    }
    member: {
      __typename?: 'GroupMember'
      id: string
      groupId: string
      userId: string
      role: GroupRole
      createdAt: any
    }
  }
}

export type DeclineGroupInvitationMutationVariables = Exact<{
  invitationId: Scalars['String']['input']
}>

export type DeclineGroupInvitationMutation = {
  __typename?: 'Mutation'
  declineGroupInvitation: {
    __typename?: 'GroupInvitation'
    id: string
    groupId: string
    email: string
    status: GroupInvitationStatus
    declinedAt?: any | null
  }
}

export type ShareDeckWithGroupMutationVariables = Exact<{
  input: ShareDeckWithGroupInput
}>

export type ShareDeckWithGroupMutation = {
  __typename?: 'Mutation'
  shareDeckWithGroup: {
    __typename?: 'ShareDeckWithGroupPayload'
    share: {
      __typename?: 'DeckGroupShare'
      id: string
      deckId: string
      groupId: string
      permission: DeckGroupSharePermission
      createdById: string
      createdAt: any
    }
  }
}

export type GroupSharedDecksQueryVariables = Exact<{
  groupId: Scalars['String']['input']
}>

export type GroupSharedDecksQuery = {
  __typename?: 'Query'
  groupSharedDecks: Array<{
    __typename?: 'Deck'
    id: string
    ownerId: string
    title: string
    description?: string | null
    visibility: DeckVisibility
    moderationStatus: DeckModerationStatus
    isOfficial: boolean
    sourceDeckId?: string | null
    targetLanguage?: string | null
    sourceLanguage?: string | null
    createdAt: any
    updatedAt: any
  }>
}

export type CopyGroupDeckMutationVariables = Exact<{
  sourceDeckId: Scalars['String']['input']
}>

export type CopyGroupDeckMutation = {
  __typename?: 'Mutation'
  copyGroupDeck: {
    __typename?: 'CopyGroupDeckPayload'
    deck: {
      __typename?: 'Deck'
      id: string
      ownerId: string
      title: string
      description?: string | null
      visibility: DeckVisibility
      moderationStatus: DeckModerationStatus
      isOfficial: boolean
      sourceDeckId?: string | null
      targetLanguage?: string | null
      sourceLanguage?: string | null
      createdAt: any
      updatedAt: any
    }
    cards: Array<{
      __typename?: 'Card'
      id: string
      deckId: string
      front: string
      back: string
      example?: string | null
      notes?: string | null
      createdAt: any
      updatedAt: any
    }>
  }
}

export type StartLessonMutationVariables = Exact<{
  input: StartLessonInput
}>

export type StartLessonMutation = {
  __typename?: 'Mutation'
  startLesson: {
    __typename?: 'StartLessonPayload'
    sessionId?: string | null
    deckId: string
    lessonSize: number
    totalCards: number
    cards: Array<{
      __typename?: 'LessonCard'
      cardId: string
      front: string
      back: string
      example?: string | null
      notes?: string | null
      position: number
      reviewState?: {
        __typename?: 'CardReviewState'
        id: string
        easeFactor: number
        intervalDays: number
        repetitions: number
        dueAt: any
        lastReviewedAt?: any | null
      } | null
    }>
  }
}

export type SubmitReviewMutationVariables = Exact<{
  input: SubmitReviewInput
}>

export type SubmitReviewMutation = {
  __typename?: 'Mutation'
  submitReview: {
    __typename?: 'SubmitReviewPayload'
    sessionId: string
    cardId: string
    reviewedCards: number
    reviewState: {
      __typename?: 'CardReviewState'
      id: string
      easeFactor: number
      intervalDays: number
      repetitions: number
      dueAt: any
      lastReviewedAt?: any | null
    }
  }
}

export type CompleteLessonMutationVariables = Exact<{
  input: CompleteLessonInput
}>

export type CompleteLessonMutation = {
  __typename?: 'Mutation'
  completeLesson: {
    __typename?: 'CompleteLessonPayload'
    sessionId: string
    deckId: string
    totalCards: number
    reviewedCards: number
    knownCount: number
    dontKnowCount: number
    completedAt: any
  }
}

export type DeckLearningStatsQueryVariables = Exact<{
  deckId: Scalars['String']['input']
}>

export type DeckLearningStatsQuery = {
  __typename?: 'Query'
  deckLearningStats: {
    __typename?: 'DeckLearningStats'
    deckId: string
    totalCards: number
    newCards: number
    dueCards: number
    reviewedCards: number
    nextDueAt?: any | null
  }
}

export type RegisterPushTokenMutationVariables = Exact<{
  input: RegisterPushTokenInput
}>

export type RegisterPushTokenMutation = {
  __typename?: 'Mutation'
  registerPushToken: { __typename?: 'RegisterPushTokenPayloadType'; success: boolean }
}

export type RemovePushTokenMutationVariables = Exact<{
  input: RemovePushTokenInput
}>

export type RemovePushTokenMutation = { __typename?: 'Mutation'; removePushToken: boolean }

export type ProfileMeQueryVariables = Exact<{ [key: string]: never }>

export type ProfileMeQuery = {
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

export type PublicDecksQueryVariables = Exact<{
  input?: InputMaybe<PublicDecksInput>
}>

export type PublicDecksQuery = {
  __typename?: 'Query'
  publicDecks: {
    __typename?: 'PublicDeckSearchResult'
    total: number
    items: Array<{
      __typename?: 'Deck'
      id: string
      ownerId: string
      title: string
      description?: string | null
      visibility: DeckVisibility
      moderationStatus: DeckModerationStatus
      isOfficial: boolean
      sourceDeckId?: string | null
      createdAt: any
      updatedAt: any
    }>
  }
}

export type PublicDeckQueryVariables = Exact<{
  deckId: Scalars['String']['input']
}>

export type PublicDeckQuery = {
  __typename?: 'Query'
  publicDeck: {
    __typename?: 'Deck'
    id: string
    ownerId: string
    title: string
    description?: string | null
    visibility: DeckVisibility
    moderationStatus: DeckModerationStatus
    isOfficial: boolean
    sourceDeckId?: string | null
    targetLanguage?: string | null
    sourceLanguage?: string | null
    createdAt: any
    updatedAt: any
  }
}

export type PublicDeckCardsQueryVariables = Exact<{
  deckId: Scalars['String']['input']
}>

export type PublicDeckCardsQuery = {
  __typename?: 'Query'
  publicDeckCards: Array<{
    __typename?: 'Card'
    id: string
    deckId: string
    front: string
    back: string
    example?: string | null
    notes?: string | null
    position: number
    createdAt: any
    updatedAt: any
  }>
}

export type CopyPublicDeckMutationVariables = Exact<{
  sourceDeckId: Scalars['String']['input']
}>

export type CopyPublicDeckMutation = {
  __typename?: 'Mutation'
  copyPublicDeck: {
    __typename?: 'CopyPublicDeckPayload'
    deck: {
      __typename?: 'Deck'
      id: string
      ownerId: string
      title: string
      description?: string | null
      visibility: DeckVisibility
      moderationStatus: DeckModerationStatus
      isOfficial: boolean
      sourceDeckId?: string | null
      createdAt: any
      updatedAt: any
    }
    cards: Array<{
      __typename?: 'Card'
      id: string
      deckId: string
      front: string
      back: string
      example?: string | null
      notes?: string | null
      position: number
      createdAt: any
      updatedAt: any
    }>
  }
}

export type MySettingsQueryVariables = Exact<{ [key: string]: never }>

export type MySettingsQuery = {
  __typename?: 'Query'
  myAccount: {
    __typename?: 'MyAccount'
    settings: {
      __typename?: 'UserSettings'
      userId: string
      interfaceLocale: string
      lessonSize: number
      notificationsEnabled: boolean
      reminderTime: string
      timezone: string
      nativeLanguage: string
      createdAt: any
      updatedAt: any
    }
  }
}

export type UpdateMySettingsMutationVariables = Exact<{
  input: UpdateSettingsInput
}>

export type UpdateMySettingsMutation = {
  __typename?: 'Mutation'
  updateSettings: {
    __typename?: 'UserSettings'
    userId: string
    interfaceLocale: string
    lessonSize: number
    notificationsEnabled: boolean
    reminderTime: string
    timezone: string
    nativeLanguage: string
    createdAt: any
    updatedAt: any
  }
}

export type LanguagesQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>
}>

export type LanguagesQuery = {
  __typename?: 'Query'
  languages: Array<{
    __typename?: 'Language'
    code: string
    englishName: string
    nativeName: string
    flag: string
    popularSortOrder?: number | null
  }>
}

export type MyStudyLanguagesQueryVariables = Exact<{ [key: string]: never }>

export type MyStudyLanguagesQuery = {
  __typename?: 'Query'
  myStudyLanguages: Array<{
    __typename?: 'UserStudyLanguage'
    languageCode: string
    isActive: boolean
    createdAt: any
    language: {
      __typename?: 'Language'
      code: string
      englishName: string
      nativeName: string
      flag: string
      popularSortOrder?: number | null
    }
  }>
}

export type StudyLanguageBootstrapQueryVariables = Exact<{ [key: string]: never }>

export type StudyLanguageBootstrapQuery = {
  __typename?: 'Query'
  myAccount: {
    __typename?: 'MyAccount'
    needsStudyLanguageOnboarding: boolean
    settings: {
      __typename?: 'UserSettings'
      activeTargetLanguage?: string | null
      nativeLanguage: string
    }
    studyLanguages: Array<{
      __typename?: 'UserStudyLanguage'
      languageCode: string
      isActive: boolean
      createdAt: any
      language: {
        __typename?: 'Language'
        code: string
        englishName: string
        nativeName: string
        flag: string
        popularSortOrder?: number | null
      }
    }>
  }
}

export type StudyLanguageRemovalImpactQueryVariables = Exact<{
  languageCode: Scalars['String']['input']
}>

export type StudyLanguageRemovalImpactQuery = {
  __typename?: 'Query'
  studyLanguageRemovalImpact: {
    __typename?: 'StudyLanguageRemovalImpact'
    affectedDeckCount: number
  }
}

export type AddStudyLanguageMutationVariables = Exact<{
  languageCode: Scalars['String']['input']
}>

export type AddStudyLanguageMutation = {
  __typename?: 'Mutation'
  addStudyLanguage: {
    __typename?: 'UserStudyLanguage'
    languageCode: string
    isActive: boolean
    createdAt: any
    language: {
      __typename?: 'Language'
      code: string
      englishName: string
      nativeName: string
      flag: string
      popularSortOrder?: number | null
    }
  }
}

export type RemoveStudyLanguageMutationVariables = Exact<{
  languageCode: Scalars['String']['input']
}>

export type RemoveStudyLanguageMutation = {
  __typename?: 'Mutation'
  removeStudyLanguage: Array<{
    __typename?: 'UserStudyLanguage'
    languageCode: string
    isActive: boolean
    createdAt: any
    language: {
      __typename?: 'Language'
      code: string
      englishName: string
      nativeName: string
      flag: string
      popularSortOrder?: number | null
    }
  }>
}

export type SetActiveTargetLanguageMutationVariables = Exact<{
  languageCode: Scalars['String']['input']
}>

export type SetActiveTargetLanguageMutation = {
  __typename?: 'Mutation'
  setActiveTargetLanguage: Array<{
    __typename?: 'UserStudyLanguage'
    languageCode: string
    isActive: boolean
    createdAt: any
    language: {
      __typename?: 'Language'
      code: string
      englishName: string
      nativeName: string
      flag: string
      popularSortOrder?: number | null
    }
  }>
}

export type CompleteStudyLanguageOnboardingMutationVariables = Exact<{
  input: CompleteStudyLanguageOnboardingInput
}>

export type CompleteStudyLanguageOnboardingMutation = {
  __typename?: 'Mutation'
  completeStudyLanguageOnboarding: {
    __typename?: 'CompleteStudyLanguageOnboardingPayload'
    needsStudyLanguageOnboarding: boolean
    studyLanguages: Array<{
      __typename?: 'UserStudyLanguage'
      languageCode: string
      isActive: boolean
      createdAt: any
      language: {
        __typename?: 'Language'
        code: string
        englishName: string
        nativeName: string
        flag: string
        popularSortOrder?: number | null
      }
    }>
  }
}

export type StartPublicDeckCopyPreviewMutationVariables = Exact<{
  input: StartPublicDeckCopyPreviewInput
}>

export type StartPublicDeckCopyPreviewMutation = {
  __typename?: 'Mutation'
  startPublicDeckCopyPreview: {
    __typename?: 'DeckPreviewSession'
    id: string
    type: DeckPreviewSessionType
    status: DeckPreviewSessionStatus
    sourceDeckId?: string | null
    targetLanguage: string
    chosenSourceLanguage: string
    expiresAt: any
    createdAt: any
    updatedAt: any
    cards: Array<{
      __typename?: 'DeckPreviewSessionCard'
      sourceCardId?: string | null
      front: string
      back: string
      example?: string | null
      backError?: string | null
      exampleError?: string | null
    }>
  }
}

export type StartGroupDeckCopyPreviewMutationVariables = Exact<{
  input: StartGroupDeckCopyPreviewInput
}>

export type StartGroupDeckCopyPreviewMutation = {
  __typename?: 'Mutation'
  startGroupDeckCopyPreview: {
    __typename?: 'DeckPreviewSession'
    id: string
    type: DeckPreviewSessionType
    status: DeckPreviewSessionStatus
    sourceDeckId?: string | null
    targetLanguage: string
    chosenSourceLanguage: string
    expiresAt: any
    createdAt: any
    updatedAt: any
    cards: Array<{
      __typename?: 'DeckPreviewSessionCard'
      sourceCardId?: string | null
      front: string
      back: string
      example?: string | null
      backError?: string | null
      exampleError?: string | null
    }>
  }
}

export type ActiveDeckPreviewQueryVariables = Exact<{ [key: string]: never }>

export type ActiveDeckPreviewQuery = {
  __typename?: 'Query'
  activeDeckPreview?: {
    __typename?: 'DeckPreviewSession'
    id: string
    type: DeckPreviewSessionType
    status: DeckPreviewSessionStatus
    sourceDeckId?: string | null
    targetLanguage: string
    chosenSourceLanguage: string
    expiresAt: any
    createdAt: any
    updatedAt: any
    cards: Array<{
      __typename?: 'DeckPreviewSessionCard'
      sourceCardId?: string | null
      front: string
      back: string
      example?: string | null
      backError?: string | null
      exampleError?: string | null
    }>
  } | null
}

export type UpdateDeckPreviewCardMutationVariables = Exact<{
  input: UpdateDeckPreviewCardInput
}>

export type UpdateDeckPreviewCardMutation = {
  __typename?: 'Mutation'
  updateDeckPreviewCard: {
    __typename?: 'DeckPreviewSession'
    id: string
    type: DeckPreviewSessionType
    status: DeckPreviewSessionStatus
    sourceDeckId?: string | null
    targetLanguage: string
    chosenSourceLanguage: string
    expiresAt: any
    createdAt: any
    updatedAt: any
    cards: Array<{
      __typename?: 'DeckPreviewSessionCard'
      sourceCardId?: string | null
      front: string
      back: string
      example?: string | null
      backError?: string | null
      exampleError?: string | null
    }>
  }
}

export type ConfirmDeckPreviewMutationVariables = Exact<{
  sessionId: Scalars['String']['input']
}>

export type ConfirmDeckPreviewMutation = {
  __typename?: 'Mutation'
  confirmDeckPreview: {
    __typename?: 'ConfirmDeckPreviewPayload'
    deck: {
      __typename?: 'Deck'
      id: string
      ownerId: string
      title: string
      description?: string | null
      visibility: DeckVisibility
      moderationStatus: DeckModerationStatus
      isOfficial: boolean
      sourceDeckId?: string | null
      targetLanguage?: string | null
      sourceLanguage?: string | null
      createdAt: any
      updatedAt: any
    }
    cards: Array<{
      __typename?: 'Card'
      id: string
      deckId: string
      front: string
      back: string
      example?: string | null
      notes?: string | null
      position: number
      createdAt: any
      updatedAt: any
    }>
  }
}

export type CancelDeckPreviewMutationVariables = Exact<{
  sessionId: Scalars['String']['input']
}>

export type CancelDeckPreviewMutation = { __typename?: 'Mutation'; cancelDeckPreview: boolean }

export type StartDeckRegeneratePreviewMutationVariables = Exact<{
  input: StartDeckRegeneratePreviewInput
}>

export type StartDeckRegeneratePreviewMutation = {
  __typename?: 'Mutation'
  startDeckRegeneratePreview: {
    __typename?: 'DeckPreviewSession'
    id: string
    type: DeckPreviewSessionType
    status: DeckPreviewSessionStatus
    sourceDeckId?: string | null
    targetLanguage: string
    chosenSourceLanguage: string
    expiresAt: any
    createdAt: any
    updatedAt: any
    cards: Array<{
      __typename?: 'DeckPreviewSessionCard'
      sourceCardId?: string | null
      front: string
      back: string
      example?: string | null
      backError?: string | null
      exampleError?: string | null
    }>
  }
}

export type AccountLocaleQueryVariables = Exact<{ [key: string]: never }>

export type AccountLocaleQuery = {
  __typename?: 'Query'
  myAccount: {
    __typename?: 'MyAccount'
    settings: { __typename?: 'UserSettings'; interfaceLocale: string }
  }
}

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
  baseOptions?: Apollo.QueryHookOptions<
    AdminDashboardStatsQuery,
    AdminDashboardStatsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminDashboardStatsQuery, AdminDashboardStatsQueryVariables>(
    AdminDashboardStatsDocument,
    options,
  )
}
export function useAdminDashboardStatsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AdminDashboardStatsQuery,
    AdminDashboardStatsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminDashboardStatsQuery, AdminDashboardStatsQueryVariables>(
    AdminDashboardStatsDocument,
    options,
  )
}
// @ts-ignore
export function useAdminDashboardStatsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    AdminDashboardStatsQuery,
    AdminDashboardStatsQueryVariables
  >,
): Apollo.UseSuspenseQueryResult<AdminDashboardStatsQuery, AdminDashboardStatsQueryVariables>
export function useAdminDashboardStatsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminDashboardStatsQuery, AdminDashboardStatsQueryVariables>,
): Apollo.UseSuspenseQueryResult<
  AdminDashboardStatsQuery | undefined,
  AdminDashboardStatsQueryVariables
>
export function useAdminDashboardStatsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminDashboardStatsQuery, AdminDashboardStatsQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminDashboardStatsQuery, AdminDashboardStatsQueryVariables>(
    AdminDashboardStatsDocument,
    options,
  )
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
  baseOptions?: Apollo.QueryHookOptions<AdminSearchUsersQuery, AdminSearchUsersQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminSearchUsersQuery, AdminSearchUsersQueryVariables>(
    AdminSearchUsersDocument,
    options,
  )
}
export function useAdminSearchUsersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AdminSearchUsersQuery, AdminSearchUsersQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminSearchUsersQuery, AdminSearchUsersQueryVariables>(
    AdminSearchUsersDocument,
    options,
  )
}
// @ts-ignore
export function useAdminSearchUsersSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    AdminSearchUsersQuery,
    AdminSearchUsersQueryVariables
  >,
): Apollo.UseSuspenseQueryResult<AdminSearchUsersQuery, AdminSearchUsersQueryVariables>
export function useAdminSearchUsersSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminSearchUsersQuery, AdminSearchUsersQueryVariables>,
): Apollo.UseSuspenseQueryResult<AdminSearchUsersQuery | undefined, AdminSearchUsersQueryVariables>
export function useAdminSearchUsersSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminSearchUsersQuery, AdminSearchUsersQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminSearchUsersQuery, AdminSearchUsersQueryVariables>(
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
  baseOptions?: Apollo.MutationHookOptions<BlockUserMutation, BlockUserMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<BlockUserMutation, BlockUserMutationVariables>(
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
  baseOptions?: Apollo.MutationHookOptions<UnblockUserMutation, UnblockUserMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UnblockUserMutation, UnblockUserMutationVariables>(
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
  baseOptions?: Apollo.QueryHookOptions<ModerationQueueQuery, ModerationQueueQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<ModerationQueueQuery, ModerationQueueQueryVariables>(
    ModerationQueueDocument,
    options,
  )
}
export function useModerationQueueLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ModerationQueueQuery, ModerationQueueQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<ModerationQueueQuery, ModerationQueueQueryVariables>(
    ModerationQueueDocument,
    options,
  )
}
// @ts-ignore
export function useModerationQueueSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    ModerationQueueQuery,
    ModerationQueueQueryVariables
  >,
): Apollo.UseSuspenseQueryResult<ModerationQueueQuery, ModerationQueueQueryVariables>
export function useModerationQueueSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<ModerationQueueQuery, ModerationQueueQueryVariables>,
): Apollo.UseSuspenseQueryResult<ModerationQueueQuery | undefined, ModerationQueueQueryVariables>
export function useModerationQueueSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<ModerationQueueQuery, ModerationQueueQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<ModerationQueueQuery, ModerationQueueQueryVariables>(
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
  baseOptions?: Apollo.MutationHookOptions<ApproveDeckMutation, ApproveDeckMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<ApproveDeckMutation, ApproveDeckMutationVariables>(
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
  baseOptions?: Apollo.MutationHookOptions<RejectDeckMutation, RejectDeckMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<RejectDeckMutation, RejectDeckMutationVariables>(
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
  baseOptions?: Apollo.MutationHookOptions<HideDeckMutation, HideDeckMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<HideDeckMutation, HideDeckMutationVariables>(HideDeckDocument, options)
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
  baseOptions?: Apollo.MutationHookOptions<
    SetOfficialDeckMutation,
    SetOfficialDeckMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<SetOfficialDeckMutation, SetOfficialDeckMutationVariables>(
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
  baseOptions?: Apollo.MutationHookOptions<
    GenerateCardExamplesMutation,
    GenerateCardExamplesMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<GenerateCardExamplesMutation, GenerateCardExamplesMutationVariables>(
    GenerateCardExamplesDocument,
    options,
  )
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
  baseOptions?: Apollo.MutationHookOptions<
    SaveGeneratedCardExampleMutation,
    SaveGeneratedCardExampleMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
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
  baseOptions?: Apollo.MutationHookOptions<
    PreviewCsvImportMutation,
    PreviewCsvImportMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<PreviewCsvImportMutation, PreviewCsvImportMutationVariables>(
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
  baseOptions?: Apollo.MutationHookOptions<
    ConfirmCsvImportMutation,
    ConfirmCsvImportMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<ConfirmCsvImportMutation, ConfirmCsvImportMutationVariables>(
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
  baseOptions?: Apollo.QueryHookOptions<MyDecksQuery, MyDecksQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<MyDecksQuery, MyDecksQueryVariables>(MyDecksDocument, options)
}
export function useMyDecksLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<MyDecksQuery, MyDecksQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<MyDecksQuery, MyDecksQueryVariables>(MyDecksDocument, options)
}
// @ts-ignore
export function useMyDecksSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<MyDecksQuery, MyDecksQueryVariables>,
): Apollo.UseSuspenseQueryResult<MyDecksQuery, MyDecksQueryVariables>
export function useMyDecksSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<MyDecksQuery, MyDecksQueryVariables>,
): Apollo.UseSuspenseQueryResult<MyDecksQuery | undefined, MyDecksQueryVariables>
export function useMyDecksSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<MyDecksQuery, MyDecksQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<MyDecksQuery, MyDecksQueryVariables>(MyDecksDocument, options)
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
  baseOptions: Apollo.QueryHookOptions<DecksPageQuery, DecksPageQueryVariables> &
    ({ variables: DecksPageQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<DecksPageQuery, DecksPageQueryVariables>(DecksPageDocument, options)
}
export function useDecksPageLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<DecksPageQuery, DecksPageQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<DecksPageQuery, DecksPageQueryVariables>(DecksPageDocument, options)
}
// @ts-ignore
export function useDecksPageSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<DecksPageQuery, DecksPageQueryVariables>,
): Apollo.UseSuspenseQueryResult<DecksPageQuery, DecksPageQueryVariables>
export function useDecksPageSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<DecksPageQuery, DecksPageQueryVariables>,
): Apollo.UseSuspenseQueryResult<DecksPageQuery | undefined, DecksPageQueryVariables>
export function useDecksPageSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<DecksPageQuery, DecksPageQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<DecksPageQuery, DecksPageQueryVariables>(
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
  baseOptions: Apollo.QueryHookOptions<DeckQuery, DeckQueryVariables> &
    ({ variables: DeckQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<DeckQuery, DeckQueryVariables>(DeckDocument, options)
}
export function useDeckLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<DeckQuery, DeckQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<DeckQuery, DeckQueryVariables>(DeckDocument, options)
}
// @ts-ignore
export function useDeckSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<DeckQuery, DeckQueryVariables>,
): Apollo.UseSuspenseQueryResult<DeckQuery, DeckQueryVariables>
export function useDeckSuspenseQuery(
  baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DeckQuery, DeckQueryVariables>,
): Apollo.UseSuspenseQueryResult<DeckQuery | undefined, DeckQueryVariables>
export function useDeckSuspenseQuery(
  baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DeckQuery, DeckQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<DeckQuery, DeckQueryVariables>(DeckDocument, options)
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
  baseOptions: Apollo.QueryHookOptions<DeckCardsQuery, DeckCardsQueryVariables> &
    ({ variables: DeckCardsQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<DeckCardsQuery, DeckCardsQueryVariables>(DeckCardsDocument, options)
}
export function useDeckCardsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<DeckCardsQuery, DeckCardsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<DeckCardsQuery, DeckCardsQueryVariables>(DeckCardsDocument, options)
}
// @ts-ignore
export function useDeckCardsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<DeckCardsQuery, DeckCardsQueryVariables>,
): Apollo.UseSuspenseQueryResult<DeckCardsQuery, DeckCardsQueryVariables>
export function useDeckCardsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<DeckCardsQuery, DeckCardsQueryVariables>,
): Apollo.UseSuspenseQueryResult<DeckCardsQuery | undefined, DeckCardsQueryVariables>
export function useDeckCardsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<DeckCardsQuery, DeckCardsQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<DeckCardsQuery, DeckCardsQueryVariables>(
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
  baseOptions?: Apollo.MutationHookOptions<CreateDeckMutation, CreateDeckMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreateDeckMutation, CreateDeckMutationVariables>(
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
  baseOptions?: Apollo.MutationHookOptions<UpdateDeckMutation, UpdateDeckMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UpdateDeckMutation, UpdateDeckMutationVariables>(
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
  baseOptions?: Apollo.MutationHookOptions<DeleteDeckMutation, DeleteDeckMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<DeleteDeckMutation, DeleteDeckMutationVariables>(
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
  baseOptions?: Apollo.MutationHookOptions<CreateCardMutation, CreateCardMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreateCardMutation, CreateCardMutationVariables>(
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
  baseOptions?: Apollo.MutationHookOptions<UpdateCardMutation, UpdateCardMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UpdateCardMutation, UpdateCardMutationVariables>(
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
  baseOptions?: Apollo.MutationHookOptions<DeleteCardMutation, DeleteCardMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<DeleteCardMutation, DeleteCardMutationVariables>(
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
  baseOptions?: Apollo.MutationHookOptions<PublishDeckMutation, PublishDeckMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<PublishDeckMutation, PublishDeckMutationVariables>(
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
  baseOptions?: Apollo.MutationHookOptions<UnpublishDeckMutation, UnpublishDeckMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UnpublishDeckMutation, UnpublishDeckMutationVariables>(
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
  baseOptions?: Apollo.QueryHookOptions<MyGroupsQuery, MyGroupsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<MyGroupsQuery, MyGroupsQueryVariables>(MyGroupsDocument, options)
}
export function useMyGroupsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<MyGroupsQuery, MyGroupsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<MyGroupsQuery, MyGroupsQueryVariables>(MyGroupsDocument, options)
}
// @ts-ignore
export function useMyGroupsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<MyGroupsQuery, MyGroupsQueryVariables>,
): Apollo.UseSuspenseQueryResult<MyGroupsQuery, MyGroupsQueryVariables>
export function useMyGroupsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<MyGroupsQuery, MyGroupsQueryVariables>,
): Apollo.UseSuspenseQueryResult<MyGroupsQuery | undefined, MyGroupsQueryVariables>
export function useMyGroupsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<MyGroupsQuery, MyGroupsQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<MyGroupsQuery, MyGroupsQueryVariables>(MyGroupsDocument, options)
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
  baseOptions: Apollo.QueryHookOptions<GroupQuery, GroupQueryVariables> &
    ({ variables: GroupQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GroupQuery, GroupQueryVariables>(GroupDocument, options)
}
export function useGroupLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GroupQuery, GroupQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GroupQuery, GroupQueryVariables>(GroupDocument, options)
}
// @ts-ignore
export function useGroupSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<GroupQuery, GroupQueryVariables>,
): Apollo.UseSuspenseQueryResult<GroupQuery, GroupQueryVariables>
export function useGroupSuspenseQuery(
  baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GroupQuery, GroupQueryVariables>,
): Apollo.UseSuspenseQueryResult<GroupQuery | undefined, GroupQueryVariables>
export function useGroupSuspenseQuery(
  baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GroupQuery, GroupQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<GroupQuery, GroupQueryVariables>(GroupDocument, options)
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
  baseOptions?: Apollo.MutationHookOptions<CreateGroupMutation, CreateGroupMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreateGroupMutation, CreateGroupMutationVariables>(
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
  baseOptions?: Apollo.MutationHookOptions<
    InviteUserToGroupMutation,
    InviteUserToGroupMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<InviteUserToGroupMutation, InviteUserToGroupMutationVariables>(
    InviteUserToGroupDocument,
    options,
  )
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
  baseOptions?: Apollo.QueryHookOptions<MyGroupInvitationsQuery, MyGroupInvitationsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<MyGroupInvitationsQuery, MyGroupInvitationsQueryVariables>(
    MyGroupInvitationsDocument,
    options,
  )
}
export function useMyGroupInvitationsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    MyGroupInvitationsQuery,
    MyGroupInvitationsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<MyGroupInvitationsQuery, MyGroupInvitationsQueryVariables>(
    MyGroupInvitationsDocument,
    options,
  )
}
// @ts-ignore
export function useMyGroupInvitationsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    MyGroupInvitationsQuery,
    MyGroupInvitationsQueryVariables
  >,
): Apollo.UseSuspenseQueryResult<MyGroupInvitationsQuery, MyGroupInvitationsQueryVariables>
export function useMyGroupInvitationsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<MyGroupInvitationsQuery, MyGroupInvitationsQueryVariables>,
): Apollo.UseSuspenseQueryResult<
  MyGroupInvitationsQuery | undefined,
  MyGroupInvitationsQueryVariables
>
export function useMyGroupInvitationsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<MyGroupInvitationsQuery, MyGroupInvitationsQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<MyGroupInvitationsQuery, MyGroupInvitationsQueryVariables>(
    MyGroupInvitationsDocument,
    options,
  )
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
  baseOptions?: Apollo.MutationHookOptions<
    AcceptGroupInvitationMutation,
    AcceptGroupInvitationMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AcceptGroupInvitationMutation, AcceptGroupInvitationMutationVariables>(
    AcceptGroupInvitationDocument,
    options,
  )
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
  baseOptions?: Apollo.MutationHookOptions<
    DeclineGroupInvitationMutation,
    DeclineGroupInvitationMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
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
  baseOptions?: Apollo.MutationHookOptions<
    ShareDeckWithGroupMutation,
    ShareDeckWithGroupMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<ShareDeckWithGroupMutation, ShareDeckWithGroupMutationVariables>(
    ShareDeckWithGroupDocument,
    options,
  )
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
  baseOptions: Apollo.QueryHookOptions<GroupSharedDecksQuery, GroupSharedDecksQueryVariables> &
    ({ variables: GroupSharedDecksQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GroupSharedDecksQuery, GroupSharedDecksQueryVariables>(
    GroupSharedDecksDocument,
    options,
  )
}
export function useGroupSharedDecksLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GroupSharedDecksQuery, GroupSharedDecksQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GroupSharedDecksQuery, GroupSharedDecksQueryVariables>(
    GroupSharedDecksDocument,
    options,
  )
}
// @ts-ignore
export function useGroupSharedDecksSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GroupSharedDecksQuery,
    GroupSharedDecksQueryVariables
  >,
): Apollo.UseSuspenseQueryResult<GroupSharedDecksQuery, GroupSharedDecksQueryVariables>
export function useGroupSharedDecksSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GroupSharedDecksQuery, GroupSharedDecksQueryVariables>,
): Apollo.UseSuspenseQueryResult<GroupSharedDecksQuery | undefined, GroupSharedDecksQueryVariables>
export function useGroupSharedDecksSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GroupSharedDecksQuery, GroupSharedDecksQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<GroupSharedDecksQuery, GroupSharedDecksQueryVariables>(
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
  baseOptions?: Apollo.MutationHookOptions<CopyGroupDeckMutation, CopyGroupDeckMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CopyGroupDeckMutation, CopyGroupDeckMutationVariables>(
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
      lessonSize
      totalCards
      cards {
        cardId
        front
        back
        example
        notes
        position
        reviewState {
          id
          easeFactor
          intervalDays
          repetitions
          dueAt
          lastReviewedAt
        }
      }
    }
  }
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
  baseOptions?: Apollo.MutationHookOptions<StartLessonMutation, StartLessonMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<StartLessonMutation, StartLessonMutationVariables>(
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
export const SubmitReviewDocument = gql`
  mutation SubmitReview($input: SubmitReviewInput!) {
    submitReview(input: $input) {
      sessionId
      cardId
      reviewedCards
      reviewState {
        id
        easeFactor
        intervalDays
        repetitions
        dueAt
        lastReviewedAt
      }
    }
  }
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
  baseOptions?: Apollo.MutationHookOptions<SubmitReviewMutation, SubmitReviewMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<SubmitReviewMutation, SubmitReviewMutationVariables>(
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
  baseOptions?: Apollo.MutationHookOptions<CompleteLessonMutation, CompleteLessonMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CompleteLessonMutation, CompleteLessonMutationVariables>(
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
export const DeckLearningStatsDocument = gql`
  query DeckLearningStats($deckId: String!) {
    deckLearningStats(deckId: $deckId) {
      deckId
      totalCards
      newCards
      dueCards
      reviewedCards
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
  baseOptions: Apollo.QueryHookOptions<DeckLearningStatsQuery, DeckLearningStatsQueryVariables> &
    ({ variables: DeckLearningStatsQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<DeckLearningStatsQuery, DeckLearningStatsQueryVariables>(
    DeckLearningStatsDocument,
    options,
  )
}
export function useDeckLearningStatsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    DeckLearningStatsQuery,
    DeckLearningStatsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<DeckLearningStatsQuery, DeckLearningStatsQueryVariables>(
    DeckLearningStatsDocument,
    options,
  )
}
// @ts-ignore
export function useDeckLearningStatsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    DeckLearningStatsQuery,
    DeckLearningStatsQueryVariables
  >,
): Apollo.UseSuspenseQueryResult<DeckLearningStatsQuery, DeckLearningStatsQueryVariables>
export function useDeckLearningStatsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<DeckLearningStatsQuery, DeckLearningStatsQueryVariables>,
): Apollo.UseSuspenseQueryResult<
  DeckLearningStatsQuery | undefined,
  DeckLearningStatsQueryVariables
>
export function useDeckLearningStatsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<DeckLearningStatsQuery, DeckLearningStatsQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<DeckLearningStatsQuery, DeckLearningStatsQueryVariables>(
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
  baseOptions?: Apollo.MutationHookOptions<
    RegisterPushTokenMutation,
    RegisterPushTokenMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<RegisterPushTokenMutation, RegisterPushTokenMutationVariables>(
    RegisterPushTokenDocument,
    options,
  )
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
  baseOptions?: Apollo.MutationHookOptions<
    RemovePushTokenMutation,
    RemovePushTokenMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<RemovePushTokenMutation, RemovePushTokenMutationVariables>(
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
  baseOptions?: Apollo.QueryHookOptions<ProfileMeQuery, ProfileMeQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<ProfileMeQuery, ProfileMeQueryVariables>(ProfileMeDocument, options)
}
export function useProfileMeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ProfileMeQuery, ProfileMeQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<ProfileMeQuery, ProfileMeQueryVariables>(ProfileMeDocument, options)
}
// @ts-ignore
export function useProfileMeSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<ProfileMeQuery, ProfileMeQueryVariables>,
): Apollo.UseSuspenseQueryResult<ProfileMeQuery, ProfileMeQueryVariables>
export function useProfileMeSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<ProfileMeQuery, ProfileMeQueryVariables>,
): Apollo.UseSuspenseQueryResult<ProfileMeQuery | undefined, ProfileMeQueryVariables>
export function useProfileMeSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<ProfileMeQuery, ProfileMeQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<ProfileMeQuery, ProfileMeQueryVariables>(
    ProfileMeDocument,
    options,
  )
}
export type ProfileMeQueryHookResult = ReturnType<typeof useProfileMeQuery>
export type ProfileMeLazyQueryHookResult = ReturnType<typeof useProfileMeLazyQuery>
export type ProfileMeSuspenseQueryHookResult = ReturnType<typeof useProfileMeSuspenseQuery>
export type ProfileMeQueryResult = Apollo.QueryResult<ProfileMeQuery, ProfileMeQueryVariables>
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
  baseOptions?: Apollo.QueryHookOptions<PublicDecksQuery, PublicDecksQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<PublicDecksQuery, PublicDecksQueryVariables>(PublicDecksDocument, options)
}
export function usePublicDecksLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<PublicDecksQuery, PublicDecksQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<PublicDecksQuery, PublicDecksQueryVariables>(
    PublicDecksDocument,
    options,
  )
}
// @ts-ignore
export function usePublicDecksSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<PublicDecksQuery, PublicDecksQueryVariables>,
): Apollo.UseSuspenseQueryResult<PublicDecksQuery, PublicDecksQueryVariables>
export function usePublicDecksSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<PublicDecksQuery, PublicDecksQueryVariables>,
): Apollo.UseSuspenseQueryResult<PublicDecksQuery | undefined, PublicDecksQueryVariables>
export function usePublicDecksSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<PublicDecksQuery, PublicDecksQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<PublicDecksQuery, PublicDecksQueryVariables>(
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
  baseOptions: Apollo.QueryHookOptions<PublicDeckQuery, PublicDeckQueryVariables> &
    ({ variables: PublicDeckQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<PublicDeckQuery, PublicDeckQueryVariables>(PublicDeckDocument, options)
}
export function usePublicDeckLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<PublicDeckQuery, PublicDeckQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<PublicDeckQuery, PublicDeckQueryVariables>(PublicDeckDocument, options)
}
// @ts-ignore
export function usePublicDeckSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<PublicDeckQuery, PublicDeckQueryVariables>,
): Apollo.UseSuspenseQueryResult<PublicDeckQuery, PublicDeckQueryVariables>
export function usePublicDeckSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<PublicDeckQuery, PublicDeckQueryVariables>,
): Apollo.UseSuspenseQueryResult<PublicDeckQuery | undefined, PublicDeckQueryVariables>
export function usePublicDeckSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<PublicDeckQuery, PublicDeckQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<PublicDeckQuery, PublicDeckQueryVariables>(
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
  baseOptions: Apollo.QueryHookOptions<PublicDeckCardsQuery, PublicDeckCardsQueryVariables> &
    ({ variables: PublicDeckCardsQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<PublicDeckCardsQuery, PublicDeckCardsQueryVariables>(
    PublicDeckCardsDocument,
    options,
  )
}
export function usePublicDeckCardsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<PublicDeckCardsQuery, PublicDeckCardsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<PublicDeckCardsQuery, PublicDeckCardsQueryVariables>(
    PublicDeckCardsDocument,
    options,
  )
}
// @ts-ignore
export function usePublicDeckCardsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    PublicDeckCardsQuery,
    PublicDeckCardsQueryVariables
  >,
): Apollo.UseSuspenseQueryResult<PublicDeckCardsQuery, PublicDeckCardsQueryVariables>
export function usePublicDeckCardsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<PublicDeckCardsQuery, PublicDeckCardsQueryVariables>,
): Apollo.UseSuspenseQueryResult<PublicDeckCardsQuery | undefined, PublicDeckCardsQueryVariables>
export function usePublicDeckCardsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<PublicDeckCardsQuery, PublicDeckCardsQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<PublicDeckCardsQuery, PublicDeckCardsQueryVariables>(
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
  baseOptions?: Apollo.MutationHookOptions<CopyPublicDeckMutation, CopyPublicDeckMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CopyPublicDeckMutation, CopyPublicDeckMutationVariables>(
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
  baseOptions?: Apollo.QueryHookOptions<MySettingsQuery, MySettingsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<MySettingsQuery, MySettingsQueryVariables>(MySettingsDocument, options)
}
export function useMySettingsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<MySettingsQuery, MySettingsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<MySettingsQuery, MySettingsQueryVariables>(MySettingsDocument, options)
}
// @ts-ignore
export function useMySettingsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<MySettingsQuery, MySettingsQueryVariables>,
): Apollo.UseSuspenseQueryResult<MySettingsQuery, MySettingsQueryVariables>
export function useMySettingsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<MySettingsQuery, MySettingsQueryVariables>,
): Apollo.UseSuspenseQueryResult<MySettingsQuery | undefined, MySettingsQueryVariables>
export function useMySettingsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<MySettingsQuery, MySettingsQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<MySettingsQuery, MySettingsQueryVariables>(
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
  baseOptions?: Apollo.MutationHookOptions<
    UpdateMySettingsMutation,
    UpdateMySettingsMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UpdateMySettingsMutation, UpdateMySettingsMutationVariables>(
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
  baseOptions?: Apollo.QueryHookOptions<LanguagesQuery, LanguagesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<LanguagesQuery, LanguagesQueryVariables>(LanguagesDocument, options)
}
export function useLanguagesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<LanguagesQuery, LanguagesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<LanguagesQuery, LanguagesQueryVariables>(LanguagesDocument, options)
}
// @ts-ignore
export function useLanguagesSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<LanguagesQuery, LanguagesQueryVariables>,
): Apollo.UseSuspenseQueryResult<LanguagesQuery, LanguagesQueryVariables>
export function useLanguagesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<LanguagesQuery, LanguagesQueryVariables>,
): Apollo.UseSuspenseQueryResult<LanguagesQuery | undefined, LanguagesQueryVariables>
export function useLanguagesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<LanguagesQuery, LanguagesQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<LanguagesQuery, LanguagesQueryVariables>(
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
  baseOptions?: Apollo.QueryHookOptions<MyStudyLanguagesQuery, MyStudyLanguagesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<MyStudyLanguagesQuery, MyStudyLanguagesQueryVariables>(
    MyStudyLanguagesDocument,
    options,
  )
}
export function useMyStudyLanguagesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<MyStudyLanguagesQuery, MyStudyLanguagesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<MyStudyLanguagesQuery, MyStudyLanguagesQueryVariables>(
    MyStudyLanguagesDocument,
    options,
  )
}
// @ts-ignore
export function useMyStudyLanguagesSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    MyStudyLanguagesQuery,
    MyStudyLanguagesQueryVariables
  >,
): Apollo.UseSuspenseQueryResult<MyStudyLanguagesQuery, MyStudyLanguagesQueryVariables>
export function useMyStudyLanguagesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<MyStudyLanguagesQuery, MyStudyLanguagesQueryVariables>,
): Apollo.UseSuspenseQueryResult<MyStudyLanguagesQuery | undefined, MyStudyLanguagesQueryVariables>
export function useMyStudyLanguagesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<MyStudyLanguagesQuery, MyStudyLanguagesQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<MyStudyLanguagesQuery, MyStudyLanguagesQueryVariables>(
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
  baseOptions?: Apollo.QueryHookOptions<
    StudyLanguageBootstrapQuery,
    StudyLanguageBootstrapQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<StudyLanguageBootstrapQuery, StudyLanguageBootstrapQueryVariables>(
    StudyLanguageBootstrapDocument,
    options,
  )
}
export function useStudyLanguageBootstrapLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    StudyLanguageBootstrapQuery,
    StudyLanguageBootstrapQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<StudyLanguageBootstrapQuery, StudyLanguageBootstrapQueryVariables>(
    StudyLanguageBootstrapDocument,
    options,
  )
}
// @ts-ignore
export function useStudyLanguageBootstrapSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    StudyLanguageBootstrapQuery,
    StudyLanguageBootstrapQueryVariables
  >,
): Apollo.UseSuspenseQueryResult<StudyLanguageBootstrapQuery, StudyLanguageBootstrapQueryVariables>
export function useStudyLanguageBootstrapSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        StudyLanguageBootstrapQuery,
        StudyLanguageBootstrapQueryVariables
      >,
): Apollo.UseSuspenseQueryResult<
  StudyLanguageBootstrapQuery | undefined,
  StudyLanguageBootstrapQueryVariables
>
export function useStudyLanguageBootstrapSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        StudyLanguageBootstrapQuery,
        StudyLanguageBootstrapQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<StudyLanguageBootstrapQuery, StudyLanguageBootstrapQueryVariables>(
    StudyLanguageBootstrapDocument,
    options,
  )
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
  baseOptions: Apollo.QueryHookOptions<
    StudyLanguageRemovalImpactQuery,
    StudyLanguageRemovalImpactQueryVariables
  > &
    ({ variables: StudyLanguageRemovalImpactQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<StudyLanguageRemovalImpactQuery, StudyLanguageRemovalImpactQueryVariables>(
    StudyLanguageRemovalImpactDocument,
    options,
  )
}
export function useStudyLanguageRemovalImpactLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    StudyLanguageRemovalImpactQuery,
    StudyLanguageRemovalImpactQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<
    StudyLanguageRemovalImpactQuery,
    StudyLanguageRemovalImpactQueryVariables
  >(StudyLanguageRemovalImpactDocument, options)
}
// @ts-ignore
export function useStudyLanguageRemovalImpactSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    StudyLanguageRemovalImpactQuery,
    StudyLanguageRemovalImpactQueryVariables
  >,
): Apollo.UseSuspenseQueryResult<
  StudyLanguageRemovalImpactQuery,
  StudyLanguageRemovalImpactQueryVariables
>
export function useStudyLanguageRemovalImpactSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        StudyLanguageRemovalImpactQuery,
        StudyLanguageRemovalImpactQueryVariables
      >,
): Apollo.UseSuspenseQueryResult<
  StudyLanguageRemovalImpactQuery | undefined,
  StudyLanguageRemovalImpactQueryVariables
>
export function useStudyLanguageRemovalImpactSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        StudyLanguageRemovalImpactQuery,
        StudyLanguageRemovalImpactQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<
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
  baseOptions?: Apollo.MutationHookOptions<
    AddStudyLanguageMutation,
    AddStudyLanguageMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AddStudyLanguageMutation, AddStudyLanguageMutationVariables>(
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
  baseOptions?: Apollo.MutationHookOptions<
    RemoveStudyLanguageMutation,
    RemoveStudyLanguageMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<RemoveStudyLanguageMutation, RemoveStudyLanguageMutationVariables>(
    RemoveStudyLanguageDocument,
    options,
  )
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
  baseOptions?: Apollo.MutationHookOptions<
    SetActiveTargetLanguageMutation,
    SetActiveTargetLanguageMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
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
  baseOptions?: Apollo.MutationHookOptions<
    CompleteStudyLanguageOnboardingMutation,
    CompleteStudyLanguageOnboardingMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
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
  baseOptions?: Apollo.MutationHookOptions<
    StartPublicDeckCopyPreviewMutation,
    StartPublicDeckCopyPreviewMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
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
  baseOptions?: Apollo.MutationHookOptions<
    StartGroupDeckCopyPreviewMutation,
    StartGroupDeckCopyPreviewMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
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
  baseOptions?: Apollo.QueryHookOptions<ActiveDeckPreviewQuery, ActiveDeckPreviewQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<ActiveDeckPreviewQuery, ActiveDeckPreviewQueryVariables>(
    ActiveDeckPreviewDocument,
    options,
  )
}
export function useActiveDeckPreviewLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ActiveDeckPreviewQuery,
    ActiveDeckPreviewQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<ActiveDeckPreviewQuery, ActiveDeckPreviewQueryVariables>(
    ActiveDeckPreviewDocument,
    options,
  )
}
// @ts-ignore
export function useActiveDeckPreviewSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    ActiveDeckPreviewQuery,
    ActiveDeckPreviewQueryVariables
  >,
): Apollo.UseSuspenseQueryResult<ActiveDeckPreviewQuery, ActiveDeckPreviewQueryVariables>
export function useActiveDeckPreviewSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<ActiveDeckPreviewQuery, ActiveDeckPreviewQueryVariables>,
): Apollo.UseSuspenseQueryResult<
  ActiveDeckPreviewQuery | undefined,
  ActiveDeckPreviewQueryVariables
>
export function useActiveDeckPreviewSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<ActiveDeckPreviewQuery, ActiveDeckPreviewQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<ActiveDeckPreviewQuery, ActiveDeckPreviewQueryVariables>(
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
  baseOptions?: Apollo.MutationHookOptions<
    UpdateDeckPreviewCardMutation,
    UpdateDeckPreviewCardMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UpdateDeckPreviewCardMutation, UpdateDeckPreviewCardMutationVariables>(
    UpdateDeckPreviewCardDocument,
    options,
  )
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
  baseOptions?: Apollo.MutationHookOptions<
    ConfirmDeckPreviewMutation,
    ConfirmDeckPreviewMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<ConfirmDeckPreviewMutation, ConfirmDeckPreviewMutationVariables>(
    ConfirmDeckPreviewDocument,
    options,
  )
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
  baseOptions?: Apollo.MutationHookOptions<
    CancelDeckPreviewMutation,
    CancelDeckPreviewMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CancelDeckPreviewMutation, CancelDeckPreviewMutationVariables>(
    CancelDeckPreviewDocument,
    options,
  )
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
  baseOptions?: Apollo.MutationHookOptions<
    StartDeckRegeneratePreviewMutation,
    StartDeckRegeneratePreviewMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
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
  baseOptions?: Apollo.QueryHookOptions<AccountLocaleQuery, AccountLocaleQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AccountLocaleQuery, AccountLocaleQueryVariables>(
    AccountLocaleDocument,
    options,
  )
}
export function useAccountLocaleLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AccountLocaleQuery, AccountLocaleQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AccountLocaleQuery, AccountLocaleQueryVariables>(
    AccountLocaleDocument,
    options,
  )
}
// @ts-ignore
export function useAccountLocaleSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<AccountLocaleQuery, AccountLocaleQueryVariables>,
): Apollo.UseSuspenseQueryResult<AccountLocaleQuery, AccountLocaleQueryVariables>
export function useAccountLocaleSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AccountLocaleQuery, AccountLocaleQueryVariables>,
): Apollo.UseSuspenseQueryResult<AccountLocaleQuery | undefined, AccountLocaleQueryVariables>
export function useAccountLocaleSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AccountLocaleQuery, AccountLocaleQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AccountLocaleQuery, AccountLocaleQueryVariables>(
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
