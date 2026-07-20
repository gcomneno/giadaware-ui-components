# Studio controls inventory

## Status and scope

**Status:** proposed architecture decision, ready for review. This document becomes the canonical inventory for Giada UI epic #8 when merged.

This document consolidates the Studio control candidates demonstrated by Giada UI and Atelier-Kit, removes overlapping candidate names, and selects the next extraction target. It records component boundaries rather than an implementation specification. In particular, it does not define a final TypeScript API, migrate Atelier-Kit, or authorize creation of the follow-up implementation issue before this document is reviewed and merged.

The inventory contains **six definitive control families**. `AsyncOperationPanel` is the next extraction candidate.

## Inventory method

The inventory was derived from source rather than inferred from epic labels:

1. Inspect the public components and contracts already present in Giada UI: `src/lib/FormStatus.svelte`, `src/lib/form-status.ts`, `src/lib/studio/ImageAttachmentControl.svelte`, `src/lib/studio/image-attachment-control.ts`, and `src/lib/studio/index.ts`.
2. Inspect Atelier-Kit's concrete Studio controls and their route consumers, including `src/lib/components/MarkedTextField.svelte`, `src/lib/components/StudioImageMutationFields.svelte`, `src/lib/components/StudioItemGalleryFields.svelte`, `src/routes/studio/site/appearance/+page.svelte`, and `src/routes/studio/readiness/+page.svelte`.
3. Trace non-visual state, parsing, domain, and server dependencies through `src/lib/studio-readiness-action-state.js`, `src/lib/editorial-markup.js`, `src/lib/marked-text.js`, `src/lib/site-appearance.js`, `src/lib/site-typography.js`, `src/lib/studio-item-gallery.js`, `src/routes/studio/readiness/+page.server.js`, `src/lib/server/studio-io.js`, and `src/lib/server/studio-publish-live-core.js` in Atelier-Kit.
4. Treat a family as real only when the repositories contain an implementation or a concrete consumer whose interaction can be described. Similar prose labels were merged when they described one responsibility; superficially similar controls were kept separate when their state and behavior differ.
5. Use existing tests as evidence of established behavior, notably Giada UI's `tests/browser/image-attachment-control.browser.test.ts` and `tests/ssr/image-attachment-control.ssr.test.ts`, plus Atelier-Kit's `src/lib/studio-readiness-action-state.test.js`, `src/routes/studio/readiness/readiness-page.test.js`, and `src/lib/server/studio-publish-live-core.test.js`.

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
| 5 | `AsyncOperationPanel` | Atelier-Kit's `src/routes/studio/readiness/+page.svelte` contains separate build-test (`runPublishPrep`) and live-publish (`publishLive`) operation panels with pending, result, and technical-output behavior. | **Next extraction candidate.** Unifies the former “async action panel” and “separate dry-run/publication feedback” entries. |
| 6 | Ordered asset or record editor | `src/lib/components/StudioItemGalleryFields.svelte` adds, removes, and moves ordered rows; `src/lib/studio-item-gallery.js` maps those rows to Atelier-Kit's gallery and cover rules. | Real family distinct from a single image attachment. The gallery is a concrete consumer, but its fields, minimum-one rule, cover role, dirty tracking, form encoding, and upload flow remain domain-coupled. |

The table count is six: one existing component, four future families not selected next, and one selected next.

## Removed overlaps and reclassifications

- “Async action panel” and “separate feedback for dry-run and publication” are one family: `AsyncOperationPanel`. Build test and publication are two instances/consumers, not two component families.
- A generic “asset upload with preview and removal” is not counted separately. The single-image case is already represented by `ImageAttachmentControl`; Atelier-Kit's local `StudioImageMutationFields` is adoption evidence, not another family.
- The ordered asset or record editor remains separate because collection mutation and ordering are not responsibilities of one attachment control.
- A single feedback message is already covered by Giada UI's `FormStatus`; Atelier-Kit already consumes it through `src/lib/components/AtelierFormStatus.svelte`. It is not a new family.
- “Read more / Read less” belongs to the Visitor backlog. The concrete behavior is in Atelier-Kit's `src/lib/element-overflow.js` and is consumed from `src/routes/items/[id]/+page.svelte`, outside the Studio control inventory.
- `ValidationSummary` is not a real candidate yet. The inspected Atelier-Kit Studio code has no concrete consumer that presents a list of validation errors linked to fields. It must not be promoted to a component family until such a consumer exists.
- Color presets and font presets are intentionally two families. Sharing one appearance page does not make their state, loading behavior, or preview responsibilities identical.

## Priority

