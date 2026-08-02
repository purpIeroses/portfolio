import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  ONLINE,
  MAX_PLAUSIBLE_SCORE,
  TOP_N,
} from "./config.js";

const LOCAL_KEY = "asteroids_scores_v1";
const TABLE = "leaderboard";

// ── validation shared by both paths ───────────────────────────
function clean(name, score) {
  const nm = String(name || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 3);
  const sc = Math.floor(Number(score));
  if (nm.length < 1) throw new Error("Enter your initials.");
  if (!Number.isFinite(sc) || sc < 0) throw new Error("Bad score.");
  if (sc > MAX_PLAUSIBLE_SCORE) throw new Error("Score rejected.");
  return { name: nm, score: sc };
}

// ── offline path (localStorage) ───────────────────────────────
function localGet() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY)) || [];
  } catch {
    return [];
  }
}
function localAll() {
  return localGet()
    .sort((a, b) => b.score - a.score)
    .slice(0, TOP_N);
}
function localSubmit(name, score) {
  const rows = localGet();
  rows.push({ name, score, created_at: new Date().toISOString() });
  localStorage.setItem(LOCAL_KEY, JSON.stringify(rows));
  return localAll();
}

// ── online path (Supabase REST) ───────────────────────────────
const headers = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  "Content-Type": "application/json",
};

async function remoteTop() {
  const url =
    `${SUPABASE_URL}/rest/v1/${TABLE}` +
    `?select=name,score,created_at&order=score.desc&limit=${TOP_N}`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`Leaderboard fetch failed (${res.status})`);
  return res.json();
}

async function remoteSubmit(name, score) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}`, {
    method: "POST",
    headers: { ...headers, Prefer: "return=minimal" },
    body: JSON.stringify({ name, score }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Submit rejected (${res.status}) ${detail}`);
  }
  return remoteTop();
}

// ── public API ────────────────────────────────────────────────
export async function fetchTop() {
  return ONLINE ? remoteTop() : localAll();
}

export async function submitScore(rawName, rawScore) {
  const { name, score } = clean(rawName, rawScore);
  const rows = ONLINE
    ? await remoteSubmit(name, score)
    : localSubmit(name, score);
  return { rows, name, score };
}

export { ONLINE };
