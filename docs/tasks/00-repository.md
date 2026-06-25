# EPIC-00 Repository & Tooling Foundation

## Epic Goal

Initialize the Flashcards monorepo and prepare the basic repository foundation for backend, frontend, shared packages, documentation, formatting, linting, and future task execution.

This epic does not implement product features.

It prepares the workspace so future backend/frontend/domain work can be implemented safely and consistently.

## Epic Status

TODO

## Related Documents

Cursor should read these documents before working on tasks in this epic:

```txt
docs/architecture.md
docs/backend-clean-architecture.md
docs/tasks/README.md
docs/tasks/cursor-task-template.md
```

These documents are not required for implementation yet, but must exist before feature work starts:

```txt
docs/algorithms/sm-2.md
docs/domain/auth-token-strategy.md
docs/domain/permissions.md
docs/domain/lesson-flow.md
docs/security/security-checklist.md
```

## Epic Prerequisites

None.

This is the first implementation epic.

## Epic Rules

```txt
1. Keep the repository minimal.
2. Do not implement product features.
3. Do not add backend domain modules yet.
4. Do not add frontend app yet unless explicitly requested in later epics.
5. Do not add secrets.
6. Do not commit .env files.
7. Keep all root scripts cross-platform where possible.
8. Every task must pass required checks before commit.
```

## Target Repository Structure

Final repository root should start with:

```txt
flashcards/
  apps/
  packages/
  docs/
  package.json
  pnpm-workspace.yaml
  tsconfig.base.json
  eslint.config.mjs
  .prettierrc
  .prettierignore
  .gitignore
  .gitattributes
```

Expected future structure:

```txt
apps/
  api/
  mobile/

packages/
  srs/
  shared/
  validation/
  graphql/

docs/
  architecture.md
  backend-clean-architecture.md
  algorithms/
  domain/
  security/
  tasks/
```

## Epic Summary

```md
- [x] TASK-00.01 Initialize pnpm monorepo
- [x] TASK-00.02 Add root TypeScript config
- [ ] TASK-00.03 Add Prettier config
- [ ] TASK-00.04 Add ESLint config
- [ ] TASK-00.05 Add Git ignore and line ending config
- [ ] TASK-00.06 Create base repository folders
- [ ] TASK-00.07 Add required documentation folders
- [ ] TASK-00.08 Add root scripts
- [ ] TASK-00.09 Run repository foundation checks
```

---

# TASK-00.01 Initialize pnpm monorepo

## Status

DONE

## Context

The project uses a monorepo so backend, frontend, shared packages, and documentation can live in one repository.

## Goal

Initialize the root pnpm workspace.

## Files to Create

```txt
package.json
pnpm-workspace.yaml
```

## Requirements

Create root `package.json`.

Required properties:

```json
{
  "name": "flashcards",
  "version": "0.1.0",
  "private": true,
  "packageManager": "pnpm@<your-installed-version>"
}
```

Create `pnpm-workspace.yaml`:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

## Architecture Constraints

```txt
- Root package must be private.
- Do not add application dependencies to root.
- Root dependencies should be only workspace tooling.
```

## Do Not Do

```txt
- Do not create backend app yet.
- Do not create frontend app yet.
- Do not install NestJS here.
- Do not install Expo here.
```

## Acceptance Criteria

```txt
- package.json exists.
- pnpm-workspace.yaml exists.
- Root package is private.
- Workspace includes apps/* and packages/*.
- pnpm install works.
```

## Commands to Run

```bash
pnpm install
pnpm --version
```

## Expected Commit Message

```txt
chore(repo): initialize pnpm workspace
```

---

# TASK-00.02 Add root TypeScript config

## Status

DONE

## Context

Backend, frontend, and shared packages need a shared TypeScript baseline.

Each app/package can extend this base config later.

## Goal

Create root TypeScript base configuration.

## Files to Create

```txt
tsconfig.base.json
```

## Requirements

