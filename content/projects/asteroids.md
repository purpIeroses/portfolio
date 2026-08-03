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

A from-scratch rebuild of the 1979 arcade game—vector ship and rocks, thrust with real inertia, screen wraparound, asteroids that break into smaller pieces, hyperspace, and the little touches that make it feel alive: screen shake, particle bursts, and sound built in code rather than from audio files. There's a global high-score leaderboard sitting behind it, saving to a real database.

## Why I started here

Honestly, because it's the kind of thing I'm most comfortable with. A lot of people building with AI tools can't make a game that actually feels right—the physics, the timing, whether a collision lands when it should. That's the part I know well, so it felt like a natural place to begin, and it gave me a real backend to secure on top of the game itself.

## The part that took the actual thinking

The leaderboard is where the interesting problem lives. The quick way to build it lets the browser send whatever score it wants, which means someone could type a fake number straight into the high-score table within a day of it going up.

So I moved the trust out of the browser and into the database. The game checks scores first, but the real gatekeeping happens at the database level—it simply refuses anything malformed, negative, or impossibly high, and it won't let anyone edit or delete existing scores at all. Even if someone tampered with the page, they still couldn't get a bad score in. The only thing the table accepts is a legitimate new entry.

## What I'd add next

Flying-saucer enemies that shoot back, a demo mode that plays itself on the title screen, and one more layer on the leaderboard so a script can't quietly flood it with believable-looking fake scores.

## The takeaway

The game is the fun part, but the leaderboard is the point. It's a small example of something I care about generally: not just making a thing run, but thinking about how people might break it, and closing that gap before it goes live.
