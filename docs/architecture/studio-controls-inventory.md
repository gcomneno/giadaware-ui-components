# Studio controls inventory

## Status and scope

**Status:** current architectural inventory and decision record for Giada UI epic #8.

This document consolidates the Studio control families demonstrated by Giada UI and Atelier-Kit, removes overlapping candidate names, and records both completed Giada UI work and remaining extraction and adoption work. It preserves the architectural basis for `AsyncOperationPanel`; its final public contract is now documented here where it resolves the original design questions. This inventory does not migrate Atelier-Kit, decide package versioning or registry publication, or imply that consumer adoption has occurred.

The inventory contains **six definitive control families**. `ImageAttachmentControl` and `AsyncOperationPanel` are implemented in Giada UI; the other four families remain future extraction candidates. `Button` is also implemented in the Studio entry point but is not an additional family from the original six-family classification. `RelationshipGraph` is implemented in the Visitor entry point and is outside this Studio inventory.

## Inventory method

The inventory was derived from source rather than inferred from epic labels:

1. Inspect the public components and contracts already present in Giada UI: `src/lib/FormStatus.svelte`, `src/lib/form-status.ts`, the Studio component implementations and contract modules, `src/lib/studio/index.ts`, and the component documentation under `docs/`.
2. Inspect Atelier-Kit's concrete Studio controls and their route consumers, including `src/lib/components/MarkedTextField.svelte`, `src/lib/components/StudioImageMutationFields.svelte`, `src/lib/components/StudioItemGalleryFields.svelte`, `src/routes/studio/site/appearance/+page.svelte`, and `src/routes/studio/readiness/+page.svelte`.
3. Trace non-visual state, parsing, domain, and server dependencies through `src/lib/studio-readiness-action-state.js`, `src/lib/editorial-markup.js`, `src/lib/marked-text.js`, `src/lib/site-appearance.js`, `src/lib/site-typography.js`, `src/lib/studio-item-gallery.js`, `src/routes/studio/readiness/+page.server.js`, `src/lib/server/studio-io.js`, and `src/lib/server/studio-publish-live-core.js` in Atelier-Kit.
4. Treat a family as real only when the repositories contain an implementation or a concrete consumer whose interaction can be described. Similar prose labels were merged when they described one responsibility; superficially similar controls were kept separate when their state and behavior differ.
5. Use existing tests as evidence of established behavior, notably Giada UI's browser, SSR, hydration, accessibility, and type-contract tests for `ImageAttachmentControl` and `AsyncOperationPanel`, plus Atelier-Kit's `src/lib/studio-readiness-action-state.test.js`, `src/routes/studio/readiness/readiness-page.test.js`, and `src/lib/server/studio-publish-live-core.test.js`.

Paths in this document are repository-relative. Unless explicitly identified as Giada UI, paths in consumer evidence refer to Atelier-Kit.

## Giada UI / Atelier-Kit boundary

Giada UI owns reusable presentation, interaction semantics, accessibility behavior, controlled state contracts, and style hooks. It may render consumer-provided labels, summaries, actions, progress state, result content, and technical details. It must remain independent of Atelier-Kit routes, translation keys, content schemas, parser rules, font registries, deployment providers, and server runtime.

Atelier-Kit owns domain state and orchestration: SvelteKit forms and `use:enhance`, fetch or Promise lifecycles, confirmation policy, Git operations, build and content checks, deployment, translation lookup, result interpretation, cross-operation locking, and conversion from server results to Giada UI props. Existing adapters such as `src/lib/components/AtelierFormStatus.svelte` and `src/lib/form-status-adapter.js` demonstrate this pattern for `FormStatus`.

Extraction and adoption are separate work. A component can exist in Giada UI while Atelier-Kit still uses a local equivalent; replacing the local control requires its own consumer-side change and validation.

## Definitive families