Create `tsconfig.base.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "baseUrl": ".",
    "paths": {
      "@flashcards/shared": ["packages/shared/src/index.ts"],
      "@flashcards/srs": ["packages/srs/src/index.ts"],
      "@flashcards/validation": ["packages/validation/src/index.ts"],
      "@flashcards/graphql": ["packages/graphql/src/index.ts"]
    }
  }
}
```

## Architecture Constraints

```txt
- Keep the base config strict.
- Individual apps may override module/moduleResolution if required.
- Do not add app-specific compiler options here.
```

## Do Not Do

```txt
- Do not create package source files yet.
- Do not disable strict mode.
```

## Acceptance Criteria

```txt
- tsconfig.base.json exists.
- TypeScript strict mode is enabled.
- Shared package path aliases are defined.
```

## Commands to Run

```bash
pnpm format:check
```

If `format:check` does not exist yet, run it after TASK-00.03.

## Expected Commit Message

```txt
chore(repo): add root TypeScript config
```

---

# TASK-00.03 Add Prettier config

## Status

TODO

## Context

All apps and packages should use the same formatting rules.

## Goal

Add root Prettier config and ignore file.

## Files to Create

```txt
.prettierrc
.prettierignore
```

## Requirements

Create `.prettierrc`:

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}
```

Create `.prettierignore`:

```txt
node_modules
dist
build
coverage
.next
.expo
.turbo
pnpm-lock.yaml
```

Install Prettier:

```bash
pnpm add -Dw prettier
```

Add root scripts:

```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

## Architecture Constraints

```txt
- Formatting should be configured at root.
- Do not add separate Prettier configs per app unless absolutely required.
```

## Do Not Do

```txt
- Do not format generated files if they are ignored.
- Do not include node_modules or build outputs.
```

## Acceptance Criteria

```txt
- .prettierrc exists.
- .prettierignore exists.
- Root format script exists.
- Root format:check script exists.
- pnpm format:check passes.
```

## Commands to Run

```bash
pnpm format:check
```

## Expected Commit Message

```txt
chore(repo): add Prettier config
```

---

# TASK-00.04 Add ESLint config

## Status

TODO

## Context

The repository needs root linting for TypeScript and JavaScript files.

Backend and frontend may add specialized linting later, but root linting should catch common issues.

## Goal

Add root ESLint flat config.

## Files to Create

```txt
eslint.config.mjs
```

## Files to Modify

```txt
package.json
```

## Requirements

Install dependencies:

```bash
pnpm add -Dw eslint @eslint/js typescript-eslint
```

Create `eslint.config.mjs`:

```js
import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/.expo/**',
      '**/.next/**',
      '**/.turbo/**',
      '**/generated/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
]
```

Add root scripts:

```json
{
  "scripts": {
    "lint": "eslint \"apps/**/*.{ts,tsx,js,jsx}\" \"packages/**/*.{ts,tsx,js,jsx}\" --ignore-pattern \"**/dist/**\" --ignore-pattern \"**/node_modules/**\"",
    "lint:fix": "pnpm lint --fix"
  }
}
```

If the `packages` folder is empty and ESLint errors because no files match, temporarily use only `apps/**/*` until packages exist.

## Architecture Constraints

```txt
- Build outputs must be ignored.
- Generated files must be ignored.
- Root lint should not lint node_modules, dist, build, .expo, .next, .turbo.
```

## Do Not Do

```txt
- Do not lint dist output.
- Do not make lint depend on generated code that does not exist yet.
```

## Acceptance Criteria

```txt
- eslint.config.mjs exists.
- Root lint script exists.
- Root lint:fix script exists.
- pnpm lint works when source files exist.
```

## Commands to Run

```bash
pnpm lint
```

## Expected Commit Message

```txt
chore(repo): add ESLint config
```

---

# TASK-00.05 Add Git ignore and line ending config

## Status

TODO

## Context

The repository should not commit dependencies, build artifacts, local env files, or OS/editor noise.

Line endings should be predictable across Windows/Linux/macOS.

## Goal

Add `.gitignore` and `.gitattributes`.

## Files to Create

