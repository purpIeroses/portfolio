import { Game } from "./game.js";
import { fetchTop, submitScore, ONLINE } from "./leaderboard.js";

// ── DOM refs ─────────────────────────────────────────────────
const canvas = document.getElementById("game");
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const boardEl = document.getElementById("leaderboard");

const startOverlay = document.getElementById("overlay-start");
const overOverlay = document.getElementById("overlay-over");
const finalScoreEl = document.getElementById("final-score");
const initialsEl = document.getElementById("initials");
const entryEl = document.getElementById("entry");
const entryStatus = document.getElementById("entry-status");

document.getElementById("btn-start").onclick = begin;
document.getElementById("btn-again").onclick = begin;
document.getElementById("btn-submit").onclick = onSubmit;

// ── tiny WebAudio SFX (no asset files needed) ────────────────
let audio;
function beep(freq, dur = 0.08, type = "square", gain = 0.04) {
  try {
    audio ||= new (window.AudioContext || window.webkitAudioContext)();
    const o = audio.createOscillator();
    const g = audio.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.value = gain;
    o.connect(g).connect(audio.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + dur);
    o.stop(audio.currentTime + dur);
  } catch {}
}

// ── game instance ────────────────────────────────────────────
const game = new Game(canvas, {
  onScore: (s) => (scoreEl.textContent = s),
  onLives: renderLives,
  onFire: () => beep(880, 0.05, "square", 0.03),
  onBoom: (tier) => beep(110 + tier * 30, 0.12, "sawtooth", 0.05),
  onGameOver: showGameOver,
});

function renderLives(n) {
  livesEl.innerHTML = "";
  for (let i = 0; i < n; i++) {
    const d = document.createElement("div");
    d.className = "life";
    livesEl.appendChild(d);
  }
}

// ── flow ─────────────────────────────────────────────────────
function begin() {
  startOverlay.classList.add("hidden");
  overOverlay.classList.add("hidden");
  entryEl.classList.remove("hidden");
  entryStatus.classList.add("hidden");
  initialsEl.value = "";
  game.start();
  canvas.focus();
}

function showGameOver(finalScore) {
  finalScoreEl.textContent = finalScore;
  overOverlay.classList.remove("hidden");
  initialsEl.focus();
}

async function onSubmit() {
  try {
    const { rows, name, score } = await submitScore(
      initialsEl.value,
      game.score
    );
    entryEl.classList.add("hidden");
    entryStatus.textContent = ONLINE ? "Score saved." : "Saved locally.";
    entryStatus.classList.remove("hidden", "err");
    renderBoard(rows, { name, score });
  } catch (err) {
    entryStatus.textContent = err.message || "Could not submit.";
    entryStatus.classList.remove("hidden");
    entryStatus.classList.add("err");
  }
}

// ── leaderboard render ───────────────────────────────────────
function renderBoard(rows, mine = null) {
  boardEl.innerHTML = "";
  if (!rows.length) {
    boardEl.innerHTML = '<li class="loading">no scores yet</li>';
    return;
  }
  let mineMarked = false;
  for (const r of rows) {
    const li = document.createElement("li");
    const isMine =
      mine && !mineMarked && r.name === mine.name && r.score === mine.score;
    if (isMine) {
      li.classList.add("me");
      mineMarked = true;
    }
    li.innerHTML = `<span class="nm">${r.name}</span><span class="sc">${r.score}</span>`;
    boardEl.appendChild(li);
  }
}

async function loadBoard() {
  try {
    renderBoard(await fetchTop());
  } catch {
    boardEl.innerHTML = '<li class="loading">leaderboard offline</li>';
  }
}

// ── input ────────────────────────────────────────────────────
const GAME_KEYS = new Set([
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "Space",
  "ShiftLeft",
  "ShiftRight",
]);

window.addEventListener("keydown", (e) => {
  const k = e.code === "ShiftLeft" || e.code === "ShiftRight" ? "Shift" : e.code;
  if (GAME_KEYS.has(e.code)) e.preventDefault();
  game.press(k);
});
window.addEventListener("keyup", (e) => {
  const k = e.code === "ShiftLeft" || e.code === "ShiftRight" ? "Shift" : e.code;
  game.release(k);
});

// initials input: uppercase, letters/numbers only
initialsEl?.addEventListener("input", () => {
  initialsEl.value = initialsEl.value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 3);
});
initialsEl?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") onSubmit();
  e.stopPropagation(); // don't drive the ship while typing
});

loadBoard();
