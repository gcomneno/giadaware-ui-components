# Panel

`Panel` is available only from `giadaware-ui-components/studio`. It renders one
named semantic section for related content and optional consumer-owned actions.

It is a structural presentation primitive. It does not own asynchronous state,
form submission, navigation, focus management, events, live regions, or domain
workflow.

## Public contract

The exported `PanelProps` contract contains:

- `title`: required visible section title;
- `children`: required body snippet;
- `description`: optional explanatory snippet rendered below the title;
- `actions`: optional consumer-provided action region;
- `headingLevel`: optional native heading level from `2` through `6`, defaulting
  to `2`;
- `id`: optional section identifier;
- `class`: optional consumer class;
- `style`: optional inline style string, including documented custom properties.

`PanelHeadingLevel` is the closed union `2 | 3 | 4 | 5 | 6`.

The component deliberately does not forward arbitrary section attributes. New
public attributes require an explicit contract decision rather than accidental
surface expansion.

## Example

```svelte
<script lang="ts">
	import { Button, Panel } from 'giadaware-ui-components/studio';
</script>

<Panel
	title="Publishing settings"
	headingLevel={3}
	id="publishing-settings"
>
	{#snippet description()}
		Configure how the current document is published.
	{/snippet}

	{#snippet actions()}
		<Button variant="secondary">Open preview</Button>
	{/snippet}

	<label>
		Publication channel
		<select>
			<option>Preview</option>
			<option>Live</option>
		</select>
	</label>
</Panel>
```

The snippets remain consumer-owned. Their controls, labels, events, validation,
submission, navigation, permissions, and domain meaning are outside `Panel`.

## Semantics and accessibility

The root is a native `section` whose `aria-labelledby` references the visible
heading. Supplying `id` produces predictable identifiers based on that value.
Without an explicit identifier, Svelte supplies a stable generated identifier
for SSR and hydration.

The consumer must choose a heading level that fits the surrounding document
outline. `headingLevel` changes only the native heading element; it does not
alter visual importance automatically.

The optional description is explanatory content, not a live region. The
optional actions snippet receives no toolbar, group, or navigation semantics
from `Panel`; consumers must add semantics to their own controls when required.

## Responsibility boundaries

Use `Panel` when content forms a named document section with a visible heading.

A future `Surface` primitive is separate: it may provide neutral visual
containment without requiring a title, heading, or section landmark. `Panel`
must not become a generic decorative wrapper merely to cover that use case.

Use `AsyncOperationPanel` when the content represents one controlled
asynchronous lifecycle. That component owns busy and result presentation,
state-specific accessibility behavior, and optional technical details.
`Panel` owns none of those responsibilities.

## Styling

Consumer classes and inline styles compose with the scoped component styles.

The supported neutral custom properties are:

- `--giu-panel-gap`;
- `--giu-panel-padding`;
- `--giu-panel-border-width`;
- `--giu-panel-border-color`;
- `--giu-panel-border-radius`;
- `--giu-panel-color`;
- `--giu-panel-background`;
- `--giu-panel-header-gap`;
- `--giu-panel-title-size`;
- `--giu-panel-description-gap`;
- `--giu-panel-description-color`.

Margins, page placement, responsive layout around the panel, action-control
styling, and body-content styling remain consumer-owned.

## Determinism

For identical props, SSR output is deterministic. Hydration reuses the existing
section, header, heading, and body nodes and does not start work, attach
component-owned events, or mutate consumer state.
