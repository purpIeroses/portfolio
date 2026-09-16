---
title: "Asteroids"
weight: 3
discipline: "Interactive / Game"
summary: "A rebuild of the 1979 arcade game with no game engine behind it, and a global high-score table that the database itself won't let anyone fake."
platform: "Vanilla JS + Canvas, built with Claude Code"
stack: "HTML5 Canvas, ES modules, Supabase (Postgres + RLS)"
demo: "/games/asteroids/"
repo: ""   # paste your repo URL
hero_image: ""
card_image: "images/asteroids-hero.png"
---

<div class="case-embed">
  <iframe src="/games/asteroids/" title="Asteroids — play in browser" loading="lazy"></iframe>
  <p class="case-embed-cta"><a href="/games/asteroids/" target="_blank" rel="noopener">Open full screen ↗</a></p>
</div>

## What it is

A rebuild of the 1979 arcade game, built in plain JavaScript against an HTML5 canvas, with no game engine or physics library. The ship is drawn as vectors and thrusts with real inertia, so it keeps drifting after you stop pushing. Everything wraps around the edges of the screen, asteroids break into smaller asteroids when you shoot them, and hyperspace drops you somewhere random. The screen shakes when something explodes, the debris is a particle burst, and there are no audio files anywhere in the project — every sound is generated in code by the browser as it plays. Behind the game there is a global high-score table saving to a real Postgres database.

## Why I started here

Game programming is what I learned first and it is still what I am most comfortable with, so it was the easiest place to start and the fastest way to have something you could actually play in a browser. It also gave me a real backend to secure, which was the part I wanted to spend time on.

## The part that took the actual thinking

A leaderboard is one of those features that is easy to build in a way that falls over immediately. The straightforward version has the browser send a score to the database and the database write it down, which means anybody who opens the developer console can type whatever number they like into the high-score table.

So I moved the decision out of the browser. The game still checks the score, but that check is only there to catch honest mistakes; the enforcement is written as row-level security policies on the table itself. The database will only accept an insert, never an update or a delete, so existing scores cannot be edited or removed by anyone using the site. It rejects anything malformed, anything negative, and anything above a ceiling that is higher than a real session can reach. Someone who tampers with the page is still talking to those same policies, and gets the same refusal.

## What I would add next

Flying-saucer enemies that shoot back, and a demo mode that plays itself on the title screen the way the original cabinet did.

The leaderboard also has a gap I have not closed. Nothing currently stops a script from submitting a long series of plausible scores — each one individually legitimate, arriving faster than a person could play. Rate limiting per address, or signing the submission from the game itself, would fix it, and it is the next thing I would do to this project.
