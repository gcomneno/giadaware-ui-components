[English](../panel.md) | [Italiano](panel.md)

# Panel

`Panel` e' disponibile solo da `giadaware-ui-components/studio`. Renderizza una singola sezione semantica nominata per contenuto correlato e azioni opzionali di proprieta' del consumatore.

E' una primitiva strutturale di presentazione. Non possiede stato asincrono, submit di form, navigazione, gestione del focus, eventi, live region o workflow di dominio.

## Contratto pubblico

Il contratto esportato `PanelProps` contiene:

- `title`: titolo visibile richiesto della sezione;
- `children`: snippet body richiesto;
- `description`: snippet esplicativo opzionale renderizzato sotto il titolo;
- `actions`: regione action header opzionale fornita dal consumatore;
- `footer`: contenuto opzionale fornito dal consumatore renderizzato dopo il body;
- `headingLevel`: livello di heading nativo opzionale da `2` a `6`, con default `2`;
- `id`: identificatore opzionale della sezione;
- `class`: classe opzionale del consumatore;
- `style`: stringa di stile inline opzionale, incluse le custom properties documentate.

`PanelHeadingLevel` e' la union chiusa `2 | 3 | 4 | 5 | 6`.

Il componente deliberatamente non inoltra attributi arbitrari di section. Nuovi attributi pubblici richiedono una decisione di contratto esplicita invece di espansione accidentale della superficie.

## Esempio

```svelte
<script lang="ts">
	import { Button, Panel } from 'giadaware-ui-components/studio';
</script>

<Panel
	title="Publishing settings"
	headingLevel={3}
	id="publishing-settings"
>
	{#snippet description()}
		Configure how the current document is published.
	{/snippet}

	{#snippet actions()}
		<Button variant="secondary">Open preview</Button>
	{/snippet}

	{#snippet footer()}
		<nav aria-label="Publishing actions">
			<Button variant="secondary">Save draft</Button>
		</nav>
	{/snippet}

	<label>
		Publication channel
		<select>
			<option>Preview</option>
			<option>Live</option>
		</select>
	</label>
</Panel>
```

Gli snippet restano di proprieta' del consumatore. I loro controlli, label, eventi, validazione, submit, navigazione, permessi e significato di dominio sono fuori da `Panel`.

## Semantica e accessibilita'

La root e' una `section` nativa il cui `aria-labelledby` fa riferimento all'heading visibile. Fornire `id` produce identificatori prevedibili basati su quel valore. Senza un identificatore esplicito, Svelte fornisce un identificatore generato stabile per SSR e hydration.

Il consumatore deve scegliere un livello di heading adatto all'outline del documento circostante. `headingLevel` cambia solo l'elemento heading nativo; non altera automaticamente l'importanza visuale.

La description opzionale e' contenuto esplicativo, non una live region. Lo snippet actions opzionale non riceve semantica toolbar, group o navigation da `Panel`; i consumatori devono aggiungere semantica ai propri controlli quando richiesto.

Il footer opzionale viene renderizzato dopo il body nell'ordine DOM e di lettura dentro un wrapper semanticamente neutro. `Panel` non produce un `footer` nativo, landmark di navigazione, group, role, label accessibile, divider o semantica di workflow. I consumatori possiedono tutta la semantica e l'interazione dentro il footer.

## Confini di responsabilita'

Usa `Panel` quando il contenuto forma una sezione documentale nominata con heading visibile.

`Surface` e' una primitiva implementata separata per contenimento visuale neutro senza titolo, heading o landmark section. `Panel` non deve diventare un wrapper decorativo generico solo per coprire quel caso d'uso.

Usa `AsyncOperationPanel` quando il contenuto rappresenta un lifecycle asincrono controllato. Quel componente possiede presentazione busy e risultato, comportamento di accessibilita' specifico dello stato e dettagli tecnici opzionali. `Panel` non possiede nessuna di queste responsabilita'.

## Stili

Classi e stili inline del consumatore si compongono con gli stili scoped del componente.

Le custom properties neutre supportate sono:

- `--giu-panel-gap`;
- `--giu-panel-padding`;
- `--giu-panel-border-width`;
- `--giu-panel-border-color`;
- `--giu-panel-border-radius`;
- `--giu-panel-color`;
- `--giu-panel-background`;
- `--giu-panel-header-gap`;
- `--giu-panel-title-size`;
- `--giu-panel-description-gap`;
- `--giu-panel-description-color`.

Il footer partecipa al `--giu-panel-gap` esistente; non viene introdotto alcun token specifico per spaziatura, bordo, divider o padding del footer. Il wrapper fornisce solo `min-width: 0` cosi' il contenuto del consumatore puo' partecipare a layout stretti.

Margini, posizionamento nella pagina, layout responsivo intorno al panel, styling dei controlli action, del contenuto footer e del contenuto body restano di proprieta' del consumatore.

## Determinismo

Per prop identiche, l'output SSR e' deterministico. L'hydration riusa i nodi esistenti di section, header, heading e body e non avvia lavoro, non collega eventi di proprieta' del componente e non muta stato del consumatore.
