[English](../relationship-graph.md) | [Italiano](relationship-graph.md)

# RelationshipGraph

Importa il componente e i tipi rivolti ai visitor solo dall'entry point visitor:

```svelte
<script lang="ts">
	import { RelationshipGraph } from 'giadaware-ui-components/visitor';
	import type {
		RelationshipGraphEdge,
		RelationshipGraphLabels,
		RelationshipGraphNode
	} from 'giadaware-ui-components/visitor';

	const nodes: RelationshipGraphNode[] = [
		{ id: 'a', label: 'Alpha' },
		{ id: 'b', label: 'Beta', href: '/beta' }
	];

	const edges: RelationshipGraphEdge[] = [
		{ source: 'a', target: 'b', type: 'support', label: 'Supports' }
	];

	const labels = {
		region: 'Relationship graph',
		controls: 'Graph controls',
		zoomIn: 'Zoom in',
		zoomOut: 'Zoom out',
		resetView: 'Reset view',
		fitGraph: 'Fit graph',
		panUp: 'Pan up',
		panDown: 'Pan down',
		panLeft: 'Pan left',
		panRight: 'Pan right',
		empty: 'No relationships to display.',
		summary: ({ nodeCount, edgeCount }) =>
			`${nodeCount} nodes, ${edgeCount} directed relationships.`,
		relationship: ({ sourceLabel, targetLabel, relationship }) =>
			relationship
				? `${sourceLabel} to ${targetLabel}: ${relationship}`
				: `${sourceLabel} to ${targetLabel}`
	} satisfies RelationshipGraphLabels;
</script>

<RelationshipGraph {nodes} {edges} {labels} />
```

I nodi richiedono `id` e `label` stringa; `image` e `href` opzionali sono stringhe. Gli edge richiedono `source` e `target` stringa; `type` e `label` opzionali sono stringhe. Gli array possono essere readonly e non vengono mai mutati.

## Label di proprieta' del consumatore

`labels` e' richiesto. Giada UI possiede semantica di interazione del grafo e wiring di accessibilita', mentre il consumatore possiede ogni stringa rivolta al grafo.

`RelationshipGraphLabels` contiene:

- `region`: nome accessibile per la regione del grafo;
- `controls`: nome accessibile per il gruppo controlli;
- `zoomIn` e `zoomOut`;
- `resetView` e `fitGraph`;
- `panUp`, `panDown`, `panLeft` e `panRight`;
- `empty`: testo visibile dello stato vuoto;
- `summary({ nodeCount, edgeCount })`: formatter del riepilogo del grafo;
- `relationship({ edge, sourceLabel, targetLabel, relationship })`: formatter per ogni descrizione accessibile di relazione.

Le callback formatter ricevono deliberatamente valori strutturati invece di inglese preformattato. I consumatori possono quindi applicare localizzazione, pluralizzazione e terminologia di dominio proprie. `relationship` e' la label edge normalizzata quando presente, altrimenti il suo type; e' omessa quando non esiste nessuno dei due.

Giada UI non fornisce fallback inglesi built-in per questo contratto.

## Layout e dati invalidi

Il layout interno senza dipendenze e' gerarchico ma non assume un albero. Accetta figli condivisi, piu' edge entranti, edge laterali o ciclici, componenti disconnesse, grafi vuoti e singoli nodi. I record validi sono copiati e ordinati per ID/campi edge prima del layout. ID e label vuoti o composti solo da whitespace sono scartati. Il primo ID duplicato nell'array del chiamante vince. Edge con endpoint mancanti sono scartati. Stringhe opzionali vuote sono omesse. Valori runtime node ed edge non-array diventano array vuoti. Queste regole mantengono i dati del grafo sicuri per SSR e deterministici in hydration; la validazione dei dati grafo e' intenzionalmente non-throwing.

Le componenti fortemente connesse sono identificate deterministicamente e collassate in un grafo aciclico di componenti. Quel grafo viene rankato una volta; i membri del ciclo occupano poi righe intra-componente stabili, producendo relazioni forward, lateral e backward utili senza inflazione del rank. I percorsi forward entrano nei nodi verticalmente, i percorsi lateral e backward usano una corsia di routing esterna, e i self-loop usano un path curvo dedicato fuori dal corpo del nodo. Le arrowhead sono path SVG inline, quindi istanze multiple del componente non condividono fragment ID. Le righe sono ordinate per ID. Questo e' un layout leggibile general-purpose, non un motore di ottimizzazione per grafi molto grandi, minimizzazione degli incroci di edge o simulazione force.

