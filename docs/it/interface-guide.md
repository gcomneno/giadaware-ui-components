[English](../interface-guide.md) | [Italiano](interface-guide.md)

# Guida all'interfaccia di GiadaWare UI

Questa guida è il punto di ingresso consumer-facing per adottare
`giadaware-ui-components` da un'applicazione Svelte.

Documenta le regole trasversali dell'interfaccia del package, i confini di
responsabilità, i pattern di integrazione e la superficie pubblica corrente dei
componenti. I documenti dedicati ai singoli componenti restano autorevoli per
props, modelli di stato, hook di styling e dettagli comportamentali specifici.

## Stato del package

`giadaware-ui-components` è attualmente un repository GitHub pubblico che
contiene un package Svelte in private incubation.

Il manifest usa `private: true`, quindi la pubblicazione su registry è bloccata.
Packability e pubblicazione su registry sono intenzionalmente due aspetti
distinti.

Durante l'incubazione, i consumer possono usare artifact immutabili revisionati
oppure fissare il repository a uno specifico commit Git. Non usare un branch
mobile come dipendenza.

La peer dependency pubblica è Svelte `^5.0.0`.

## Entry point pubblici

Esiste un solo entry point JavaScript pubblico:

```ts
import {
	Accordion,
	AccordionItem,
	AsyncOperationPanel,
	Button,
	Checkbox,
	Combobox,
	Dialog,
	Disclosure,
	EditableList,
	EditableListRow,
	FieldDescription,
	FieldError,
	FieldLabel,
	FormActions,
	FormStatus,
	IconButton,
	ImageAttachmentControl,
	ImageFocalPointControl,
	ImageLightbox,
	MenuButton,
	MenuItem,
	MenuSeparator,
	NavList,
	PageIntro,
	Pagination,
	Panel,
	Radio,
	RelationshipGraph,
	Select,
	ReorderActions,
	ReorderAnnouncement,
	SocialIcon,
	SocialLink,
	StatusNotice,
	Surface,
	Tab,
	TabList,
	TabPanel,
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeaderCell,
	TableRow,
	Tabs,
	Textarea,
	TextInput,
	Tooltip
} from 'giadaware-ui-components';
```

Usare soltanto gli export dichiarati dal package.

Non importare file implementativi da `src/` e non dedurre l'API pubblica dai
file che per caso esistono sotto `src/` o `dist/`.

## Entry point CSS

Il CSS è esplicito e non viene importato automaticamente:

```ts
import 'giadaware-ui-components/styles.css';
```

Importare lo stylesheet pubblico quando serve la presentazione di GiadaWare UI.

Lo styling pubblico dei componenti usa CSS custom properties documentate. Le
classi interne dei discendenti non costituiscono automaticamente API pubblica.

Il package non nasconde dipendenze di rete, font, telemetria o asset remoti nei
suoi CSS pubblici.

## Modello di ownership

GiadaWare UI possiede i contratti riutilizzabili di presentazione e interazione:

- presentazione riutilizzabile;
- semantica di interazione del componente;
- comportamento di accessibilità esplicitamente assegnato al componente;
- contratti di stato controllato;
- hook di styling neutrali;
- comportamento SSR e hydration deterministico.

L'applicazione consumer possiede gli aspetti di dominio e orchestrazione:

- route e policy di navigazione;
- form action SvelteKit;
- orchestrazione fetch e Promise;
- persistenza e schemi;
- lookup delle traduzioni e copy di dominio;
- policy di conferma;
- coordinamento tra operazioni;
- interpretazione dei risultati di dominio;
- deployment e infrastruttura specifica dell'applicazione.

Un componente condiviso non deve assorbire implicitamente comportamento
applicativo soltanto perché tale comportamento gli è adiacente nel consumer.

## Stato e binding Svelte

Usare il contratto di stato dichiarato dal componente invece di inventare uno
stato parallelo.

### Checkbox

`Checkbox` è un singolo checkbox nativo visibile. Lo stato checked usa il
binding nativo di Svelte:

```svelte
<script lang="ts">
	import { Checkbox } from 'giadaware-ui-components';

	let accepted = $state(false);
</script>

<label>
	<Checkbox
		bind:checked={accepted}
		name="terms"
		value="accepted"
		required
	/>
	Accept the terms
</label>
```

