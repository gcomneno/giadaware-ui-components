[English](README.md) | [Italiano](README.it.md)

# giadaware-ui-components

Componenti Svelte in incubazione privata per GiadaWare.

L'inglese e' la fonte canonica di verita' per la documentazione pubblica. L'italiano e' uno specchio ufficiale mantenuto della superficie di documentazione pubblica; vedi la [policy sulla lingua della documentazione](docs/it/documentation-policy.md).

Questo e' un repository GitHub pubblico che contiene un pacchetto il cui manifest usa `private: true`.

Quel flag impedisce la pubblicazione su registry. Non rende privato il repository GitHub.

Durante il trial, artefatti immutabili del pacchetto vengono creati con `npm pack`, identificati da commit sorgente, nome file e checksum, e installati solo in consumer controllati.

Non sono richiesti account npm, organizzazione, scope, identita' registry o workflow di pubblicazione.

Atelier-Kit e' il primo consumer di validazione. Non e' una dipendenza di questo pacchetto.

Il trial approvato contiene:

- `SocialIcon`
- `SocialLink`
- `StatusNotice`
- `FormStatus`
- `ImageAttachmentControl`
- `AsyncOperationPanel`
- `Button`
- `PageIntro`
- `FieldLabel`
- `FieldDescription` e `FieldError`
- `FormActions`
- `Panel`
- `Surface`
- `EditableList`, `EditableListRow`, `ReorderActions` e `ReorderAnnouncement`

I tre grafi di entry JavaScript restano isolati. Le API pubbliche correnti sono:

- `giadaware-ui-components` esporta `FormStatus`, `FormStatusTone`, `StatusNotice`, `StatusNoticeAnnouncement`, `StatusNoticeProps`, `StatusNoticeTone`, `SocialIcon`, `SocialIconId`, `SOCIAL_ICON_IDS`, `SocialLink` e `SocialLinkProps`;
- `giadaware-ui-components/visitor` esporta `ImageLightbox`, `ImageLightboxLabels`, `ImageLightboxProps`, `RelationshipGraph` e i suoi tipi pubblici;
- `giadaware-ui-components/studio` esporta `ImageAttachmentControl` e i tipi `ImageAttachmentControlLabels`, `ImageAttachmentCurrentImage`, `ImageAttachmentDropzoneOptions`, `ImageAttachmentFileValidator`, `ImageAttachmentIntent`, `ImageAttachmentState` e `ImageAttachmentValidationError`, piu' `AsyncOperationPanel` e i suoi tipi pubblici incluso `AsyncOperationProgress`, piu' `Button`, `ButtonProps`, `ButtonVariant` e `ButtonSize`, piu' `PageIntro` e `PageIntroProps`, piu' `FieldLabel` e `FieldLabelProps`, piu' `FieldDescription`, `FieldDescriptionProps`, `FieldError` e `FieldErrorProps`, piu' `FormActions`, `FormActionsProps` e `FormActionsAlign`, piu' `Panel`, `PanelProps` e `PanelHeadingLevel`, piu' `Surface` e `SurfaceProps`, piu' `EditableList`, `EditableListRow`, `ReorderActions`, `ReorderAnnouncement` e le loro prop pubbliche, tipi drag candidate e cancellation.

Vedi [SocialLink](docs/it/social-link.md) per il contratto di anchor nativo, le regole di nome accessibile, la proprieta' della navigazione, gli hook di stile e la composizione con `SocialIcon`.

Vedi [StatusNotice](docs/it/status-notice.md) per il contratto di notice statica componibile, la semantica di annuncio esplicita, la chiusura controllata, la distinzione da FormStatus e i non-obiettivi per toast futuri.

Vedi [AsyncOperationPanel](docs/it/async-operation-panel.md) per il modello di stato, il progress running opzionale, il contratto snippet, il comportamento di accessibilita', gli esempi e gli hook di stile.

Vedi [Button](docs/it/button.md) per inoltro degli attributi nativi, variant, size, responsabilita' di accessibilita', esempi e CSS custom properties.

Vedi [PageIntro](docs/it/page-intro.md) per il contratto di paragrafo e snippet, il confine di responsabilita', il comportamento di accessibilita' e le CSS custom properties.

Vedi [FieldLabel](docs/it/field-label.md) per il contratto di field-label solo di presentazione, la policy dei marker required e optional, l'associazione hint e gli hook di styling.

