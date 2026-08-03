---
title: "Tally"
weight: 2
discipline: "Full-stack / Auth"
summary: "A polished landing page with a real, secured product behind it — signups, auth, and a gated dashboard where users only ever see their own data."
platform: "Lovable"
stack: "Lovable, Supabase (Postgres, Auth, Row Level Security)"
demo: "https://tally-demo.lovable.app/"
repo: ""
hero_image: "images/tally-hero.png"
---

## What it is

Tally is a simple invoicing tool for freelancers, but the prototype is really about everything that has to work underneath a product like that. There's a landing page to draw people in, a sign-up that captures them into a database, real accounts and logins, and a dashboard where each person only ever sees their own invoices—never anyone else's.

## Why I built it this way

A landing page on its own just shows I can style a page. I wanted to show the harder half: accounts, logins, and the rules about who's allowed to see what. So it's the polished front and the working backend in one piece.

## The part that took the actual thinking

The whole "handled the login properly" claim really comes down to one question: if you're logged in, are you genuinely blocked from seeing another user's data at the database, or is the app just hiding it from view? AI tools quite often build something that looks locked down while the underlying data is actually readable by anyone signed in.

So I didn't take the interface at its word. I set the ownership rules at the database itself, so it enforces that you can only ever read or change your own records, and I put roles (like admin access) somewhere the user can't quietly edit. Then I tested it the way someone trying to break in would: two accounts open side by side, checking directly that one genuinely couldn't pull the other's data. Not just that it was hidden on screen—that the request itself came back empty.

## What I caught

My first version filtered the invoices in the browser while the data underneath was readable by any logged-in user. I moved that enforcement down into the database so it refuses the request outright. That's really the line between a nice demo and something you could actually trust with real people's information.

## The takeaway

Anyone can put a login screen on a page. The value is in making sure the boundary actually holds—and knowing how to check that it does.
