# MVP Smoke Test Checklist

Repeatable manual smoke tests for Flashcards MVP before release.

Use this checklist for:

```txt
- local development verification
- production verification after deployment
```

Do not record real passwords, API keys, or production secrets in this document.

## Environment Placeholders

Set these before running tests:

```txt
API_BASE_URL=http://localhost:3000
GRAPHQL_URL=http://localhost:3000/graphql
WEB_APP_URL=http://localhost:8081
INTERNAL_JOB_URL=http://localhost:3000/internal/jobs/due-card-reminders
INTERNAL_JOB_SECRET=<local-internal-job-secret>
```

Production example:

```txt
API_BASE_URL=https://<render-api-host>
GRAPHQL_URL=https://<render-api-host>/graphql
WEB_APP_URL=https://<vercel-web-host>
INTERNAL_JOB_URL=https://<render-api-host>/internal/jobs/due-card-reminders
INTERNAL_JOB_SECRET=<production-internal-job-secret>
```

## Test Accounts (Placeholders)

Create fresh accounts during smoke testing or use local-only demo accounts:

```txt
Primary user email: test-user@example.com
Primary user password: <local-test-password>

Second user email: test-user-2@example.com
Second user password: <local-test-password>

Admin email: admin-user@example.com
Admin password: <local-test-password>
```

Rules:

```txt
- Use placeholder values only in notes and screenshots.
- Do not commit real credentials.
- For email verification/password reset in production, use a mailbox you control.
```

## How To Record Results

For each test:

```txt
- [ ] PASS
- [ ] FAIL
```

If FAIL, record:

```txt
- environment (local/production)
- steps attempted
- expected vs actual result
- relevant logs or screenshots (without secrets)
```

---

## 1. Health Endpoint

**Goal:** Verify backend process is alive.

**Steps:**

1. Send `GET {API_BASE_URL}/health`.

**Expected result:**

```txt
- HTTP 200
- JSON includes "status": "ok"
- Response does not expose secrets or DATABASE_URL
```

**Result:** - [ ] PASS - [ ] FAIL

---

## 2. GraphQL Endpoint Reachability

**Goal:** Verify GraphQL transport is available.

**Steps:**

1. Open GraphQL playground only in non-production, or send a simple POST to `{GRAPHQL_URL}`.
2. Run query:

```graphql
query {
  __typename
}
```

**Expected result:**

```txt
- GraphQL responds successfully
- No stack traces or internal error details in production
```

**Result:** - [ ] PASS - [ ] FAIL

---

## 3. Registration

**Goal:** Verify a new user can register.

**Steps:**

1. Open `{WEB_APP_URL}`.
2. Go to sign up.
3. Register with `test-user@example.com` and `<local-test-password>`.

**Expected result:**

```txt
- Registration succeeds
- User is signed in or prompted for email verification depending on config
- No secrets appear in UI or network responses
```

**Result:** - [ ] PASS - [ ] FAIL

---

## 4. Login

**Goal:** Verify existing user can sign in.

**Steps:**

1. Sign out if already signed in.
2. Sign in with `test-user@example.com` and `<local-test-password>`.

**Expected result:**

```txt
- Login succeeds
- App navigates to authenticated area
- Invalid credentials show a safe generic error
```

**Result:** - [ ] PASS - [ ] FAIL

---

## 5. Logout

**Goal:** Verify session can be cleared.

**Steps:**

1. While signed in, use logout from profile/settings/auth flow.
2. Try opening a protected screen.

**Expected result:**

```txt
- User is logged out locally
- Protected routes require sign in again
```

**Result:** - [ ] PASS - [ ] FAIL

---

## 6. Refresh Session

**Goal:** Verify access token refresh works after expiry or forced retry.

**Steps:**

1. Sign in on web.
2. Wait for access token expiry or trigger a protected request that returns UNAUTHENTICATED once.
3. Retry a protected action such as opening decks.

**Expected result:**

```txt
- App refreshes session once and retries successfully, or
- App safely signs out if refresh token is unavailable
- No tokens are stored in localStorage
```

**Result:** - [ ] PASS - [ ] FAIL

---

## 7. Email Verification

**Goal:** Verify email verification flow works.

**Steps:**

1. Register a new user with an email you can access, or use dev email capture locally.
2. Open verification link or submit verification token through supported UI/API flow.
3. Confirm account becomes verified.

**Expected result:**

```txt
- Verification succeeds
- Verified user can use authenticated flows that require verification
- Invalid/expired token fails safely
```

