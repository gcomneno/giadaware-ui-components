[English](../documentation-policy.md) | [Italiano](documentation-policy.md)

# Criterio per la documentazione

L'inglese e' la fonte canonica di verita' per la documentazione pubblica di
GiadaWare UI Components.

L'italiano e' uno specchio ufficiale mantenuto della superficie di
documentazione pubblica. Gli specchi italiani non sono riassunti: devono
preservare requisiti normativi, contratti pubblici, esempi, avvisi,
limitazioni, confini di responsabilita', semantica di accessibilita',
garanzie SSR e di hydration, regole di package e distribuzione, e significato
tecnico.

Quando un documento canonico inglese in ambito cambia, la stessa pull request
deve valutare e aggiornare il relativo specchio italiano mantenuto. I selettori
di lingua reciproci sono richiesti in ogni documento bilingue mantenuto. La
navigazione nella stessa lingua deve essere usata quando esiste uno specchio
mantenuto.

Gli identificatori tecnici e il codice restano canonici. Non tradurre nomi di
package, imports o exports, simboli Svelte o TypeScript, nomi di prop o tipi,
nomi di file e percorsi, comandi shell, variabili d'ambiente, proprieta'
personalizzate CSS, nomi di attributi HTML o ARIA, valori letterali di union
chiuse, o blocchi di codice quando la traduzione cambierebbe la semantica
eseguibile o dell'esempio. Le stringhe in linguaggio naturale dentro esempi di
codice illustrativi possono restare in inglese quando tradurle creerebbe una
divergenza non necessaria.

La parita' semantica della traduzione e' responsabilita' dei reviewer. Il
verificatore automatico della documentazione controlla il contratto mantenuto
per file, selettori, link e navigazione nella stessa lingua; non dimostra la
qualita' della traduzione.

I documenti seguenti restano solo in inglese:

- `docs/architecture/**`
- `SECURITY.md`
- `CHANGELOG.md`
- `AGENTS.md`
- `THIRD_PARTY_NOTICES.md`

I componenti pubblici documentati solo in `README.md` non ottengono pagine di
documentazione dedicate speculative attraverso il contratto di documentazione
bilingue.
