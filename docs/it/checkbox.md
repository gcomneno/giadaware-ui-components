[English](../checkbox.md) | [Italiano](checkbox.md)

# Checkbox

`Checkbox` e' disponibile solo da `giadaware-ui-components/studio`. Renderizza
sempre esattamente un `<input type="checkbox">` nativo e visibile. L'input resta
il controllo interattivo; non ci sono wrapper, ID generati, elementi proxy, label
di proprieta' del componente, `role="checkbox"` o `role="switch"`.

```svelte
<script lang="ts">
	import { Checkbox } from 'giadaware-ui-components/studio';

	let featured = $state(false);
</script>

<label>
	<Checkbox bind:checked={featured} name="featured" value="yes" />
	Featured item
</label>
```

## Contratto pubblico

`CheckboxProps` si basa sul tipo pubblico `HTMLInputAttributes` di Svelte.
Attributi e handler nativi della checkbox, inclusi `disabled`, `required`,
`name`, `value`, `form`, `autofocus`, `aria-*`, `data-*`, `onchange`,
`onclick`, `onkeydown`, `class` del consumatore e `style` del consumatore,
vengono inoltrati all'input.

Il componente fissa `type="checkbox"` e rifiuta `type` controllato dal caller.
`checked` e' bindable con la sintassi Svelte standard `bind:checked`:

```svelte
<Checkbox bind:checked={accepted} required name="terms" value="accepted" />
```

Non passare una prop sintetica `bind:checked`. Usa la sintassi di binding di
Svelte.

## Semantica checkbox nativa

L'elemento conserva role checkbox del browser, comportamento di attivazione e
comportamento form. Attivazione pointer e attivazione con il tasto Space
alternano lo stato checked, salvo quando l'input e' disabled. Le checkbox
disabled mantengono il comportamento disabled nativo e ricevono una
presentazione visiva distinta.

I consumatori possiedono la label accessibile. Avvolgi la checkbox in una
`<label>` nativa, collega una label separata con `for`/`id`, o fornisci un altro
nome accessibile valido tramite attributi nativi quando appropriato. Il
componente non genera ID perche' le relazioni stabili appartengono al
consumatore.

## Form e gruppi

La submit nativa dei form e' preservata. Una checkbox checked contribuisce la
coppia `name`/`value` a `FormData`; una checkbox unchecked non contribuisce
nessuna entry. Quando piu' checkbox usano lo stesso `name`, il browser invia una
entry per ogni controllo checked:

```svelte
<fieldset>
	<legend>Topics</legend>
	<label><Checkbox name="topics" value="design" /> Design</label>
	<label><Checkbox name="topics" value="accessibility" /> Accessibility</label>
</fieldset>
```

Il componente non fornisce astrazioni di checkbox group, validazione o
indeterminate. I consumatori possiedono fieldset, legend, copy di validazione,
associazioni di errore e qualsiasi stato di collezione.

## Checkbox, non Switch

Usa `Checkbox` quando il controllo rappresenta semantica checkbox nativa:
selezionare uno o piu' valori, accettare un'opzione, o inviare un valore checked
con un form. Non trasformarla visivamente in uno switch e non aggiungere
`role="switch"`. Uno switch e' un pattern semantico separato ed e'
intenzionalmente fuori da questa primitiva.

## CSS custom properties

L'input nativo e' stilizzato direttamente. Il suo checkmark e' geometria CSS
deterministica, non un glifo font.

- Dimensione e forma: `--giu-checkbox-size`, `--giu-checkbox-border-width`,
  `--giu-checkbox-border-radius`.
- Colori base: `--giu-checkbox-color`, `--giu-checkbox-background`,
  `--giu-checkbox-border-color`.
- Colori checked: `--giu-checkbox-checked-color`,
  `--giu-checkbox-checked-background`,
  `--giu-checkbox-checked-border-color`.
- Colori hover: `--giu-checkbox-hover-background`,
  `--giu-checkbox-hover-border-color`.
- Indicatore di focus: `--giu-checkbox-focus-width`,
  `--giu-checkbox-focus-color`, `--giu-checkbox-focus-offset`.
- Presentazione disabled: `--giu-checkbox-disabled-opacity`.

Ogni property e' opzionale e ha un fallback neutro. Gli stili sono scoped e non
influenzano input non correlati.

## Forced colors

In modalita' forced-colors/high-contrast, la checkbox usa colori di sistema per
bordo, fill, checkmark e outline di focus cosi' lo stato nativo resta visibile.

## Provenienza

L'approccio visuale e' adattato dalla sorgente Uiverse
`https://uiverse.io/cbolson/calm-wasp-75` di cbolson / Chris Bolson, licenza
MIT. Decisione: ADAPT. Giada UI conserva solo la direzione utile: stilizzare
direttamente una checkbox nativa con `appearance: none` e stati CSS scoped. Non
copia demo form, wrapper, contenuti, nomi o colori.