Vedi [FieldDescription e FieldError](docs/it/field-description-error.md) per associazione statica description/error, annuncio live opt-in degli errori, comportamento con contenuto vuoto e confini di proprieta'.

Vedi [FormActions](docs/it/form-actions.md) per il contratto di layout flex, comportamento wrapping, confini di proprieta' e personalizzazione del gap.

Vedi [Panel](docs/it/panel.md) per il contratto di sezione semantica, comportamento heading, confini di responsabilita', esempi e CSS custom properties.

Vedi [Surface](docs/it/surface.md) per il contratto di contenitore neutro, confini semantici, esempi di composizione e CSS custom properties.

Vedi [EditableList](docs/it/editable-list.md) per struttura componibile di righe ordinate, controlli nativi di riordino, enhancement pointer drag opzionale solo handle, contratto di selezione `isEmpty` di proprieta' del consumatore, confini di proprieta' e proprieta' CSS isolate.

Vedi [RelationshipGraph](docs/it/relationship-graph.md) per contratto dati, layout deterministico, interazioni, payload delle callback, policy di resilienza e hook di personalizzazione CSS.

## ImageLightbox

Importa la primitiva modale controllata dall'entry point Visitor:

```svelte
<script lang="ts">
	import { ImageLightbox } from 'giadaware-ui-components/visitor';
</script>

{#snippet caption()}
	<p>Descriptive figure caption.</p>
{/snippet}

{#snippet actions()}
	<nav aria-label="Image navigation">
		<button type="button">Previous</button>
		<button type="button">Next</button>
	</nav>
{/snippet}

<ImageLightbox
	open={previewOpen}
	onopenchange={(open) => previewOpen = open}
	src={currentImage.src}
	alt={currentImage.alt}
	labels={{ dialog: 'Image preview', close: 'Close image' }}
	{caption}
	{actions}
/>
```

`caption` resta contenuto descrittivo della figura ed e' renderizzato dentro `<figcaption>`. I controlli interattivi appartengono allo snippet opzionale `actions`, renderizzato dentro la modale nativa dopo la figura. Il wrapper actions e' semanticamente neutro: Giada UI non aggiunge semantica toolbar, navigation, footer o gallery.

I consumatori possiedono controlli e relazioni dentro `actions`, inclusi nomi accessibili, raggruppamento, comportamento da tastiera, array galleria, indice corrente, logica previous/next, counter e traduzioni. Giada UI continua a possedere lifecycle della native dialog, comportamento close/Escape/backdrop, ripristino del focus, scroll locking, sicurezza SSR/hydration e presentazione contenuta di una singola immagine.

Il componente non inferisce stato galleria, non aggiunge comportamento ArrowLeft/ArrowRight e non reinterpreta `caption` come area action.

## FieldLabel

Importa `FieldLabel` solo dall'entry point Studio:

```svelte
<script lang="ts">
	import { FieldLabel } from 'giadaware-ui-components/studio';
</script>

<label for="display-name">
	<FieldLabel
		label="Display name"
		required
		requiredLabel="Required"
		hint="Shown on your public profile."
		hintId="display-name-hint"
	/>
</label>

<input
	id="display-name"
	name="displayName"
	required
	aria-describedby="display-name-hint"
/>
```

`FieldLabel` renderizza solo presentazione. I consumatori forniscono stringhe tradotte, associazione semantica `label`, `required` nativo, ID controllo stabili e relazioni hint. La presentazione required ha precedenza sulla presentazione optional, e le label marker non risolte sono omesse.

## FieldDescription e FieldError

Importa entrambe le primitive solo dall'entry point Studio:

```svelte
<script lang="ts">
	import {
		FieldDescription,
		FieldError
	} from 'giadaware-ui-components/studio';
</script>

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

Entrambi i componenti renderizzano testo risolto dal consumatore e omettono contenuto composto solo da whitespace. Non generano mai ID e non mutano attributi ARIA di un controllo.

`FieldDescription` e' sempre statico. `FieldError` e' statico per default, evitando di annunciare di nuovo durante hydration un errore SSR gia' renderizzato. Per un errore introdotto realmente dopo un'interazione del consumatore, `announce={true}` opta per `role="alert"`, `aria-live="assertive"` e `aria-atomic="true"`.

I consumatori possiedono validazione, `aria-invalid`, `aria-describedby`, `aria-errormessage`, ID, localizzazione e policy di focus. Vedi `docs/it/field-description-error.md` per il contratto completo.

## Panel

Importa `Panel` solo dall'entry point Studio:

```svelte
<script lang="ts">
	import { Panel } from 'giadaware-ui-components/studio';
