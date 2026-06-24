Accessibility linting (jsx-a11y)

What I changed

- Added `aria-label` / `title` to many icon-only interactive elements.
- Defaulted `Icon` wrapper to `aria-hidden` when decorative.
- Committed changes on branch `chore/a11y-icon-aria-labels`.

Why ESLint didn't enable automatically

- Attempting to enable `plugin:jsx-a11y/recommended` via the repository's `eslint.config.js` (FlatCompat) caused a runtime error in `@eslint/eslintrc` during config resolution (circular-config JSON error). This appears to be a compatibility issue between the flat config approach and certain shareable configs/plugins in the installed node_modules.

Recommended safe approach to enable jsx-a11y

1. Add the plugin as a dev dependency (if you decide to proceed):

```bash
npm install -D eslint-plugin-jsx-a11y
```

2. Prefer using a legacy `.eslintrc.json` for enabling the plugin (isolated, easy to revert). Example:

```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:jsx-a11y/recommended"
  ],
  "plugins": ["jsx-a11y"],
  "rules": {
    "jsx-a11y/alt-text": "warn",
    "jsx-a11y/click-events-have-key-events": "warn",
    "jsx-a11y/interactive-supports-focus": "warn"
  }
}
```

3. Run ESLint in a clean environment (CI or a fresh npm install) to validate. If you hit the same circular-config error, try one of the following:

- Use a dedicated CI job that installs only the dependencies required for linting (isolates dev deps).
- Upgrade/downgrade `eslint` / `eslint-config-next` to versions known to be compatible, then re-run `npm install`.

4. If you want, I can attempt the dependency-tuning approach (upgrade/downgrade) and enable the plugin in `eslint.config.js`. This is more invasive and may touch other dev dependencies.

Next recommended step

- Merge the accessibility changes now (PR from `chore/a11y-icon-aria-labels`). Then enable `jsx-a11y` in a follow-up change that also updates/locks dev dependencies so CI and local dev environments stay stable.

If you'd like me to attempt the dependency fix and enable jsx-a11y automatically, say "proceed with dependency fix" and I'll start by testing compatible `eslint` and `eslint-config-next` versions locally.
