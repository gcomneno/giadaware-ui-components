[English](../radio.md) | [Italiano](radio.md)

# Radio

`Radio` e' disponibile solo da `giadaware-ui-components/studio`. Renderizza
sempre esattamente un `<input type="radio">` nativo e visibile. L'input resta il
controllo interattivo; non ci sono wrapper, ID generati, elementi proxy, label
di proprieta' del componente, `role="radio"` o `role="radiogroup"`.

```svelte
<script lang="ts">
	import { Radio } from 'giadaware-ui-components/studio';

	let importance = $state('normal');
</script>

<label>
	<Radio bind:group={importance} name="importance" value="low" />
	Low
</label>

<label>
	<Radio bind:group={importance} name="importance" value="normal" />
	Normal
</label>
```

## Contratto pubblico

`RadioProps` si basa sul tipo pubblico `HTMLInputAttributes` di Svelte.
Attributi e handler nativi del radio, inclusi `disabled`, `required`, `name`,
`form`, `autofocus`, `aria-*`, `data-*`, `onchange`, `onclick`, `onkeydown`,
`class` del consumatore e `style` del consumatore, vengono inoltrati all'input.

Il componente fissa `type="radio"` e rifiuta `type` controllato dal caller.
`value` e' obbligatorio. Il valore selezionato e' bindable tramite la sintassi
Svelte standard `bind:group`.

`checked` non fa intenzionalmente parte del contratto pubblico. In Svelte lo
stato dei radio e' rappresentato da `bind:group`; il browser deriva lo stato
checked dal valore del gruppo e dal `value` di ciascun radio.

## Semantica radio nativa

L'elemento conserva role radio nativo, focus, interazione da tastiera,
esclusivita' tra radio con lo stesso name e partecipazione ai form.

I consumatori possiedono label accessibili e semantica del gruppo. Usa elementi
nativi `<label>`, `<fieldset>` e `<legend>`, oppure un'altra strategia valida di
naming accessibile. Il componente non genera ID e non possiede wrapper di gruppo.

## Form e gruppi

Un radio selezionato contribuisce la propria coppia `name`/`value` alla submit
nativa del form. Tra radio con lo stesso name viene inviato esattamente un
valore selezionato.

`Radio` non fornisce un'astrazione `RadioGroup`. Il consumer possiede
composizione del gruppo, stato applicativo selezionato, messaggi di validazione,
fieldset, legend e significato di dominio.

## CSS custom properties

L'input nativo viene stilizzato direttamente con geometria CSS deterministica.

- Dimensione: `--giu-radio-size`, `--giu-radio-dot-size`.
- Bordo: `--giu-radio-border-width`, `--giu-radio-border-color`.
- Background base: `--giu-radio-background`.
- Stato checked: `--giu-radio-checked-color`,
  `--giu-radio-checked-border-color`.
- Hover: `--giu-radio-hover-border-color`.
- Indicatore di focus: `--giu-radio-focus-width`,
  `--giu-radio-focus-color`, `--giu-radio-focus-offset`.
- Presentazione disabled: `--giu-radio-disabled-opacity`.

Ogni property e' opzionale e ha un fallback neutro. Gli stili sono scoped e non
influenzano input non correlati.

## Forced colors

In modalita' forced-colors/high-contrast, `Radio` usa colori di sistema per
bordo, dot selezionato, stato disabled e outline di focus.

## Provenienza

La direzione visuale e' adattata dalla sorgente Uiverse
`https://uiverse.io/risabbir/good-chicken-7` di risabbir, licenza MIT.

Decisione: ADAPT.

Giada UI conserva il concetto visuale utile del radio nativo — bordo circolare e
dot interno selezionato — eliminando container demo, glassmorphism, glow,
animazione orbitale, varianti colore dipendenti dalla posizione e il
`display: none` applicato all'input nativo. La primitiva finale mantiene il vero
radio visibile e focusable.
