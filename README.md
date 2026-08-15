[English](README.md) | [Italiano](README.it.md)

# giadaware-ui-components

Private-incubation Svelte components for GiadaWare.

English is the canonical source of truth for public documentation. Italian is an official maintained mirror for the public documentation surface; see the [documentation language policy](docs/documentation-policy.md).

This is a public GitHub repository containing a package whose manifest uses
`private: true`.

That flag prevents registry publication. It does not make the GitHub
repository private.

During the trial, immutable package artifacts are created with `npm pack`,
identified by source commit, filename and checksum, and installed only in
controlled consumers.

Release and version semantics are defined by the
[release guide](docs/releases.md) and the underlying
[architecture policy](docs/architecture/release-versioning-policy.md).

No npm account, organization, scope, registry identity or publication workflow
is required.

Atelier-Kit is the first validation consumer. It is not a dependency of this
package.

The approved trial contains:

- `SocialIcon`
- `SocialLink`
- `StatusNotice`
- `FormStatus`
- `ImageAttachmentControl`
- `AsyncOperationPanel`
- `Button`
- `PageIntro`
- `FieldLabel`
- `FieldDescription` and `FieldError`
- `FormActions`
- `Panel`
- `Surface`
- `EditableList`, `EditableListRow`, `ReorderActions` and `ReorderAnnouncement`

The three JavaScript entry graphs remain isolated. Their current public APIs
are:

- `giadaware-ui-components` exports `FormStatus`, `FormStatusTone`,
  `StatusNotice`, `StatusNoticeAnnouncement`, `StatusNoticeProps`,
  `StatusNoticeTone`, `SocialIcon`, `SocialIconId`, `SOCIAL_ICON_IDS`,
  `SocialLink` and `SocialLinkProps`;
- `giadaware-ui-components/visitor` exports `ImageLightbox`,
  `ImageLightboxLabels`, `ImageLightboxProps`, `RelationshipGraph` and its
  public types;
- `giadaware-ui-components/studio` exports `ImageAttachmentControl` and the
  `ImageAttachmentControlLabels`, `ImageAttachmentCurrentImage`,
  `ImageAttachmentDropzoneOptions`, `ImageAttachmentFileValidator`,
  `ImageAttachmentIntent`,
  `ImageAttachmentState` and `ImageAttachmentValidationError` types, plus
  `AsyncOperationPanel` and its public types including `AsyncOperationProgress`,
  plus `Button`, `ButtonProps`, `ButtonVariant` and `ButtonSize`, plus
  `PageIntro` and `PageIntroProps`, plus
  `FieldLabel` and `FieldLabelProps`, plus `FieldDescription`,
  `FieldDescriptionProps`, `FieldError` and `FieldErrorProps`, plus
  `FormActions`, `FormActionsProps` and `FormActionsAlign`, plus `Panel`,
  `PanelProps` and `PanelHeadingLevel`, plus `Surface` and `SurfaceProps`, plus
  `EditableList`, `EditableListRow`, `ReorderActions`, `ReorderAnnouncement`
  and their public props, drag candidate and cancellation types.

See [SocialLink](docs/social-link.md) for its native-anchor contract,
accessible-name rules, navigation ownership, styling hooks and composition with
`SocialIcon`.

See [StatusNotice](docs/status-notice.md) for its composable static notice
contract, explicit announcement semantics, controlled dismissal, FormStatus
distinction and future-toast non-goals.

See [AsyncOperationPanel](docs/async-operation-panel.md) for its state model,
optional running progress, snippet contract, accessibility behavior, examples,
and styling hooks.

See [Button](docs/button.md) for native attribute forwarding, variants, sizes,
accessibility responsibilities, examples, and CSS custom properties.

See [PageIntro](docs/page-intro.md) for its paragraph and snippet contract,
responsibility boundary, accessibility behavior and CSS custom properties.

See [FieldLabel](docs/field-label.md) for its presentation-only field-label
contract, required and optional marker policy, hint association and styling
hooks.

See [FieldDescription and FieldError](docs/field-description-error.md) for
static description/error association, opt-in live error announcement,
empty-content behavior and ownership boundaries.

See [FormActions](docs/form-actions.md) for its flex layout contract, wrapping
behavior, ownership boundaries and gap customization.

See [Panel](docs/panel.md) for its semantic section contract, heading behavior,
responsibility boundaries, examples and CSS custom properties.

See [Surface](docs/surface.md) for its neutral container contract, semantic
boundaries, composition examples and CSS custom properties.

See [EditableList](docs/editable-list.md) for composable ordered-row structure,
native reorder controls, optional handle-only pointer drag enhancement, the
consumer-owned `isEmpty` selection contract, ownership boundaries and isolated
CSS properties.

