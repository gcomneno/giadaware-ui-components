# Changelog

## Unreleased

### Added

- Define the release and versioning policy, including strict SemVer,
  immutable Git/GitHub release identity, curated changelog rules, `0.x`
  breaking-change handling and the path toward `1.0.0`.
- Add the bilingual operational release guide while keeping registry
  publication blocked during private incubation.
- Establish the bilingual public documentation contract with maintained Italian
  mirrors, reciprocal language selectors and an automated documentation
  verification gate.
- Add optional running-only `AsyncOperationPanel` progress with native
  indeterminate and determinate presentation, strict lifecycle typing, runtime
  normalization and neutral styling hooks.
- Add the root `StatusNotice` primitive with composable title/body/icon/actions
  regions, explicit optional live announcement semantics, controlled native
  dismissal, neutral styling hooks and documentation distinguishing it from
  `FormStatus`.
- Add the root `SocialLink` primitive with native anchor semantics, supported `SocialIcon` composition, icon-only accessible-name validation, visible-label support, consumer-owned navigation policy and neutral styling hooks.
- Add the Studio `IconButton` primitive with a required accessible label, consumer-owned decorative icon content, Button-aligned variants/sizes, native button behavior and explicit target-size styling hooks.
- Add Studio `FieldDescription` and `FieldError` primitives with consumer-owned field associations, whitespace-empty omission, static validation presentation and explicit opt-in assertive error announcement.
- Add the Studio `ReorderAnnouncement` companion primitive for visually hidden,
  event-key-driven polite announcements of confirmed editable-list reorder
  outcomes.
- Add optional Studio `ReorderActions` position context descriptions with
  consumer-owned stable IDs and localized text.
- Add optional Studio `EditableListRow` handle-only pointer drag enhancement
  with consumer-owned candidates, before/after drops, cancellation callbacks and
  no package-owned ordering or announcements.

### Changed

- `RelationshipGraph` now requires a consumer-owned `labels` contract for all
  graph-facing and accessibility copy, including count and relationship
  formatters; node arrow-key navigation and explicit keyboard-operable pan
  controls complete keyboard viewport operation.

### Added
- `ImageLightbox` accepts an optional consumer-owned `actions` snippet inside
  the modal after the figure without adding gallery, index or navigation state.
- `ImageAttachmentControl` supports an optional consumer-labeled dropzone as a
  progressive enhancement while preserving the native file input, controlled
  `keep | replace | remove` model, shared validation path and native `FormData`.
- `ImageLightbox` adds a controlled, consumer-labeled native modal image viewer with uncropped viewport fitting, close/Escape/backdrop handling, focus restoration and reference-counted scroll locking.

- `EditableList`, `EditableListRow` and `ReorderActions` Studio primitives for
  composable ordered editors with consumer-owned `isEmpty` selection and native
  disabled reorder controls.
- `FieldLabel` Studio presentation primitive with deterministic required and
  optional markers, consumer-resolved copy and optional hint IDs.
- `Surface` Studio presentation primitive with a neutral native root,
  required snippet content, no implicit semantics and independent style hooks.
- `Panel` Studio structural primitive with a named semantic section, required
  body content, optional description, header actions and consumer-owned footer,
  deterministic identifiers, closed heading levels and neutral styling hooks.
- `FormActions` Studio layout primitive with required snippet content, closed
  main-axis alignment, configurable wrapping and a neutral gap hook.
- `PageIntro` Studio component with semantic paragraph output, snippet-based
  mixed content and scoped typography and link-color hooks.
- `ImageAttachmentControl` Studio component with controlled `keep`, `replace`
  and `remove` intents, local file validation and consumer-provided labels.
- `AsyncOperationPanel` Studio component for one consumer-controlled operation
  with `idle`, `running`, `success`, `warning` and `error` states.
- `Button` Studio component with native button behavior, forwarded attributes,
  closed variant and size contracts, optional presentation-only leading/trailing
  regions, and scoped style hooks.
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
