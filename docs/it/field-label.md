[English](../field-label.md) | [Italiano](field-label.md)

# FieldLabel

`FieldLabel` e' disponibile solo da `giadaware-ui-components/studio`. Presenta una riga di etichetta campo, testo required o optional risolto, e testo hint opzionale senza creare l'associazione semantica con un controllo form.

## Contratto pubblico

Il contratto esportato `FieldLabelProps` contiene:

- `label`: testo visibile richiesto dell'etichetta;
- `hint`: testo hint risolto opzionale;
- `required`: flag opzionale di presentazione required;
- `optional`: flag opzionale di presentazione optional;
- `requiredLabel`: espansione accessibile risolta dal consumatore per il marker required;
- `optionalLabel`: testo optional visibile risolto dal consumatore;
- `hintId`: ID opzionale applicato a un hint renderizzato;
- `class`: classe opzionale del consumatore applicata alla riga etichetta;
- `style`: stile inline opzionale applicato alla riga etichetta.

Tutte le stringhe sono renderizzate come testo. `FieldLabel` non accetta HTML non sicuro.

## Stati required e optional

`required` ha precedenza quando `required` e `optional` sono entrambi true.

Il simbolo required visibile viene renderizzato solo quando `requiredLabel` contiene testo non-whitespace. Il simbolo e' nascosto alle tecnologie assistive e l'espansione fornita dal consumatore resta disponibile per esse. Omettere il marker e' piu' sicuro che renderizzare un simbolo non spiegato.

Il testo optional viene renderizzato esattamente come fornito. Il componente non aggiunge parentesi, punteggiatura o testo tradotto. Le label marker vuote o composte solo da whitespace sono omesse.

Questi stati sono presentazionali. I consumatori devono applicare `required` nativo al controllo form effettivo e mantenere lo stato UI condizionale allineato alla validazione server-side.

## Composizione con label parent

```svelte
<script lang="ts">
	import { FieldLabel } from 'giadaware-ui-components/studio';
</script>

<label>
	<FieldLabel
		label="Display name"
		required
		requiredLabel="Required"
	/>
	<input name="displayName" required />
</label>
```

Il `label` parent e l'attributo nativo `required` sono di proprieta' del consumatore.

## Associazione esplicita e hint

```svelte
<label for="account-email">
	<FieldLabel
		label="Email"
		required
		requiredLabel="Required"
		hint="Used for account notifications."
		hintId="account-email-hint"
	/>
</label>

<input
	id="account-email"
	name="email"
	type="email"
	required
	aria-describedby="account-email-hint"
/>
```

`hintId` viene applicato solo quando viene renderizzato un hint non vuoto. Il consumatore possiede l'ID del controllo, l'associazione `for` e la relazione `aria-describedby`.

## Stato required condizionale

```svelte
<FieldLabel
	label="Company registration number"
	required={isBusinessAccount}
	optional={!isBusinessAccount}
	requiredLabel="Required"
	optionalLabel="Optional"
/>

<input
	name="registrationNumber"
	required={isBusinessAccount}
/>
```

La stessa condizione deve guidare presentazione, semantica del controllo nativo e validazione server.

## Relazione con le legend dei form

Testo a livello applicazione come "Tutti i campi sono obbligatori salvo quelli contrassegnati come opzionali" appartiene a una legend di form o fieldset. `FieldLabel` non genera convenzioni required o optional a livello form e non sostituisce uno `StudioFormLegend` specifico dell'applicazione.

## Migrazione da Atelier-Kit

Quando sostituisci lo `StudioFieldLabel` locale di Atelier-Kit:

1. risolvi label, hint e stringhe dei marker nel consumatore;
2. wrappa o associa `FieldLabel` con il controllo nativo effettivo;
3. applica `required` al controllo stesso;
4. fornisci ID hint stabili e `aria-describedby` dove necessario;
5. mantieni legend e validazione specifiche dell'applicazione fuori da Giada UI.

## Stili

Le custom properties supportate sono:

- `--giu-field-label-row-gap`;
- `--giu-field-label-color`;
- `--giu-field-label-weight`;
- `--giu-field-label-line-height`;
- `--giu-field-label-marker-size`;
- `--giu-field-label-marker-weight`;
- `--giu-field-label-required-color`;
- `--giu-field-label-optional-color`;
- `--giu-field-label-hint-gap`;
- `--giu-field-label-hint-color`;
- `--giu-field-label-hint-size`;
- `--giu-field-label-hint-line-height`.

Layout del campo, spaziatura dei controlli, messaggi di errore, stato di validazione e struttura del form restano di proprieta' del consumatore.

## Determinismo

Per prop identiche, l'output SSR e' deterministico. L'hydration deve riusare i nodi esistenti di riga etichetta, marker, hint e controllo del consumatore senza aggiungere eventi o stato di proprieta' del componente.
