[English](../component-surface-expansion.md) | [Italiano](component-surface-expansion.md)

# Espansione della superficie dei componenti

Questo documento descrive le famiglie pubbliche aggiunte durante l'espansione
della superficie riutilizzabile di `giadaware-ui-components`.

Tutti i componenti e tipi pubblici vengono importati dall'unica root del
package:

```ts
import {
	Accordion,
	AccordionItem,
	Combobox,
	Dialog,
	Disclosure,
	MenuButton,
	MenuItem,
	MenuSeparator,
	NavList,
	Pagination,
	Select,
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

Nessuna famiglia introdotta da questa espansione crea un subpath pubblico del
package.

## Confine di ownership

GiadaWare UI possiede presentazione riutilizzabile, semantica di interazione
nativa o ARIA, comportamento di accessibilita' assegnato al componente,
contratti di stato controllato, ID deterministici dove necessari, hook CSS,
SSR e hydration.

L'applicazione consumer mantiene route, orchestrazione fetch e Promise,
persistenza, schemi, lookup di localizzazione, filtering di dominio, stato di
dominio, policy di navigazione applicativa e altro comportamento specifico del
workflow.

## Primitive native per i campi

### TextInput

`TextInput` avvolge un singolo `input` nativo ed espone un `value` stringa
bindable.

I tipi di input posseduti dal componente sono:

- `text`;
- `email`;
- `password`;
- `search`;
- `tel`;
- `url`.

Gli attributi nativi applicabili restano forniti dal consumer.

### Textarea

`Textarea` avvolge una singola `textarea` nativa ed espone un `value` stringa
bindable.

Il contratto `resize` e':

- `block`: resize verticale;
- `inline`: resize orizzontale;
- `both`: entrambi gli assi;
- `none`: nessun resize utente.

### Select

`Select` preserva l'elemento `select` nativo e il contenuto option fornito dal
consumer.

La modalita' single-select usa un valore `string | null | undefined`.
La modalita' multiple-select viene scelta esplicitamente con `multiple` e usa
un valore `string[]`.

`Select` non implementa filtering, caricamento remoto o comportamento da
combobox editabile.

## Disclosure e accordion

### Disclosure

`Disclosure` e' un singolo disclosure nativo `details`/`summary` con stato
`open` bindable.

Il consumer fornisce sia summary sia body.

### Accordion

`Accordion` coordina una raccolta di componenti `AccordionItem`.

La modalita' single-open usa il meccanismo nativo di grouping `details[name]`.
`multiple={true}` permette item aperti indipendenti.

`AccordionItem` mantiene la semantica nativa `details`/`summary` ed espone stato
`open` bindable. GiadaWare UI non sostituisce il modello nativo con una state
machine ARIA personalizzata.

## Dialog

`Dialog` e' una primitiva generica controllata basata su native dialog.

Il contratto pubblico di stato e' `open` piu' `onopenchange`.

GiadaWare UI possiede:

- lifecycle modale nativo tramite `showModal()`;
- intent di chiusura Escape e backdrop;
- posizionamento del focus in apertura;
- ripristino del focus in chiusura;
- resilienza quando una richiesta controllata di chiusura viene rifiutata;
- comportamento SSR e hydration deterministico.

Il consumer possiede azioni applicative, submit dei form, policy di conferma,
copy e workflow di dominio.

`Dialog` resta distinto da `ImageLightbox`. Un dialog generico non deve inferire
comportamento da image gallery.

## Tabs

La famiglia Tabs contiene:

- `Tabs`;
- `TabList`;
- `Tab`;
- `TabPanel`.

`Tabs` e' controllato tramite `value` e `onvaluechange`.

L'attivazione puo' essere:

- `automatic`: lo spostamento del focus richiede anche la selezione;
- `manual`: il focus si sposta indipendentemente e l'attivazione nativa del
  button richiede la selezione.

`TabList` supporta orientamento orizzontale o verticale, navigazione con frecce,
Home ed End, salto dei tab disabled e wrapping.

GiadaWare UI possiede ID deterministici tab/panel e le relazioni ARIA richieste.
Il consumer possiede sincronizzazione con route, URL state, persistenza e
interpretazione di dominio.

I valori devono identificare in modo coerente la relazione tab/panel
all'interno della stessa root Tabs.

## MenuButton

La famiglia menu contiene:

- `MenuButton`;
- `MenuItem`;
- `MenuSeparator`.

`MenuButton` possiede un trigger button nativo e un popup `role="menu"`.

Il componente possiede stato open transitorio, navigazione con frecce,
Home/End, salto degli item disabled, chiusura Escape, chiusura con Tab senza
intrappolare il focus, chiusura da pointer esterno e ripristino del focus sul
trigger dopo l'attivazione di un item.

`MenuItem` e' un button nativo con semantica menu-item.

Questa famiglia rappresenta un menu di azioni. Non e' un `Dropdown` generico,
un sostituto di select, un modello di selezione persistente o un'astrazione
router.

## Combobox

`Combobox` e' una combobox ARIA editabile basata su `aria-activedescendant`.
Il focus DOM resta sull'input nativo mentre cambia l'option attiva.

Il contratto dati controllato separa:

- `query`: testo editabile corrente;
- `value`: valore committed opzionale;
- `options`: option gia' preparate dal consumer;
- `onquerychange`;
- `onvaluechange`.

GiadaWare UI possiede visibilita' del popup, navigazione dell'option attiva,
salto delle option disabled, attivazione dell'option, ID deterministici e
relazioni ARIA.

Il consumer possiede filtering, fetch remoto, debounce, persistenza,
localizzazione e interpretazione di dominio.

La digitazione modifica `query`; non azzera implicitamente il `value` committed.

I valori delle option dovrebbero essere univoci nello stesso insieme, cosi' la
selezione committed ha una sola corrispondenza semantica.

## Tooltip

`Tooltip` e' un popup descrittivo non interattivo.

Il consumer renderizza il trigger tramite lo snippet fornito e applica
all'elemento interattivo le props di trigger ricevute.

GiadaWare UI possiede:

- `aria-describedby`;
- comportamento di visibilita' da focus e pointer;
- dismiss con Escape;
- ID tooltip deterministico;
- `role="tooltip"`.

Il contenuto del tooltip deve restare non interattivo. Le azioni applicative
appartengono a un'altra famiglia.

## Pagination

`Pagination` e' controllato tramite:

- `page`;
- `pageCount`;
- `onpagechange`;
- label risolte dal consumer.

Renderizza button nativi per Previous, pagine numeriche e Next e applica
`aria-current="page"` alla pagina corrente.

GiadaWare UI possiede presentazione, semantica dei controlli pagina e disabling
ai confini. Il consumer possiede URL state, page size, interpretazione del
numero totale di record, fetch e persistenza.

Il contratto corrente renderizza tutti i numeri di pagina. Non possiede ancora
policy di ellissi o windowing.

## Navigazione

`NavList` renderizza nativamente:

```text
nav
└── ul
    └── li
        └── a