</script>

<Panel title="Publishing settings" headingLevel={3}>
	<p>Configure how the current document is published.</p>
</Panel>
```

`Panel` renderizza una sezione semantica nominata con heading visibile e contenuto body richiesto. Gli snippet description, header-action e footer sono opzionali e di proprieta' del consumatore. Il footer segue il body e non riceve da Giada UI semantica implicita di navigation, group, workflow o landmark. `Panel` non gestisce form, eventi, stato asincrono, live region o workflow. Usa `AsyncOperationPanel` per la presentazione del lifecycle di operazione. Usa `Surface` per contenimento visuale neutro senza heading o landmark section.

## Surface

Importa `Surface` solo dall'entry point Studio:

```svelte
<script lang="ts">
	import { Surface } from 'giadaware-ui-components/studio';
</script>

<nav aria-label="Resources">
	<Surface>
		<a href="/documentation">Documentation</a>
	</Surface>
</nav>
```

`Surface` renderizza contenuto richiesto del consumatore dentro un singolo `div` nativo neutro. Non aggiunge heading, ruolo, landmark, nome accessibile, interazione, evento o comportamento applicativo. I consumatori possiedono qualsiasi semantica circostante di `nav`, `section`, `article` o form.

Classi e stili inline del consumatore si compongono con la sua presentazione scoped tramite le custom properties documentate `--giu-surface-*`. Usa invece `Panel` quando il contenuto e' una sezione nominata che richiede un heading visibile.

## PageIntro

Importa `PageIntro` solo dall'entry point Studio:

```svelte
<script lang="ts">
	import { PageIntro } from 'giadaware-ui-components/studio';
</script>

<PageIntro>Manage the current document.</PageIntro>

<PageIntro>
	Manage the current document and
	<a href="/preview">open its preview</a>.
</PageIntro>
```

`PageIntro` renderizza sempre un paragrafo semantico. Il suo snippet richiesto puo' contenere testo semplice o contenuto inline misto. Traduzioni, link e posizionamento nella pagina restano di proprieta' del consumatore. Classi e stili inline del consumatore si compongono con gli stili scoped del componente e con gli hook documentati `--giu-page-intro-*`. Non e' heading, alert, live region o landmark.

## Button

Importa `Button` solo dall'entry point Studio:

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

Le variant sono `primary`, `secondary` e `danger`; le size sono `default` e `compact`. `type` ha default sicuro `button`. Gli attributi nativi applicabili di button, form, ARIA, data ed event sono inoltrati. Il contenuto figlio richiesto fornisce il nome accessibile. Gli snippet opzionali `leading` e `trailing` aggiungono contenuto solo di presentazione intorno alla label senza modificarne il nome accessibile. Classi e stili inline del consumatore si compongono con gli stili scoped del componente, inclusi gli hook documentati `--giu-button-*`.

`Button` non possiede comportamento pending, loading, result o live-region; un consumatore puo' posizionare un indicatore pending visuale in una regione leading/trailing mentre possiede autonomamente `aria-busy`, stato disabled e annunci. Usa `AsyncOperationPanel` per la presentazione di lifecycle asincrono. Link e controlli solo icona restano componenti/contratti separati. Componi controlli correlati di proprieta' del consumatore con `FormActions`.

## IconButton

Importa `IconButton` solo dall'entry point Studio. Rappresenta sempre un singolo button nativo solo icona per prop valide, usa `type="button"` come default, richiede un `label` non vuoto risolto dal consumatore e accetta contenuto snippet `icon` richiesto e di proprieta' del consumatore.

Il wrapper dell'icona e' solo di presentazione e `aria-hidden="true"`, quindi la geometria non duplica il nome del button. `IconButton` riusa i contratti `ButtonVariant` e `ButtonSize` esistenti esponendo hook di presentazione indipendenti `--giu-icon-button-*`. I target default e compact sono almeno 44px e 40px rispettivamente.

Una label runtime mancante o vuota fallisce in modo chiuso invece di renderizzare un controllo senza nome. `aria-label` e `aria-labelledby` sono riservati dal componente; attributi nativi button ordinari, altri attributi ARIA/data applicabili e handler si compongono normalmente. `IconButton` non fornisce tooltip, registro icone, lifecycle loading, conferma, navigazione o modello keyboard toolbar. Vedi `docs/it/icon-button.md`.

## FormActions

Importa `FormActions` solo dall'entry point Studio:

```svelte
<script lang="ts">
	import { Button, FormActions } from 'giadaware-ui-components/studio';
