// ═══════════════════════════════════════════════
// Minuetto 🎀 — logica di gioco
// ═══════════════════════════════════════════════

const STUDY_SECONDS = 15 * 60;
const EXPLAIN_SECONDS = 60;
const RING_CIRCUMFERENCE = 2 * Math.PI * 118;
const STORAGE_KEY = "minuetto_used_topics";

const $ = (id) => document.getElementById(id);

const screens = {
  home: $("screen-home"),
  topic: $("screen-topic"),
  timer: $("screen-timer"),
  done: $("screen-done"),
};

let activeFilters = new Set(Object.keys(CATEGORIES));
let currentTopic = null;
let currentTopicIndex = null;

let timerInterval = null;
let secondsLeft = 0;
let phaseTotal = 0;
let phase = "study"; // "study" | "explain"
let paused = false;

// ───────────────────────── Navigazione schermate ─────────────────────────

function showScreen(name) {
  Object.values(screens).forEach((s) => s.classList.remove("active"));
  screens[name].classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ───────────────────────── Argomenti già pescati ─────────────────────────

function getUsed() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function markUsed(index) {
  const used = getUsed();
  if (!used.includes(index)) {
    used.push(index);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(used));
  }
  refreshUsedInfo();
}

function resetUsed() {
  localStorage.removeItem(STORAGE_KEY);
  refreshUsedInfo();
  refreshDeckInfo();
}

function refreshUsedInfo() {
  const n = getUsed().length;
  $("used-info").textContent =
    n === 0
      ? "Nessun argomento pescato finora: il mazzo è pieno! ✨"
      : `Hai già pescato ${n} argoment${n === 1 ? "o" : "i"} su ${TOPICS.length}.`;
}

// ───────────────────────── Filtri per categoria ─────────────────────────

function buildChips() {
  const wrap = $("category-chips");
  wrap.innerHTML = "";
  for (const [key, cat] of Object.entries(CATEGORIES)) {
    const count = TOPICS.filter((t) => t.c === key).length;
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip on";
    chip.style.setProperty("--chip-color", cat.color);
    chip.innerHTML = `${cat.emoji} ${cat.label} <span class="count">${count}</span>`;
    chip.addEventListener("click", () => {
      if (activeFilters.has(key)) {
        // impedisci di rimanere senza categorie
        if (activeFilters.size === 1) {
          chip.animate(
            [{ transform: "translateX(0)" }, { transform: "translateX(-5px)" }, { transform: "translateX(5px)" }, { transform: "translateX(0)" }],
            { duration: 240 }
          );
          return;
        }
        activeFilters.delete(key);
        chip.classList.remove("on");
      } else {
        activeFilters.add(key);
        chip.classList.add("on");
      }
      refreshDeckInfo();
    });
    wrap.appendChild(chip);
  }
  refreshDeckInfo();
}

function availableIndexes() {
  const used = new Set(getUsed());
  const inFilter = [];
  const unusedInFilter = [];
  TOPICS.forEach((t, i) => {
    if (!activeFilters.has(t.c)) return;
    inFilter.push(i);
    if (!used.has(i)) unusedInFilter.push(i);
  });
  // se il mazzo filtrato è esaurito, si ricomincia da capo dentro il filtro
  return unusedInFilter.length > 0 ? unusedInFilter : inFilter;
}

function refreshDeckInfo() {
  const total = TOPICS.filter((t) => activeFilters.has(t.c)).length;
  const fresh = availableIndexes().length;
  $("deck-info").textContent = `Nel mazzo: ${total} argomenti (${Math.min(fresh, total)} ancora da pescare).`;
}

// ───────────────────────── Pesca ─────────────────────────

function drawTopic() {
  const pool = availableIndexes();
  if (pool.length === 0) return; // non dovrebbe succedere: c'è sempre almeno una categoria
  currentTopicIndex = pool[Math.floor(Math.random() * pool.length)];
  currentTopic = TOPICS[currentTopicIndex];

  const cat = CATEGORIES[currentTopic.c];
  const badge = $("topic-badge");
  badge.textContent = `${cat.emoji} ${cat.label}`;
  badge.style.setProperty("--badge-color", cat.color);
  $("topic-title").textContent = currentTopic.t;
  $("scholar-link").href =
    "https://scholar.google.com/scholar?q=" + encodeURIComponent(currentTopic.t);

  // ri-innesca l'animazione della card
  const card = $("topic-card");
  card.style.animation = "none";
  void card.offsetWidth;
  card.style.animation = "";

  playChime([523.25, 659.25, 783.99], 0.12);
  showScreen("topic");
}

// ───────────────────────── Timer ─────────────────────────