Il consumer possiede label, raggruppamento, validazione e stato della
collezione.

### Radio

`Radio` è un singolo input radio nativo visibile. La selezione usa `bind:group`,
non `bind:checked`:

```svelte
<script lang="ts">
	import { Radio } from 'giadaware-ui-components';

	let importance = $state('normal');
</script>

<fieldset>
	<legend>Importance</legend>

	<label>
		<Radio bind:group={importance} name="importance" value="low" />
		Low
	</label>

	<label>
		<Radio bind:group={importance} name="importance" value="normal" />
		Normal
	</label>
</fieldset>
```

`value` è obbligatorio. Il browser deriva lo stato checked dal valore del gruppo
e dal `value` di ciascun radio.

### Componenti controllati

Alcuni componenti usano contratti value/callback espliciti invece dei binding
Svelte.

Per esempio, `ImageAttachmentControl` è controllato tramite `value` e
`onvaluechange`. `ImageLightbox` usa `open` e `onopenchange`.

Mantenere lo stato applicativo nel consumer, salvo diversa indicazione esplicita
nel contratto specifico del componente.

## Form nativi

Le semantiche HTML native vengono preservate ove possibile.

`Button`, `Checkbox` e `Radio` renderizzano controlli nativi e conservano il
comportamento form applicabile. Non sostituirne la semantica con ruoli
sintetici.

Il consumer resta responsabile dell'architettura del form, della policy di
validazione, delle server action, degli ID e delle relazioni non assegnate
esplicitamente a un componente.

Composizione tipica:

```svelte
<script lang="ts">
	import {
		Button,
		FieldDescription,
		FieldError,
		FieldLabel,
		FormActions
	} from 'giadaware-ui-components';

	let invalid = $state(false);
</script>

<form method="post">
	<label for="display-name">
		<FieldLabel
			label="Display name"
			required
			requiredLabel="Required"
		/>
	</label>

	<input
		id="display-name"
		name="displayName"
		required
		aria-invalid={invalid || undefined}
		aria-describedby="display-name-help display-name-error"
	/>

	<FieldDescription
		id="display-name-help"
		text="Shown on your public profile."
	/>

	<FieldError
		id="display-name-error"
		text={invalid ? 'Use at least three characters.' : ''}
		announce={invalid}
	/>

	<FormActions align="end">
		<Button type="submit">Save changes</Button>
	</FormActions>
</form>
```

`FieldLabel`, `FieldDescription` e `FieldError` non generano ID del controllo e
non modificano le sue relazioni ARIA. Tali relazioni appartengono al consumer.

## Contratto di accessibilità

L'accessibilità fa parte dell'API pubblica.

Preferire semantiche native e preservare il confine di responsabilità tra
componente e consumer documentato per ciascuna primitiva.

Il consumer deve fornire nomi accessibili e raggruppamento semantico quando tali
responsabilità gli appartengono. Esempi tipici:

- label per `Checkbox` e `Radio`;
- `fieldset` e `legend` per gruppi di radio o checkbox;
- label tradotte dei controlli;
- ID e relazioni `aria-describedby`;
- semantica di navigazione attorno a container neutrali;
- semantica toolbar soltanto quando l'interfaccia implementa davvero una toolbar.

Non aggiungere ruoli ARIA sintetici a controlli nativi soltanto per riprodurre
un pattern visuale.

Il semplice rendering corretto di un componente non costituisce prova
sufficiente di accessibilità.

## SSR e hydration

Input equivalenti devono produrre output server-rendered deterministico.

Il comportamento browser-only non deve eseguirsi durante SSR. L'hydration non
deve inaspettatamente avviare lavoro, mutare stato consumer, cambiare valori
controllati, duplicare regioni semantiche/live o sostituire nodi stabili senza
una ragione contrattuale.

Il package verifica SSR, comportamento browser e hydration come confini
separati. Un consumer dovrebbe preservare gli stessi confini quando compone
wrapper attorno ai componenti condivisi.

## Styling e theming

`class` e `style` del consumer si compongono con la presentazione del componente
dove documentato.

La personalizzazione stabile viene fornita principalmente tramite CSS custom
properties specifiche del componente, per esempio:

```css
.my-save-button {
	--giu-button-background: #202020;
	--giu-button-color: #ffffff;
}

.my-radio {
	--giu-radio-size: 1.25rem;
}
```

Usare soltanto custom property documentate come hook di theming stabile.

Non dipendere da selettori discendenti privati o dettagli implementativi
generati.

I controlli come `Checkbox` e `Radio` supportano esplicitamente forced-colors;
evitare override consumer che rendano invisibile lo stato nativo.

## Mappa dei componenti

| Famiglia | Responsabilità principale | Resta al consumer |
| --- | --- | --- |
| `FormStatus` | presentazione di stato persistente o temporizzato | contenuto del messaggio e input di lifecycle |
| `StatusNotice` | presentazione componibile di notice | significato di dominio, azioni e policy |
| `SocialIcon` | geometria delle icone social approvate | semantica circostante e uso conforme ai trademark |
| `SocialLink` | composizione accessibile icona/link | href, route, policy target/rel, copy |
| `ImageLightbox` | modal controllata per una singola immagine | stato gallery, controlli di navigazione, traduzioni |
| `RelationshipGraph` | presentazione e interazione del grafo | routing, localizzazione e stato applicativo |
| `Button` | un pulsante testuale nativo | lifecycle asincrono e workflow |
| `IconButton` | un pulsante nativo icon-only con nome accessibile | policy tooltip/help e workflow |
| `Checkbox` | un checkbox nativo | label, raggruppamento e validazione |
| `Radio` | un radio nativo | label, raggruppamento e stato selezionato applicativo |
| `TextInput` | presentazione e binding di un input text-like nativo | label, validazione e significato di dominio |
| `Textarea` | presentazione e binding multilinea nativo | label, validazione e significato di dominio |
| `Select` | selezione nativa single/multiple | dati option/dominio e policy di filtering |
| `Combobox` | interazione combobox ARIA editabile | filtering, fetch, debounce e persistenza |
| `Disclosure` | un disclosure nativo details/summary | copy e struttura documentale circostante |
| famiglia `Accordion` | grouping coordinato di disclosure native | contenuto item e stato di dominio |
| `Dialog` | modal nativa generica controllata | azioni, workflow, copy e policy di conferma |
| famiglia `Tabs` | relazioni tab e interazione keyboard | routing, URL state e persistenza |
| famiglia `MenuButton` | interazione transitoria da action menu | azioni di dominio e policy routing |
| `Pagination` | controlli di navigazione pagina controllati | fetch, URL state, page size e modello record |
| `Tooltip` | descrizione contestuale non interattiva | significato del trigger e help copy |
| `NavList` | lista di navigazione semantica | href, policy router e gerarchia di navigazione |
| famiglia `Table` | struttura semantica table nativa | comportamento dati, sorting, filtering e row actions |
| `FieldLabel` | presentazione della label di campo | associazione semantica della label e ID |
| `FieldDescription` | testo descrittivo statico | relazioni ARIA e ID |
| `FieldError` | presentazione dell'errore di validazione | logica di validazione e focus policy |
| `FormActions` | layout delle azioni | comportamento dei figli e semantica toolbar |
| `Panel` | una sezione semantica nominata | form, workflow e stato asincrono |
| `Surface` | contenimento visuale neutrale | semantica landmark/sezione/form |
| `PageIntro` | paragrafo introduttivo semantico | copy, link e posizionamento nella pagina |
| `AsyncOperationPanel` | presentazione di una singola operazione controllata | esecuzione, retry e locking tra operazioni |
| `ImageAttachmentControl` | intent controllato per file immagine | persistenza e trasporto upload |
| `ImageFocalPointControl` | interazione controllata del punto focale | persistenza e interpretazione di dominio |
| famiglia `EditableList` | struttura ordinata e interazione di riordino riutilizzabile | stato della collezione/dominio e persistenza |

## Scelta tra primitive correlate

Usare `Panel` quando il contenuto è una sezione semantica nominata con heading
visibile.

Usare `Surface` quando serve soltanto contenimento visuale neutrale.

Usare `Button` per un pulsante testuale e `IconButton` per un pulsante icon-only
con un proprio contratto di nome accessibile.

