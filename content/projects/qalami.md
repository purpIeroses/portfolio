---
title: "Qalami"
weight: 1
discipline: "AI Product / Education"
summary: "A marking assistant for teachers, in Arabic and English. It reads handwritten schoolwork and drafts a mark, and then it stops, because the database will not let a mark be finalised by anything other than a teacher."
platform: "Next.js + Claude API, built with Claude Code"
stack: "Next.js 16, React 19, Supabase (Postgres, Auth, Row Level Security, Storage), Claude API, TypeScript, Railway, Resend"
demo: "https://qalamiapp.com"
demo_label: "Visit qalamiapp.com →"
repo: ""
hero_image: "images/qalami-hero.webp"
---

## What it is

Qalami marks handwritten schoolwork. A teacher photographs a class set, and it reads each page against that teacher's own rubric, drafts a mark for every criterion, and writes the feedback to go with it. The teacher then works through the draft, keeping what is right and changing what is not, and approves the paper. Across a class that turns an evening of marking into a read-through.

It runs in Arabic and in English, with a proper right-to-left interface rather than a mirrored one. For the schools this is built for that is not a translation layer added at the end, it is the product. Every string, every date format and every plural form is written twice, and Arabic does not pluralise the way English does, so a sentence counting three papers and a sentence counting eleven need genuinely different words. There are a little over two thousand of those strings now, each held in English and Arabic side by side, and a test fails the build if a screen shows a teacher English that has no Arabic beside it.

It is also the only thing on this page that is a live product rather than a prototype. The schema has been through fifty migrations, and a lot of that is the unglamorous machinery a school actually needs: accounts that keep working when a teacher leaves, uploaded scans that delete themselves on a clock, and a record of one pupil's progress that holds together across terms.

The most recent rounds were about the rest of a teacher's week rather than the marking itself. There are cover sheets with a QR code for each pupil, so a class set can be photographed from a phone and the pages land against the right names, and a comment bank a teacher can share with their school. The school's admin can take a sample of colleagues' approved papers to moderate, and a teacher can ask a colleague to second-mark a few blind. The colleague sees neither the pupil's name nor the first marks until their own are in, because I wanted the second opinion to be a second opinion and not a reply to the first one.

> One honest note: it does not read every word correctly. Handwriting is handwriting, and a rubbed-out answer, or two answers written against one question, will still confuse it. That is why the teacher's read-through is not ceremonial. The design assumes the draft is wrong in a few places and tries to make those places cheap to find. Arabic handwriting in particular I have now measured on real pupils' pages rather than assumed, and reading the script turned out not to be the problem, although the testing found three defects elsewhere that are now fixed. Messy Arabic handwriting is still unmeasured.

## Why I built it this way

Marking is the part of teaching that eats evenings, so it is an obvious thing to try to help with. It is also the part where being wrong lands on a child, because a mark follows a pupil around afterwards. The question I kept coming back to was not whether a model can read handwriting, because it mostly can, but what would have to be true before I would be comfortable with a number it produced going anywhere near a real report.

## The part that took the actual thinking

There is a version of Qalami that marks a class set and shows the teacher a finished result. It is faster to use and it looks better in a demo, and I decided against it, because once the software has published a number the teacher is no longer making the decision, they are disagreeing with one that has already been made. I did not want a teacher to be in that position over a pupil they know and the software does not.

So Qalami never publishes a mark. It drafts one, shows what it read off the page, and waits.

The part I am most pleased with is where that rule is kept. It is not a convention in the interface, where a later refactor could quietly drop it — it is in the database. A paper moves through draft, ready, grading, review and finalized, and only a teacher can perform that last transition. The schema says so in its own comment: **"Nothing is finalized without a teacher."** Each individual criterion carries its own status as well, pending, accepted or adjusted, so a teacher's read-through leaves a record of what they actually looked at instead of collapsing into a single approve button.

Two smaller decisions came out of the same thinking. The marking says when it is unsure and points at the specific answers it is unsure about, so a teacher's attention goes where the risk is rather than being spread evenly across a stack of pages. And the ninety-day clock that erases pupils' scans is started by a database trigger rather than by the application, because anything the application can set, a bug in the application can also set, and that would mean either deleting a child's work early or keeping it indefinitely.

## What I caught

Four strings on the site said the system records *who* accepted or changed each mark. It does not. What is stored is the action — accepted, adjusted — and never the person. There was no such column anywhere in the twenty-seven migrations the schema had at the time. In a workspace with one teacher the two readings look identical, which is why it went unnoticed for as long as it did. In a shared staffroom it was simply untrue.

I only found it because I went looking for the evidence behind the claim and could not find any.

Two of the four were not marketing copy. One was in the terms a school agrees to, and one was the AI disclosure, which is the single place obliged to describe the mechanism that actually exists. All four now say "whether each mark was approved or changed," in both languages, because that is the claim the code could support.

Part of that has since been built. When a teacher changes a mark, a log now records the mark before and after, who changed it and when, and the log is written only by the database, so nobody can edit the history through the app. Accepting a mark as the draft had it still records the action and not the person, so the copy still says only what is true.

## What I would add next

- **Who approved a paper.** The change log covers marks that were altered, and I would like the approval itself to carry a name too, so that the record is complete in a shared staffroom.
- **A native read of the Arabic.** The Arabic interface is a careful first draft and has had one close reading, which corrected twelve slips, the worst a retention sentence that said pupils' scans are *wiped* where the English said deleted. A native reviewer has still not been through it, and until one has I would not call it finished.
- **Messy Arabic handwriting.** The pages I measured were reasonably tidy, and untidy writing is what a teacher will often hand it, so that is the next measurement.
