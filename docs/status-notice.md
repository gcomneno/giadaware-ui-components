# StatusNotice

`StatusNotice` is a root-entry composable notice for persistent page-level or
section-level status copy.

```svelte
<script lang="ts">
	import { StatusNotice } from 'giadaware-ui-components';
</script>

{#snippet body()}
	<p>The public page will update after the cache refresh completes.</p>
{/snippet}

{#snippet actions()}
	<a href="/preview">Preview</a>
	<button type="button">Retry</button>
{/snippet}

<StatusNotice
	title="Publish queued"
	tone="warning"
	announcement="polite"
	{actions}
	onDismiss={() => dismissed = true}
	closeLabel="Dismiss notice"
>
	{@render body()}
</StatusNotice>
```

## Contract

Import it from `giadaware-ui-components`. Do not import it from the Studio
entry point.

`title` is required consumer-resolved text. `children` is optional rich body
content. `icon` is optional consumer-owned decorative content and is wrapped in
`aria-hidden="true"`. `actions` is optional consumer-owned action content.

Rich interactive controls should be placed in `actions`, not in the live
announcement body. The action and dismissal regions are rendered outside the
live announcement subregion.

## Announcement

`StatusNotice` is static by default. Tone changes presentation only and never
implies live-region behavior.

Set `announcement="polite"` to add `role="status"`, `aria-live="polite"` and
`aria-atomic="true"` to the title/body subregion. Set
`announcement="assertive"` to add `role="alert"`, `aria-live="assertive"` and
`aria-atomic="true"` to that same subregion.

Invalid runtime `tone` values normalize to `info`. Invalid runtime
`announcement` values normalize to static output with no role, `aria-live` or
`aria-atomic`.

## Dismissal

Dismissal is controlled only. `StatusNotice` never hides itself.

The close control is a native `type="button"` and is rendered only when
`onDismiss` exists and `closeLabel` is nonblank after trimming. Activating it
calls `onDismiss()`. Consumers own whether the notice remains mounted, how focus
moves, Escape behavior, persistence, timers, queues, portals and application
state.

## Styling

The root receives `giu-status-notice`,
`giu-status-notice--info | --success | --warning | --error` and
`data-giu-tone`.

CSS customization uses package-owned neutral custom properties with fallbacks,
including:

- `--giu-status-notice-gap`
- `--giu-status-notice-padding`
- `--giu-status-notice-border-width`
- `--giu-status-notice-border-color`
- `--giu-status-notice-border-radius`
- `--giu-status-notice-color`
- `--giu-status-notice-background`
- `--giu-status-notice-line-height`
- `--giu-status-notice-actions-gap`
- `--giu-status-notice-dismiss-*`

## FormStatus Distinction

Use `FormStatus` for the existing form-operation status behavior, including its
current responsibility for timed browser dismissal and tone-driven live-region
semantics.

Use `StatusNotice` for composable static notices where announcement is explicit
and optional, actions are consumer-owned, and dismissal is controlled by the
consumer.

`StatusNotice` is not a toast system. Toast queues, timers, stacking,
portals, focus restoration, Escape behavior and persistence remain future
application or component responsibilities, not part of this primitive.
