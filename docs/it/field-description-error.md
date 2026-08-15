[English](../field-description-error.md) | [Italiano](field-description-error.md)

# FieldDescription e FieldError

`FieldDescription` e `FieldError` sono primitive Studio per testo supplementare dei campi. Standardizzano la presentazione e una policy esplicita di annuncio dei messaggi di validazione senza possedere controlli form, stato di validazione o associazioni ARIA.

Importali solo dall'entry point Studio:

```ts
import {
	FieldDescription,
	FieldError
} from 'giadaware-ui-components/studio';

import type {
	FieldDescriptionProps,
	FieldErrorProps
} from 'giadaware-ui-components/studio';
```

## Contratti pubblici

`FieldDescriptionProps` contiene:

- `text`: testo descrittivo richiesto e risolto dal consumatore;
- `id`: ID opzionale di proprieta' del consumatore;
- `class`: classe opzionale del consumatore;
- `style`: stile inline opzionale.

`FieldErrorProps` contiene:

- `text`: testo di validazione richiesto e risolto dal consumatore;
- `id`: ID opzionale di proprieta' del consumatore;
- `announce`: richiesta opzionale esplicita di annuncio live, con default `false`;
- `class`: classe opzionale del consumatore;
- `style`: stile inline opzionale.

Entrambe le primitive renderizzano solo testo. Non accettano HTML o snippet rich-content.

Un `text` composto solo da whitespace non renderizza alcun nodo. Un `id` composto solo da whitespace e' omesso. Per un `id` non vuoto, Giada UI passa il valore del consumatore senza modificarlo; i consumatori restano responsabili di fornire un ID HTML valido.

## FieldDescription

`FieldDescription` renderizza un singolo paragrafo nativo statico:

```svelte
<FieldDescription
	id="email-description"
	text="Used for account notifications."
/>

<input
	id="email"
	aria-describedby="email-description"
/>
```

Il paragrafo non ha ruolo live-region o stato ARIA. Il consumatore possiede controllo, ID e relazione `aria-describedby`.

## Errori di validazione statici

`FieldError` e' statico per default:

```svelte
<input
	id="account-code"
	aria-invalid="true"
	aria-describedby="account-code-error"
/>

<FieldError
	id="account-code-error"
	text="Enter a valid account code."
/>
```

Questa modalita' intenzionalmente non aggiunge `role`, `aria-live` o `aria-atomic`. E' appropriata per testo di validazione gia' presente durante il server rendering o comunque pensato per essere scoperto tramite l'associazione del campo invece che annunciato come evento appena avvenuto.

Usare `aria-describedby` per testo di validazione statico evita anche di trasformare l'hydration di un errore server gia' renderizzato in un annuncio ripetuto.

## Description ed errore statico insieme

I consumatori possono comporre entrambi gli ID:

```svelte
<input
	id="display-name"
	aria-invalid="true"
	aria-describedby="display-name-description display-name-error"
/>

<FieldDescription
	id="display-name-description"
	text="Shown on your public profile."
/>

<FieldError
	id="display-name-error"
	text="Use at least three characters."
/>
```

Giada UI non costruisce, unisce o muta mai queste relazioni ARIA.

## Errori introdotti dinamicamente

Quando un consumatore introduce un nuovo errore in risposta a un'interazione, puo' richiedere esplicitamente un annuncio assertive:

```svelte
<input
	id="dynamic-value"
	aria-invalid={error ? 'true' : undefined}
	aria-errormessage={error ? 'dynamic-value-error' : undefined}
/>

<FieldError
	id="dynamic-value-error"
	text={error}
	announce
/>
```

Con `announce={true}`, un `FieldError` renderizzato usa:

- `role="alert"`;
- `aria-live="assertive"`;
- `aria-atomic="true"`.

Il consumatore possiede ancora quando l'errore esiste, `aria-invalid`, `aria-errormessage`, esecuzione della validazione e policy di focus.

`announce` e' deliberatamente opt-in. `FieldError` non inferisce se il testo e' nuovo, se la validazione e' stata eseguita sul server o sul client, o se annunciarlo di nuovo sarebbe appropriato.

## Relazione con FieldLabel

`FieldLabel` mantiene la propria responsabilita' esistente solo di presentazione. Queste primitive non lo alterano e non creano un wrapper campo monolitico.

Un campo completo puo' quindi essere composto da responsabilita' indipendenti:

```svelte
<label for="email">
	<FieldLabel
		label="Email"
		required
		requiredLabel="Required"
	/>
</label>

<input
	id="email"
	required
	aria-invalid={emailError ? 'true' : undefined}
	aria-describedby={
		emailError
			? 'email-description email-error'
			: 'email-description'
	}
/>

<FieldDescription
	id="email-description"
	text="Used for account notifications."
/>

<FieldError
	id="email-error"
	text={emailError}
/>
```

Il consumatore possiede l'associazione semantica della label, lo stato required nativo, lo stato di validazione e tutti gli ID.

## Validazione server e client

Per errori gia' presenti nell'output SSR, mantieni `announce` false salvo che il consumatore abbia una ragione specifica per esporre una live region.

Per errori introdotti dopo un'interazione, `announce` puo' essere abilitato quando l'annuncio assertive e' appropriato.

Le primitive non implementano:

- regole o schemi di validazione;
- stato touched o dirty;
- azioni SvelteKit;
- ID generati;
- movimento del focus;
- `aria-invalid` automatico;
- `aria-describedby` automatico;
- `aria-errormessage` automatico;
- lookup di traduzioni.

## Stili

`FieldDescription` espone:

- `--giu-field-description-color`;
- `--giu-field-description-size`;
- `--giu-field-description-line-height`.

`FieldError` espone:

- `--giu-field-error-color`;
- `--giu-field-error-size`;
- `--giu-field-error-line-height`.

Ogni custom property ha un fallback neutro. Gli stili sono scoped e non introducono token applicativi, asset esterni, font o dipendenze di rete.

Le classi root stabili sono:

- `.giu-field-description`;
- `.giu-field-error`.

## Determinismo e hydration

Prop equivalenti producono output SSR deterministico.

La copertura hydration verifica che description statica, errore statico, controlli e nodi di interazione del consumatore siano riusati con `recover: false`. L'hydration non inventa una live region. L'alert opt-in appare solo dopo che il consumatore introduce effettivamente l'errore dinamico.

## Confine di responsabilita'

Giada UI possiede:

- le due root di presentazione;
- omissione di contenuto composto solo da whitespace;
- hook di styling neutri;
- la policy esplicita statico versus opt-in-live di `FieldError`;
- SSR e hydration deterministici.

I consumatori possiedono:

- elementi campo e label;
- ID dei controlli;
- ID di description/error;
- `aria-describedby`;
- `aria-errormessage`;
- `aria-invalid`;
- esecuzione e stato della validazione;
- timing di validazione server/client;
- policy di focus;
- copy risolto e localizzazione.
