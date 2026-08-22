[English](../releases.md) | [Italiano](releases.md)

# Release

Giada UI segue la
[policy architetturale di release e versioning](../architecture/release-versioning-policy.md).

Questo documento descrive il contratto operativo di release. Non abilita la
pubblicazione su registry npm.

## Stato corrente

Il package resta in incubazione privata.

La prima release reale, `v0.1.0`, e' stata creata dalla versione package
`0.1.0` il 2026-08-15.

GitHub Immutable Releases e' abilitato per questo repository. In questo
repository, una release immutabile significa entrambe le cose:

- invarianti di identita' della release applicati dal workflow, che legano la
  versione del package, il tag Git annotato, il target del tag remoto e il tag
  della GitHub Release allo stesso commit verificato; e
- per le release qualificanti create dopo l'abilitazione di GitHub Immutable
  Releases, l'API GitHub riporta la release risultante come `immutable: true`.

`v0.1.0` e' storica. E' stata pubblicata prima che l'immutabilita' di
piattaforma delle release fosse abilitata per questo repository, quindi la
GitHub Release resta `immutable: false`. Non modificare, eliminare o ricreare
`v0.1.0` per cambiare quello stato storico di piattaforma.

Le future release qualificanti sono attese con immutabilita' di piattaforma
GitHub.

I consumer downstream possono usare:

- uno SHA Git esatto e revisionato; oppure
- un tag di release esatto la cui identita' e' fissata da questo contratto di
  release.

`private: true` e i guard contro la pubblicazione su registry restano invariati.

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
   di release.

Non modificare manualmente l'output generato del package come fonte di una
release.

Il workflow di release non esegue nessuna di queste modifiche di preparazione.

## Creare metadata di release

Il percorso normale per i metadata e' il workflow GitHub Actions `Release`,
avviato manualmente.

Dopo il merge della pull request di preparazione della release:

1. verificare che `main` punti al commit di release previsto;
2. aprire **Actions → Release → Run workflow**;
3. selezionare `main`;
4. inserire la versione SemVer preparata senza il prefisso `v`;
5. avviare il workflow.

Il workflow fallisce in modo chiuso a meno che:

- venga eseguito dal commit corrente di `main`;
- `package.json` usi la versione richiesta;
- entrambi i campi versione del package-lock usino la versione richiesta;
- il verifier locale del manifest attenda deliberatamente quella versione;
- `CHANGELOG.md` contenga una sezione datata e non vuota per quella versione;
- `private: true` e il guard esplicito `prepublishOnly` restino integri;
- non sia presente `publishConfig`;
- il tag Git e la GitHub Release richiesti non esistano gia'.

Prima di modificare metadata di release, il workflow installa le dipendenze dal
lockfile, installa Chromium ed esegue il gate canonico `npm run validate`.

Quindi:

1. estrae le note di release dalla sezione del changelog curata manualmente;
2. crea il tag Git annotato `v<major>.<minor>.<patch>` sul commit esatto del
   workflow;
3. pubblica quel tag annotato;
4. verifica il target del tag remoto;
5. crea la GitHub Release corrispondente dallo stesso tag e dalle stesse note;
6. verifica che la GitHub Release usi il tag previsto;
7. verifica tramite l'API GitHub che la nuova GitHub Release sia riportata come
   `immutable: true`.

La versione del package, il tag Git e la versione della GitHub Release devono
coincidere.

I tag di release pubblicati non devono essere spostati forzatamente o
riutilizzati per contenuti diversi. Se una versione rilasciata e' errata,
correggerla con una release SemVer successiva.

Se l'automazione fallisce dopo che il tag annotato e' gia' stato pubblicato,
non eliminare, spostare o ricreare il tag soltanto per ritentare il workflow.
Esaminare lo stato parziale della release e completarlo o correggerlo
deliberatamente.

## Fallback manuale

Se GitHub Actions non e' disponibile, i maintainer possono eseguire manualmente
lo stesso contratto.

Il fallback deve comunque:

1. usare il commit di release esatto e verificato di `main`;
2. eseguire `npm run validate`;
3. eseguire il verifier di release-readiness per la versione richiesta;
4. creare un tag annotato `v<version>` su quel commit esatto;
5. pubblicare il tag senza riscriverlo;
6. creare la GitHub Release dallo stesso tag usando la sezione curata del
   changelog;
7. verificare l'identita' risultante di tag e release;
8. per le future release qualificanti, verificare tramite l'API GitHub che la
   GitHub Release sia riportata come `immutable: true`.

Automazione e fallback manuale implementano lo stesso contratto di release.

## Uso da parte dei consumer

I consumer devono usare riferimenti di release fissi.

Durante l'incubazione privata, i riferimenti supportati sono:

- uno SHA Git esatto e revisionato;
- un tag di release esatto.

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

Il workflow di release usa permessi GitHub limitati al repository soltanto per
creare il tag Git e la GitHub Release e per verificare i metadata di release
risultanti. Non pubblica il package su un registry npm.

## Confine dell'automazione

L'automazione delle release riduce gli errori meccanici; non sceglie la
semantica della release.

Preserva:

- selezione SemVer esplicita;
- changelog curato manualmente;
- preparazione revisionata della release tramite pull request;
- gate canonico di validazione;
- invarianti di identita' della release;
- immutabilita' di piattaforma GitHub per le future release qualificanti;
- divieto di pubblicazione su registry.

Il workflow e' esclusivamente manuale e non trasforma merge o push in release.
