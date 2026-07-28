# PageIntro

`PageIntro` is available only from `giadaware-ui-components/studio`. It renders one semantic paragraph for short introductory content placed before the primary controls, panels or panel groups of a Studio page.

```svelte
<script lang="ts">
	import { PageIntro } from 'giadaware-ui-components/studio';
</script>

<PageIntro>Manage the current document.</PageIntro>

<PageIntro>
	Manage the current document and
	<a href="/preview" target="_blank" rel="noreferrer">open its preview</a>.
</PageIntro>
```

## Public contract

`PageIntroProps` requires `children: Snippet` and accepts optional `class` and `style` values.

The root is always a native `<p>`. Snippet content may contain plain text or mixed inline content such as links. The component does not construct links, resolve translations or interpret HTML strings.

Consumer classes compose with `giu-page-intro`. The standard inline `style` attribute is forwarded and may define ordinary declarations or supported custom properties.

## CSS custom properties

- `--giu-page-intro-margin`, default `0 0 1rem`;
- `--giu-page-intro-color`, default `#303030`;
- `--giu-page-intro-line-height`, default `1.5`;
- `--giu-page-intro-link-color`, default `currentColor`.

Every property is optional and has a neutral fallback. Link color remains consumer-controlled and supplied links retain their native attributes and behavior.

## Accessibility and responsibility boundary

`PageIntro` preserves native paragraph semantics. It does not add a role, live region, landmark or accessible-name mechanism.

The consumer owns:

- translated text;
- link destinations, targets and relationships;
- placement within the page;
- application-specific theming.

Use a real heading for page titles and hierarchy. Use an alert or status component for feedback that must be announced. Use a panel component for structured or landmark-like content. `PageIntro` is not a breadcrumb, help panel or arbitrary-root typography wrapper.
