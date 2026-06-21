# Auth Token Strategy

## Purpose

This document defines how Flashcards handles authentication tokens across backend, mobile, and web clients.

This file is a source-of-truth document for auth implementation.

Relevant task files:

```txt
docs/tasks/02-auth.md
docs/tasks/03-email-verification-password-reset.md
docs/tasks/13-frontend-foundation.md
docs/tasks/14-frontend-auth.md
docs/tasks/20-deployment-mvp.md
```

## Core Principles

```txt
- Access tokens are short-lived.
- Refresh tokens are long-lived.
- Refresh tokens must be rotated.
- Raw refresh tokens must never be stored in the database.
- Token hashes may be stored.
- Tokens must not be logged.
- Access tokens must not be stored in localStorage.
- Backend is the source of truth for sessions.
```

## Token Types

Flashcards uses two token types:

```txt
Access token
Refresh token
```

## Access Token

Access token is a short-lived JWT.

Used for:

```txt
- authenticated GraphQL queries
- authenticated GraphQL mutations
- current user identification
```

Recommended MVP lifetime:

```txt
15 minutes
```

Access token payload:

```ts
export type AccessTokenPayload = {
  sub: string
  email: string
  role: 'USER' | 'MODERATOR' | 'ADMIN'
}
```

Rules:

```txt
- Access token is returned by login/register/refresh mutations.
- Access token is sent in Authorization header.
- Access token is stored in memory on frontend.
- Access token must not be persisted in localStorage.
- Access token must not be stored in SecureStore.
- Access token must not be logged.
```

Authorization header format:

```txt
Authorization: Bearer <access_token>
```

## Refresh Token

Refresh token is a long-lived random opaque token.

Recommended MVP lifetime:

```txt
30 days
```

Refresh token is used for:

```txt
- obtaining a new access token
- continuing a session after app restart
- session rotation
- logout
```

Rules:

```txt
- Refresh token must be cryptographically random.
- Refresh token must not be a JWT.
- Raw refresh token must never be stored in database.
- Only refresh token hash is stored.
- Refresh token is rotated on every refresh.
- Old refresh token is revoked after rotation.
- Refresh token is revoked on logout.
- All refresh tokens for user are revoked after password reset.
```

## Refresh Token Hashing

The backend stores only a hash of refresh tokens.

Required hashing strategy:

```txt
SHA-256 is enough for random opaque tokens.
```

Why SHA-256 is acceptable here:

```txt
- Refresh token is high entropy.
- Refresh token is randomly generated.
- Refresh token is not user-chosen.
- Token guessing is infeasible if token length is sufficient.
```

Do not use SHA-256 for passwords.

Passwords must use Argon2.

## Token Generation

Refresh token should be generated with Node crypto.

Recommended token length:

```txt
32 bytes minimum
```

Example output format:

```txt
base64url
```

Token generation requirements:

```txt
- Use crypto.randomBytes or equivalent.
- Do not use Math.random.
- Do not use predictable IDs.
- Do not include user email in raw token.
```

## Backend Storage Model

Refresh token table should store:

```txt
id
userId
tokenHash
expiresAt
revokedAt
createdAt
rotatedFromTokenId
userAgent optional
ipAddress optional
```

Database rules:

```txt
- tokenHash should be unique.
- revokedAt null means token is active.
- expiresAt must be checked.
- deleted/blocked users cannot refresh.
```

## Mobile Token Storage

Mobile app uses Expo React Native.

Mobile rules:

```txt
Access token:
- store in memory only

Refresh token:
- store in Expo SecureStore
```

Mobile login flow:

```txt
1. User logs in.
2. Backend returns accessToken and refreshToken.
3. App stores accessToken in memory.
4. App stores refreshToken in SecureStore.
5. Apollo sends accessToken in Authorization header.
```

Mobile app restart flow:

```txt
1. App starts.
2. App reads refreshToken from SecureStore.
3. App calls refreshToken mutation.
4. Backend rotates refresh token.
5. App stores new accessToken in memory.
6. App replaces stored refreshToken in SecureStore.
```

Mobile logout flow:

```txt
1. App calls logout mutation with current refreshToken.
2. Backend revokes refresh token.
3. App clears refreshToken from SecureStore.
4. App clears accessToken from memory.
5. App moves user to unauthenticated state.
```

If backend logout fails:

```txt
- frontend must still clear local tokens
- user must be logged out locally
```

## Web Token Storage

Web MVP rule:

```txt
Access token:
- store in memory only
```

For refresh token, preferred production strategy:

```txt
Refresh token:
- httpOnly secure cookie
```

However, if web cookie implementation is not ready in MVP, the web client must not use localStorage for access tokens.

