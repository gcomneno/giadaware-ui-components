[English](../editable-list.md) | [Italiano](editable-list.md)

# EditableList, EditableListRow, ReorderActions e ReorderAnnouncement

Queste primitive sono disponibili solo da `giadaware-ui-components/studio`.

```svelte
<script lang="ts">
	import {
		EditableList,
		EditableListRow,
		ReorderActions,
		ReorderAnnouncement
	} from 'giadaware-ui-components/studio';
	import type { ReorderActionsPositionContext } from 'giadaware-ui-components/studio';

	let images = $state([{ id: 'hero', title: 'Hero' }]);
	let reorderEventKey = $state<number | null>(null);
	let reorderAnnouncement = $state<string | null>(null);
	let nextReorderEvent = 0;

	function positionContextFor(
		image: { id: string; title: string },
		index: number,
		total: number
	): ReorderActionsPositionContext {
		return {
			id: `gallery-${image.id}-reorder-context`,
			text: `${image.title}, position ${index + 1} of ${total}`
		};
	}

	function confirmMove(index: number, direction: -1 | 1) {
		/* consumer mutation, persistence and success/failure policy */
		reorderAnnouncement = 'Resolved localized reorder message';
		reorderEventKey = ++nextReorderEvent;
	}
</script>

{#snippet empty()}No images yet.{/snippet}

<EditableList legend="Gallery" isEmpty={images.length === 0} {empty}>
	{#each images as image, index (image.id)}
		{#snippet fields()}{image.title}{/snippet}
		{#snippet actions()}
			<ReorderActions
				moveUpLabel="Move image up"
				moveDownLabel="Move image down"
				canMoveUp={index > 0}
				canMoveDown={index < images.length - 1}
				positionContext={positionContextFor(image, index, images.length)}
				onMoveUp={() => confirmMove(index, -1)}
				onMoveDown={() => confirmMove(index, 1)}
			/>
		{/snippet}
		<EditableListRow position={index + 1} {fields} {actions} />
	{/each}
</EditableList>

<ReorderAnnouncement
	message={reorderAnnouncement}
	eventKey={reorderEventKey}
/>
```

`EditableList` possiede un `fieldset` nativo e una `legend` stringa, snippet opzionali description ed empty, una regione ordered-list e una regione add-action opzionale. `isEmpty` e' un segnale di cardinalita' di proprieta' del consumatore: `true` seleziona lo snippet `empty` e sopprime la lista; `false` seleziona la lista quando `children` e' presente. Quando e' omesso, i children selezionano la modalita' rows e la loro assenza seleziona la modalita' empty. Questo preserva la composizione per contenuto statico ma non puo' determinare se un `{#each}` del consumatore ha righe.

`EditableListRow` e' un `li` diretto con posizione visibile one-based, fields e poi actions. Posizioni runtime invalide (non finite, non intere o minori di uno) renderizzano deterministicamente come `1`. Il numero visibile e' nascosto alle tecnologie assistive cosi' l'ordinale nativo della lista non viene annunciato due volte.

`EditableListRow` puo' anche renderizzare un handle pointer drag opzionale locale alla riga come progressive enhancement:

```ts
export type EditableListRowDropPosition = 'before' | 'after';

export type EditableListRowDragCandidate = {
	sourceId: string;
	targetId: string;
	position: EditableListRowDropPosition;
};

export type EditableListRowDragCancelReason =
	| 'pointercancel'
	| 'lostpointercapture'
	| 'escape';
```

Passa `drag` solo quando il riordino pointer e' utile. Una config valida richiede un `id` riga stabile, una `label` handle esatta e `onDrop`. Config runtime invalide falliscono in modo chiuso senza renderizzare un handle. L'handle e' un controllo `type="button"` nativo esplicito marcato con `data-giu-drag-handle`; la riga stessa non e' mai `draggable`, non riceve mai ARIA drag-and-drop deprecata e non diventa mai il target pointer per il drag. `drag.disabled` disabilita solo l'handle: non puo' avviare drag o chiamare callback drag, mentre `ReorderActions` resta controllato indipendentemente.

Il pacchetto non calcola ordine, indici, ID target o punti di inserimento. I consumatori possiedono rendering keyed `{#each}` stabile, identita' degli item, hit testing, calcolo dei candidate, mutation, persistenza, policy di failure e focus post-riordino. Mantieni chiavi basate sull'identita' dell'item cosi' una mutation del consumatore riuscita preserva la riga e l'identita' del controllo previste dopo il riordino.