See [RelationshipGraph](docs/relationship-graph.md) for its data contract,
deterministic layout, interactions, callback payloads, resilience policy, and
CSS customization hooks.

## ImageLightbox

Import the controlled modal primitive from the Visitor entry point:

```svelte
<script lang="ts">
	import { ImageLightbox } from 'giadaware-ui-components/visitor';
</script>

{#snippet caption()}
	<p>Descriptive figure caption.</p>
{/snippet}

{#snippet actions()}
	<nav aria-label="Image navigation">
		<button type="button">Previous</button>
		<button type="button">Next</button>
	</nav>
{/snippet}

<ImageLightbox
	open={previewOpen}
	onopenchange={(open) => previewOpen = open}
	src={currentImage.src}
	alt={currentImage.alt}
	labels={{ dialog: 'Image preview', close: 'Close image' }}
	{caption}
	{actions}
/>
```

`caption` remains descriptive figure content and is rendered inside `<figcaption>`. Interactive controls belong in the optional `actions` snippet, rendered inside the native modal after the figure. The actions wrapper is semantically neutral: Giada UI adds no toolbar, navigation, footer or gallery semantics.

Consumers own the controls and relationships inside `actions`, including accessible names, grouping, keyboard behavior, gallery arrays, current index, previous/next logic, counters and translations. Giada UI continues to own the native-dialog lifecycle, close/Escape/backdrop behavior, focus restoration, scroll locking, SSR/hydration safety and contained single-image presentation.

The component does not infer gallery state, add ArrowLeft/ArrowRight behavior, or reinterpret `caption` as an action area.

## FieldLabel

Import `FieldLabel` only from the Studio entry point:

```svelte
<script lang="ts">
	import { FieldLabel } from 'giadaware-ui-components/studio';
</script>

<label for="display-name">
	<FieldLabel
		label="Display name"
		required
		requiredLabel="Required"
		hint="Shown on your public profile."
		hintId="display-name-hint"
	/>
</label>

<input
	id="display-name"
	name="displayName"
	required
	aria-describedby="display-name-hint"
/>
```

`FieldLabel` renders presentation only. Consumers provide translated strings,
the semantic `label` association, native `required`, stable control IDs and
hint relationships. Required presentation takes precedence over optional
presentation, and unresolved marker labels are omitted.

## FieldDescription and FieldError

Import both primitives only from the Studio entry point:

```svelte
<script lang="ts">
	import {
		FieldDescription,
		FieldError
	} from 'giadaware-ui-components/studio';
</script>

<input
	id="display-name"
	aria-invalid="true"
	aria-describedby="display-name-description display-name-error"
/>

<FieldDescription
	id="display-name-description"
	text="Shown on your public profile."
/>

<FieldError
	id="display-name-error"
	text="Use at least three characters."
/>
```

Both components render consumer-resolved text and omit whitespace-only content.
They never generate IDs or mutate a control's ARIA attributes.

`FieldDescription` is always static. `FieldError` is static by default, which
avoids announcing an already-rendered SSR error again during hydration. For an
error genuinely introduced after consumer interaction, `announce={true}`
opts into `role="alert"`, `aria-live="assertive"` and `aria-atomic="true"`.

Consumers own validation, `aria-invalid`, `aria-describedby`,
`aria-errormessage`, IDs, localization and focus policy. See
`docs/field-description-error.md` for the complete contract.

## Panel

Import `Panel` only from the Studio entry point:

```svelte
<script lang="ts">
	import { Panel } from 'giadaware-ui-components/studio';
</script>

<Panel title="Publishing settings" headingLevel={3}>
	<p>Configure how the current document is published.</p>
</Panel>
```

`Panel` renders one named semantic section with a visible heading and required
body content. Description, header-action and footer snippets are optional and
consumer-owned. The footer follows the body and receives no implied navigation,
group, workflow or landmark semantics from Giada UI. `Panel` does not manage
forms, events, asynchronous state, live regions or workflow.
Use `AsyncOperationPanel` for operation lifecycle presentation. Use `Surface`
for neutral visual containment without a heading or section landmark.

## Surface

Import `Surface` only from the Studio entry point:

```svelte
<script lang="ts">
	import { Surface } from 'giadaware-ui-components/studio';
</script>

<nav aria-label="Resources">
	<Surface>
		<a href="/documentation">Documentation</a>
	</Surface>
</nav>
```

`Surface` renders required consumer content inside one neutral native `div`.
It adds no heading, role, landmark, accessible name, interaction, event or
application behavior. Consumers own any surrounding `nav`, `section`, `article`
or form semantics.

