[English](../image-lightbox.md) | [Italiano](image-lightbox.md)

# ImageLightbox

`ImageLightbox` e' una primitiva Visitor controllata per presentare una singola immagine completa in una finestra modale nativa senza ritagliarla.

## Importazione

```ts
import {
  ImageLightbox,
  type ImageLightboxLabels
} from 'giadaware-ui-components/visitor';
```

## Uso controllato

Il consumatore possiede il trigger e lo stato `open`.

```svelte
<script lang="ts">
  import {
    ImageLightbox,
    type ImageLightboxLabels
  } from 'giadaware-ui-components/visitor';

  let open = $state(false);

  const labels = {
    dialog: 'Image preview',
    close: 'Close image'
  } satisfies ImageLightboxLabels;
</script>

<button type="button" onclick={() => open = true}>
  Enlarge image
</button>

{#snippet caption()}
  <span>Optional consumer-owned caption.</span>
{/snippet}

{#snippet actions()}
  <div role="group" aria-label="Image actions">
    <button type="button">Consumer action</button>
  </div>
{/snippet}

<ImageLightbox
  {open}
  onopenchange={(next) => open = next}
  src="/images/example.jpg"
  alt="Example landscape"
  {labels}
  {caption}
  {actions}
/>
```

## Contratto pubblico

`open`, `onopenchange`, `src`, `alt` e `labels` sono richiesti.

`labels.dialog` nomina la finestra modale e `labels.close` e' il testo visibile del controllo di chiusura. Tutto il testo tradotto o rivolto al dominio resta di proprieta' del consumatore.

`caption` e' uno snippet Svelte opzionale per contenuto descrittivo della figura.

`actions` e' uno snippet Svelte opzionale renderizzato dentro la modale dopo la figura. E' pensato per contenuto interattivo di proprieta' del consumatore senza cambiare la semantica di `caption`. Giada UI non aggiunge semantica di raggruppamento, toolbar, navigazione o galleria al contenuto action.

`class` e `style` personalizzano la root della dialog.

## Modello di interazione

Il componente usa l'elemento HTML nativo `dialog` e `showModal()`.

Il consumatore possiede il trigger. L'apertura del lightbox segue quindi la semantica ordinaria di button o link scelta dal consumatore.

La chiusura puo' essere richiesta da:

- il pulsante close visibile;
- `Escape`;
- click sul backdrop della dialog o sullo stage vuoto intorno all'immagine.

Ogni interazione di chiusura chiama `onopenchange(false)`. Il consumatore resta la fonte di verita'. Se un consumatore rifiuta la transizione richiesta, la dialog resta aperta.

Il pulsante close riceve il focus modale iniziale. Il ripristino del focus nativo della dialog riporta il focus al trigger invocante quando lo stato controllato accetta la chiusura.

## Comportamento dell'immagine

Il componente mostra una sola immagine. L'immagine preserva il proprio aspect ratio intrinseco, usa `object-fit: contain` ed e' vincolata al viewport disponibile.

In questa primitiva deliberatamente non esistono comportamenti `cover`, dimensione naturale, galleria, previous/next, counter, zoom o routing.

## Scorrimento dello sfondo

Mentre un lightbox e' aperto, Giada UI blocca lo scrolling sia sull'elemento document sia sul body. I valori inline precedenti di overflow sono ripristinati esattamente quando l'ultimo `ImageLightbox` aperto rilascia il lock.

Istanze multiple condividono quindi un document lock con reference count.

## Accessibilita'

I consumatori devono:

- usare un trigger accessibile;
- fornire `labels.dialog` e `labels.close` significativi;
- fornire testo alternativo appropriato per l'immagine;
- fornire contenuto caption solo quando aggiunge informazioni descrittive utili;
- fornire semantica, nomi accessibili, comportamento da tastiera e gestione dello stato per ogni controllo fornito tramite `actions`.

Giada UI possiede semantica modale nativa, focus iniziale sul controllo close, gestione controllata di Escape, gestione del backdrop e ripristino dello scroll.

## Hook di styling

La classe root stabile e' `giu-image-lightbox`.

Custom properties supportate:

- `--giu-image-lightbox-color`
- `--giu-image-lightbox-background`
- `--giu-image-lightbox-backdrop`
- `--giu-image-lightbox-gap`
- `--giu-image-lightbox-padding`
- `--giu-image-lightbox-close-padding`
- `--giu-image-lightbox-close-border-width`
- `--giu-image-lightbox-close-border-color`
- `--giu-image-lightbox-close-radius`
- `--giu-image-lightbox-close-color`
- `--giu-image-lightbox-close-background`
- `--giu-image-lightbox-close-hover-background`
- `--giu-image-lightbox-focus-width`
- `--giu-image-lightbox-focus-color`
- `--giu-image-lightbox-focus-offset`
- `--giu-image-lightbox-caption-gap`
- `--giu-image-lightbox-caption-max-width`
- `--giu-image-lightbox-caption-color`

Le classi interne dei discendenti non sono hook DOM pubblici.

## Non-obiettivi

`ImageLightbox` non possiede gallerie, indici, comportamento previous/next, counter, navigazione galleria da tastiera, selettori di fit mode, routing applicativo, i18n applicativa, persistenza o modelli di dominio del consumatore.
