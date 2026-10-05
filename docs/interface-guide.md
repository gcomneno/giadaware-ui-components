[English](interface-guide.md) | [Italiano](it/interface-guide.md)

# GiadaWare UI interface guide

This guide is the consumer-facing entry point for adopting `giadaware-ui-components`
from a Svelte application.

It documents package-wide interface rules, ownership boundaries, integration
patterns and the current public component surface. Focused component documents
remain authoritative for component-specific props, state models, styling hooks
and behavioral details.

## Package status

`giadaware-ui-components` is currently a public GitHub repository containing a
Svelte package under private incubation.

The package manifest uses `private: true`, so registry publication is blocked.
Packability and registry publication are intentionally separate concerns.

During incubation, consumers may use reviewed immutable package artifacts or pin
the repository at an exact Git commit. Do not depend on a moving branch.

The public peer dependency is Svelte `^5.0.0`.

## Public entry points

There are three JavaScript entry points:

```ts
import {
	FormStatus,
	SocialIcon,
	SocialLink,
	StatusNotice
} from 'giadaware-ui-components';

import {
	ImageLightbox,
	RelationshipGraph
} from 'giadaware-ui-components/visitor';

import {
	AsyncOperationPanel,
	Button,
	Checkbox,
	EditableList,
	EditableListRow,
	FieldDescription,
	FieldError,
	FieldLabel,
	FormActions,
	IconButton,
	ImageAttachmentControl,
	ImageFocalPointControl,
	PageIntro,
	Panel,
	Radio,
	ReorderActions,
	ReorderAnnouncement,
	Surface
} from 'giadaware-ui-components/studio';
```

Use only declared package exports.

Do not import implementation files from `src/` or infer public API from files
that happen to exist in `src/` or `dist/`.

## CSS entry points

CSS is explicit and is not auto-imported:

```ts
import 'giadaware-ui-components/styles.css';
import 'giadaware-ui-components/visitor/styles.css';
import 'giadaware-ui-components/studio/styles.css';
```

Import only the stylesheet families needed by the application.

Public component styling uses documented CSS custom properties. Internal
descendant classes are not automatically public API.

The package does not hide network, font, telemetry or remote asset dependencies
inside its public CSS.

## Ownership model

GiadaWare UI owns reusable presentation and interaction contracts:

- reusable presentation;
- component interaction semantics;
- accessibility behavior explicitly assigned to the component;
- controlled-state contracts;
- neutral styling hooks;
- deterministic SSR and hydration behavior.

The consuming application owns domain and orchestration concerns:

- routes and navigation policy;
- SvelteKit form actions;
- fetch and Promise orchestration;
- persistence and schemas;
- localization lookup and domain-facing copy;
- confirmation policy;
- cross-operation coordination;
- interpretation of domain results;
- deployment and application-specific infrastructure.

A shared component must not silently absorb application behavior merely because
that behavior is adjacent in a consumer.

## State and Svelte bindings

Use the component's declared state contract rather than inventing parallel state.

### Checkbox

`Checkbox` is one visible native checkbox. Its checked state uses Svelte's native
binding:

```svelte
<script lang="ts">
	import { Checkbox } from 'giadaware-ui-components/studio';

	let accepted = $state(false);
</script>

<label>
	<Checkbox
		bind:checked={accepted}
		name="terms"
		value="accepted"
		required
	/>
	Accept the terms
</label>
```

The consumer owns the label, grouping, validation and collection state.

### Radio

`Radio` is one visible native radio input. Selection uses `bind:group`, not
`bind:checked`:

```svelte
<script lang="ts">
	import { Radio } from 'giadaware-ui-components/studio';

	let importance = $state('normal');
</script>

<fieldset>
	<legend>Importance</legend>

	<label>
		<Radio bind:group={importance} name="importance" value="low" />
		Low
	</label>

	<label>
		<Radio bind:group={importance} name="importance" value="normal" />
		Normal
	</label>
</fieldset>
```

`value` is required. The browser derives the checked state from the group value
and each radio value.

### Controlled components

Some components use explicit value/callback contracts instead of Svelte bindings.

