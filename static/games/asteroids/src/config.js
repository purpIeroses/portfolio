// ─────────────────────────────────────────────────────────────
// CONFIG — fill these in with your Supabase project values.
// Get them from: Supabase dashboard → Project Settings → API
//
// Leave them blank to run in OFFLINE mode: the game works fully,
// and the leaderboard falls back to localStorage so you can dev
// without a backend. Flip to online just by pasting the two values.
// ─────────────────────────────────────────────────────────────

export const SUPABASE_URL = ""; // e.g. "https://abcdxyz.supabase.co"
export const SUPABASE_ANON_KEY = ""; // the public anon key (safe for client)

export const ONLINE = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

// Anti-cheat plausibility ceiling. The DB enforces this too (see schema),
// but we reject obviously-bad scores client-side before they travel.
export const MAX_PLAUSIBLE_SCORE = 1_000_000;
export const TOP_N = 10;
