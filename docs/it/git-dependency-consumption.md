[English](../git-dependency-consumption.md) | [Italiano](git-dependency-consumption.md)

# Consumo come dipendenza Git

GIADA UI non viene intenzionalmente pubblicato in un registro di pacchetti durante la fase di incubazione privata, ma le applicazioni GiadaWare downstream hanno comunque bisogno di un modo riproducibile per consumare il pacchetto Svelte reale senza copiare i componenti.

## Percorso di incubazione supportato

I progetti downstream possono fissare questo repository come dipendenza Git a un commit SHA esatto.

Perche' questo flusso funzioni, npm deve poter materializzare la directory `dist/` del pacchetto dopo aver clonato la dipendenza. Il repository tratta quindi il lifecycle `prepare` come passaggio di build del pacchetto ed esegue la stessa pipeline `svelte-package` usata da `npm run package`.

Questo **non** abilita la pubblicazione su registry. `prepublishOnly` continua a rifiutare la pubblicazione e `private: true` resta invariato.

## Regola downstream

Fissa un commit esatto gia' revisionato invece di un branch mobile. Questo mantiene riproducibili le dipendenze UI mentre GIADA UI rimane non pubblicato.

I consumatori devono usare gli export dichiarati del pacchetto (`giadaware-ui-components`, `/visitor`, `/studio` e gli export degli stili) invece di importare file da `src/`.