function startPhase(newPhase) {
  clearInterval(timerInterval);
  phase = newPhase;
  paused = false;
  phaseTotal = phase === "study" ? STUDY_SECONDS : EXPLAIN_SECONDS;
  secondsLeft = phaseTotal;

  const card = $("timer-card");
  card.classList.toggle("explain-mode", phase === "explain");
  card.classList.remove("urgent");

  $("phase-label").textContent = phase === "study" ? "📚 Fase di studio" : "🎤 Spiegalo in un minuto!";
  $("phase-hint").textContent =
    phase === "study"
      ? "Niente AI, niente scorciatoie. Scholar, libri e appunti. 💪"
      : "Chiaro, denso, con parole tue. Chi ti ascolta deve imparare qualcosa!";
  $("timer-topic").textContent = currentTopic ? currentTopic.t : "";
  $("btn-pause").textContent = "⏸️ Pausa";
  $("btn-skip").style.display = phase === "study" ? "" : "none";

  renderTimer();
  showScreen("timer");
  timerInterval = setInterval(tick, 1000);
}

function tick() {
  if (paused) return;
  secondsLeft--;
  renderTimer();

  if (secondsLeft === 60 && phase === "study") playChime([880], 0.1);
  if (secondsLeft <= 10 && secondsLeft > 0) {
    $("timer-card").classList.add("urgent");
    playChime([660], 0.05);
  }

  if (secondsLeft <= 0) {
    clearInterval(timerInterval);
    if (phase === "study") {
      playChime([523.25, 659.25, 783.99, 1046.5], 0.18);
      startPhase("explain");
    } else {
      finishGame();
    }
  }
}

function renderTimer() {
  const m = Math.floor(Math.max(secondsLeft, 0) / 60);
  const s = Math.max(secondsLeft, 0) % 60;
  $("timer-display").textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  const progress = secondsLeft / phaseTotal;
  $("ring-fg").style.strokeDashoffset = String(RING_CIRCUMFERENCE * (1 - progress));
}

function togglePause() {
  paused = !paused;
  $("btn-pause").textContent = paused ? "▶️ Riprendi" : "⏸️ Pausa";
}

function finishGame() {
  clearInterval(timerInterval);
  if (currentTopicIndex !== null) markUsed(currentTopicIndex);
  $("done-topic").textContent = currentTopic ? `«${currentTopic.t}»` : "";
  playChime([523.25, 659.25, 783.99, 1046.5, 1318.5], 0.22);
  launchConfetti();
  refreshDeckInfo();
  showScreen("done");
}

function abandonGame() {
  clearInterval(timerInterval);
  showScreen("home");
}

// ───────────────────────── Suoni (WebAudio, senza file) ─────────────────────────

let audioCtx = null;

function playChime(freqs, noteLength) {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const now = audioCtx.currentTime;
    freqs.forEach((f, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.value = f;
      const start = now + i * noteLength;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.18, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + noteLength * 2.2);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(start);
      osc.stop(start + noteLength * 2.5);
    });
  } catch {
    /* audio non disponibile: pazienza, il gioco funziona lo stesso */
  }
}

// ───────────────────────── Decorazioni ─────────────────────────

function buildFloatingNotes() {
  const wrap = document.querySelector(".floating-notes");
  const glyphs = ["🎵", "🎶", "🎼", "♪", "♫", "𝄞"];
  for (let i = 0; i < 14; i++) {
    const s = document.createElement("span");
    s.textContent = glyphs[i % glyphs.length];
    s.style.left = `${(i * 7.3 + Math.random() * 5) % 100}%`;
    s.style.animationDuration = `${14 + Math.random() * 16}s`;
    s.style.animationDelay = `${Math.random() * 18}s`;
    s.style.fontSize = `${1 + Math.random() * 1.2}rem`;
    wrap.appendChild(s);
  }
}

function launchConfetti() {
  const layer = $("confetti-layer");
  const glyphs = ["🎉", "🎊", "🎵", "🎶", "✨", "💜", "🎀"];
  for (let i = 0; i < 36; i++) {
    const c = document.createElement("span");
    c.className = "confetto";
    c.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
    c.style.left = `${Math.random() * 100}%`;
    c.style.animationDuration = `${2.2 + Math.random() * 2.4}s`;
    c.style.animationDelay = `${Math.random() * 0.8}s`;
    layer.appendChild(c);
    setTimeout(() => c.remove(), 6000);
  }
}

// ───────────────────────── Avvio ─────────────────────────

$("btn-draw").addEventListener("click", drawTopic);
$("btn-redraw").addEventListener("click", drawTopic);
$("btn-back-home").addEventListener("click", () => showScreen("home"));
$("btn-start-study").addEventListener("click", () => startPhase("study"));
$("btn-pause").addEventListener("click", togglePause);
$("btn-skip").addEventListener("click", () => startPhase("explain"));
$("btn-abandon").addEventListener("click", abandonGame);
$("btn-again").addEventListener("click", drawTopic);
$("btn-done-home").addEventListener("click", () => showScreen("home"));
$("btn-reset-used").addEventListener("click", () => {
  resetUsed();
  playChime([659.25], 0.1);
});

buildChips();
buildFloatingNotes();
refreshUsedInfo();