</script>

<FormActions align="end">
	<Button type="submit">Save changes</Button>
	<Button variant="secondary">Cancel</Button>
</FormActions>
```

`align` controlla l'allineamento sull'asse principale e accetta `start`, `center`, `end` o `space-between`; il default e' `start`. Il wrapping ha default `true`. `space-between` opera indipendentemente su ogni riga flex wrappata. Impostare `wrap={false}` puo' permettere al contenuto di overfloware ed e' una scelta esplicita del consumatore.

Il componente renderizza lo snippet richiesto direttamente dentro un singolo `div` nativo. Semantica dei figli, nomi accessibili, attributi, handler, focus, tastiera, submit e navigazione restano di proprieta' del consumatore. Anche margini e posizionamento nella pagina restano di proprieta' del consumatore. Classi e stili del consumatore si compongono con il componente, la cui unica CSS custom property pubblica e' `--giu-form-actions-gap` con fallback `0.75rem`.

Mantieni l'azione primaria per prima nell'ordine DOM salvo che il workflow consumatore abbia una ragione documentata per scegliere un ordine diverso. `FormActions` non e' una toolbar: interfacce che richiedono semantica toolbar o navigazione con frecce richiedono un componente separato.

## SocialIcon

L'entry point root esporta:

```ts
import {
	SOCIAL_ICON_IDS,
	SocialIcon
} from 'giadaware-ui-components';

import type {
	SocialIconId
} from 'giadaware-ui-components';
```

Il registro chiuso degli identificatori e':

- `instagram`;
- `facebook`;
- `x`;
- `github`;
- `github-sponsors`.

`github` renderizza il brand mark GitHub. `github-sponsors` renderizza il cuore pieno usato per i link GitHub Sponsors. Identificatori runtime sconosciuti non renderizzano nulla; le build di sviluppo emettono un warning per ogni condizione invalida.

L'uso decorativo e' il default:

```svelte
<a href="/profile" aria-label="Profilo GitHub">
	<SocialIcon id="github" />
</a>
```

L'uso informativo richiede una label accessibile non vuota:

```svelte
<SocialIcon
	id="github"
	decorative={false}
	ariaLabel="Profilo GitHub"
	title="GitHub"
/>
```

Il sizing ha default `24px`. Un `size`, `width` o `height` numerico diventa un valore CSS pixel; le stringhe sono passate come lunghezze CSS. `width` e `height` sovrascrivono l'asse corrispondente impostato da `size`.

L'SVG usa:

```text
viewBox="0 0 24 24"
fill="currentColor"
```

Il colore eredita quindi dal contesto CSS circostante.

### Contratto tree-shaking

`SocialIcon` seleziona dinamicamente il proprio glyph da un identificatore. Importare il componente quindi include legittimamente tutte e cinque le geometrie approvate.

Il grafo di export root mantiene comunque il registro pubblico indipendente dall'implementazione del componente. Il gate corrente dimostra che importare solo `SOCIAL_ICON_IDS` esclude `SocialIcon`, i suoi helper runtime e tutte e cinque le geometrie SVG nel consumer packed pulito compilato dal test Vite SSR. Non rivendica una garanzia universale per ogni bundler.

### Geometria di terze parti

Le geometrie brand provengono da Simple Icons 16.26.0. La licenza del pacchetto sorgente e' CC0-1.0, ma il disclaimer di Simple Icons afferma che la licenza del progetto non implica che ogni singola icona sia CC0. Trademark e termini delle singole icone possono comunque applicarsi, e CC0 non concede diritti di trademark.

Il cuore GitHub Sponsors proviene da GitHub Primer Octicons v19.29.2, `icons/heart-fill-24.svg`, sotto MIT License, Copyright (c) 2026 GitHub Inc.

Vedi [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) per le notice complete.

## SocialLink

`SocialLink` incapsula la composizione accessibile ricorrente di un `SocialIcon` supportato e un anchor nativo senza spostare la policy di navigazione in Giada UI.

L'uso solo icona fornisce una label accessibile di proprieta' del consumatore:

```svelte
<SocialLink
	id="github"
	href="/profile"
	label="Profilo GitHub"