**Result:** - [ ] PASS - [ ] FAIL

---

## 8. Password Reset

**Goal:** Verify password reset request and completion.

**Steps:**

1. Request password reset for `test-user@example.com`.
2. Open reset link or use reset token from dev mailbox.
3. Set a new placeholder password and sign in.

**Expected result:**

```txt
- Reset request succeeds without revealing whether email exists
- New password works
- Old refresh sessions are invalidated if applicable
```

**Result:** - [ ] PASS - [ ] FAIL

---

## 9. Create Deck

**Goal:** Verify deck creation.

**Steps:**

1. Sign in.
2. Create a deck with title `Smoke Test Deck`.

**Expected result:**

```txt
- Deck appears in My Decks
- Deck detail opens successfully
```

**Result:** - [ ] PASS - [ ] FAIL

---

## 10. Edit Deck

**Goal:** Verify deck update.

**Steps:**

1. Open `Smoke Test Deck`.
2. Edit title to `Smoke Test Deck Updated`.
3. Save.

**Expected result:**

```txt
- Updated title persists after reload
```

**Result:** - [ ] PASS - [ ] FAIL

---

## 11. Delete Deck

**Goal:** Verify deck deletion.

**Steps:**

1. Create a disposable deck.
2. Delete it from deck detail or list action.

**Expected result:**

```txt
- Deck disappears from My Decks
- Deleted deck is no longer accessible
```

**Result:** - [ ] PASS - [ ] FAIL

---

## 12. Create Card

**Goal:** Verify card creation inside a deck.

**Steps:**

1. Open a deck owned by the signed-in user.
2. Add a card with front `hello` and back `hola`.

**Expected result:**

```txt
- Card appears in deck card list
- Card detail/edit view shows saved values
```

**Result:** - [ ] PASS - [ ] FAIL

---

## 13. Edit Card

**Goal:** Verify card update.

**Steps:**

1. Edit the card back text to `hola mundo`.
2. Save.

**Expected result:**

```txt
- Updated card content persists after reload
```

**Result:** - [ ] PASS - [ ] FAIL

---

## 14. Delete Card

**Goal:** Verify card deletion.

**Steps:**

1. Create a disposable card.
2. Delete it.

**Expected result:**

```txt
- Card disappears from deck
- Card is no longer accessible
```

**Result:** - [ ] PASS - [ ] FAIL

---

## 15. Publish Deck

**Goal:** Verify a private deck can be submitted for public visibility.

**Steps:**

1. Open an owned deck with at least one card.
2. Publish/submit deck for public visibility.

**Expected result:**

```txt
- Deck publish action succeeds
- Deck status reflects public/moderation state correctly
```

**Result:** - [ ] PASS - [ ] FAIL

---

## 16. Public Deck Search

**Goal:** Verify public deck discovery.

**Steps:**

1. Sign in or browse as allowed public user.
2. Open public decks screen.
3. Search for a known public deck title.

**Expected result:**

```txt
- Public deck list loads
- Known public deck appears in results or browse list
```

**Result:** - [ ] PASS - [ ] FAIL

---

## 17. Copy Public Deck

**Goal:** Verify copying a public deck into My Decks.

**Steps:**

1. Open a public deck.
2. Copy it to your account.

**Expected result:**

```txt
- Copy succeeds
- Copied deck appears in My Decks
- Copied cards are available in the new deck
```

**Result:** - [ ] PASS - [ ] FAIL

---

## 18. CSV Preview

**Goal:** Verify CSV import preview.

**Steps:**

1. Open CSV import for an owned deck.
2. Upload a small valid CSV sample.
3. Run preview.

**Expected result:**

```txt
- Preview shows parsed rows/cards
- Validation errors are shown safely for invalid rows
```

**Result:** - [ ] PASS - [ ] FAIL

---

## 19. CSV Confirm Import

**Goal:** Verify CSV import confirmation.

**Steps:**

1. Continue from CSV preview with valid rows.
2. Confirm import.

**Expected result:**

```txt
- Import completes successfully
- Imported cards appear in the deck
```

**Result:** - [ ] PASS - [ ] FAIL

---

## 20. AI Example Generation

**Goal:** Verify AI example generation or safe mock fallback.

**Steps:**

1. Open a card in an owned deck.
2. Trigger AI example generation.

**Expected result:**

```txt
- Request succeeds
- Example content is shown or safe mock behavior is used
- No provider secrets appear in UI or errors
```

**Result:** - [ ] PASS - [ ] FAIL

---

