[English](../button.md) | [Italiano](button.md)

# Button

`Button` e' disponibile solo da `giadaware-ui-components/studio`. Renderizza sempre un `button` nativo, preserva i comportamenti nativi di focus, tastiera, click, form e disabled, e usa come default `type="button"` per evitare submit accidentali di form.

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

## Contratto pubblico

`ButtonVariant` e' la union chiusa `primary | secondary | danger`. `ButtonSize` e' `default | compact`. Entrambe le prop normalizzano valori runtime non tipizzati e sconosciuti a `primary` e `default`. Il contenuto visibile dello snippet `children` e' richiesto e resta responsabile del nome accessibile del pulsante.

`leading` e `trailing` sono snippet di presentazione opzionali intorno all'etichetta principale. I loro wrapper sono `aria-hidden="true"`, quindi icone, spinner, badge e altri indicatori decorativi non alterano o duplicano il nome accessibile del pulsante. Questi snippet non devono contenere discendenti interattivi o focusable.

`ButtonProps` si basa sul tipo nativo pubblico `HTMLButtonAttributes` di Svelte. Gli attributi e handler nativi applicabili ai button, inclusi `disabled`, `name`, `value`, `form`, `formaction`, `formmethod`, `formenctype`, `formnovalidate`, `formtarget`, `autofocus`, `aria-*`, `data-*` e `onclick`, sono inoltrati all'elemento nativo. `type="submit"` e `type="reset"` espliciti mantengono il loro comportamento nativo di form.

Le classi del consumatore si compongono con le classi `giu-button` del componente. L'attributo inline standard `style` viene inoltrato e puo' impostare dichiarazioni ordinarie o custom properties supportate.

## Contenuto leading e trailing

Il componente possiede solo il layout delle tre regioni: contenuto leading opzionale, etichetta richiesta e contenuto trailing opzionale. Le regioni leading e trailing non si restringono; l'etichetta puo' restringersi e andare a capo dentro contenitori stretti.

```svelte
{#snippet saveIcon()}
	<svg viewBox="0 0 16 16" width="16" height="16">
		<path d="M3 8h10" />
	</svg>
{/snippet}

<Button leading={saveIcon}>Save changes</Button>
```

Un indicatore pending di proprieta' del consumatore puo' usare la stessa regione di presentazione mentre il consumatore controlla esplicitamente la semantica del lifecycle:

```svelte
<Button
	aria-busy={saving}
	trailing={saving ? pendingIndicator : undefined}
>
	Save changes
</Button>
```

`Button` non imposta `aria-busy`, non disabilita se stesso, non annuncia status e non crea spinner. Se uno stato pending richiede un annuncio, il consumatore deve fornire quello status fuori dalle regioni leading/trailing solo di presentazione.

## CSS custom properties

- Colori base: `--giu-button-color`, `--giu-button-background`, `--giu-button-border-color`.
- Colori hover: `--giu-button-hover-color`, `--giu-button-hover-background`, `--giu-button-hover-border-color`.
- Colori active: `--giu-button-active-color`, `--giu-button-active-background`, `--giu-button-active-border-color`.
- Forma e spaziatura: `--giu-button-border-width`, `--giu-button-border-radius`, `--giu-button-padding`, `--giu-button-compact-padding`, `--giu-button-content-gap`.
- Tipografia: `--giu-button-font-weight`.
- Indicatore di focus: `--giu-button-focus-width`, `--giu-button-focus-color`, `--giu-button-focus-offset`.
- Presentazione disabled: `--giu-button-disabled-opacity`.

Ogni property e' opzionale e ha un fallback neutro. Gli stili sono scoped e non influenzano pulsanti non correlati.

## Confine di responsabilita'

`Button` presenta un singolo controllo nativo. Non ha stato pending, spinner, risultato, conferma, live region o esecuzione asincrona. Usa `AsyncOperationPanel` per presentare un lifecycle asincrono di proprieta' del consumatore, posizionando `Button` nel suo snippet action quando appropriato.

Gli snippet leading e trailing arricchiscono solo pulsanti testuali. I pulsanti solo icona restano un componente separato con un contratto distinto di nome accessibile e dimensione del target. Anche link e layout di gruppi di azioni restano responsabilita' separate.
