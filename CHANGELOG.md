# Changelog

## Unreleased

### Added

- `ImageAttachmentControl` Studio component with controlled `keep`, `replace`
  and `remove` intents, local file validation and consumer-provided labels.
- `AsyncOperationPanel` Studio component for one consumer-controlled operation
  with `idle`, `running`, `success`, `warning` and `error` states.
- `Button` Studio component with native button behavior, forwarded attributes,
  closed variant and size contracts, and scoped style hooks.
- `RelationshipGraph` Visitor component with deterministic graph normalization
  and layout, accessible node controls, pan/zoom controls and selection and
  activation callbacks.
- `FormStatus` root component with the closed `success`, `error`, `warning`
  and `info` tone contract.
- Persistent-by-default and browser-only timed status dismissal with prop-reset,
  hydration and cleanup coverage.
- Deterministic `alert`/assertive semantics for errors and `status`/polite
  semantics for all other FormStatus tones.
- Scoped FormStatus styling through neutral `--giu-form-status-*` tokens.
- `SocialIcon` root component with a closed five-identifier registry.
- Distinct GitHub brand and GitHub Sponsors heart glyphs.
- Decorative and informative accessibility modes.
- Deterministic SSR and DOM-reusing hydration coverage.
- Vendored SVG geometry with third-party license and trademark notices.
- Packed-consumer tree-shaking evidence for registry-only imports.
- Production-safe handling of invalid runtime identifiers.
- Private-incubation Svelte package scaffold.
- Empty and isolated root, visitor and Studio entry graphs.
- Explicit opt-in CSS entry points.
- Manifest validation.
- Blocking registry-publication guard.
- Svelte 5 SSR, Chromium rendering and hydration test harness.
- Automatic Axe accessibility checks.
- Root, visitor and Studio graph-isolation verification.
- Clean-consumer Svelte singleton verification.
- Isolated proof that private-package publication is rejected.
