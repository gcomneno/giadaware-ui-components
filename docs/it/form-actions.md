[English](../form-actions.md) | [Italiano](form-actions.md)

# FormActions

`FormActions` e' disponibile solo da `giadaware-ui-components/studio`. E' una primitiva di layout per uno snippet di azioni arbitrario fornito dal consumatore e renderizza sempre un singolo `div` nativo.

```svelte
<script lang="ts">
	import { Button, FormActions } from 'giadaware-ui-components/studio';
</script>

<FormActions align="end">
	<Button type="submit">Save changes</Button>
	<Button variant="secondary">Cancel</Button>
</FormActions>
```

## Contratto

`FormActionsProps` richiede `children: Snippet`. Accetta inoltre:

- `align?: 'start' | 'center' | 'end' | 'space-between'`, con default `start`;
- `wrap?: boolean`, con default `true`;
- valori opzionali `class` e `style` del consumatore.

`align` controlla l'allineamento sull'asse principale. Viene mappato a `flex-start`, `center`, `flex-end` o `space-between`. Quando il contenuto va a capo, `space-between` opera indipendentemente su ogni riga flex.

Il wrapping e' abilitato per default. Impostare `wrap={false}` seleziona `nowrap`; il contenuto puo' quindi uscire dal proprio contenitore, e questa e' una scelta esplicita del consumatore.

## Confine di ownership

`FormActions` possiede solo layout flex orizzontale, allineamento centrato sull'asse trasversale, box sizing e sicurezza della larghezza minima, gap, wrapping e allineamento sull'asse principale. Non imposta margini, larghezza, padding, bordi, colori, tipografia o dimensionamento dei discendenti. Margini e posizionamento dentro una pagina o un pannello restano di proprieta' del consumatore.

I figli sono renderizzati direttamente senza wrapper individuali o stili sui discendenti. Pulsanti, link, input, form e altri contenuti mantengono semantica nativa, attributi, ordine di focus, comportamento da tastiera, event handler, comportamento di submit e comportamento di navigazione. I nomi accessibili e ogni altra semantica o comportamento dei figli restano di proprieta' del consumatore.

Il componente non aggiunge ruoli, attributi ARIA, live region, landmark, meccanismi di nome accessibile, controlli, eventi, gestione del focus o comportamento di lifecycle. Non inoltra attributi nativi arbitrari di `div`.

## Ordine delle azioni e confine toolbar

Inserisci per default l'azione primaria per prima nell'ordine DOM, seguita dalle azioni secondarie. Un consumatore puo' scegliere un ordine diverso quando il suo workflow ha una ragione documentata, ma `FormActions` non modifica mai l'ordine fornito.

`FormActions` non e' una toolbar. Interfacce che richiedono semantica toolbar, ruoli di raggruppamento, roving focus o navigazione con frecce richiedono un componente separato con un contratto di accessibilita' esplicito.

## Stili

Le classi del consumatore si compongono con `giu-form-actions`, e gli stili inline del consumatore sono inoltrati al `div` root. L'unica custom property pubblica e':

```css
--giu-form-actions-gap: 0.75rem;
```

Il fallback viene usato quando la property non e' impostata. L'allineamento viene selezionato tramite la prop `align` invece che con una CSS custom property. Il margine esterno resta di proprieta' del consumatore. Allineamento e wrapping sono implementati con classi modificatrici interne e scoped, quindi il componente non inietta dichiarazioni `justify-content` o `flex-wrap` di proprieta' della libreria nello stile del consumatore.
