# Surface

`Surface` is available only from `giadaware-ui-components/studio`. It provides
neutral visual containment without creating a section, heading, landmark,
accessible name, interaction model, or application workflow.

## Public contract

The exported `SurfaceProps` contract contains:

- `children`: required content snippet;
- `class`: optional consumer class;
- `style`: optional inline style string, including documented custom properties.

The component deliberately does not forward arbitrary `div` attributes. Adding
roles, accessible names, data attributes, or other root attributes requires a
future explicit contract decision rather than accidental API expansion.

## Neutral form container

```svelte
<script lang="ts">
	import { Surface } from 'giadaware-ui-components/studio';
</script>

<Surface>
	<form method="post">
		<label>
			Display name
			<input name="displayName" />
		</label>
		<button type="submit">Save</button>
	</form>
</Surface>
```

The form, labels, controls, submission behavior and validation remain entirely
consumer-owned.

## Content inside a named navigation landmark

```svelte
<nav aria-label="Project resources">
	<Surface>
		<a href="/documentation">Documentation</a>
		<a href="/support">Support</a>
	</Surface>
</nav>
```

`Surface` does not become the navigation landmark. The surrounding `nav` owns
the landmark semantics and accessible name.

## Custom wrapper composition

```svelte
<article aria-labelledby="release-title">
	<h2 id="release-title">Current release</h2>

	<Surface class="release-summary">
		<p>Version 2.4 is ready for deployment.</p>
	</Surface>
</article>
```

Consumers choose the wrapper, heading hierarchy, IDs and accessible
relationships required by their document structure.

## Relationship with Panel

Use `Panel` when the content is a named document section that requires a visible
heading and deterministic `aria-labelledby` association.

Use `Surface` when only neutral visual containment is required or when the
consumer must choose the surrounding semantics. `Surface` must not be given
automatic section or heading behavior merely to imitate `Panel`.

Use `AsyncOperationPanel` when the content represents one controlled
asynchronous lifecycle with busy and result presentation.

## Accessibility responsibilities

`Surface` intentionally adds no role, landmark, heading or accessible name. The
consumer must:

- choose semantic wrappers when required;
- name surrounding landmarks;
- preserve native form and navigation semantics;
- provide headings and document hierarchy;
- ensure interactive descendants have accessible names.

Default border, foreground and background fallbacks provide a visible neutral
container, but consumers remain responsible for validating any overridden
colors.

## Styling

The supported custom properties are:

- `--giu-surface-padding`;
- `--giu-surface-border-width`;
- `--giu-surface-border-color`;
- `--giu-surface-border-radius`;
- `--giu-surface-color`;
- `--giu-surface-background`.

Margins, page placement, internal content layout, descendant spacing and
interactive-control styling remain consumer-owned.

## Determinism

For identical props, SSR output is deterministic. Hydration must reuse the
existing root and consumer nodes without introducing component-owned events,
state or semantic attributes.
