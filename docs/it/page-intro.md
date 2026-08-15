[English](../page-intro.md) | [Italiano](page-intro.md)

# PageIntro

`PageIntro` e' disponibile solo da `giadaware-ui-components/studio`. Renderizza un singolo paragrafo semantico per breve contenuto introduttivo posizionato prima dei controlli principali, dei pannelli o dei gruppi di pannelli di una pagina Studio.

```svelte
<script lang="ts">
	import { PageIntro } from 'giadaware-ui-components/studio';
</script>

<PageIntro>Manage the current document.</PageIntro>

<PageIntro>
	Manage the current document and
	<a href="/preview" target="_blank" rel="noreferrer">open its preview</a>.
</PageIntro>
```

## Contratto pubblico

`PageIntroProps` richiede `children: Snippet` e accetta valori opzionali `class` e `style`.

La root e' sempre un `<p>` nativo. Il contenuto dello snippet puo' contenere testo semplice o contenuto inline misto, come link. Il componente non costruisce link, non risolve traduzioni e non interpreta stringhe HTML.

Le classi del consumatore si compongono con `giu-page-intro`. L'attributo inline standard `style` viene inoltrato e puo' definire dichiarazioni ordinarie o custom properties supportate.

## CSS custom properties

- `--giu-page-intro-margin`, default `0 0 1rem`;
- `--giu-page-intro-color`, default `#303030`;
- `--giu-page-intro-line-height`, default `1.5`;
- `--giu-page-intro-link-color`, default `currentColor`.

Ogni property e' opzionale e ha un fallback neutro. Il colore dei link resta controllato dal consumatore e i link forniti mantengono i propri attributi e comportamenti nativi.

## Accessibilita' e confine di responsabilita'

`PageIntro` preserva la semantica nativa di paragrafo. Non aggiunge ruolo, live region, landmark o meccanismo di nome accessibile.

Il consumatore possiede:

- testo tradotto;
- destinazioni, target e relazioni dei link;
- posizionamento nella pagina;
- theming specifico dell'applicazione.

Usa un vero heading per titoli di pagina e gerarchia. Usa un componente alert o status per feedback che deve essere annunciato. Usa un componente panel per contenuto strutturato o simile a un landmark. `PageIntro` non e' breadcrumb, pannello di aiuto o wrapper tipografico con root arbitraria.
