---
title: "Tally"
weight: 4
discipline: "Full-stack / Auth"
summary: "An invoicing tool with clients, PDFs and email behind a real login — where the rule that you only see your own invoices lives in the database, not in the interface."
platform: "Lovable"
stack: "Lovable, Supabase (Postgres, Auth, Row Level Security)"
demo: "https://tally-demo.lovable.app/"
repo: ""
hero_image: "images/tally-hero.png"
---

## What it is

Tally is a simple invoicing tool for freelancers, though the prototype is really about everything that has to work underneath a product like that. There is a landing page, a sign-up that writes people into a database, real accounts and logins, and a dashboard where each person only ever sees their own invoices.

The invoicing goes the whole way through. You keep a list of clients so you are not retyping details for every job, invoice numbers run in sequence, and each invoice takes as many line items as the work needs, with tax and discounts applied on top. A finished invoice downloads as a PDF straight from the browser, or goes to the client as a branded email.

> One honest note: the money side is not live. Getting paid is built as a Stripe layer that is deliberately stubbed, so the flow exists but nothing is wired to real payments.

## Why I built it this way

A landing page on its own only shows that I can style a page. I wanted the harder half in the same project: accounts, logins, and the rules about who is allowed to see what.

## The part that took the actual thinking

Everything in the claim "the login is handled properly" comes down to one question. When you are logged in, are you genuinely prevented from reading another user's data by the database, or is the application simply not showing it to you?

My first version was the second thing. It filtered invoices in the browser, while the underlying table would still return every row to any signed-in user. Nothing looked wrong. Every account saw only its own invoices on screen, and the data was there for the asking to anyone who knew how to ask.

So I moved the enforcement down into the database, as row-level security policies that tie every row to its owner and refuse the request outright rather than returning rows the interface then hides. Roles like admin access went into a place the user cannot edit, rather than being a field on their own profile. Then I checked it the way someone trying to get in would: two accounts open side by side, querying directly for the other account's records, and confirming that what came back was empty rather than hidden.