Durante un gesto handle attivo, `onDragStart` riceve l'ID sorgente esattamente una volta. Dopo che il pointer supera la soglia interna di 4 CSS pixel, `onDragCandidate` viene chiamato solo quando il candidate semantico controllato cambia, dove l'identita' e' `sourceId`, `targetId` e `position`. Il candidate e' sempre fornito dal consumatore tramite `drag.candidate`; Giada UI non espone coordinate pointer o eventi nativi. `onDrop` viene emesso con il candidate completo di proprieta' del consumatore `{ sourceId, targetId, position }` invariato, e solo dalla riga sorgente attiva il cui `drag.id` corrisponde a `candidate.sourceId`. Valori `sourceId` e `targetId` non vuoti devono essere trimmati, non contenere whitespace e non corrispondere tra loro.

`position` significa inserimento `before` o `after` il target candidate. Non esistono `inside`, movimento cross-list, ID generati, stato sortable-list, ghost manager, portal, modalita' keyboard drag, annuncio automatico, `aria-grabbed`, `aria-dropeffect` o `draggable=true`.

`pointercancel`, `lostpointercapture` ed Escape annullano il gesto attivo senza drop. Giada UI non intrappola focus, non ripristina focus e non sposta focus dopo il drop; la policy di focus appartiene alla mutation del consumatore e al rendering keyed. Pointer Events copre mouse, pen e touch. Solo l'handle esplicito usa `touch-action: none`; scrolling pagina e selezione non sono disabilitati sulla riga o sulla lista.

Le righe espongono `data-giu-dragging="true"` solo mentre il gesto del proprio handle e' attivo e `data-giu-drop-candidate="before|after"` solo quando il loro `drag.id` corrisponde al `targetId` di un candidate valido. Lo stesso candidate completo puo' essere passato alle righe sorgente e target; la sola presentazione della riga target non avvia un gesto e non chiama callback drag. Non codificare ID del consumatore nei nomi delle classi CSS.

`ReorderActions` renderizza move up e poi move down come controlli `type="button"` nativi. Le label esatte vengono da `moveUpLabel` e `moveDownLabel`; le callback non ricevono argomenti. `canMoveUp` e `canMoveDown` hanno default `true` e determinano da soli lo stato disabled, inclusi confini di prima, ultima e singola riga. Valori `size` non tipizzati e sconosciuti normalizzano a `default`, coerentemente con `Button`; i valori supportati sono `default` e `compact`.

`positionContext` e' una prop raggruppata opzionale per il contesto della riga/gruppo di azioni corrente:

```ts
export type ReorderActionsPositionContext = {
	id: string;
	text: string;
};
```

Quando fornito, entrambi i pulsanti move ricevono `aria-describedby` per una descrizione visually hidden e non-live dentro `ReorderActions`. L'`id` deve essere globalmente unico, stabile in hydration, non vuoto dopo trim e senza whitespace. Il `text` deve essere non vuoto dopo trim. Valori runtime invalidi falliscono in modo chiuso: non viene renderizzata alcuna descrizione e i pulsanti omettono `aria-describedby`. Giada UI non genera ne' sostituisce mai ID.

I consumatori possiedono calcolo della posizione, calcolo del totale, wording, localizzazione e identita' stabile. Preferisci ID derivati dall'identita' dell'item, come `gallery-${image.id}-reorder-context`. Non derivare ID da indici array che possono cambiare durante il riordino, perche' lo stesso item riceverebbe una relazione di accessibilita' diversa dopo lo spostamento. Gli esempi qui sono inglese illustrativo, non wording prescritto dal pacchetto.

Stati riga di esempio:

```svelte
<ReorderActions
	moveUpLabel="Move image up"
	moveDownLabel="Move image down"
	canMoveUp={false}
	canMoveDown={images.length > 1}
	positionContext={{ id: `gallery-${first.id}-reorder-context`, text: 'Hero, position 1 of 4' }}
	onMoveUp={noop}
	onMoveDown={moveFirstDown}
/>

<ReorderActions
	moveUpLabel="Move image up"
	moveDownLabel="Move image down"
	canMoveUp={true}
	canMoveDown={true}
	positionContext={{ id: `gallery-${middle.id}-reorder-context`, text: 'Detail, position 2 of 4' }}
	onMoveUp={moveMiddleUp}
	onMoveDown={moveMiddleDown}
/>

<ReorderActions
	moveUpLabel="Move image up"
	moveDownLabel="Move image down"
	canMoveUp={true}
	canMoveDown={false}
	positionContext={{ id: `gallery-${last.id}-reorder-context`, text: 'Credits, position 4 of 4' }}
	onMoveUp={moveLastUp}
	onMoveDown={noop}
/>

<ReorderActions
	moveUpLabel="Move image up"
	moveDownLabel="Move image down"
	canMoveUp={false}
	canMoveDown={false}
	positionContext={{ id: `gallery-${only.id}-reorder-context`, text: 'Hero, only image' }}
	onMoveUp={noop}
	onMoveDown={noop}
/>
```