/>
```

L'uso con label visibile lascia il contenuto visibile come unica sorgente del naming:

```svelte
{#snippet githubLabel()}
	<span>Profilo GitHub</span>
{/snippet}

<SocialLink
	id="github"
	href="/profile"
	children={githubLabel}
/>
```

L'icona annidata e' sempre decorativa rispetto al link. Valori `href` blank invalidi e chiamate runtime solo icona senza nome falliscono in modo chiuso.

I consumatori mantengono piena proprieta' di `href`, `target`, `rel`, route, copy visibile, localizzazione, analytics e policy per link esterni. Il componente non aggiunge mai silenziosamente `target="_blank"` o `rel`.

`aria-label` e `aria-labelledby` sono riservati dal contratto di naming del componente; altri attributi nativi anchor, ARIA, `data-*` ed event applicabili sono inoltrati.

`SocialLink` non introduce geometria brand aggiuntiva. Le notice third-party e trademark esistenti di `SocialIcon` restano autorevoli.

Vedi [SocialLink](docs/it/social-link.md) per il contratto pubblico completo.

## FormStatus

L'entry point root esporta:

```ts
import { FormStatus } from 'giadaware-ui-components';

import type { FormStatusTone } from 'giadaware-ui-components';
```

`FormStatusTone` e' la union chiusa `success | error | warning | info`. `message` e' richiesto ed e' renderizzato senza label fornite dal pacchetto o altro testo localizzato. Un messaggio vuoto non renderizza alcuno status. `tone` ha default `info`.

Gli status sono persistenti per default:

```svelte
<FormStatus
	message="Impostazioni salvate"
	tone="success"
/>
```

Imposta `durationMs` a un numero finito positivo per chiudere automaticamente il messaggio nel browser:

```svelte
<FormStatus
	message="Bozza aggiornata"
	tone="info"
	durationMs={5000}
/>
```

Il default `null`, cosi' come zero, valori negativi, `NaN` e infinities, resta persistente. Cambiare `message` o `durationMs` rende di nuovo visibile il messaggio corrente e riavvia il lifecycle temporizzato. Durate oltre il limite di timer singolo del browser sono pianificate in chunk consecutivi bounded invece di overfloware. I timer non sono creati durante server rendering e sono ripuliti quando le prop cambiano o il componente viene distrutto.

La policy di accessibilita' e' deterministica: `error` usa `role="alert"` con `aria-live="assertive"`; `success`, `warning` e `info` usano `role="status"` con `aria-live="polite"`. Ogni status renderizzato usa `aria-atomic="true"`. Non ci sono close button, animazione, callback di chiusura o toast manager.

Il componente accetta `class` e `style` sul proprio elemento root. Il suo CSS scoped usa solo queste custom properties pubbliche neutre, ciascuna con un fallback leggibile:

- layout: `--giu-form-status-padding`, `--giu-form-status-border-width`, `--giu-form-status-border-radius`, `--giu-form-status-line-height`;
- colori per tone: `--giu-form-status-<tone>-border`, `--giu-form-status-<tone>-background` e `--giu-form-status-<tone>-color`.

## ImageAttachmentControl

Importa il componente e i suoi tipi rivolti al consumatore dall'entry point Studio:

```ts
import { ImageAttachmentControl } from 'giadaware-ui-components/studio';
import type {
	ImageAttachmentControlLabels,
	ImageAttachmentDropzoneOptions,
	ImageAttachmentState
} from 'giadaware-ui-components/studio';
```

`ImageAttachmentControl` e' controllato tramite `value` e `onvaluechange`. Il suo intent finale e' `keep`, `replace` (con un `File` nativo) o `remove`. `currentImage` descrive un'immagine esistente quando disponibile. I chiamanti possiedono tutte le label e i messaggi di validazione e possono configurare `accept`, `maxSizeBytes`, un `validator` custom e `disabled`.

La selezione drag-and-drop e' un progressive enhancement opzionale tramite la prop `dropzone`. L'input file nativo resta visibile ed e' l'interazione canonica da tastiera e fallback. I file droppati riusano la stessa validazione, transizione controllata `onvaluechange` e percorso nativo `FormData` dei file selezionati tramite picker. I consumatori forniscono tutte le istruzioni drop risolte.

```svelte
<script lang="ts">
	import { ImageAttachmentControl } from 'giadaware-ui-components/studio';
	import type {
		ImageAttachmentControlLabels,
		ImageAttachmentDropzoneOptions,
		ImageAttachmentState
	} from 'giadaware-ui-components/studio';

	let value: ImageAttachmentState = $state({ intent: 'keep', file: null });

	const dropzone: ImageAttachmentDropzoneOptions = {
		instructions: 'Drop an image here',
		activeInstructions: 'Release the image'
	};

	const labels: ImageAttachmentControlLabels = {
		input: 'Choose image',
		cancelReplacement: 'Cancel replacement',
		remove: 'Remove image',
		cancelRemoval: 'Cancel removal',
		keepExistingStatus: 'Existing image kept',
		keepEmptyStatus: 'No image selected',
		replaceStatus: 'Replacement selected',
		removeStatus: 'Image will be removed',
		replacementPreviewAlt: 'Replacement preview'
	};

	function save(state: ImageAttachmentState): void {
		switch (state.intent) {
			case 'keep':
				return;
			case 'replace':
				console.log('Selected file', state.file.name);
				return;
			case 'remove':
				console.log('Removal selected');
				return;
			default: {
				const exhaustive: never = state;
				return exhaustive;
			}
		}
	}
</script>

<ImageAttachmentControl
	{value}
	onvaluechange={(next) => value = next}
	currentImage={{ src: '/current-image.jpg', alt: 'Current image' }}
	invalidTypeMessage="Choose a supported image type"
	tooLargeMessage="Choose a smaller image"
	{labels}
	accept="image/png,image/jpeg"
	maxSizeBytes={5_000_000}
	{dropzone}
/>

<button type="button" onclick={() => save(value)}>Save</button>
```

Il chiamante e' responsabile di interpretare e persistere l'intent finale. Il componente non fornisce hidden removal field e non ha persistenza built-in.

Quando `dropzone` e' abilitato:

- i drag file espongono `data-drop-active="true"` mentre il target e' attivo;
- i drop rifiutati espongono `data-drop-rejected="true"` e riusano l'errore di validazione accessibile esistente;
- eventi drag enter/leave annidati sono normalizzati per evitare flicker del feedback;
- lo stato disabled blocca sia selezione nativa sia dropped selection;
- istruzioni drop di proprieta' del consumatore sono associate all'input nativo tramite `aria-describedby`;
- il target drop e' un gruppo semantico, non un button sintetico, quindi l'interazione da tastiera continua tramite l'input file nativo.

La presentazione dropzone e' personalizzabile tramite la famiglia di token `--giu-image-attachment-dropzone-*`, inclusi hook base, active e rejected per border/background.

L'enhancement non aggiunge upload transport, progress tracking, persistenza, supporto multi-file, paste handling o dipendenza drag-and-drop.

## Requisiti

Node.js:

    ^20.19.0 || >=22.12.0

Il repository attualmente usa Node 24 in CI.

## Harness di test del trial

Il trial di estrazione privata usa un harness di test bloccante che copre:

- server-side rendering deterministico;
- rendering componenti in Chromium;
- hydration client senza mismatch;
- controlli automatici di accessibilita' con Axe;
- grafi di dipendenze root, visitor e Studio isolati;
- entry point CSS espliciti opt-in;
- installazione pulita dal tarball generato;
- import TypeScript e runtime dall'artefatto packed;
- un runtime Svelte compatibile nel consumer;
- rifiuto della pubblicazione su registry.

Installa una volta il browser di test Chromium su una macchina di sviluppo:

    npx playwright install chromium

## Validazione locale

Installa le dipendenze:

    npm install

Esegui tutti i gate di validazione correnti:

    npm run validate

Crea un artefatto trial locale:

    npm pack

La pubblicazione su registry e' vietata durante l'incubazione privata.

Architettura e proprieta' del trial sono tracciate in
https://github.com/gcomneno/atelier-kit/issues/127