## 21. Start Lesson

**Goal:** Verify lesson session can begin for a deck.

**Steps:**

1. Open an owned deck with cards.
2. Start a lesson.

**Expected result:**

```txt
- Lesson session is created
- First review card is shown
```

**Result:** - [ ] PASS - [ ] FAIL

---

## 22. Submit KNOW Review

**Goal:** Verify KNOW review submission.

**Steps:**

1. During an active lesson, submit `KNOW` for the current card.

**Expected result:**

```txt
- Review is accepted
- App advances to next card or lesson completion state
```

**Result:** - [ ] PASS - [ ] FAIL

---

## 23. Submit DONT_KNOW Review

**Goal:** Verify DONT_KNOW review submission.

**Steps:**

1. Start or continue a lesson.
2. Submit `DONT_KNOW` for the current card.

**Expected result:**

```txt
- Review is accepted
- Card scheduling updates without errors
- App advances correctly
```

**Result:** - [ ] PASS - [ ] FAIL

---

## 24. Complete Lesson

**Goal:** Verify lesson completion summary.

**Steps:**

1. Finish all cards in a lesson session.
2. Open lesson summary/completion screen.

**Expected result:**

```txt
- Lesson completes successfully
- Summary/stats screen loads
- Session is no longer active
```

**Result:** - [ ] PASS - [ ] FAIL

---

## 25. Update Settings

**Goal:** Verify profile/settings updates.

**Steps:**

1. Open settings.
2. Update lesson size, timezone, and reminder hour.
3. Save settings.

**Expected result:**

```txt
- Settings save successfully
- Reloaded settings show updated values
- Invalid values are rejected safely
```

**Result:** - [ ] PASS - [ ] FAIL

---

## 26. Register Push Token (If Supported)

**Goal:** Verify push token registration on supported platforms.

**Steps:**

1. On a supported native/dev environment, enable notifications in settings if required.
2. Trigger push token registration flow.

**Expected result:**

```txt
- Token registration succeeds on supported platform, or
- Web/local unsupported path fails gracefully without breaking settings
```

**Result:** - [ ] PASS - [ ] FAIL - [ ] N/A

---

## 27. Internal Reminder Endpoint Secret Rejection

**Goal:** Verify internal job endpoint is protected.

**Steps:**

1. Run:

```bash
curl -i -X POST "$INTERNAL_JOB_URL"
```

1. Run with invalid secret:

```bash
curl -i -X POST "$INTERNAL_JOB_URL" \
  -H "x-internal-job-secret: invalid-secret"
```

**Expected result:**

```txt
- Missing secret is rejected
- Invalid secret is rejected
- Response does not expose secret values or stack traces in production
```

**Result:** - [ ] PASS - [ ] FAIL

---

## 28. Internal Reminder Endpoint Valid Secret

**Goal:** Verify due-card reminder job runs with valid secret.

**Steps:**

1. Run:

```bash
curl -fsS -X POST "$INTERNAL_JOB_URL" \
  -H "x-internal-job-secret: $INTERNAL_JOB_SECRET"
```

**Expected result:**

```txt
- HTTP success response
- JSON includes job counters such as checkedUsers/notifiedUsers
- No secrets are printed in response
```

**Result:** - [ ] PASS - [ ] FAIL

---

## 29. Groups Flow (If Enabled)

**Goal:** Verify basic groups and sharing flow.

**Steps:**

1. Sign in as primary user.
2. Create a group.
3. Invite `test-user-2@example.com`.
4. Sign in as second user and accept invitation.
5. Share an owned deck with the group.

**Expected result:**

```txt
- Group is created
- Invitation can be accepted
- Shared deck is visible to group member
```

**Result:** - [ ] PASS - [ ] FAIL - [ ] N/A

---

## 30. Admin / Moderation Flow (If Enabled)

**Goal:** Verify admin or moderator access to moderation tools.

**Steps:**

1. Sign in as `admin-user@example.com` or a moderator account.
2. Open admin dashboard.
3. Review moderation queue for a submitted public deck.
4. Approve, reject, or hide a test deck as appropriate.

**Expected result:**

```txt
- Admin/moderator screens are accessible for authorized role
- Moderation action succeeds
- Non-admin user cannot access admin routes/actions
```

**Result:** - [ ] PASS - [ ] FAIL - [ ] N/A

---

## Final Sign-Off

```txt
Tester: <name>
Date: <yyyy-mm-dd>
Environment: local / production
Overall result: PASS / FAIL
Notes: <short summary without secrets>
```
