---
title: "Qalami"
weight: 1
discipline: "AI Product / Education"
summary: "A marking assistant for teachers, in Arabic and English. It reads handwritten schoolwork and drafts a mark — then stops, because nothing counts until a teacher approves it."
platform: "Next.js + Claude API"
stack: "Next.js 16, React 19, Supabase (Postgres, Auth, Row Level Security, Storage), Claude API, TypeScript"
demo: "https://qalamiapp.com"
demo_label: "Visit qalamiapp.com →"
repo: ""
hero_image: "images/qalami-hero.webp"
---

## What it is

Qalami marks handwritten schoolwork. A teacher photographs a class set, and it reads each page against that teacher's own rubric, drafts a mark for every criterion, and writes the feedback to go with it. The teacher then works through the draft—keeping what's right, changing what isn't—and approves the paper. Across a class, that turns an evening of marking into a read-through.

It runs in Arabic and in English, right-to-left interface included. For the schools this is built for, that isn't a translation layer bolted on at the end; it's the product. Every string, every plural form, every date—and Arabic doesn't pluralise the way English does, so a sentence counting three papers and a sentence counting eleven need different words.

It's also the only thing on this page that's a real product rather than a prototype: live, with a schema that has been through twenty-seven migrations and the kind of unglamorous machinery a school actually needs—accounts that survive a teacher leaving, scans that delete themselves on a clock, a record of a pupil's progress across terms.

> One honest note: it doesn't read every word correctly. Handwriting is handwriting, and a rubbed-out answer or two marks on one question will still trip it. That's exactly why the teacher's read-through isn't ceremonial—the design assumes the draft is wrong somewhere and makes finding it cheap.

## Why I built it this way

Marking is the part of teaching that eats evenings, and it's obvious AI can help. What's less obvious is that it's also the part where getting it wrong lands on a child. A mark follows a pupil around. So the interesting question was never "can a model read handwriting"—it can—but "what has to be true before I'd let that number near a real report."

## The part that took the actual thinking

There's a version of this product that marks a class set and shows the teacher a finished result. It's faster, it demos better, and it's the wrong product. Once the software has published a number, the teacher's role quietly becomes *appealing* a decision rather than *making* one—and that's the difference between a tool and something making decisions about a child.

So the rule is that Qalami never publishes a mark. It drafts one, shows you what it read off the page, and waits.

The part I'm actually pleased with is where that rule lives. It isn't a convention in the interface, where a later refactor could lose it—it's in the database. A paper moves through *draft → ready → grading → review → finalized*, and only a teacher performs the last transition. The schema says so in its own comment: **"Nothing is finalized without a teacher."** Each individual criterion carries its own status too—pending, accepted, or adjusted—so the teacher's read-through leaves a trace instead of collapsing into one approve button.

Two smaller decisions came out of the same thinking. The marking says when it's unsure, and points at the specific answers it's unsure about, so a teacher's attention goes where the risk is rather than being spread evenly over a stack of pages. And the 90-day clock that erases pupils' scans is started by a database trigger, never by the app—because anything the app can set, a bug can set, and that would mean deleting a child's work early or keeping it forever.

## What I caught

Four strings on the site said the system records *who* accepted or changed each mark. It doesn't. What's stored is the action—accepted, adjusted—never the person; there's no such column anywhere in twenty-seven migrations. On a workspace with one teacher the two readings look identical, which is exactly why it survived so long. On a shared staffroom it was simply untrue.

I only found it because I went looking for evidence to back the claim, and couldn't find any.

Two of those four weren't marketing copy. One was in the terms a school agrees to. One was the AI disclosure—the single place obliged to describe the mechanism that actually exists. They now say "whether each mark was approved or changed," in both languages, because that's the claim the code can support.

## The takeaway

The strongest thing I can say about Qalami is that a teacher is genuinely in the loop, not decoratively in it. That claim is only worth anything if every part of it holds up—which meant putting the rule somewhere it can't be refactored away, and taking a sentence off my own landing page the moment I couldn't prove it.
