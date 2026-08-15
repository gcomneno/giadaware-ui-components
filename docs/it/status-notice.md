[English](../status-notice.md) | [Italiano](status-notice.md)

# StatusNotice

`StatusNotice` e' una notice componibile dall'entry root per testo di stato persistente a livello pagina o sezione.

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

## Contratto

Importalo da `giadaware-ui-components`. Non importarlo dall'entry point Studio.

`title` e' testo richiesto risolto dal consumatore. `children` e' contenuto rich body opzionale. `icon` e' contenuto decorativo opzionale di proprieta' del consumatore ed e' wrappato in `aria-hidden="true"`. `actions` e' contenuto action opzionale di proprieta' del consumatore.

I controlli interattivi ricchi dovrebbero essere posizionati in `actions`, non nel corpo dell'annuncio live. Le regioni action e dismiss sono renderizzate fuori dalla sottoregione di annuncio live.

## Annuncio

`StatusNotice` e' statico per default. Le modifiche di tone cambiano solo la presentazione e non implicano mai comportamento live-region.

Imposta `announcement="polite"` per aggiungere `role="status"`, `aria-live="polite"` e `aria-atomic="true"` alla sottoregione titolo/corpo. Imposta `announcement="assertive"` per aggiungere `role="alert"`, `aria-live="assertive"` e `aria-atomic="true"` alla stessa sottoregione.

Valori runtime `tone` invalidi vengono normalizzati a `info`. Valori runtime `announcement` invalidi vengono normalizzati a output statico senza ruolo, `aria-live` o `aria-atomic`.

## Chiusura controllata

La chiusura e' solo controllata. `StatusNotice` non nasconde mai se stesso.

Il controllo close e' un `type="button"` nativo ed e' renderizzato solo quando esiste `onDismiss` e `closeLabel` e' non vuoto dopo il trim. Attivarlo chiama `onDismiss()`. I consumatori possiedono se la notice resta montata, come si muove il focus, comportamento Escape, persistenza, timer, code, portal e stato applicativo.

## Stili

La root riceve `giu-status-notice`,
`giu-status-notice--info | --success | --warning | --error` e
`data-giu-tone`.

La personalizzazione CSS usa custom properties neutre di proprieta' del pacchetto con fallback, incluse:

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

## Distinzione da FormStatus

Usa `FormStatus` per il comportamento di stato delle operazioni form esistente, inclusa la sua responsabilita' attuale per chiusura temporizzata del browser e semantica live-region guidata dal tone.

Usa `StatusNotice` per notice statiche componibili dove l'annuncio e' esplicito e opzionale, le azioni sono di proprieta' del consumatore e la chiusura e' controllata dal consumatore.

`StatusNotice` non e' un sistema toast. Code toast, timer, stacking, portal, ripristino del focus, comportamento Escape e persistenza restano responsabilita' future dell'applicazione o di un componente, non parte di questa primitiva.