For example, `ImageAttachmentControl` is controlled through `value` and
`onvaluechange`. `ImageLightbox` uses `open` and `onopenchange`.

Keep application state in the consumer unless the focused component contract
states otherwise.

## Native forms

Native HTML semantics are preserved wherever possible.

`Button`, `Checkbox` and `Radio` render native controls and keep applicable form
behavior. Do not replace their semantics with synthetic roles.

The consumer remains responsible for form architecture, validation policy,
server actions, IDs and relationships not explicitly owned by a component.

Typical form composition:

```svelte
<script lang="ts">
	import {
		Button,
		FieldDescription,
		FieldError,
		FieldLabel,
		FormActions
	} from 'giadaware-ui-components/studio';

	let invalid = $state(false);
</script>

<form method="post">
	<label for="display-name">
		<FieldLabel
			label="Display name"
			required
			requiredLabel="Required"
		/>
	</label>

	<input
		id="display-name"
		name="displayName"
		required
		aria-invalid={invalid || undefined}
		aria-describedby="display-name-help display-name-error"
	/>

	<FieldDescription
		id="display-name-help"
		text="Shown on your public profile."
	/>

	<FieldError
		id="display-name-error"
		text={invalid ? 'Use at least three characters.' : ''}
		announce={invalid}
	/>

	<FormActions align="end">
		<Button type="submit">Save changes</Button>
	</FormActions>
</form>
```

`FieldLabel`, `FieldDescription` and `FieldError` do not generate control IDs or
mutate the control's ARIA relationships. Those relationships are
consumer-owned.

## Accessibility contract

Accessibility is part of the public API.

Prefer native semantics and preserve the component/consumer responsibility
boundary documented for each primitive.

Consumers must provide accessible names and semantic grouping where those are
consumer-owned. Typical examples include:

- labels for `Checkbox` and `Radio`;
- `fieldset` and `legend` for radio or checkbox groups;
- translated control labels;
- IDs and `aria-describedby` relationships;
- navigation semantics around neutral containers;
- toolbar semantics only when the interface actually implements a toolbar.

Do not add synthetic ARIA roles to native controls merely to reproduce a visual
pattern.

A component rendering successfully is not sufficient evidence of accessibility.

## SSR and hydration

Equivalent input must produce deterministic server-rendered output.

Browser-only behavior must not execute during SSR. Hydration must not
unexpectedly start work, mutate consumer state, change controlled values,
duplicate semantic/live regions or replace stable nodes without contractual
reason.

The package verifies SSR, browser behavior and hydration as separate boundaries.
A consumer should preserve those boundaries when wrapping shared components.

## Styling and theming

Consumer `class` and `style` compose with component presentation where documented.

Stable customization is provided primarily through component-specific CSS custom
properties such as:

```css
.my-save-button {
	--giu-button-background: #202020;
	--giu-button-color: #ffffff;
}

.my-radio {
	--giu-radio-size: 1.25rem;
}
```

Use only documented custom properties as stable theming hooks.

Do not depend on private descendant selectors or generated implementation
details.

Forced-colors behavior is explicitly supported by controls such as `Checkbox`
and `Radio`; avoid overriding it with consumer CSS that makes native state
invisible.

## Component map