| # | Family | Observed evidence | Classification and disposition |
|---:|---|---|---|
| 1 | `ImageAttachmentControl` | Implemented and exported by Giada UI from `src/lib/studio/ImageAttachmentControl.svelte` and `src/lib/studio/index.ts`; Atelier-Kit still uses `src/lib/components/StudioImageMutationFields.svelte` in the identity, hero, and appearance Studio routes. | Existing Giada UI component. Atelier-Kit adoption is separate work, not a new extraction. |
| 2 | Controlled marked-text field/editor | Atelier-Kit's `src/lib/components/MarkedTextField.svelte` is used across multiple Studio routes and depends on `src/lib/editorial-markup.js`, `src/lib/marked-text.js`, `src/lib/components/EditorialText.svelte`, `src/lib/site-typography.js`, and operator i18n. | Real family, but too coupled to Atelier Mark, parser and renderer semantics, typography presets, preview, selection APIs, and localization to be next. |
| 3 | Color preset control | `src/routes/studio/site/appearance/+page.svelte` selects a preset, applies it across seven color fields, and renders a coordinated preview; definitions and normalization live in `src/lib/site-appearance.js`. | Distinct future family for selecting and editing a multi-value palette with preview. Do not collapse it into font selection. |
| 4 | Font preset control | The same appearance route owns separate font selection and preview state, while `src/lib/site-typography.js` owns font families and external stylesheet URLs. | Distinct future family for font selection, loading, and preview. Do not create a color-font monolith. |
| 5 | `AsyncOperationPanel` | Implemented and exported by Giada UI from `src/lib/studio/AsyncOperationPanel.svelte` and `src/lib/studio/index.ts`. Atelier-Kit's `src/routes/studio/readiness/+page.svelte` provides two consumer cases: build test (`runPublishPrep`) and live publication (`publishLive`). | Existing Giada UI component. It unifies the former “async action panel” and “separate dry-run/publication feedback” entries; Atelier-Kit adoption remains separate work. |
| 6 | Ordered asset or record editor | `src/lib/components/StudioItemGalleryFields.svelte` adds, removes, and moves ordered rows; `src/lib/studio-item-gallery.js` maps those rows to Atelier-Kit's gallery and cover rules. | Real family distinct from a single image attachment. The gallery is a concrete consumer, but its fields, minimum-one rule, cover role, dirty tracking, form encoding, and upload flow remain domain-coupled. |

The table count remains six: two components implemented in Giada UI and four future candidate families not yet extracted.

## Removed overlaps and reclassifications

- “Async action panel” and “separate feedback for dry-run and publication” are one family: `AsyncOperationPanel`. Build test and publication are two instances/consumers, not two component families.
- A generic “asset upload with preview and removal” is not counted separately. The single-image case is already represented by `ImageAttachmentControl`; Atelier-Kit's local `StudioImageMutationFields` is adoption evidence, not another family.
- The ordered asset or record editor remains separate because collection mutation and ordering are not responsibilities of one attachment control.
- A single feedback message is already covered by Giada UI's `FormStatus`; Atelier-Kit already consumes it through `src/lib/components/AtelierFormStatus.svelte`. It is not a new family.
- “Read more / Read less” belongs to the Visitor backlog. The concrete behavior is in Atelier-Kit's `src/lib/element-overflow.js` and is consumed from `src/routes/items/[id]/+page.svelte`, outside the Studio control inventory.
- `ValidationSummary` is not a real candidate yet. The inspected Atelier-Kit Studio code has no concrete consumer that presents a list of validation errors linked to fields. It must not be promoted to a component family until such a consumer exists.
- Color presets and font presets are intentionally two families. Sharing one appearance page does not make their state, loading behavior, or preview responsibilities identical.

## Current implementation and remaining priority

`AsyncOperationPanel` was selected as the highest-priority extraction because it has two concrete consumers on one Atelier-Kit page, repeats a coherent interaction rather than domain data editing, and has a clean dependency-inversion boundary. That Giada UI extraction is complete: the component and public types are exported from `src/lib/studio/index.ts`. Its shared responsibility remains visible state and accessible feedback for one consumer-owned operation; server and workflow details remain outside Giada UI.

The currently exported Studio components are `ImageAttachmentControl`, `AsyncOperationPanel`, and `Button`. Their existence in Giada UI does not establish that Atelier-Kit has replaced its local controls. Based on the consumer evidence recorded here, adoption of `ImageAttachmentControl` and `AsyncOperationPanel` remains pending and must be validated in Atelier-Kit separately.

The remaining work is classified as follows:

1. `ImageAttachmentControl` and `AsyncOperationPanel` need Atelier-Kit adoption, not Giada UI extraction.
2. The color preset and font preset controls are credible future candidates but currently demonstrated together in only one consumer surface; their generic data and preview extension points need further design.
3. The ordered editor is a future candidate with a useful generic interaction, but the concrete gallery consumer embeds Atelier-Kit field shapes, minimum-cardinality rules, dirty tracking, form naming, cover semantics, and a separate upload append flow.
4. The marked-text editor is a future candidate with broad usage but the greatest architectural coupling. Extracting it now would either leak Atelier Mark and Atelier-Kit typography/i18n into Giada UI or prematurely design a plugin-style editor contract.

## Implemented decision: `AsyncOperationPanel`

### Evidence and state model

The readiness page provides at least two real consumers:

- build test / publish preparation, submitted through `?/runPublishPrep`;
- live publication, submitted through `?/publishLive`.

They are independently rendered and retain separate results. `src/lib/studio-readiness-action-state.js` stores `prep` and `live` pending/result state separately, and its tests verify that one result does not overwrite the other. The current page also coordinates them by disabling both actions while either is pending. That mutual exclusion is page workflow policy and must not move into a single-operation presentation component.

The public state vocabulary is `idle`, `running`, `success`, `warning`, and `error`:

| State | Meaning |
|---|---|
| `idle` | The operation has not started, or the consumer has reset it; no completed result is implied. |
| `running` | The consumer reports that this operation is in progress. |
| `success` | The operation completed with the intended outcome. |
| `warning` | The operation completed only partially or needs operator attention despite meaningful completed work. |
| `error` | The operation failed without an outcome that the consumer classifies as partial success. |

`warning` is justified by a concrete Atelier-Kit outcome, not by speculation. In `src/lib/server/studio-publish-live-core.js`, Git push can succeed and the subsequent deploy can fail or omit a deployment URL; the service returns `ok: false` with `outcome: 'partial'`. Atelier-Kit should map that result to `warning`, while preflight, preparation, commit, or push failure can map to `error`. Giada UI must not know the `outcome` strings or make that mapping itself.

### Component responsibilities

One `AsyncOperationPanel` instance represents exactly one operation. It is responsible for:

- rendering a title and optional explanatory content;
- rendering or composing the consumer-provided action control;
- reflecting the controlled operation state and exposing appropriate busy/status semantics;
- presenting a primary human-readable status/result message;
- composing or reusing the existing `FormStatus` tone and live-region behavior where that is the appropriate presentation primitive;
- rendering optional result content, such as a deployed-site link;
- rendering optional technical details behind an accessible, collapsible disclosure;
- keeping labels and visible content consumer-supplied and therefore localizable;
- exposing Giada UI style hooks without depending on Atelier-Kit Studio tokens.

It is not responsible for starting or awaiting a Promise, calling `fetch`, enhancing or submitting a form, interpreting SvelteKit action results, running Git, invoking build tooling, deploying, confirming a destructive action, refreshing readiness data, or coordinating any other operation.

### Consumer responsibilities

The consumer is responsible for:

- owning the operation lifecycle and setting the controlled state;
- supplying the action button/form or equivalent trigger and deciding when it is disabled;
- preventing duplicate submissions and enforcing mutual exclusion across different operations;
- executing fetch, Promise, form action, Git, build, and deployment behavior;
- mapping domain results, including Atelier-Kit's `partial` publication outcome, to the five public states;
- supplying localized title, description, action text, summary, technical-detail label/content, and optional result content;
- deciding whether details initially open, subject to the component's accessibility contract;
- preserving or clearing prior results when a new run begins;
- deciding confirmation, retry, cancellation, and navigation policy.

### Invariants

1. One panel models one operation; it never accepts or manages an array of operations.
2. State is controlled by the consumer. The panel does not infer lifecycle from a returned Promise or initiate side effects.
3. Cross-operation locking is outside the component. Two panels neither discover nor disable each other.
4. `running` exposes a programmatic busy state and does not announce a stale terminal result as current.
5. Terminal states have consumer-provided human-readable content; technical output alone is not the primary status.
6. `warning` and `error` remain semantically distinct. A partial outcome is not styled or announced as full success.
7. Technical details are optional, collapsible, and absent from the accessibility tree when not supplied; raw output is rendered as text, never interpreted as HTML.
8. Labels are supplied by the consumer. Giada UI contains no Atelier-Kit translation keys or English fallback copy.
9. SSR output is deterministic for the supplied state, and hydration does not start an operation or change disclosure state unexpectedly.
10. Reuse of `FormStatus` must preserve its established tones (`success`, `warning`, `error`, `info`) and alert/live-region semantics without producing duplicate announcements.