`ReorderActions` non accetta `position` o `total` numerici, array, schemi item, loop keyed, servizi di localizzazione, ownership delle mutation, comportamento live-region o gestione del focus. Le label button esistenti restano i nomi accessibili forniti dal consumatore; il position context e' solo una descrizione accessibile.

`ReorderAnnouncement` e' la primitiva companion solo Studio per esiti confermati di riordino. Renderizza una singola shell live-region visually hidden `role="status"` polite e nessun testo visibile. I consumatori possiedono identita' degli item, array di item, gestione dell'intent di reorder, gestione dei candidate pointer drag, successo o fallimento della mutation, calcolo della posizione, localizzazione, messaggio finale di annuncio ed event key. `ReorderActions` rappresenta solo intent di reorder equivalente da tastiera, il drag opzionale rappresenta solo intent pointer, e `positionContext` descrive solo il contesto riga/gruppo di azioni corrente. Il position context non e' mai live e non deve essere usato come, o puntare a, `ReorderAnnouncement`.

`eventKey` e' il confine evento dell'annuncio. L'uguaglianza del messaggio e' irrilevante: cambiare il messaggio mantenendo lo stesso `eventKey` non e' un nuovo annuncio, mentre cambiare `eventKey` puo' annunciare di nuovo lo stesso messaggio. Usa un contatore monotonicamente crescente di proprieta' del consumatore, ID di mutation confermata o altro ID evento stabile esistente. Non usare `Date.now()` come event key canonico. Usa `null` quando non c'e' un evento di reorder confermato, e passa `null` o `message` vuoto per fallire in modo chiuso senza testo di annuncio significativo.

Il lifecycle dovrebbe essere solo su stato confermato: intent, mutation del consumatore, aggiornamento dello stato confermato, poi aggiornamento di `message` ed `eventKey`. Controlli disabled o mutation fallite non dovrebbero aggiornare `eventKey`. Server rendering e hydration iniziale mantengono vuota la shell live-region anche se le prop iniziali contengono un risultato precedente, cosi' stato preesistente obsoleto non viene annunciato. Il primo annuncio puo' avvenire solo dopo un cambio post-hydration di `eventKey`. Messaggi identici ripetuti con event key distinti vengono svuotati e reinseriti attraverso un boundary di tick Svelte cosi' le tecnologie assistive possano ricevere ogni evento confermato.

`FormStatus` resta feedback visibile generale di operazione. `ReorderAnnouncement` e' un companion visually hidden, event-driven, specifico per esiti confermati di reorder di `EditableList` e non compone o riusa `FormStatus`. Non rispecchiare lo stesso esito di reorder in un'altra live region, incluso `FormStatus` o `StatusNotice`, perche' puo' produrre annunci duplicati. Se serve conferma visibile, componi testo separato non-live accanto a `ReorderAnnouncement`.

I consumatori possiedono array, schemi, rendering keyed `{#each}` e identita' logica, mutation add/remove/reorder, cardinalita', nomi e ID dei campi, `FormData`, validazione, persistenza, focus dopo mutation e dirty tracking. Gallery e Meta quindi passano la propria condizione empty esplicita, per esempio `isEmpty={images.length === 0}`. La policy minimo-uno di Gallery e la policy zero-righe di Meta restano di proprieta' del consumatore. Le azioni remove si compongono con il `Button` esistente. Relations, drag and drop cross-list, comportamento combobox, matematica posizionale di proprieta' del pacchetto e qualsiasi `DynamicFieldList` monolitico sono esplicitamente esclusi.

Gli hook di stile pubblici sono isolati a `--giu-editable-list-*`, `--giu-editable-list-row-*`, `--giu-reorder-actions-*` e `--giu-reorder-announcement-*`. Hook comuni includono `--giu-editable-list-row-gap`, `--giu-editable-list-row-padding`, `--giu-editable-list-row-border`, `--giu-editable-list-row-drag-handle-size`, `--giu-reorder-actions-gap`, `--giu-reorder-actions-control-size`, `--giu-reorder-announcement-size` e `--giu-reorder-announcement-margin`.
