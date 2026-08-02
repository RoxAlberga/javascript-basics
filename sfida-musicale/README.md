# Minuetto 🎀

**Studia 15 minuti, spiega in 1.** Un gioco-sfida per chi ama la musica sul serio.

## Come funziona

1. 🎲 **Pesca un argomento** tra 200 argomenti musicali accademicamente complessi
   (teoria e analisi, storia della musica, armonia e composizione, generi e popular
   music, etnomusicologia, acustica e psicoacustica, organologia, musicologia).
2. ⏳ **Studia per 15 minuti** — solo fonti vere (Google Scholar, JSTOR, libri).
   Niente intelligenza artificiale, niente copia-incolla da Wikipedia.
3. 🎤 **Spiega l'argomento in 1 minuto** a chi gioca con te (o alla webcam).

Si può giocare da soli o in gruppo, a turni, votando la spiegazione più chiara.

## Avvio

È un sito statico senza dipendenze: basta aprire `index.html` nel browser,
oppure servire la cartella con un qualunque server statico (o GitHub Pages).

## File

- `index.html` — struttura della pagina (home, argomento, timer, fine round)
- `style.css` — stile pastello, animazioni, timer ad anello
- `topics.js` — database dei 200 argomenti (8 categorie × 25)
- `script.js` — logica di gioco: pesca casuale senza ripetizioni (localStorage),
  filtri per categoria, timer di studio e di spiegazione, suoni WebAudio, coriandoli
