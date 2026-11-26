# Quiz Frigo Pronto

Quiz React Frigo Pronto. Il percorso comprende sette domande, una schermata di caricamento e il video finale. I testi dell'interfaccia sono in italiano. Immagini e font sono ospitati nel progetto.

## Aprire il file direttamente

Apri `index.html` nella cartella principale del progetto. Include React e CSS e funziona anche con `file://`. Dopo ogni modifica al codice, esegui `pnpm.cmd build` per aggiornarlo.

## Sviluppo

```powershell
pnpm.cmd install
pnpm.cmd dev
```

Apri `http://localhost:5173/src/dev.html`. Per generare la versione aggiornata di `index.html`, esegui `pnpm.cmd build`.

## Verifica

```powershell
node qa/verify.mjs
node qa/verify-video.mjs
```

`verify.mjs` percorre tutte le sette domande e verifica il ritardo di 30 secondi prima della comparsa del pulsante finale. `verify-video.mjs` controlla che il player caricato durante la schermata di progresso continui a riprodurre il video quando appare il risultato. Gli script usano Chrome installato in `C:/Program Files/Google/Chrome/Application/chrome.exe`.

La schermata di progresso dura almeno 3,2 secondi e attende il caricamento iniziale del player, per un massimo di 9 secondi. Il video parte automaticamente senza audio; l'utente può attivare l'audio nel player.
