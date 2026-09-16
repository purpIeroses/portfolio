---
title: "Residence 724"
weight: 2
discipline: "Client Work / Web + Print"
summary: "A one-page site for a furnished studio in Midtown Miami, in English and Spanish, with front-desk business cards whose two QR codes each open the page in their own language."
platform: "Hand-written HTML/CSS/JS"
stack: "HTML, CSS, vanilla JS, Cloudflare Pages, Cloudflare Registrar, GitHub, ffmpeg, Python (Pillow, segno)"
demo: "https://miamistandard724.com"
demo_label: "Visit miamistandard724.com →"
repo: ""
hero_image: "images/724-hero.webp"
---

## What it is

A one-page site for a furnished studio in Midtown Miami, and the business cards that point at it. The owner had been trying to sell the unit into a market that was not buying, and decided to rent it furnished instead, for stays of thirty nights and longer. What he asked for was a stack of cards on the building's front desk with a QR code on them, and something worth looking at on the other end of it.

So the whole thing is built around one moment: somebody standing in a lobby with a card in one hand and a phone in the other, who is not going to give it very long. It is one column, photographs first, with a contact bar that stays on screen the whole way down, and no enquiry form and no booking flow, because the owner answers his own phone and all the page has to do is get somebody to use it. About eight hours of work across three days.

It runs in English and in Spanish, because a good share of the people renting in Midtown at that price are Spanish speakers, and a page that only speaks English has quietly decided which of them it is for.

<figure class="case-figure">
  <img src="/images/724-phones.webp" alt="Three phone screens from the Residence 724 site: the full-screen hero photo with Call and Text buttons, the red hamburger menu open over the page, and the photo gallery with captions under each image" loading="lazy">
  <figcaption>The hero, the menu and the gallery, at phone width. Names and numbers are redacted throughout — the live site shows the owner's.</figcaption>
</figure>

## Why I built it this way

Hand-written HTML, CSS and JavaScript, no framework and no build step, which is less a purist position than a reading of where the page gets opened. Whoever scans that code is standing up, on whatever signal a lift lobby has, and has half decided already to put their phone away. The page and all eighteen photos come to about 1.2 MB, and nothing has to start up before the first one appears.

The look is borrowed from the building itself, which is cheerfully 1970s Miami, all bold reds and yellows, arched openings and a fat retro serif. I took that and did not take the logo, and the footer says plainly that this is a privately owned unit and not the building's own page, because the owner is renting his apartment, not running the leasing office.

## The part that took the actual thinking

The card is double-sided, English on one side and Spanish on the other, each side with its own QR code. That is a nice idea on paper, and it puts a constraint on the site that took me a while to get right: once five hundred cards are printed you cannot change where the codes point.

So each side has its own address. `/card` opens the page in English, `/tarjeta` opens it in Spanish, and the address decides, not anything the browser guesses. The page also remembers a visitor's choice, and those two rules pull against each other: if the remembered one wins, somebody who once tapped EN out of curiosity scans the yellow side and gets English, which is the exact failure the second side of the card exists to prevent. So a card address beats the stored preference, every time. And if somebody switches language while sitting on a card address, the page moves itself to `/`, so a reload keeps the choice they just made.

Giving each code its own path had a second effect I did not plan and am glad of. Cloudflare Web Analytics counts the two paths separately, so the owner can see which side of the card people are picking up.

<figure class="case-figure">
  <img src="/images/724-bilingual.webp" alt="The same hero screen side by side in English and Spanish, the Spanish one reached through the business card's /tarjeta address, with Llamar and Escribir buttons and the ES toggle active" loading="lazy">
  <figcaption>The English card address and the Spanish one. The toggle in the corner switches by hand; the card decides which language you land in.</figcaption>
</figure>

I wrote the Spanish for Miami rather than translating it phrase by phrase, which is a different job and one I would rather have checked than be confident about.

## The photos and the card

The realtor's shoot came to seventy-nine photographs, several of them the same corner from slightly different places. I shortlisted eighteen, and the extra ten behind the "show more photos" button only download when somebody taps it. The originals were about 70 MB; as WebP the set is roughly 1.2 MB. From the walkthrough video I wanted one continuous aerial pass with no cuts in it, so it could loop silently behind the location section, and used ffmpeg to find the scene changes and the fade to black that marked where the usable passage began and ended.

<figure class="case-figure">
  <img src="/images/724-detail.webp" alt="Three more phone screens: a photo open in the full-screen swipe viewer, the rates table showing monthly prices by length of stay, and the amenities strip part-way through a sideways drag" loading="lazy">
  <figcaption>The photo viewer, the rates table, and the amenities strip mid-drag. The red contact bar stays put as you scroll.</figcaption>
</figure>

The card is 3.5 × 2 inches with bleed, built as an HTML page rendered to a print-ready PDF with crop marks, which meant I could change the layout and look at it again straight away. It needed that. The first version was text on a flat colour and it was dull. It picked up an arch-shaped photo window, then a tone-on-tone fabric texture, then a white panel behind the text, which I added after looking at the red side and finding I could not comfortably read the small type. The copy is scan-first: the card's whole job is to get the code scanned, so it leaves the rest to the page.

<figure class="case-figure">
  <img src="/images/724-card.webp" alt="Both sides of the business card, trimmed: the red English side and the yellow Spanish side, each with an arched photo window, a white text panel and its own QR code" loading="lazy">
  <figcaption>Both sides, trimmed to 3.5 × 2 in. Each QR code opens the page in that side's language.</figcaption>
</figure>

## The deploy

A private GitHub repository connected to Cloudflare Pages, so pushing to the main branch is the deploy. The domain is registered in the owner's own Cloudflare account with me added as a member rather than in mine, which is a little more setup and means he owns it outright, with nothing to hand over if he stops working with me. Then HTTPS redirects, DNSSEC, SPF and DMARC records so nobody can send mail claiming to be the domain, and cache headers.

The site is live, the cards are at the printer, and analytics is recording scans.

> One honest note: analytics counts scans, not phone calls. I can tell you the cards are being scanned and which language people land in. I cannot tell you the page got anybody to ring him.

## What I caught

I tested the finished cards by scanning them with my own phone, and the Spanish card opened in English.

Nothing was wrong with the code. iPhone Safari was holding a copy of the site's JavaScript from before the card addresses existed, so `/tarjeta` was being handled by a script that had never heard of `/tarjeta` and fell back to the stored preference. The fix was versioned asset URLs — the page asks for `main.js?v=2026-09-16a` rather than `main.js` — plus cache headers that revalidate the HTML on every visit while the versioned files stay cached.

What makes that one worth telling is when it shows up. It cannot happen on a phone that has never been to the site, which is every phone in the lobby and not the one in my hand, so the only reason I saw it is that I had been testing all week. And it is the worst thing here to find late, because the remedy for a QR code pointing at the wrong place is not a deploy, it is reprinting the cards.

## What I would add next

The rates table is maintained by hand, so it will go out of date the first time the owner changes a price and does not think to mention it.

The photo viewer swipes and takes arrow keys, but it does not preload the photo either side of the one you are looking at, so on a weak connection a swipe shows an empty frame for a moment.

And I would like a native speaker who lives in Miami to read the Spanish before the next batch of cards goes out. It reads well to me, which is not the same as being right.
