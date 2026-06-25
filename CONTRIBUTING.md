# Contributing to TradeFlow-Web

Thank you for your interest in contributing! Please follow the guidelines below to keep our codebase clean and consistent.

---

## Commit Message Convention

This project enforces [Conventional Commits](https://www.conventionalcommits.org/) using **Commitlint** and **Husky**.

Every commit message must follow this format:

\`\`\`
type(scope): subject
\`\`\`

### Examples

\`\`\`
feat: add wallet modal
fix(api): resolve CORS issue
chore: update dependencies
docs: update README setup steps
refactor(auth): simplify token validation logic
test(dashboard): add unit tests for chart component
\`\`\`

### Allowed Types

| Type     | Description                               |
| -------- | ----------------------------------------- |
| feat     | A new feature                             |
| fix      | A bug fix                                 |
| chore    | Maintenance tasks (deps, config, tooling) |
| docs     | Documentation changes only                |
| refactor | Code change that is not a fix or feature  |
| test     | Adding or updating tests                  |
| style    | Formatting, missing semicolons, etc.      |
| perf     | Performance improvements                  |
| ci       | CI/CD configuration changes               |
| build    | Changes affecting the build system        |

### Rules

- The type is **required**
- The subject is **required** and must not be empty
- Use **lowercase** for type and subject
- No period at the end of the subject line

Commits that do not follow this format will be **rejected** by the commit hook.

---

## Running Locally

\`\`\`bash
npm install
npm run dev
\`\`\`

---

## Pull Request Guidelines

- Branch off from main
- Keep PRs focused and small
- Reference the related issue in your PR description (e.g., Closes #259)
