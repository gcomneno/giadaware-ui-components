[English](CONTRIBUTING.md) | [Italiano](CONTRIBUTING.it.md)

# Contribuire

Le modifiche devono preservare il contratto di incubazione privata tracciato da
gcomneno/atelier-kit#127.

Le modifiche alla documentazione pubblica devono preservare il contratto
bilingue in [docs/it/documentation-policy.md](docs/it/documentation-policy.md).
Quando un documento canonico inglese in ambito cambia, valutare e aggiornare lo
specchio italiano mantenuto nella stessa pull request, mantenere validi i
selettori di lingua reciproci ed eseguire `npm run verify:docs`.

Prima di aprire una pull request, eseguire:

    npm install
    npm run validate
    git diff --check

Non aggiungere:

- configurazione di pubblicazione npm;
- credenziali o token di registry;
- permessi OIDC per la pubblicazione;
- dist-tags;
- scope od organizzazioni npm;
- workflow di release che pubblicano il package.

L'ambito dei componenti consiste solo nei componenti approvati tramite decisioni
architetturali esplicite. Ogni componente aggiuntivo richiede ancora la propria
decisione architetturale esplicita prima dell'implementazione.