Consumer classes and inline styles compose with its scoped presentation through
the documented `--giu-surface-*` custom properties. Use `Panel` instead when
the content is a named section requiring a visible heading.

## PageIntro

Import `PageIntro` only from the Studio entry point:

```svelte
<script lang="ts">
	import { PageIntro } from 'giadaware-ui-components/studio';
</script>

<PageIntro>Manage the current document.</PageIntro>

<PageIntro>
	Manage the current document and
	<a href="/preview">open its preview</a>.
</PageIntro>
```

`PageIntro` always renders a semantic paragraph. Its required snippet may contain
plain or mixed inline content. Translations, links and page placement remain
consumer-owned. Consumer classes and inline styles compose with the scoped
component styles and documented `--giu-page-intro-*` hooks. It is not a
heading, alert, live region or landmark.

## Button

Import `Button` only from the Studio entry point:

```svelte
<script lang="ts">
	import { Button } from 'giadaware-ui-components/studio';
</script>

<Button>Save changes</Button>
<Button type="submit">Submit form</Button>
<Button disabled>Unavailable</Button>
<Button variant="danger">Remove item</Button>
<Button variant="secondary" size="compact">Move up</Button>
```

The variants are `primary`, `secondary`, and `danger`; sizes are `default` and
`compact`. `type` safely defaults to `button`. Applicable native button,
form, ARIA, data, and event attributes are forwarded. Required child content
provides the accessible name. Optional `leading` and `trailing` snippets add
presentation-only content around that label without changing its accessible
name. Consumer classes and inline styles compose with the scoped component
styles, including the documented `--giu-button-*` hooks.

`Button` does not own pending, loading, result, or live-region behavior; a
consumer may place a visual pending indicator in a leading/trailing region while
owning `aria-busy`, disabled state and announcements itself. Use
`AsyncOperationPanel` for asynchronous lifecycle presentation. Links and
icon-only controls remain separate components/contracts. Compose related
consumer-owned controls with `FormActions`.

## IconButton

Import `IconButton` only from the Studio entry point. It always represents one
icon-only native button for valid props, defaults to `type="button"`, requires a
consumer-resolved non-empty `label`, and accepts required consumer-owned `icon`
snippet content.

The icon wrapper is presentation-only and `aria-hidden="true"`, so geometry does
not duplicate the button name. `IconButton` reuses the existing `ButtonVariant`
and `ButtonSize` contracts while exposing independent `--giu-icon-button-*`
presentation hooks. Default and compact targets are at least 44px and 40px,
respectively.

A missing or blank runtime label fails closed rather than rendering an unnamed
control. `aria-label` and `aria-labelledby` are reserved by the component;
ordinary native button attributes, other applicable ARIA/data attributes and
handlers compose normally. `IconButton` provides no tooltip, icon registry,
loading lifecycle, confirmation, navigation or toolbar keyboard model. See
`docs/icon-button.md`.

## FormActions

Import `FormActions` only from the Studio entry point:

```svelte
<script lang="ts">
	import { Button, FormActions } from 'giadaware-ui-components/studio';
</script>

<FormActions align="end">
	<Button type="submit">Save changes</Button>
	<Button variant="secondary">Cancel</Button>
</FormActions>
```

`align` controls main-axis alignment and accepts `start`, `center`, `end`, or
`space-between`; it defaults to `start`. Wrapping defaults to `true`.
`space-between` operates independently on each wrapped flex line. Setting
`wrap={false}` may allow content to overflow and is an explicit consumer
choice.

The component renders its required snippet directly inside one native `div`.
Child semantics, accessible names, attributes, handlers, focus, keyboard,
submission, and navigation behavior remain consumer-owned. Margins and page
placement also remain consumer-owned. Consumer classes and styles compose with
the component, whose only public CSS custom property is
`--giu-form-actions-gap` with a `0.75rem` fallback.

Keep the primary action first in DOM order unless the consuming workflow has a
documented reason to choose a different order. `FormActions` is not a toolbar:
interfaces that require toolbar semantics or arrow-key navigation need a
separate component.

## SocialIcon

The root entry point exports:

```ts
import {
	SOCIAL_ICON_IDS,
	SocialIcon
} from 'giadaware-ui-components';

import type {
	SocialIconId
} from 'giadaware-ui-components';
```

The closed identifier registry is:

- `instagram`;
- `facebook`;
- `x`;
- `github`;
- `github-sponsors`.

`github` renders the GitHub brand mark. `github-sponsors` renders the filled
heart used for GitHub Sponsors links. Unknown runtime identifiers render
nothing; development builds emit one warning for each invalid condition.

