[English](../releases.md) | [Italiano](releases.md)

# Release

Giada UI segue la
[policy architetturale di release e versioning](../architecture/release-versioning-policy.md).

Questo documento descrive il contratto operativo di release. Non abilita la
pubblicazione su registry npm.

## Stato corrente

Il package resta in incubazione privata.

Finche' non viene preparata la prima release reale:

- `package.json` resta a `0.0.0`;
- non esiste alcun tag di release;
- i consumer downstream possono continuare a fissare SHA Git esatti e
  revisionati;
- `private: true` e i guard contro la pubblicazione su registry restano
  invariati.

La prima release reale e' pianificata come `0.1.0`.

## Preparare una release

Una release deve rappresentare una tranche coerente di lavoro revisionato,
anziche' un singolo merge.

La preparazione della release deve partire da una `main` aggiornata e deve
preservare il normale workflow tramite pull request.

La modifica di preparazione della release deve:

1. scegliere la versione SemVer richiesta dalle modifiche pubbliche accumulate;
2. aggiornare la versione del package e ogni contratto di verifica locale al
   repository che valida intenzionalmente quella versione;
3. spostare le voci applicabili di `CHANGELOG.md` da `Unreleased` in una sezione
   versionata con la data della release;
4. documentare la guida di migrazione per ogni modifica `0.x` deliberatamente
   breaking;
5. eseguire il gate canonico di validazione del repository e
   `git diff --check`;
6. integrare la modifica di preparazione revisionata prima di creare metadata
   immutabili di release.

Non modificare manualmente l'output generato del package come fonte di una
release.

## Creare metadata immutabili di release

Dopo il merge della modifica di preparazione della release e dopo aver
verificato il commit di release previsto:

1. creare il tag Git annotato `v<major>.<minor>.<patch>` su quel commit
   esatto;
2. pubblicare quel tag senza spostarlo o riscriverlo;
3. creare la GitHub Release corrispondente dallo stesso tag;
4. usare la sezione curata del changelog come base per le note della GitHub
   Release.

La versione del package, il tag Git e la versione della GitHub Release devono
coincidere.

I tag di release pubblicati non devono essere spostati forzatamente o
riutilizzati per contenuti diversi. Se una versione rilasciata e' errata,
correggerla con una release SemVer successiva.

## Uso da parte dei consumer

I consumer devono usare riferimenti immutabili.

Durante l'incubazione privata, i riferimenti supportati sono:

- uno SHA Git esatto e revisionato;
- un tag di release esatto quando esistono release.

Non dipendere da `main` o da un altro branch mobile come riferimento di release.

I consumer devono continuare a importare solo gli export dichiarati del package
e non percorsi `src/` del repository.

Vedi
[Consumo tramite dipendenza Git](git-dependency-consumption.md)
per il contratto di installazione durante l'incubazione.

## La pubblicazione su registry resta bloccata

GitHub Releases e tag Git non sono pubblicazione npm.

Una release non deve aggiungere o aggirare:

- configurazione di pubblicazione su registry npm;
- credenziali di registry o token di pubblicazione;
- permessi OIDC per la pubblicazione;
- dist-tags;
- scope od organizzazioni npm orientati alla pubblicazione;
- workflow che pubblicano il package su un registry.

`private: true`, `prepublishOnly` e il gate di verifica della pubblicazione
restano in vigore finche' una decisione architetturale separata non modifica
esplicitamente il modello di incubazione.

## Automazione futura

L'automazione delle release puo' essere introdotta separatamente dopo aver
stabilito la policy e il contratto manuale.

L'automazione dovrebbe rendere il processo di release riproducibile e ridurre
gli errori meccanici, ma deve preservare:

- selezione SemVer esplicita;
- changelog curato;
- gate canonico di validazione;
- identita' immutabile di tag e release;
- divieto di pubblicazione su registry.

L'automazione non deve trasformare ogni merge in una release.
