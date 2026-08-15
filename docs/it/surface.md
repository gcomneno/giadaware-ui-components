[English](../surface.md) | [Italiano](surface.md)

# Surface

`Surface` e' disponibile solo da `giadaware-ui-components/studio`. Fornisce contenimento visuale neutro senza creare sezione, heading, landmark, nome accessibile, modello di interazione o workflow applicativo.

## Contratto pubblico

Il contratto esportato `SurfaceProps` contiene:

- `children`: snippet di contenuto richiesto;
- `class`: classe opzionale del consumatore;
- `style`: stringa di stile inline opzionale, incluse le custom properties documentate.

Il componente deliberatamente non inoltra attributi arbitrari di `div`. Aggiungere ruoli, nomi accessibili, attributi data o altri attributi root richiede in futuro una decisione di contratto esplicita invece di un'espansione accidentale dell'API.

## Contenitore form neutro

```svelte
<script lang="ts">
	import { Surface } from 'giadaware-ui-components/studio';
</script>

<Surface>
	<form method="post">
		<label>
			Display name
			<input name="displayName" />
		</label>
		<button type="submit">Save</button>
	</form>
</Surface>
```

Il form, le label, i controlli, il comportamento di submit e la validazione restano interamente di proprieta' del consumatore.

## Contenuto dentro un landmark di navigazione nominato

```svelte
<nav aria-label="Project resources">
	<Surface>
		<a href="/documentation">Documentation</a>
		<a href="/support">Support</a>
	</Surface>
</nav>
```

`Surface` non diventa il landmark di navigazione. Il `nav` circostante possiede la semantica landmark e il nome accessibile.

## Composizione con wrapper personalizzato

```svelte
<article aria-labelledby="release-title">
	<h2 id="release-title">Current release</h2>

	<Surface class="release-summary">
		<p>Version 2.4 is ready for deployment.</p>
	</Surface>
</article>
```

I consumatori scelgono wrapper, gerarchia degli heading, ID e relazioni accessibili richieste dalla struttura del loro documento.

## Relazione con Panel

Usa `Panel` quando il contenuto e' una sezione nominata del documento che richiede un heading visibile e un'associazione `aria-labelledby` deterministica.

Usa `Surface` quando serve solo contenimento visuale neutro o quando il consumatore deve scegliere la semantica circostante. `Surface` non deve ricevere comportamento automatico di sezione o heading solo per imitare `Panel`.

Usa `AsyncOperationPanel` quando il contenuto rappresenta un lifecycle asincrono controllato con presentazione busy e risultato.

## Responsabilita' di accessibilita'

`Surface` intenzionalmente non aggiunge ruolo, landmark, heading o nome accessibile. Il consumatore deve:

- scegliere wrapper semantici quando richiesti;
- nominare i landmark circostanti;
- preservare la semantica nativa di form e navigazione;
- fornire heading e gerarchia del documento;
- assicurare che i discendenti interattivi abbiano nomi accessibili.

I fallback di default per bordo, foreground e background forniscono un contenitore neutro visibile, ma i consumatori restano responsabili della validazione di eventuali colori sovrascritti.

## Stili

Le custom properties supportate sono:

- `--giu-surface-padding`;
- `--giu-surface-border-width`;
- `--giu-surface-border-color`;
- `--giu-surface-border-radius`;
- `--giu-surface-color`;
- `--giu-surface-background`.

Margini, posizionamento nella pagina, layout interno del contenuto, spaziatura dei discendenti e styling dei controlli interattivi restano di proprieta' del consumatore.

## Determinismo

Per prop identiche, l'output SSR e' deterministico. L'hydration deve riusare la root esistente e i nodi del consumatore senza introdurre eventi, stato o attributi semantici di proprieta' del componente.