Decorative use is the default:

```svelte
<a href="/profile" aria-label="Profilo GitHub">
	<SocialIcon id="github" />
</a>
```

Informative use requires a non-empty accessible label:

```svelte
<SocialIcon
	id="github"
	decorative={false}
	ariaLabel="Profilo GitHub"
	title="GitHub"
/>
```

Sizing defaults to `24px`. A numeric `size`, `width` or `height` becomes a CSS
pixel value; strings are passed as CSS lengths. `width` and `height` override
the corresponding axis set by `size`.

The SVG uses:

```text
viewBox="0 0 24 24"
fill="currentColor"
```

Color therefore inherits from the surrounding CSS context.

### Tree-shaking contract

`SocialIcon` selects its glyph dynamically from an identifier. Importing the
component therefore legitimately includes all five approved geometries.

The root export graph nevertheless keeps the public registry independent from
the component implementation. The current gate demonstrates that importing
only `SOCIAL_ICON_IDS` excludes `SocialIcon`, its runtime helpers and all five
SVG geometries in the clean packed consumer compiled by the Vite SSR test. It
does not claim a universal guarantee for every bundler.

### Third-party geometry

Brand geometries come from Simple Icons 16.26.0. The source package license is
CC0-1.0, but the Simple Icons disclaimer states that the project license does
not imply every individual icon is CC0. Trademark and individual icon terms
may still apply, and CC0 does not grant trademark rights.

The GitHub Sponsors heart comes from GitHub Primer Octicons v19.29.2,
`icons/heart-fill-24.svg`, under the MIT License, Copyright (c) 2026 GitHub
Inc.

See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for the complete notices.

## SocialLink

`SocialLink` packages the recurring accessible composition of a supported
`SocialIcon` and a native anchor without moving navigation policy into Giada UI.

Icon-only use provides a consumer-owned accessible label:

```svelte
<SocialLink
	id="github"
	href="/profile"
	label="Profilo GitHub"
/>
```

Visible-label use leaves the visible content as the single naming source:

```svelte
{#snippet githubLabel()}
	<span>Profilo GitHub</span>
{/snippet}

<SocialLink
	id="github"
	href="/profile"
	children={githubLabel}
/>
```

The nested icon is always decorative relative to the link. Invalid blank
`href` values and unnamed icon-only runtime calls fail closed.

Consumers retain full ownership of `href`, `target`, `rel`, routes, visible
copy, localization, analytics and external-link policy. The component never
silently adds `target="_blank"` or `rel`.

`aria-label` and `aria-labelledby` are reserved by the component naming
contract; other applicable native anchor, ARIA, `data-*` and event attributes
are forwarded.

`SocialLink` introduces no additional brand geometry. The existing
`SocialIcon` third-party and trademark notices remain authoritative.

See [SocialLink](docs/social-link.md) for the complete public contract.

## FormStatus

The root entry point exports:

```ts
import { FormStatus } from 'giadaware-ui-components';

import type { FormStatusTone } from 'giadaware-ui-components';
```

`FormStatusTone` is the closed union `success | error | warning | info`.
`message` is required and is rendered without package-provided labels or other
localized text. An empty message renders no status. `tone` defaults to `info`.

Statuses are persistent by default:

```svelte
<FormStatus
	message="Impostazioni salvate"
	tone="success"
/>
```

Set `durationMs` to a positive finite number to dismiss the message
automatically in the browser:

```svelte
<FormStatus
	message="Bozza aggiornata"
	tone="info"
	durationMs={5000}
/>
```

The default `null`, as well as zero, negative values, `NaN` and infinities,
remain persistent. Changing `message` or `durationMs` makes the current message
visible again and restarts the timing lifecycle. Durations beyond the browser's
single-timer limit are scheduled in bounded consecutive chunks rather than
overflowing. Timers are not created during server rendering and are cleaned up
when props change or the component is destroyed.

The accessibility policy is deterministic: `error` uses `role="alert"` with
`aria-live="assertive"`; `success`, `warning` and `info` use `role="status"`
with `aria-live="polite"`. Every rendered status uses `aria-atomic="true"`.
There is no close button, animation, dismissal callback or toast manager.

The component accepts `class` and `style` on its root element. Its scoped CSS
uses only these public neutral custom properties, each with a readable fallback:

- layout: `--giu-form-status-padding`, `--giu-form-status-border-width`,
  `--giu-form-status-border-radius`, `--giu-form-status-line-height`;
- per-tone colors: `--giu-form-status-<tone>-border`,
  `--giu-form-status-<tone>-background` and
  `--giu-form-status-<tone>-color`.