Usare `Checkbox` per semantica checkbox nativa. Non trasformarlo in switch.

Usare `Radio` per una scelta all'interno di un gruppo radio nativo. GiadaWare UI
intenzionalmente non fornisce un'astrazione `RadioGroup`.

Usare `Select` quando la semantica di selezione nativa e' sufficiente. Usare
`Combobox` quando l'utente modifica query text mentre naviga una lista di option
candidate.

Usare `Disclosure` per un singolo disclosure nativo e `Accordion` quando piu'
disclosure richiedono grouping coordinato.

Usare `Dialog` per una modal generica controllata. Mantenere `ImageLightbox` per
il contratto modale a singola immagine.

Usare `MenuButton` per action menu transitori. Non e' un sostituto di select ne'
un'astrazione dropdown generica.

Usare la famiglia `Table` per tabelle semantiche native, non per comportamento
da data grid.

Usare `FormActions` per il layout delle azioni. Non è una toolbar e non
implementa navigazione toolbar con frecce.

Usare `AsyncOperationPanel` per presentare il lifecycle di un'operazione. Non
esegue l'operazione e non coordina operazioni sorelle.

Usare `ImageLightbox` per una singola immagine modale controllata. Non è una
gallery.

## Anti-pattern

Non:

- importare da `src/` o da path `dist/` non documentati;
- trattare ogni file implementativo come API pubblica;
- dipendere da classi CSS discendenti interne;
- spostare route, persistenza o traduzioni applicative nelle primitive condivise;
- ricreare controlli nativi tramite ruoli sintetici;
- usare `bind:checked` con `Radio`;
- trasformare `Checkbox` in `role="switch"`;
- trasformare `FormActions` in toolbar senza un contratto dedicato;
- usare `Panel` come wrapper decorativo privo di semantica;
- far inventare a `Surface` semantica di section o landmark;
- far avviare lavoro asincrono ad `AsyncOperationPanel`;
- far inferire stato gallery a `ImageLightbox`;
- assumere che il successo SSR provi comportamento browser o hydration;
- assumere che il comportamento dal source tree provi il packed consumer.

## Distribuzione durante l'incubazione

Per il consumo via Git, fissare uno specifico commit revisionato.

I consumer devono comunque importare soltanto gli export dichiarati dal
package. Il lifecycle `prepare` del repository materializza `dist/` durante
l'installazione come Git dependency.

La pubblicazione su registry resta vietata finché `private: true` e il guard
esplicito di pubblicazione rimangono attivi.

Vedere [Consumo come dipendenza Git](git-dependency-consumption.md) e
[Release](releases.md).

## Reference dei componenti

La documentazione dedicata fornisce il contratto completo di ciascuna famiglia:

- [AsyncOperationPanel](async-operation-panel.md)
- [Button](button.md)
- [Checkbox](checkbox.md)
- [Espansione della superficie dei componenti](component-surface-expansion.md)
- [Famiglia EditableList](editable-list.md)
- [FieldDescription e FieldError](field-description-error.md)
- [FieldLabel](field-label.md)
- [FormActions](form-actions.md)
- [IconButton](icon-button.md)
- [ImageFocalPointControl](image-focal-point-control.md)
- [ImageLightbox](image-lightbox.md)
- [PageIntro](page-intro.md)
- [Panel](panel.md)
- [Radio](radio.md)
- [RelationshipGraph](relationship-graph.md)
- [SocialLink](social-link.md)
- [StatusNotice](status-notice.md)
- [Surface](surface.md)

Il README root resta autorevole per i componenti pubblici che non dispongono
ancora di una pagina dedicata.

## Checklist di integrazione

Prima di adottare un componente:

1. importare componenti e tipi pubblici da `giadaware-ui-components`;
2. importare `giadaware-ui-components/styles.css` quando serve la presentazione pubblica;
3. leggere il contratto specifico del componente;
4. identificare responsabilità del componente e del consumer;
5. preservare le semantiche native di form e accessibilità;
6. mantenere l'orchestrazione di dominio fuori dal componente di libreria;
7. usare i contratti di stato/binding documentati;
8. usare soltanto hook CSS documentati;
9. preservare le assunzioni di SSR/hydration deterministico;
10. fissare una revisione immutabile del package durante la private incubation.
