export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  DateTime: { input: string; output: string }
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
  learningGroup?: Maybe<LearningGroup>
  notes?: Maybe<Scalars['String']['output']>
  position: Scalars['Int']['output']
  updatedAt: Scalars['DateTime']['output']
}

export enum CardDuplicateKind {
  CurrentDeck = 'CURRENT_DECK',
  InBatch = 'IN_BATCH',
  OtherDeck = 'OTHER_DECK',
}

export type CardReviewState = {
  __typename?: 'CardReviewState'
  dueAt: Scalars['DateTime']['output']
  id: Scalars['String']['output']
  lastReviewedAt?: Maybe<Scalars['DateTime']['output']>
  learningStep: Scalars['Int']['output']
  longReviewSuccessCount: Scalars['Int']['output']
}

export type CheckCardDuplicateHit = {
  __typename?: 'CheckCardDuplicateHit'
  deckTitle?: Maybe<Scalars['String']['output']>
  index: Scalars['Int']['output']
  kind: CardDuplicateKind
}

export type CheckCardDuplicatesInput = {
  deckId: Scalars['String']['input']
  pairs: Array<CheckCardDuplicatesPairInput>
}

export type CheckCardDuplicatesPairInput = {
  back: Scalars['String']['input']
  front: Scalars['String']['input']
}

export type CheckCardDuplicatesPayload = {
  __typename?: 'CheckCardDuplicatesPayload'
  hits: Array<CheckCardDuplicateHit>
}

export type CompleteLessonInput = {
  sessionId: Scalars['String']['input']
}

export type CompleteLessonPayload = {
  __typename?: 'CompleteLessonPayload'
  completedAt: Scalars['DateTime']['output']
  deckId?: Maybe<Scalars['String']['output']>
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
  dueCount: Scalars['Int']['output']
  learnedCount: Scalars['Int']['output']
  nextDueAt?: Maybe<Scalars['DateTime']['output']>
  practicedCount: Scalars['Int']['output']
  toLearnCount: Scalars['Int']['output']
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

export type DisableAudioOnlyInput = {
  cardId: Scalars['String']['input']
  sessionId: Scalars['String']['input']
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
  memberCount?: Maybe<Scalars['Int']['output']>
  membersPreview: Array<GroupMemberPreview>
  myRole?: Maybe<GroupRole>
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
  groupName?: Maybe<Scalars['String']['output']>
  id: Scalars['String']['output']
  invitedByEmail?: Maybe<Scalars['String']['output']>
  invitedById: Scalars['String']['output']
  memberCount?: Maybe<Scalars['Int']['output']>
  sharedDeckCount?: Maybe<Scalars['Int']['output']>
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

export type GroupMemberPreview = {
  __typename?: 'GroupMemberPreview'
  initials: Scalars['String']['output']
  userId: Scalars['String']['output']
}

export enum GroupRole {
  Admin = 'ADMIN',
  Member = 'MEMBER',
  Owner = 'OWNER',
}

export type HomeLearningProgress = {
  __typename?: 'HomeLearningProgress'
  activeTargetLanguage?: Maybe<Scalars['String']['output']>
  dueCount: Scalars['Int']['output']
  learnedCount: Scalars['Int']['output']
  practicedCount: Scalars['Int']['output']
  toLearnCount: Scalars['Int']['output']
  totalCardCount: Scalars['Int']['output']
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

export enum LearningGroup {
  Learned = 'LEARNED',
  Practiced = 'PRACTICED',
  ToLearn = 'TO_LEARN',
}

export type LessonCard = {
  __typename?: 'LessonCard'
  back: Scalars['String']['output']
  cardId: Scalars['String']['output']
  deckId: Scalars['String']['output']
  example?: Maybe<Scalars['String']['output']>
  front: Scalars['String']['output']
  learningGroup: LearningGroup
  learningStep: Scalars['Int']['output']
  notes?: Maybe<Scalars['String']['output']>
  position: Scalars['Int']['output']
  presentationMode: ReviewPresentationMode
  reviewState: CardReviewState
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
  deleteAccount: Scalars['Boolean']['output']
  deleteCard: Scalars['Boolean']['output']
  deleteDeck: Scalars['Boolean']['output']
  disableAudioOnly: LessonCard
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
  startHomeLesson: StartLessonPayload
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

export type MutationDisableAudioOnlyArgs = {
  input: DisableAudioOnlyInput
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

export type MutationStartHomeLessonArgs = {
  input: StartHomeLessonInput
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
  checkCardDuplicates: CheckCardDuplicatesPayload
  deck: Deck
  deckCards: Array<Card>
  deckLearningStats: DeckLearningStats
  decksPage: DecksPageResult
  group: Group
  groupSharedDecks: Array<Deck>
  homeLearningProgress: HomeLearningProgress
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

export type QueryCheckCardDuplicatesArgs = {
  input: CheckCardDuplicatesInput
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

export enum ReviewPresentationMode {
  SourceText = 'SOURCE_TEXT',
  TargetAudioOnly = 'TARGET_AUDIO_ONLY',
  TargetText = 'TARGET_TEXT',
  TargetTextAudio = 'TARGET_TEXT_AUDIO',
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

export type StartHomeLessonInput = {
  lessonSize?: InputMaybe<Scalars['Int']['input']>
}

export type StartLessonInput = {
  deckId: Scalars['String']['input']
  lessonSize?: InputMaybe<Scalars['Int']['input']>
}

export type StartLessonPayload = {
  __typename?: 'StartLessonPayload'
  cards: Array<LessonCard>
  deckId?: Maybe<Scalars['String']['output']>
  lessonSize: Scalars['Int']['output']
  scope: StudySessionScope
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

export enum StudySessionScope {
  Deck = 'DECK',
  HomeActiveTarget = 'HOME_ACTIVE_TARGET',
}

export type SubmitReviewInput = {
  answer: ReviewAnswer
  cardId: Scalars['String']['input']
  sessionId: Scalars['String']['input']
}

export type SubmitReviewPayload = {
  __typename?: 'SubmitReviewPayload'
  cardId: Scalars['String']['output']
  nextCard?: Maybe<LessonCard>
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
