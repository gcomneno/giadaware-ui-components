# giadaware-ui-components

Private-incubation Svelte components for GiadaWare.

This is a public GitHub repository containing a package whose manifest uses
`private: true`.

That flag prevents registry publication. It does not make the GitHub
repository private.

During the trial, immutable package artifacts are created with `npm pack`,
identified by source commit, filename and checksum, and installed only in
controlled consumers.

No npm account, organization, scope, registry identity or publication workflow
is required.

Atelier-Kit is the first validation consumer. It is not a dependency of this
package.

The approved trial contains:

- `SocialIcon`
- `FormStatus`
- `ImageAttachmentControl`
- `AsyncOperationPanel`

The three JavaScript entry graphs remain isolated. Their current public APIs
are:

- `giadaware-ui-components` exports `FormStatus`, `FormStatusTone`,
  `SocialIcon`, `SocialIconId` and `SOCIAL_ICON_IDS`;
- `giadaware-ui-components/visitor` remains empty and reserved;
- `giadaware-ui-components/studio` exports `ImageAttachmentControl` and the
  `ImageAttachmentControlLabels`, `ImageAttachmentCurrentImage`,
  `ImageAttachmentFileValidator`, `ImageAttachmentIntent`,
  `ImageAttachmentState` and `ImageAttachmentValidationError` types, plus
  `AsyncOperationPanel` and its public types.

See [AsyncOperationPanel](docs/async-operation-panel.md) for its state model,
snippet contract, accessibility behavior, examples, and styling hooks.

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
	ImageAttachmentState
} from 'giadaware-ui-components/studio';
```

`ImageAttachmentControl` is controlled through `value` and `onvaluechange`.
Its final intent is `keep`, `replace` (with a native `File`) or `remove`.
`currentImage` describes an existing image when one is available. Callers own
all labels and validation messages, and can configure `accept`, `maxSizeBytes`,
a custom `validator` and `disabled`.

```svelte
<script lang="ts">
	import { ImageAttachmentControl } from 'giadaware-ui-components/studio';
	import type {
		ImageAttachmentControlLabels,
		ImageAttachmentState
	} from 'giadaware-ui-components/studio';

	let value: ImageAttachmentState = $state({ intent: 'keep', file: null });

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
/>

<button type="button" onclick={() => save(value)}>Save</button>
```

The caller is responsible for interpreting and persisting the final intent.
The component provides no hidden removal field and no built-in persistence.

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

Registry publication is forbidden during private incubation.

Architecture and trial ownership are tracked in
https://github.com/gcomneno/atelier-kit/issues/127
