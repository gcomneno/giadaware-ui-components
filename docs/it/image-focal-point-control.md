[English](../image-focal-point-control.md) | [Italiano](image-focal-point-control.md)

# ImageFocalPointControl

`ImageFocalPointControl` e' una primitiva Studio controllata per scegliere un
punto focale su un'immagine sorgente che un consumatore potra' poi renderizzare
in media ritagliati.

## Importazione

```ts
import {
  ImageFocalPointControl,
  type ImageFocalPointImage,
  type ImageFocalPointValue
} from 'giadaware-ui-components';
```

Importa lo stylesheet pubblico esplicito dove il componente viene renderizzato:

```ts
import 'giadaware-ui-components/styles.css';
```

## Uso Controllato

```svelte
<script lang="ts">
  import {
    ImageFocalPointControl,
    type ImageFocalPointImage,
    type ImageFocalPointValue
  } from 'giadaware-ui-components';
  import 'giadaware-ui-components/styles.css';

  const image = {
    src: '/images/editorial-hero.jpg',
    alt: 'Editorial hero preview'
  } satisfies ImageFocalPointImage;

  let focalPoint: ImageFocalPointValue | null = $state(null);
</script>

<ImageFocalPointControl
  {image}
  value={focalPoint}
  onvaluechange={(next) => focalPoint = next}
  label="Choose hero image focal point"
/>
```

## Contratto Pubblico

Il tipo pubblico del valore e':

```ts
type ImageFocalPointValue = {
  x: number;
  y: number;
};
```

`x` e `y` sono coordinate normalizzate nell'intervallo inclusivo `0..1`. `x: 0`
e' il bordo sinistro, `x: 1` e' il bordo destro, `y: 0` e' il bordo superiore e
`y: 1` e' il bordo inferiore.

Il tipo pubblico dell'immagine e':

```ts
type ImageFocalPointImage = {
  src: string;
  alt: string;
};
```

`image`, `onvaluechange` e `label` sono richiesti. `value` e' opzionale e puo'
essere `null`. Coordinate mancanti, `null`, malformate o non finite
renderizzano il punto centrale `0.5, 0.5`. Coordinate finite fuori
dall'intervallo supportato sono clampate a `0..1`.

`disabled`, `id`, `class` e `style` sono opzionali. `id` viene applicato alla
superficie interattiva del punto focale. `class` e `style` si compongono con la
root.

## Modello di Interazione

Il controllo renderizza l'immagine sorgente e un marker focale visibile.

Interazioni pointer, mouse, pen e touch usano pointer events. Premere o
trascinare sulla preview richiede un valore normalizzato derivato dal bounding
box corrente della preview. Il componente non memorizza dimensioni pixel, quindi
il drag continua a usare la dimensione correntemente renderizzata se il layout
cambia.

Interazione da tastiera disponibile quando il controllo ha focus:

- le frecce regolano la coordinata corrente di `0.01`;
- `Shift` piu' una freccia regola di `0.1`;
- tutti i risultati da tastiera sono clampati a `0..1`.

Ogni transizione significativa chiama `onvaluechange(next)`. Il consumatore
resta la fonte di verita'. Se il consumatore rifiuta una transizione richiesta,
il marker continua a renderizzare da `value` controllato.

Quando `disabled` e' true, la superficie interattiva e' un button nativo
disabled, non riceve focus tramite normale navigazione da tastiera e non emette
callback.

## Accessibilita'

La superficie del punto focale e' un button nativo con il `label` fornito dal
consumatore come nome accessibile. Il componente non usa semantica slider
perche' la piattaforma web non ha un pattern slider nativo o ARIA accurato per
un singolo punto bidimensionale.

I consumatori devono fornire:

- un `label` significativo per la superficie del punto focale;
- testo `image.alt` appropriato;
- eventuali relazioni circostanti di field label, description o validation;
- tutto il testo tradotto o rivolto al dominio.

Giada UI possiede focusability, comportamento disabled e interazione
pointer/tastiera del controllo stesso.

## Hook di Styling

La classe root stabile e' `giu-image-focal-point-control`.

Custom properties supportate:

- `--giu-image-focal-point-preview-width`
- `--giu-image-focal-point-preview-aspect-ratio`
- `--giu-image-focal-point-preview-radius`
- `--giu-image-focal-point-preview-border`
- `--giu-image-focal-point-preview-background`
- `--giu-image-focal-point-object-fit`
- `--giu-image-focal-point-marker-size`
- `--giu-image-focal-point-marker-border`
- `--giu-image-focal-point-marker-background`
- `--giu-image-focal-point-marker-shadow`
- `--giu-image-focal-point-focus-width`
- `--giu-image-focal-point-focus-color`
- `--giu-image-focal-point-focus-offset`
- `--giu-image-focal-point-disabled-opacity`

Le classi interne dei discendenti non sono hook DOM pubblici.

## Non-Responsabilita'

`ImageFocalPointControl` non persiste coordinate, non genera ritagli, non muta
l'immagine sorgente, non carica file, non rileva volti o soggetti, non decide la
policy di rendering fuori dal controllo, non mappa valori a CSS
`object-position`, non possiede schemi del consumatore, non possiede route e non
codifica logica applicativa o di dominio.