| Component family | Entry point | Main responsibility | Consumer retains |
| --- | --- | --- | --- |
| `FormStatus` | root | persistent or timed status presentation | message content and lifecycle inputs |
| `StatusNotice` | root | composable notice presentation | domain meaning, actions and policy |
| `SocialIcon` | root | approved social icon geometry | surrounding semantics and trademark-appropriate use |
| `SocialLink` | root | accessible icon/link composition | href, routes, target/rel policy, copy |
| `ImageLightbox` | visitor | controlled single-image modal | gallery state, navigation controls, translations |
| `RelationshipGraph` | visitor | graph presentation and interaction | routing, localization and application state |
| `Button` | studio | one native text button | async lifecycle and workflow |
| `IconButton` | studio | one named icon-only native button | tooltip/help policy and workflow |
| `Checkbox` | studio | one native checkbox | labels, grouping and validation |
| `Radio` | studio | one native radio | labels, grouping and selected application state |
| `FieldLabel` | studio | field-label presentation | semantic label association and IDs |
| `FieldDescription` | studio | static descriptive text | ARIA relationships and IDs |
| `FieldError` | studio | validation error presentation | validation logic and focus policy |
| `FormActions` | studio | action-row layout | child behavior and toolbar semantics |
| `Panel` | studio | one named semantic section | forms, workflows and async state |
| `Surface` | studio | neutral visual containment | landmark/section/form semantics |
| `PageIntro` | studio | semantic introductory paragraph | copy, links and page placement |
| `AsyncOperationPanel` | studio | presentation of one controlled operation | execution, retries and cross-operation locking |
| `ImageAttachmentControl` | studio | controlled image-file intent | persistence and upload transport |
| `ImageFocalPointControl` | studio | controlled focal-point interaction | persistence and domain interpretation |
| `EditableList` family | studio | reusable ordered-list structure and reorder interaction | collection/domain state and persistence |

## Choosing between related primitives

Use `Panel` when content is a named semantic section with a visible heading.

Use `Surface` when only neutral visual containment is required.

Use `Button` for a text button and `IconButton` for an icon-only button with its
own accessible-name contract.

Use `Checkbox` for native checkbox semantics. Do not convert it into a switch.

Use `Radio` for one choice within a native radio group. GiadaWare UI intentionally
does not provide a `RadioGroup` abstraction.

Use `FormActions` for action layout. It is not a toolbar and does not implement
arrow-key toolbar behavior.

Use `AsyncOperationPanel` to present an operation lifecycle. It does not execute
the operation or coordinate sibling operations.

Use `ImageLightbox` for one controlled modal image. It is not a gallery.

## Anti-patterns

Do not:

- import from `src/` or undocumented `dist/` paths;
- treat every implementation file as public API;
- rely on internal descendant CSS classes;
- add application routes, persistence or translations to shared primitives;
- recreate native controls with synthetic roles;
- use `bind:checked` with `Radio`;
- turn `Checkbox` into `role="switch"`;
- make `FormActions` behave like a toolbar without a dedicated contract;
- use `Panel` as a semantics-free decorative wrapper;
- make `Surface` invent section or landmark semantics;
- make `AsyncOperationPanel` start asynchronous work;
- make `ImageLightbox` infer gallery state;
- assume SSR success proves browser or hydration correctness;
- assume source-tree behavior proves packed-consumer behavior.

## Distribution during incubation

For Git-based consumption, pin an exact reviewed commit.

Consumers must still import only declared package exports. The repository's
`prepare` lifecycle materializes `dist/` for Git dependency installation.

Registry publication remains forbidden while `private: true` and the explicit
publication guard remain in force.

See [Git dependency consumption](git-dependency-consumption.md) and
[Releases](releases.md).

## Component references

Focused documentation provides the complete contract for each family:

- [AsyncOperationPanel](async-operation-panel.md)
- [Button](button.md)
- [Checkbox](checkbox.md)
- [EditableList family](editable-list.md)
- [FieldDescription and FieldError](field-description-error.md)
- [FieldLabel](field-label.md)
- [FormActions](form-actions.md)
- [IconButton](icon-button.md)
- [ImageFocalPointControl](image-focal-point-control.md)
- [ImageLightbox](image-lightbox.md)
- [PageIntro](page-intro.md)
- [Panel](panel.md)
- [Radio](radio.md)
- [RelationshipGraph](relationship-graph.md)
- [SocialLink](social-link.md)
- [StatusNotice](status-notice.md)
- [Surface](surface.md)

The root README remains authoritative for public components that do not yet have
a dedicated focused page.

## Integration checklist

Before adopting a component:

1. import it from the correct public entry point;
2. import the matching explicit CSS entry when its presentation is required;
3. read the focused component contract;
4. identify component-owned and consumer-owned responsibilities;
5. preserve native form and accessibility semantics;
6. keep domain orchestration outside the library component;
7. use documented state/binding contracts;
8. use only documented CSS hooks;
9. preserve deterministic SSR/hydration assumptions;
10. pin an immutable package revision during private incubation.
