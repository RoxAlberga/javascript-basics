# Minuetto 🎀

**Studia 15 minuti, spiega in 1.** Un gioco-sfida per chi ama la musica sul serio.

## Come funziona

1. 🎚️ **Scegli il livello**: Facile 🌱 (divulgativo), Intermedio 🌿 (serve
   studiare sul serio) o Esperto 🌳 (argomenti accademici da Google Scholar).
2. 🎲 **Pesca un argomento** tra i 600 disponibili — 200 per livello, divisi in
   8 categorie (teoria e analisi, storia della musica, armonia e composizione,
   generi e popular music, etnomusicologia, acustica e psicoacustica,
   organologia, musicologia).
3. ⏳ **Studia per 15 minuti** — solo fonti vere, adeguate al livello.
   Niente intelligenza artificiale, niente copia-incolla da Wikipedia.
4. 🎤 **Spiega l'argomento in 1 minuto** a chi gioca con te (o alla webcam).

Si può giocare da soli o in gruppo, a turni, votando la spiegazione più chiara.

## Avvio

È un sito statico senza dipendenze: basta aprire `index.html` nel browser,
oppure servire la cartella con un qualunque server statico (o GitHub Pages).

## File

- `index.html` — struttura della pagina (home, argomento, timer, fine round)
- `style.css` — stile pastello, animazioni, timer ad anello
- `topics.js` — database dei 600 argomenti (3 livelli × 8 categorie × 25)
- `script.js` — logica di gioco: scelta del livello, pesca casuale senza
  ripetizioni (localStorage separato per livello), filtri per categoria,
  timer di studio e di spiegazione, suoni WebAudio, coriandoli