```

Il consumer fornisce href e label.

`current: true` viene mappato a `aria-current="page"`. I token supportati di
`aria-current` possono essere forniti esplicitamente tramite `NavListCurrent`.

`NavList` non possiede integrazione router, breadcrumb, stato di navigazione
annidato o policy route applicativa.

## Primitive Table

La famiglia table contiene:

- `Table`;
- `TableCaption`;
- `TableHead`;
- `TableBody`;
- `TableRow`;
- `TableHeaderCell`;
- `TableCell`.

Ogni componente preserva il corrispondente elemento HTML nativo.

La famiglia fornisce intenzionalmente soltanto struttura semantica di tabella e
hook di stile. Non e' un data grid e non possiede sorting, filtering, selezione,
virtualizzazione, pagination, row actions o interazione keyboard da grid.

## Accessibilita' e semantica nativa

L'espansione preferisce deliberatamente HTML nativo quando fornisce gia' il
modello di interazione corretto:

- `input`;
- `textarea`;
- `select`;
- `details` / `summary`;
- `dialog`;
- `button`;
- `nav`;
- elementi table.

I modelli ARIA vengono introdotti solo dove HTML nativo non fornisce il
comportamento composito richiesto, in particolare Tabs, MenuButton, Combobox e
Tooltip.

I consumer devono preservare label accessibili, struttura del documento e
relazioni applicative specifiche che restano fuori dal contratto pubblico del
singolo componente.

## SSR e hydration

La superficie espansa e' testata per SSR deterministico e hydration.

Le famiglie composite interattive hanno inoltre test browser mirati per
comportamento da tastiera, ownership del focus, richieste di stato controllato
e accessibilita'.

I consumer non devono considerare il solo successo SSR come prova di correttezza
browser o hydration.

## Styling

Ogni famiglia espone CSS custom properties scoped `--giu-*`.

`class` e `style` inline del consumer si compongono quando inclusi nel contratto
pubblico. Le classi discendenti interne sono dettagli implementativi salvo
diversa indicazione esplicita in una documentazione pubblica dedicata.

Il package non introduce dipendenze nascoste da rete, font o runtime third-party
per questi componenti.

## Note finali di contratto

- I campi `value` delle opzioni di `Combobox` **devono essere univoci** all'interno dello stesso insieme di opzioni. Identità delle opzioni, ID `aria-activedescendant` e selezione controllata dipendono da valore/indice; i valori duplicati sono fuori dal contratto supportato.
- L'`id` pubblico di `Combobox` identifica il contratto radice del componente. L'input nativo modificabile usa l'ID derivato `${id}-input`; le associazioni esterne `<label for>` devono quindi puntare a tale ID derivato.
- `Select.multiple` è una scelta della modalità di costruzione. Cambiare `multiple` a runtime sostituisce il nodo `<select>` nativo perché Svelte richiede binding distinti per valore singolo e valore multiplo. I consumer non devono quindi fare affidamento sulla conservazione del focus o dell'identità del nodo DOM durante tale cambio di modalità.