`AsyncOperationPanel` is the highest-priority extraction because it has two concrete consumers on one Atelier-Kit page, repeats a coherent interaction rather than domain data editing, and has a clean dependency-inversion boundary. Its shared responsibility is visible state and accessible feedback for one consumer-owned operation. The server and workflow details can remain entirely outside Giada UI.

The other candidates rank behind it:

1. `ImageAttachmentControl` needs adoption, not extraction.
2. The color preset and font preset controls are credible but currently demonstrated together in only one consumer surface; their generic data and preview extension points need further design.
3. The ordered editor has a useful generic interaction, but the concrete gallery consumer embeds Atelier-Kit field shapes, minimum-cardinality rules, dirty tracking, form naming, cover semantics, and a separate upload append flow.
4. The marked-text editor has broad usage but the greatest architectural coupling. Extracting it now would either leak Atelier Mark and Atelier-Kit typography/i18n into Giada UI or prematurely design a plugin-style editor contract.

## Decision: `AsyncOperationPanel`

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

### Conceptual public API

The API should express the following concepts without committing yet to final Svelte or TypeScript syntax:

- `state`: required controlled value, one of `idle | running | success | warning | error`;
- `title`: required visible operation name;
- `description`: optional explanatory content;
- `action`: consumer-provided renderable content for the button, form, or trigger region;
- `message`: optional primary status text for the current state;
- `result`: optional rich, consumer-provided result content, for example a safe link;
- `technicalDetails`: optional plain-text or consumer-rendered technical content;
- `technicalDetailsLabel`: required when technical details exist;
- `technicalDetailsInitiallyExpanded`: optional presentation hint, with a conservative default to be decided;
- `busyLabel` or equivalent accessible content: required if the visible running presentation does not already name the activity;
- standard styling hooks such as `class`, `style`, and documented CSS custom properties.

The implementation issue must decide whether renderable regions use snippets, children, named snippets, or a smaller structured-data contract. It must also decide whether the action region is mandatory in terminal states and how much disclosure state is controlled. Those are open API questions, not decisions made by this inventory.

`FormStatus` composition should be preferred for a plain primary message. The panel may map `idle` and `running` to `info`, and terminal states to their same-named tone, but it must avoid rendering a second live region around `FormStatus`. Rich result content and technical details belong beside, not inside, a forced string-only status API.

### Minimum test strategy

The future component issue should require, at minimum:

- type-contract coverage for required state/content relationships and public exports;
- SSR coverage for all five states, optional regions, escaped technical text, deterministic markup, and absence of browser-side work;
- browser interaction coverage for the details disclosure, focus/keyboard behavior, controlled state changes, and action-region composition;
- accessibility coverage for heading structure, `aria-busy`, status versus alert announcements, no duplicate live regions when using `FormStatus`, disclosure naming, and terminal tone semantics;
- hydration coverage for each state and both collapsed and expanded technical details;
- a small consumer-style fixture with two panels proving that results remain independent and that mutual exclusion can be implemented externally. The fixture demonstrates composition only; the component itself must not coordinate the instances.

No Git, build, deploy, network, SvelteKit form-action, or Promise execution belongs in component tests.

## Risks and open questions

- The final renderable-content mechanism is unresolved. Structured props are easier to type; snippets are more flexible for forms and result links.
- Whether technical-detail expansion is controlled, uncontrolled with an initial value, or supports both modes remains open. Hydration and consumer reset behavior must guide the choice.
- The default expansion policy is unresolved. Atelier-Kit currently opens failed build output but always provides a closed publication disclosure; a generic rule may depend on state or remain entirely consumer-controlled.
- The exact running announcement and transitions need accessibility validation so state updates are timely without duplicate or noisy announcements.
- `FormStatus` currently accepts a string message and optional duration. The panel must decide whether terminal messages should ever auto-dismiss; persistent results are likely safer, but this is not yet a final decision.
- Cancellation and progress percentage have no concrete readiness consumer and are therefore out of scope unless a real consumer appears before implementation.
- The component name is selected for the architectural candidate, but export path, CSS token names, and final prop names remain implementation decisions.
- Atelier-Kit does not currently map the publication service's `outcome: 'partial'` to a five-state presentation model. Adoption will need an explicit adapter and consumer tests.

## Next step

Review and merge this document first. Only after merge, open one autonomous child issue for designing and implementing `AsyncOperationPanel` in Giada UI, including its tests and public export. Atelier-Kit adoption, including the two readiness instances and the `partial`-to-`warning` mapping, should remain separately scoped. Do not open either issue as part of this inventory work.
