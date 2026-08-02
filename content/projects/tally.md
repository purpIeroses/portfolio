---
title: "Tally"
weight: 2
discipline: "Full-stack / Auth"
summary: "A polished landing page with a real, secured product behind it — signups, auth, and a gated dashboard where users only ever see their own data."
platform: "Lovable"
stack: "Lovable, Supabase (Postgres, Auth, Row Level Security)"
demo: ""
repo: ""
hero_image: ""
---

## What it is

Tally is a simple invoicing tool for solo freelancers — but the prototype is
really about the full arc a client cares about: a marketing page that attracts,
a CTA that captures leads into a database, auth that gates a real product, and a
dashboard where each user manages only their own invoices.

## Why this one

A landing page alone proves you can style a hero. This proves the thing
underneath it works: accounts, sessions, ownership, roles. The public polish and
the secured backend in one build.

## The hard part

The claim "auth done properly" lives or dies on one thing: **does a logged-in
user actually get blocked from another user's data at the database, or is the UI
just hiding it?** AI-assisted builders frequently generate a dashboard that
*looks* gated while the underlying table is world-readable.

So I didn't trust the UI. I enforced ownership with Row Level Security:
`auth.uid() = user_id` on every read and write, roles read from a server-side
profile row rather than client state, and a waitlist table that's insert-only to
the public and readable only by admins. Then I verified it the way an attacker
would — two accounts, the network tab open, confirming the API itself returns
zero of the other user's rows. Not the UI. The API.

## What I caught

The first pass filtered invoices client-side while the table was readable by any
authenticated user. I moved enforcement into RLS so the database refuses the
request outright. That's the difference between a demo and a product.

## The takeaway

Anyone can generate a login screen. The value is proving the boundary actually
holds — and knowing how to test that it does.
