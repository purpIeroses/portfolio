---
title: "Asteroids"
weight: 1
discipline: "Interactive / Game"
summary: "A faithful vector arcade clone with a real global leaderboard — built to prove I can ship interactive work and secure the backend behind it."
platform: "Vanilla JS + Canvas"
stack: "HTML5 Canvas, ES modules, Supabase (Postgres + RLS)"
demo: "/games/asteroids/"
repo: ""   # paste your repo URL
hero_image: ""  # e.g. images/asteroids-hero.png
---

<div class="case-embed">
  <iframe src="/games/asteroids/" title="Asteroids — play in browser" loading="lazy"></iframe>
  <p class="case-embed-cta"><a href="/games/asteroids/" target="_blank" rel="noopener">Open full screen ↗</a></p>
</div>

## What it is

A from-scratch recreation of the 1979 arcade classic: vector-drawn ship and
rocks, thrust with real inertia, screen wraparound, asteroids that split into
three size tiers, hyperspace, and juice — screen shake, particle explosions, and
synthesized sound with no audio files. Attached to it is a global high-score
leaderboard backed by Postgres.

## Why this one

Most people building in AI-assisted tools can't build a game that *feels* right —
the physics, the frame-rate independence, the collision timing. My background is
game programming, so this is where I start: something interactive and tactile
that also has a real backend to secure.

## The hard part

The leaderboard is where the engineering shows. The naive version — the one a
fast build produces — lets the browser submit any score it wants. That's a
leaderboard that's wrong within a day.

I moved the trust boundary to the database. Scores are validated client-side
first, but the real guarantee is at the table: **Row Level Security** plus
`CHECK` constraints mean the database itself refuses malformed initials,
negative scores, and implausible values, and forbids updates and deletes
entirely. A tampered client still can't insert a bad row. The write path is
insert-only by design.

## What I'd add next

Saucer enemies that shoot back, an attract-mode demo on the title screen, and an
Edge Function gating submissions behind a signed run token — so a scripted POST
can't flood the board with plausible-but-fake scores.

## The takeaway

The game is the hook; the leaderboard is the point. It shows I don't just make
things that run — I think about how they get abused, and I close the gap before
it ships.
