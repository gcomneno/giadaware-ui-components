[English](../async-operation-panel.md) | [Italiano](async-operation-panel.md)

# AsyncOperationPanel

`AsyncOperationPanel` e' disponibile solo da `giadaware-ui-components/studio`. Presenta una singola operazione controllata dal consumatore senza avviare lavoro o coordinare altri pannelli.

## Stato e prop

La union pubblica `AsyncOperationPanelProps` ha cinque stati:

- `idle` non accetta `message`, `busyLabel` o `result` e non crea live region.
- `running` richiede `busyLabel` scritto dal consumatore, accetta `progress` opzionale e non accetta `message` o `result`.
- `success`, `warning` ed `error` richiedono un `message` leggibile da persone, rifiutano `busyLabel` e `progress`, e accettano opzionalmente uno snippet `result`.

Ogni stato richiede `title` e la `action: Snippet` nominata. Ogni stato accetta anche `description?: Snippet`, `headingLevel?: 2 | 3 | 4 | 5 | 6`, `id`, `class` e `style`. `headingLevel` ha default `2`; valori runtime non tipizzati invalidi vengono normalizzati a `2`. L'`aria-labelledby` deterministico del panel fa sempre riferimento all'heading nativo renderizzato.

L'action e' fornita dal consumatore cosi' comportamento nativo di button, form, focus, disabled e submit resta sotto controllo del consumatore. La regione action resta presente negli stati terminali. Il consumatore possiede cambi di lifecycle, mapping dei risultati di dominio, policy di submit duplicato, retry e lock tra operazioni. Il componente possiede solo struttura e presentazione.

Running usa la presentazione interna FormStatus con `info`, `role="status"` e un annuncio polite mentre il panel ha `aria-busy="true"`. Success e warning usano i tone corrispondenti con semantica status. Error usa il tone error e la semantica alert assertive di FormStatus. I messaggi restano persistenti e il panel non aggiunge una seconda live region ne' sposta il focus.

Il progress opzionale durante running e' un piccolo contratto di presentazione:

```ts
type AsyncOperationProgress =
	| { mode: 'indeterminate'; label: string }
	| { mode: 'determinate'; label: string; value: number; max: number };
```

Il progress viene renderizzato solo mentre lo stato normalizzato e' `running` e l'input progress e' valido. Progress runtime non tipizzato invalido e' omesso, tranne numeri determinate invalidi che vengono normalizzati a un elemento nativo `progress` indeterminate con la label fornita. I valori determinate sono clampati a `0...max`; `value` e `max` finiti sono altrimenti preservati esattamente e non vengono arrotondati.

Progress usa semantica nativa `progress` con una label richiesta del consumatore. Non aggiunge `role`, `aria-valuenow`, `aria-valuemax`, `aria-valuetext` o `aria-live`. Mantieni `busyLabel` come status polite stabile per l'operazione; non inserire aggiornamenti percentuali ad alta frequenza in `busyLabel`.

L'output tecnico viene fornito con `technicalDetails`; `technicalDetailsLabel` diventa quindi richiesto. E' testo semplice escapato dentro `pre`, mai HTML. La disclosure nativa non controllata `details` ha default chiuso ed e' inizializzata aperta solo quando `technicalDetailsInitiallyExpanded` e' true.

## Esempio minimo

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

## Esempio progress

```svelte
<AsyncOperationPanel
	state="running"
	title="Upload media"
	busyLabel="Uploading media"
	progress={{ mode: 'determinate', label: 'Upload progress', value: bytesSent, max: totalBytes }}
>
	{#snippet action()}
		<button disabled>Upload</button>
	{/snippet}
</AsyncOperationPanel>
```

## Mutua esclusione di proprieta' del consumatore

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

Ogni consumatore mantiene il proprio lifecycle e stato risultato. La policy condivisa `locked` appartiene all'applicazione contenitrice; i panel non si scoprono ne' si coordinano tra loro.

## CSS custom properties

- `--giu-async-operation-panel-gap`
- `--giu-async-operation-panel-padding`
- `--giu-async-operation-panel-border-width`
- `--giu-async-operation-panel-border-color`
- `--giu-async-operation-panel-border-radius`
- `--giu-async-operation-panel-color`
- `--giu-async-operation-panel-background`
- `--giu-async-operation-panel-title-size`
- `--giu-async-operation-panel-progress-height`
- `--giu-async-operation-panel-progress-background`
- `--giu-async-operation-panel-progress-color`
- `--giu-async-operation-panel-progress-border-width`
- `--giu-async-operation-panel-progress-border-color`
- `--giu-async-operation-panel-progress-radius`
- `--giu-async-operation-panel-focus-width`
- `--giu-async-operation-panel-focus-color`
- `--giu-async-operation-panel-focus-offset`
- `--giu-async-operation-panel-details-gap`
- `--giu-async-operation-panel-details-font-family`

Tutte le property sono opzionali e hanno fallback neutri.
