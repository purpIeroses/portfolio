---
title: "This Site"
weight: 7
discipline: "Full-stack / Infra"
summary: "The portfolio you are reading — a Hugo project with its own templates and CSS rather than a marketplace theme, bilingual in Arabic and English, deployed through a platform migration that happened underneath me."
platform: "Hugo (static site generator), built with Claude Code"
stack: "Hugo + Go templates, Cloudflare Workers (static assets), GitHub, DigitalPlat free domain"
demo: "https://sophianawasreh.dpdns.org/"
demo_label: "You're looking at it!"
repo: "https://github.com/purpIeroses/portfolio"
---

## What it is

This case study is the site itself. There is no Squarespace, no Webflow and no theme from a marketplace: it is a Hugo project with its own layouts, a homepage and case-study template built on Hugo's Go templating, and CSS written for this site alone. The other projects show what I can build. This one is the part that usually stays hidden, which is how I get something built onto a domain and keep it there.

It is also bilingual. Every page exists in English and Arabic, the Arabic version runs right-to-left, and each language has its own metadata and link preview image rather than sharing the English one.

## Why this one

Saying "I can deploy things" is easy and does not tell you much. Pointing at the repository, the DNS records and the page you are currently reading is a more useful thing to offer, because you can go and check all three.

## The build

I chose Hugo over a JavaScript framework because a portfolio is content rather than an application. Static generation means there is no client-side routing to go wrong, nothing to hydrate, and a build fast enough that I can change a line and see it immediately. The homepage and case-study templates are this project's own `baseof`, `single` and `index` layouts rather than a downloaded theme, so the hero, the work grid and the about section are laid out exactly the way I wanted them.

## The deploy

This is the part a website builder does for you, and it turned out to be the most interesting engineering in the project:

- **Git-based deploys.** The repository is connected to Cloudflare, so every push to `main` triggers a fresh Hugo build and redeploy. There is no manual upload step anywhere in the process.
- **A platform migration mid-setup.** Cloudflare was in the middle of folding Pages into Workers while I was configuring this, so the dashboard did not match the documentation and the build kept producing a site with nothing in it. What fixed it was adding a `wrangler.jsonc` pointing at Hugo's output directory, which is what the new Workers static-asset path reads.
- **Real DNS on a free domain.** `sophianawasreh.dpdns.org` is registered through DigitalPlat and delegated to Cloudflare with external nameservers rather than DigitalPlat's own DNS, which meant waiting out actual nameserver propagation instead of assuming it had worked.

None of that is complicated once you know it. It was worth doing because it is the layer I would otherwise have been guessing about, and now I am not.
