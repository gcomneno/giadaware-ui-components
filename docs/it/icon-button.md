[English](../icon-button.md) | [Italiano](icon-button.md)

# IconButton

`IconButton` e' disponibile solo da `giadaware-ui-components/studio`. Rappresenta un singolo pulsante nativo solo icona con un nome accessibile richiesto e di proprieta' del consumatore.

```svelte
<script lang="ts">
	import { IconButton } from 'giadaware-ui-components/studio';
</script>

{#snippet editIcon()}
	<svg viewBox="0 0 16 16" width="16" height="16">
		<path d="M2 12l2 2 9-9-2-2z" />
	</svg>
{/snippet}

<IconButton label="Edit item" icon={editIcon} />
```

## Contratto pubblico

`IconButtonProps` richiede:

- `label: string`: nome accessibile risolto dal consumatore;
- `icon: Snippet`: geometria visuale dell'icona.

`variant` usa la union `ButtonVariant` esistente `primary | secondary | danger`.
`size` usa la union `ButtonSize` esistente `default | compact`.
Valori runtime non tipizzati e sconosciuti di variant e size vengono normalizzati tramite lo stesso contratto di `Button`.

`type` ha default `button`. I consumatori possono usare esplicitamente un altro tipo nativo valido di button quando necessario.

Il `label` richiesto viene sottoposto a trim prima dell'uso. Un valore runtime mancante, non stringa, vuoto o composto solo da whitespace fallisce in modo chiuso: non viene renderizzato alcun pulsante senza nome. Le build di sviluppo emettono un warning diagnostico; le build di produzione non emettono warning.

`aria-label` e `aria-labelledby` sono riservati dal componente, quindi non possono sostituire il contratto `label` richiesto. Gli altri attributi nativi applicabili restano componibili, inclusi `disabled`, attributi form, `aria-describedby`, `aria-pressed`, `aria-expanded`, attributi data ed event handler.

## Contratto dell'icona decorativa

Lo snippet icona viene renderizzato dentro un wrapper `aria-hidden="true"`. La sua geometria quindi non contribuisce al nome accessibile del pulsante.

Lo snippet deve contenere solo presentazione. Non deve contenere link, pulsanti, controlli form o altri discendenti focusable/interattivi.

Giada UI non dipende da un registro icone o da una libreria di icone.

## Dimensione del target

Il target del controllo default e' almeno `2.75rem` (44px alla dimensione root di default del browser). Il target compact e' almeno `2.5rem` (40px).

Compact e' una scelta deliberata del consumatore e resta piu' grande della geometria dell'icona stessa.

## Guida e confine tooltip

`IconButton` non implementa un tooltip.

Un consumatore puo' fornire attributi nativi ordinari come `title` o associare testo esplicativo visibile tramite `aria-describedby`, ma nessuno dei due meccanismi sostituisce il `label` richiesto.

## CSS custom properties

- Colori base: `--giu-icon-button-color`, `--giu-icon-button-background`, `--giu-icon-button-border-color`.
- Colori hover: `--giu-icon-button-hover-color`, `--giu-icon-button-hover-background`, `--giu-icon-button-hover-border-color`.
- Colori active: `--giu-icon-button-active-color`, `--giu-icon-button-active-background`, `--giu-icon-button-active-border-color`.
- Target e spaziatura: `--giu-icon-button-control-size`, `--giu-icon-button-compact-control-size`, `--giu-icon-button-padding`, `--giu-icon-button-compact-padding`.
- Forma: `--giu-icon-button-border-width`, `--giu-icon-button-border-radius`.
- Indicatore di focus: `--giu-icon-button-focus-width`, `--giu-icon-button-focus-color`, `--giu-icon-button-focus-offset`.
- Presentazione disabled: `--giu-icon-button-disabled-opacity`.

Ogni property ha un fallback neutro e resta scoped a `IconButton`.

## Confine di responsabilita'

`IconButton` possiede un singolo pulsante nativo solo icona, il suo requisito di nome accessibile, il confine di icona decorativa, la dimensione del target e la presentazione neutra.

Non possiede:

- navigazione o anchor;
- tooltip;
- stato toggle oltre all'ARIA nativa inoltrata;
- caricamento o lifecycle asincrono;
- conferma;
- selezione icone o comportamento di registro;
- raggruppamento toolbar o navigazione con frecce.

Usa `Button` quando il testo visibile fa parte del controllo. I suoi snippet opzionali leading e trailing arricchiscono un pulsante testuale; non sostituiscono il contratto separato solo icona.