```txt
.gitignore
.gitattributes
```

## Requirements

Create `.gitignore`:

```txt
node_modules/
dist/
build/
coverage/

.env
.env.local
.env.*.local

.DS_Store
Thumbs.db

.idea/
.vscode/

.expo/
.next/
.turbo/

apps/*/dist/
apps/*/build/
packages/*/dist/
```

Create `.gitattributes`:

```txt
* text=auto

*.ts text eol=lf
*.tsx text eol=lf
*.js text eol=lf
*.jsx text eol=lf
*.json text eol=lf
*.yaml text eol=lf
*.yml text eol=lf
*.md text eol=lf
*.prisma text eol=lf
```

## Security Requirements

```txt
- .env files must be ignored.
- .env.example files must not be ignored.
```

## Do Not Do

```txt
- Do not ignore documentation files.
- Do not ignore .env.example.
- Do not commit real secrets.
```

## Acceptance Criteria

```txt
- .gitignore exists.
- .gitattributes exists.
- Local env files are ignored.
- .env.example remains trackable.
```

## Commands to Run

```bash
git status
```

## Expected Commit Message

```txt
chore(repo): add git ignore and attributes
```

---

# TASK-00.06 Create base repository folders

## Status

TODO

## Context

The monorepo needs stable root folders for apps, packages, and documentation.

## Goal

Create base folders.

## Folders to Create

```txt
apps/
packages/
docs/
```

Optional placeholders:

```txt
apps/.gitkeep
packages/.gitkeep
```

## Requirements

Create the folders:

```bash
mkdir apps
mkdir packages
mkdir docs
```

On PowerShell:

```powershell
New-Item -ItemType Directory apps
New-Item -ItemType Directory packages
New-Item -ItemType Directory docs
```

If Git does not track empty folders, add `.gitkeep` files.

## Architecture Constraints

```txt
- apps/ contains deployable applications.
- packages/ contains shared internal packages.
- docs/ contains architecture, domain, security, task, and release docs.
```

## Do Not Do

```txt
- Do not create apps/api yet.
- Do not create apps/mobile yet.
- Do not create package source files yet.
```

## Acceptance Criteria

```txt
- apps/ exists.
- packages/ exists.
- docs/ exists.
- Empty folders are trackable if needed.
```

## Commands to Run

```bash
git status
```

## Expected Commit Message

```txt
chore(repo): create base workspace folders
```

---

# TASK-00.07 Add required documentation folders

## Status

TODO

## Context

Before implementation starts, documentation should have a predictable structure.

Some files will be created in later documentation tasks, but folders should exist early.

## Goal

Create documentation folders for architecture, algorithms, domain rules, security, testing, API conventions, frontend architecture, and task files.

## Folders to Create

```txt
docs/algorithms/
docs/domain/
docs/security/
docs/testing/
docs/api/
docs/frontend/
docs/tasks/
```

Optional placeholders:

```txt
docs/algorithms/.gitkeep
docs/domain/.gitkeep
docs/security/.gitkeep
docs/testing/.gitkeep
docs/api/.gitkeep
docs/frontend/.gitkeep
docs/tasks/.gitkeep
```

## Required Source-of-Truth Files

These files must be created before feature implementation starts:

```txt
docs/algorithms/sm-2.md
docs/domain/auth-token-strategy.md
docs/domain/permissions.md
docs/domain/lesson-flow.md
docs/security/security-checklist.md
```

They may be generated before or after this task, but they must exist before implementing:

```txt
auth
SRS
lessons
permissions
groups
admin
deployment security
```

## Architecture Constraints

```txt
- Source-of-truth docs must live outside task files.
- Task files define implementation steps.
- Domain/security/algorithm docs define rules.
```

## Do Not Do

```txt
- Do not implement product code.
- Do not leave core specs only inside task files.
```

## Acceptance Criteria

```txt
- Required documentation folders exist.
- docs/tasks/ folder exists.
- Core source-of-truth file paths are reserved.
```

## Commands to Run

```bash
git status
```

## Expected Commit Message

