# AsyncOperationPanel

`AsyncOperationPanel` is available only from `giadaware-ui-components/studio`. It presents one consumer-controlled operation without starting work or coordinating other panels.

## State and props

The public `AsyncOperationPanelProps` union has five states:

- `idle` accepts neither `message`, `busyLabel`, nor `result` and creates no live region.
- `running` requires the consumer-written `busyLabel` and accepts neither `message` nor `result`.
- `success`, `warning`, and `error` require a human-readable `message`, reject `busyLabel`, and optionally accept a `result` snippet.

Every state requires `title` and the named `action: Snippet`. Every state also accepts `description?: Snippet`, `headingLevel?: 2 | 3 | 4 | 5 | 6`, `id`, `class`, and `style`. `headingLevel` defaults to `2`; invalid untyped runtime values normalize to `2`. The panel's deterministic `aria-labelledby` always refers to the rendered native heading.

The action is consumer-provided so native button, form, focus, disabled, and submission behavior stays under consumer control. The action region remains present in terminal states. The consumer owns lifecycle changes, domain-result mapping, duplicate-submission policy, retries, and locking across operations. The component owns only structure and presentation.

Running uses the internal FormStatus presentation with `info`, `role="status"`, and a polite announcement while the panel has `aria-busy="true"`. Success and warning use their matching tones with status semantics. Error uses the error tone and FormStatus's assertive alert semantics. Messages remain persistent, and the panel does not add a second live region or move focus.

Technical output is provided with `technicalDetails`; `technicalDetailsLabel` is then required. It is escaped plain text inside `pre`, never HTML. The native, uncontrolled `details` disclosure defaults closed and is initialized open only when `technicalDetailsInitiallyExpanded` is true.

## Minimal example

```svelte
<script lang="ts">
	import { AsyncOperationPanel } from 'giadaware-ui-components/studio';
</script>

<AsyncOperationPanel state="running" title="Refresh index" busyLabel="Refreshing index">
	{#snippet action()}
		<form method="post"><button disabled>Refresh</button></form>
	{/snippet}
</AsyncOperationPanel>
```

## Consumer-owned mutual exclusion

```svelte
<script lang="ts">
	import { AsyncOperationPanel } from 'giadaware-ui-components/studio';

	type State = 'idle' | 'running';

	let first = $state<State>('idle');
	let second = $state<State>('idle');

	const locked = $derived(first === 'running' || second === 'running');
</script>

{#snippet firstAction()}
	<button disabled={locked} onclick={() => first = 'running'}>
		Run first
	</button>
{/snippet}

{#snippet secondAction()}
	<button disabled={locked} onclick={() => second = 'running'}>
		Run second
	</button>
{/snippet}

{#if first === 'running'}
	<AsyncOperationPanel
		state="running"
		title="First operation"
		busyLabel="Running first operation"
		action={firstAction}
	/>
{:else}
	<AsyncOperationPanel
		state="idle"
		title="First operation"
		action={firstAction}
	/>
{/if}

{#if second === 'running'}
	<AsyncOperationPanel
		state="running"
		title="Second operation"
		busyLabel="Running second operation"
		action={secondAction}
	/>
{:else}
	<AsyncOperationPanel
		state="idle"
		title="Second operation"
		action={secondAction}
	/>
{/if}
```

Each consumer keeps its own lifecycle and result state. The shared `locked`
policy belongs to the containing application; panels neither discover nor
coordinate one another.

## CSS custom properties

- `--giu-async-operation-panel-gap`
- `--giu-async-operation-panel-padding`
- `--giu-async-operation-panel-border-width`
- `--giu-async-operation-panel-border-color`
- `--giu-async-operation-panel-border-radius`
- `--giu-async-operation-panel-color`
- `--giu-async-operation-panel-background`
- `--giu-async-operation-panel-title-size`
- `--giu-async-operation-panel-focus-width`
- `--giu-async-operation-panel-focus-color`
- `--giu-async-operation-panel-focus-offset`
- `--giu-async-operation-panel-details-gap`
- `--giu-async-operation-panel-details-font-family`

All properties are optional and have neutral fallbacks.