### Implemented public API

The exported `AsyncOperationPanelProps` contract expresses these concepts:

- `state`: required controlled value, one of `idle | running | success | warning | error`;
- `title`: required visible operation name;
- `description`: optional explanatory snippet;
- `action`: required consumer-provided snippet for the button, form, or trigger region;
- `headingLevel`: optional native heading level from 2 through 6, defaulting to 2;
- `message`: optional primary status text for the current state;
- `result`: optional rich, consumer-provided result content, for example a safe link;
- `technicalDetails`: optional plain-text technical content;
- `technicalDetailsLabel`: required when technical details exist;
- `technicalDetailsInitiallyExpanded`: optional initial state for the native, uncontrolled disclosure, which defaults closed;
- `busyLabel`: required in `running` state;
- standard styling hooks such as `class`, `style`, and documented CSS custom properties.

The state-discriminated contract accepts no status content in `idle`, requires `busyLabel` and rejects `message` and `result` in `running`, and requires `message` with an optional result snippet in terminal states. The action remains required in terminal states. Technical output is escaped text, and disclosure state is native and uncontrolled after its optional initial value.

The implementation composes `FormStatus` without adding a second live region: `running` uses `info`, and terminal states use their same-named tone. Rich result content and technical details sit beside the primary string status.

### Implemented test strategy

The component has focused type, SSR, browser, accessibility, and hydration coverage for:

- type-contract coverage for required state/content relationships and public exports;
- SSR coverage for all five states, optional regions, escaped technical text, deterministic markup, and absence of browser-side work;
- browser interaction coverage for the details disclosure, focus/keyboard behavior, controlled state changes, and action-region composition;
- accessibility coverage for heading structure, `aria-busy`, status versus alert announcements, no duplicate live regions when using `FormStatus`, disclosure naming, and terminal tone semantics;
- hydration coverage for each state and both collapsed and expanded technical details;
- a small consumer-style fixture with two panels proving that results remain independent and that mutual exclusion can be implemented externally. The fixture demonstrates composition only; the component itself must not coordinate the instances.

No Git, build, deploy, network, SvelteKit form-action, or Promise execution belongs in component tests.

## Residual risks and adoption questions

- The snippet-based action and result contract is now fixed, but Atelier-Kit adapters must preserve native form behavior and localized accessible names.
- Technical-detail disclosure is uncontrolled with a consumer-supplied initial value. Atelier-Kit must account for native disclosure state when replacing or resetting operation results.
- Running and terminal announcement behavior is implemented and covered in Giada UI; consumer integration still needs validation to avoid duplicate surrounding live regions or unexpected focus changes.
- Terminal messages are persistent. Atelier-Kit remains responsible for deciding when results are replaced or cleared.
- Cancellation and progress percentage have no concrete readiness consumer and remain out of scope unless a real consumer motivates future API expansion.
- The component name, Studio export path, CSS token names, and prop contract are implemented and documented public contracts.
- Atelier-Kit does not currently map the publication service's `outcome: 'partial'` to a five-state presentation model. Adoption will need an explicit adapter and consumer tests.

## Next steps and epic status

Giada UI implementation work for `ImageAttachmentControl` and `AsyncOperationPanel` is complete. The next work for those families is separate Atelier-Kit adoption, including replacement of local controls, consumer integration tests, removal of duplicate implementations, and the readiness page's `partial`-to-`warning` mapping. The other four families remain candidates and require separately scoped design and extraction work before implementation.

Epic #8 must remain open. Its architectural boundary and inventory can be marked complete, and the completed Giada UI component implementations and their library-side test coverage can be recorded. The epic-level items requiring Atelier-Kit adoption, removal of consumer duplicates, permanent consumer regression coverage, and any publication/versioning decision remain incomplete.
