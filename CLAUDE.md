# Claude Code Instructions

## Commit Rules (ЗАВЖДИ, без винятків)

Every commit must:

1. Have format: `TASK-XX.XX <title>` — де XX.XX — номер таски і епіку
2. Include the updated epic doc file (`docs/tasks/NN-name.md`) in the **same** commit
3. NOT include Claude as co-author

No exceptions — redesigns, bug fixes, tooling, config changes all follow this rule.

## Git Rebase Rules

Before any rebase:

- Run `git log --oneline -N` and save the list
- After rebase, immediately verify the count and content of commits

During rebase:

- For renaming: use `reword` in todo, then `git commit --amend -m "..."` for each stop — do NOT chain GIT_EDITOR through `--continue`
- For splitting a commit: `git reset HEAD~1`, save full file copies with `cp`, stage and commit in two separate steps
- Never start a second rebase while the first is unfinished — `git rebase --abort` first

After rebase — always run:

```
git log --oneline -10
git show --stat HEAD
```

## Do Not Push

Never push to remote unless explicitly asked.