Allowed MVP fallback:

```txt
- Web session may be shorter.
- Web can require login after refresh token is unavailable.
- Web must not store access token in localStorage.
```

Forbidden on web:

```txt
- localStorage access token
- localStorage refresh token
- sessionStorage refresh token
- logging tokens
```

## GraphQL Auth Flow

Auth mutations:

```txt
register(input): AuthPayload
login(input): AuthPayload
refreshToken(input): AuthPayload
logout(input): Boolean
me: SafeUser
```

Auth payload:

```ts
export type AuthPayload = {
  accessToken: string
  refreshToken: string
  user: SafeUser
}
```

If web httpOnly cookie strategy is implemented later:

```txt
- refreshToken may be omitted from GraphQL payload for web
- refresh token may be set as cookie by backend
- mobile can still receive refreshToken in payload
```

## Safe User Output

GraphQL must never return:

```txt
passwordHash
refreshTokenHash
emailVerificationTokenHash
passwordResetTokenHash
```

Safe user fields:

```txt
id
email
role
emailVerifiedAt
blockedAt
createdAt
updatedAt
```

## Refresh Token Rotation

Refresh mutation must:

```txt
1. Receive raw refresh token.
2. Hash received token.
3. Find active refresh token by hash.
4. Check token exists.
5. Check token is not revoked.
6. Check token is not expired.
7. Check user exists.
8. Check user is not blocked.
9. Revoke old refresh token.
10. Generate new refresh token.
11. Store new refresh token hash.
12. Return new access token and new refresh token.
```

If any validation fails:

```txt
- reject request
- do not reveal which exact token check failed
- do not rotate
```

## Logout

Logout must:

```txt
1. Receive current raw refresh token.
2. Hash token.
3. Find active token.
4. Revoke it if found.
5. Return success.
```

Logout should be idempotent:

```txt
- If token is already revoked, return success.
- If token is not found, return success or generic unauthorized depending on implementation.
```

Frontend must always clear local tokens after logout attempt.

## Password Reset Interaction

After successful password reset:

```txt
- update password hash
- revoke all active refresh tokens for that user
```

This forces all devices to log in again.

## Email Verification Interaction

For MVP:

```txt
- unverified users may log in
- user.emailVerifiedAt is returned
- frontend may show verification reminder
```

If stricter policy is enabled later:

```txt
- login can reject unverified users
- refresh can reject unverified users
```

This policy must be explicit in backend code and tests.

## Blocked User Interaction

Blocked users must not be able to:

```txt
- log in
- refresh token
- access protected GraphQL operations
```

If a user is blocked while already logged in:

```txt
- existing access token may work until expiry
- refresh must fail
- protected operations should check blockedAt if current user is loaded from database
```

## Apollo Client Rules

Apollo auth link must:

```txt
- read current access token from memory
- attach Authorization header if token exists
- not read access token from localStorage
```

On unauthorized response:

```txt
- try refresh once if refresh token exists
- retry original operation once
- if refresh fails, clear session
```

Avoid infinite refresh loops.

## Frontend Auth State

Frontend auth state should track:

```txt
isBootstrapping
isAuthenticated
accessToken
user
```

Refresh token should not be stored in React state unless necessary.

Mobile refresh token belongs in SecureStore.

## Security Checklist

Implementation must satisfy:

```txt
- Passwords are hashed with Argon2.
- Refresh tokens are random opaque tokens.
- Refresh tokens are stored only as hashes.
- Access tokens are short-lived.
- Refresh tokens rotate on refresh.
- Logout revokes refresh token.
- Password reset revokes all refresh tokens.
- Tokens are not logged.
- Sensitive fields are not returned through GraphQL.
- Access token is not persisted in localStorage.
- Refresh token is not persisted in localStorage.
```

## Tests Required

Backend tests should cover:

```txt
- register returns accessToken, refreshToken, safe user
- login with valid credentials succeeds
- login with invalid credentials fails
- refresh with valid token succeeds
- refresh rotates token
- old refresh token cannot be reused
- logout revokes token
- password reset revokes all refresh tokens
- blocked user cannot log in
- blocked user cannot refresh
- GraphQL me requires access token
- GraphQL me never returns sensitive fields
```

Frontend tests/manual checks should cover:

```txt
- login stores access token in memory
- mobile stores refresh token in SecureStore
- logout clears local session
- app bootstrap attempts refresh
- refresh failure logs user out
- access token is not in localStorage
```

## Cursor Implementation Rules

Cursor must read this document before implementing or modifying:

```txt
backend auth
frontend auth
token storage
Apollo auth link
logout
refresh token flow
password reset
admin blocking behavior
```

Implementation must follow this document exactly unless this document is explicitly updated.