## ImageAttachmentControl

Import the component and its consumer-facing types from the Studio entry point:

```ts
import { ImageAttachmentControl } from 'giadaware-ui-components/studio';
import type {
	ImageAttachmentControlLabels,
	ImageAttachmentDropzoneOptions,
	ImageAttachmentState
} from 'giadaware-ui-components/studio';
```

`ImageAttachmentControl` is controlled through `value` and `onvaluechange`.
Its final intent is `keep`, `replace` (with a native `File`) or `remove`.
`currentImage` describes an existing image when one is available. Callers own
all labels and validation messages, and can configure `accept`, `maxSizeBytes`,
a custom `validator` and `disabled`.

Drag-and-drop selection is an optional progressive enhancement through the
`dropzone` prop. The native file input remains visible and is the canonical
keyboard and fallback interaction. Dropped files reuse the same validation,
controlled `onvaluechange` transition and native `FormData` path as files
selected through the picker. Consumers provide all resolved drop instructions.

```svelte
<script lang="ts">
	import { ImageAttachmentControl } from 'giadaware-ui-components/studio';
	import type {
		ImageAttachmentControlLabels,
		ImageAttachmentDropzoneOptions,
		ImageAttachmentState
	} from 'giadaware-ui-components/studio';

	let value: ImageAttachmentState = $state({ intent: 'keep', file: null });

	const dropzone: ImageAttachmentDropzoneOptions = {
		instructions: 'Drop an image here',
		activeInstructions: 'Release the image'
	};

	const labels: ImageAttachmentControlLabels = {
		input: 'Choose image',
		cancelReplacement: 'Cancel replacement',
		remove: 'Remove image',
		cancelRemoval: 'Cancel removal',
		keepExistingStatus: 'Existing image kept',
		keepEmptyStatus: 'No image selected',
		replaceStatus: 'Replacement selected',
		removeStatus: 'Image will be removed',
		replacementPreviewAlt: 'Replacement preview'
	};

	function save(state: ImageAttachmentState): void {
		switch (state.intent) {
			case 'keep':
				return;
			case 'replace':
				console.log('Selected file', state.file.name);
				return;
			case 'remove':
				console.log('Removal selected');
				return;
			default: {
				const exhaustive: never = state;
				return exhaustive;
			}
		}
	}
</script>

<ImageAttachmentControl
	{value}
	onvaluechange={(next) => value = next}
	currentImage={{ src: '/current-image.jpg', alt: 'Current image' }}
	invalidTypeMessage="Choose a supported image type"
	tooLargeMessage="Choose a smaller image"
	{labels}
	accept="image/png,image/jpeg"
	maxSizeBytes={5_000_000}
	{dropzone}
/>

<button type="button" onclick={() => save(value)}>Save</button>
```

The caller is responsible for interpreting and persisting the final intent.
The component provides no hidden removal field and no built-in persistence.

When `dropzone` is enabled:

- file drags expose `data-drop-active="true"` while the target is active;
- rejected drops expose `data-drop-rejected="true"` and reuse the existing
  accessible validation error;
- nested drag enter/leave events are normalized to avoid feedback flicker;
- disabled state blocks both native and dropped selection;
- consumer-owned drop instructions are associated with the native input through
  `aria-describedby`;
- the drop target is a semantic group, not a synthetic button, so keyboard
  interaction continues through the native file input.

Dropzone presentation is customizable through the
`--giu-image-attachment-dropzone-*` token family, including base, active and
rejected border/background hooks.

The enhancement adds no upload transport, progress tracking, persistence,
multiple-file support, paste handling or drag-and-drop dependency.

## Requirements

Node.js:

    ^20.19.0 || >=22.12.0

The repository currently uses Node 24 in CI.

## Trial test harness

The private extraction trial uses a blocking test harness covering:

- deterministic server-side rendering;
- Chromium component rendering;
- client hydration without mismatch;
- automatic accessibility checks with Axe;
- isolated root, visitor and Studio dependency graphs;
- explicit opt-in CSS entry points;
- clean installation from the generated tarball;
- TypeScript and runtime imports from the packed artifact;
- one compatible Svelte runtime in the consumer;
- registry-publication refusal.

Install the Chromium test browser once on a development machine:

    npx playwright install chromium

## Local validation

Install dependencies:

    npm install

Run all current validation gates:

    npm run validate

Create a local trial artifact:

    npm pack

For immutable release/version rules and the operational release procedure,
see [Releases](docs/releases.md).

Registry publication is forbidden during private incubation.

Architecture and trial ownership are tracked in
https://github.com/gcomneno/atelier-kit/issues/127