## Controlli e callback

Rotella del mouse e gesti pinch fanno zoom; il drag pointer esegue pan. Button nativi forniscono operazioni esplicite Zoom in, Zoom out, pan direzionale, Reset view e Fit graph. Le loro label visibili o accessibili vengono da `labels`.

Attivare un nodo lo seleziona e lo centra. `onnodeselect` riceve `{ node }`. `onnodeactivate` riceve `{ node, source }`, dove `source` e' `pointer` o `keyboard`. Il nodo in entrambi i payload e' una copia normalizzata. La selezione viene emessa immediatamente prima dell'attivazione.

Quando un controllo nodo ha focus, Arrow Up, Arrow Down, Arrow Left e Arrow Right selezionano il nodo piu' vicino nel semipiano geometrico richiesto, spostano il focus su di esso e lo centrano. La navigazione direzionale e' deterministica. Non attiva il nodo di destinazione; Enter, Space o la normale attivazione del link restano responsabili dell'attivazione.

I nodi con `href` sono link nativi e mantengono navigazione, context-menu e comportamento browser dei link. Gli altri nodi sono button nativi, inclusa attivazione con Enter e Space. I consumatori possiedono validita' delle destinazioni, comportamento di routing, label e contenuto localizzati, disponibilita' delle immagini e stato applicativo risultante dalle callback.

## Accessibilita' e resilienza

Il grafo e' una regione nominata usando `labels.region`. Il gruppo controlli e ogni controllo viewport usano nomi forniti dal consumatore. I controlli nodo restano link o button nativi con focus visibile.

Un riepilogo visually hidden usa `labels.summary` per i conteggi del grafo e `labels.relationship` per ogni relazione. La geometria edge resta decorativa e nascosta dall'albero di accessibilita', evitando primitive SVG rumorose. Il testo dei nodi resta presente quando un'immagine e' assente o fallisce. I grafi vuoti renderizzano esplicitamente `labels.empty`.

Il componente non ha transizione animata, e la modalita' reduced-motion disabilita l'ottimizzazione transform. Evita globali browser durante SSR. Il viewport ad altezza fissa e clipped e i controlli wrappabili restano usabili in contenitori stretti.

## Migrazione dal contratto iniziale

L'API di incubazione iniziale accettava prop separate `ariaLabel` e `emptyLabel` e forniva default inglesi:

```svelte
<RelationshipGraph
	{nodes}
	{edges}
	ariaLabel="Relationship graph"
	emptyLabel="No relationships to display."
/>
```

Sostituisci quelle prop con il contratto `labels` richiesto:

```svelte
<RelationshipGraph {nodes} {edges} {labels} />
```

Sposta nome regione, testo di stato vuoto, nomi dei controlli, riepilogo del grafo e formatter delle relazioni nel layer di localizzazione del consumatore. Giada UI non importa routing applicativo o servizio i18n.

## Stili

`class` e `style` si compongono sulla root. Gli hook stabili sono `.giu-relationship-graph` e le seguenti custom properties: `--giu-relationship-graph-height`, `--giu-relationship-graph-narrow-height`, `--giu-relationship-graph-border`, `--giu-relationship-graph-radius`, `--giu-relationship-graph-background`, `--giu-relationship-graph-color`, `--giu-relationship-graph-focus`, `--giu-relationship-graph-edge`, `--giu-relationship-graph-node-border`, `--giu-relationship-graph-node-background` e `--giu-relationship-graph-node-color`.

Gli attributi di stato stabili sono `data-giu-relationship-graph`, `data-giu-empty`, `data-giu-scale`, `data-giu-node-id` e `data-giu-edge-kind` (`forward`, `lateral`, `backward` o `self`). Hook interni di focus, coordinate path e annidamento DOM non sono API pubblica. Il componente non importa CSS automaticamente; `visitor/styles.css` resta un entry stylesheet esplicito vuoto e riservato.
