[English](../social-link.md) | [Italiano](social-link.md)

# SocialLink

`SocialLink` e' la primitiva root per la composizione ricorrente di un `SocialIcon` supportato con un anchor nativo.

Importalo dall'entry point root:

```ts
import {
	SocialLink
} from 'giadaware-ui-components';

import type {
	SocialLinkProps
} from 'giadaware-ui-components';
```

## Contratto pubblico

`SocialLink` renderizza sempre un `<a>` nativo quando il suo contratto runtime e' valido.

Il consumatore fornisce:

- `id`, usando il registro chiuso `SocialIconId` esistente;
- un `href` contenente almeno un carattere non-whitespace;
- un `label` non vuoto per la presentazione solo icona oppure `children` visibili;
- `iconSize` opzionale;
- attributi nativi anchor, ARIA, `data-*` ed event attribute applicabili.

`href` e `id` sono richiesti dal contratto TypeScript pubblico.

La regola del nome accessibile dipende dalla presenza di contenuto figlio visibile, quindi `label` e `children` sono individualmente opzionali nel tipo pubblico strutturale. La validazione runtime applica l'invariante effettivo: un link solo icona senza `label` non vuoto non renderizza alcun anchor. Le build di sviluppo emettono una diagnostica una volta per ogni condizione invalida.

`aria-label` e `aria-labelledby` intenzionalmente non fanno parte di `SocialLinkProps`. I chiamanti runtime che aggirano il contratto TypeScript non possono sovrascriverli: il componente li rimuove entrambi dagli attributi inoltrati.

## Presentazione solo icona

Fornisci `label` quando non viene renderizzato contenuto figlio visibile:

```svelte
<SocialLink
	id="instagram"
	href="/instagram"
	label="Instagram profile"
/>
```

Il componente posiziona la label normalizzata sull'anchor con `aria-label`.

Il `SocialIcon` annidato e' sempre decorativo, quindi il suo SVG e' nascosto dall'albero di accessibilita' e non duplica il nome dell'anchor.

Una label solo icona vuota o mancante fallisce in modo chiuso e non renderizza alcun anchor.

`href` viene controllato per contenuto non-whitespace ma per il resto viene renderizzato esattamente come fornito. `SocialLink` non normalizza o riscrive l'URL di proprieta' del consumatore.

## Icona piu' label visibile

Fornisci contenuto snippet visibile quando il link ha testo:

```svelte
{#snippet githubLabel()}
	<span>GitHub profile</span>
{/snippet}

<SocialLink
	id="github"
	href="/github"
	children={githubLabel}
/>
```

In questa modalita' il contenuto visibile fornisce il nome accessibile. `SocialLink` non aggiunge `aria-label` o `aria-labelledby`, evitando una sorgente di naming duplicata.

Se un chiamante runtime non tipizzato fornisce sia figli visibili sia `label`, il contenuto visibile resta autorevole e `label` viene ignorato per il naming.

## Policy di navigazione

Il consumatore possiede completamente la policy di navigazione.

`SocialLink` non aggiunge o inferisce automaticamente:

- `target`;
- `rel`;
- parametri di tracking;
- comportamento analytics;
- gestione delle route;
- annunci per link esterni.

Per esempio:

```svelte
<SocialLink
	id="github"
	href="https://github.com/example"
	label="GitHub profile"
	target="_blank"
	rel="me noreferrer"
/>
```

Quegli attributi sono inoltrati perche' li ha forniti il consumatore. Senza di essi il componente non renderizza ne' `target` ne' `rel`.

Il componente non e' mai un button e non implementa sharing, chiamate SDK, tooltip o analytics.

## Inoltro degli attributi nativi

`SocialLinkProps` si basa su `HTMLAnchorAttributes` di Svelte.

Gli attributi e handler nativi anchor applicabili si compongono con il componente, inclusi `download`, `hreflang`, `media`, `ping`, `rel`, `target`, `type`, `referrerpolicy`, attributi ARIA ordinari diversi dagli attributi di naming riservati, attributi `data-*` ed event handler.

I valori `class` e `style` inline del consumatore si compongono con la root del componente.

## Proprieta' dell'icona

`SocialLink` riusa `SocialIcon`; non duplica o mantiene geometria SVG.

Gli identificatori supportati restano quindi esattamente quelli esposti tramite `SocialIconId` e `SOCIAL_ICON_IDS`.

`iconSize` viene passato a `SocialIcon` come valore `size`. Il default e' `24px` tramite il contratto `SocialIcon` esistente.

L'API `SocialIcon` esistente resta utilizzabile indipendentemente per presentazione SVG decorativa o informativa.

## Stili

La classe root stabile e':

```text
.giu-social-link
```

Due classi di presentazione distinguono i layout supportati:

```text
.giu-social-link--icon-only
.giu-social-link--labelled
```

Il componente espone custom properties CSS neutre:

- `--giu-social-link-gap`;
- `--giu-social-link-border-radius`;
- `--giu-social-link-color`;
- `--giu-social-link-text-decoration`;
- `--giu-social-link-hover-color`;
- `--giu-social-link-hover-text-decoration`;
- `--giu-social-link-focus-width`;
- `--giu-social-link-focus-color`;
- `--giu-social-link-focus-offset`.

Ogni custom property ha un fallback. Lo styling resta scoped al componente; non ci sono dipendenze nascoste da font, asset o rete.

## Accessibilita' e hydration

L'anchor mantiene semantica nativa di link, focus e attivazione da tastiera.

L'SVG del brand annidato e' solo di presentazione rispetto al nome del link.

L'output SSR e' deterministico. La copertura hydration verifica che i nodi anchor server esistenti siano riusati senza mismatch, warning o errore e restino interattivi dopo l'hydration.

La copertura Axe verifica sia composizioni solo icona sia con label visibile.

## Geometria di terze parti e trademark

`SocialLink` non introduce nuova geometria icona. Renderizza il componente `SocialIcon` esistente e quindi eredita la stessa provenienza della geometria di terze parti e le stesse considerazioni di trademark.

Vedi [`THIRD_PARTY_NOTICES.md`](../../THIRD_PARTY_NOTICES.md) e la documentazione [`SocialIcon`](../../README.it.md#socialicon) per le notice complete.

## Confine di responsabilita'

`SocialLink` possiede:

- un singolo anchor nativo;
- composizione con un `SocialIcon` decorativo supportato;
- il requisito di nome accessibile per la modalita' solo icona;
- evitare nomi accessibili duplicati con contenuto visibile;
- presentazione neutra e styling del focus;
- SSR e hydration deterministici.

I consumatori possiedono:

- URL di destinazione;
- `target` e `rel`;
- policy di routing;
- copy visibile e localizzazione;
- analytics e tracking;
- policy per link esterni;
- comportamento applicativo.

`SocialLink` non genera URL, non apre SDK social, non agisce come controllo share, non implementa tooltip e non amplia il registro icone.