```txt
chore(docs): create documentation folders
```

---

# TASK-00.08 Add root scripts

## Status

TODO

## Context

Common root commands should exist so the project can be checked consistently from the repository root.

## Goal

Add useful root scripts to `package.json`.

## Files to Modify

```txt
package.json
```

## Requirements

Root scripts should include:

```json
{
  "scripts": {
    "dev:api": "pnpm --filter @flashcards/api start:dev",
    "build:api": "pnpm --filter @flashcards/api build",
    "dev:app": "pnpm --filter @flashcards/mobile start",
    "build:web": "pnpm --filter @flashcards/mobile build:web",
    "lint": "eslint \"apps/**/*.{ts,tsx,js,jsx}\" \"packages/**/*.{ts,tsx,js,jsx}\" --ignore-pattern \"**/dist/**\" --ignore-pattern \"**/node_modules/**\"",
    "lint:fix": "pnpm lint --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "typecheck": "pnpm --filter @flashcards/mobile typecheck",
    "test": "pnpm -r test",
    "check:api": "pnpm --filter @flashcards/api build",
    "db:validate": "pnpm --filter @flashcards/api prisma:validate",
    "db:generate": "pnpm --filter @flashcards/api prisma:generate",
    "db:migrate:deploy": "pnpm --filter @flashcards/api prisma:migrate:deploy"
  }
}
```

If some packages do not exist yet, scripts can be added later or may fail until corresponding apps are created.

Minimum scripts for this epic:

```json
{
  "scripts": {
    "lint": "eslint \"apps/**/*.{ts,tsx,js,jsx}\" \"packages/**/*.{ts,tsx,js,jsx}\" --ignore-pattern \"**/dist/**\" --ignore-pattern \"**/node_modules/**\"",
    "lint:fix": "pnpm lint --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

## Architecture Constraints

```txt
- Root scripts should delegate to packages/apps.
- Root should not contain app source code.
```

## Do Not Do

```txt
- Do not add scripts that require apps before they exist unless marked future-use.
- Do not add real env values in scripts.
```

## Acceptance Criteria

```txt
- Root package.json has basic check scripts.
- format:check works.
- lint works once source files exist.
```

## Commands to Run

```bash
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
chore(repo): add root workspace scripts
```

---

# TASK-00.09 Run repository foundation checks

## Status

TODO

## Context

After repository setup, the workspace should be checked and committed.

## Goal

Run final checks for repository foundation.

## Requirements

Run:

```bash
pnpm install
pnpm format:check
pnpm lint
git status
```

If `pnpm lint` fails only because no source files exist yet, either:

```txt
- adjust lint script temporarily
- or add .gitkeep placeholders only and run lint later after apps/packages exist
```

Do not ignore real lint errors.

## Do Not Do

```txt
- Do not add backend app.
- Do not add frontend app.
- Do not add product features.
```

## Acceptance Criteria

```txt
- pnpm install works.
- pnpm format:check passes.
- pnpm lint passes or is clearly deferred because no source files exist.
- git status shows only expected files.
- Commit is created.
```

## Commands to Run

```bash
pnpm install
pnpm format:check
pnpm lint
git status
git add .
git commit -m "chore(repo): initialize repository foundation"
```

## Expected Commit Message

```txt
chore(repo): initialize repository foundation
```

---

## Epic Completion Criteria

EPIC-00 is complete when:

```txt
- pnpm workspace is initialized.
- Root package.json exists and is private.
- pnpm-workspace.yaml exists.
- tsconfig.base.json exists.
- Prettier is configured.
- ESLint is configured.
- .gitignore exists.
- .gitattributes exists.
- apps/ exists.
- packages/ exists.
- docs/ exists.
- docs/tasks/ exists.
- docs/algorithms/ exists.
- docs/domain/ exists.
- docs/security/ exists.
- Root format/check scripts exist.
- No real secrets are committed.
- Repository foundation is committed.
```

After this epic is complete, move to:

```txt
docs/tasks/01-backend-foundation.md
```
