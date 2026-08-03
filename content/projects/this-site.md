---
title: "This Site"
weight: 5
discipline: "Full-stack / Infra"
summary: "The portfolio you're looking at right now — built in Hugo, not assembled in a drag-and-drop builder, and deployed through a live platform migration."
platform: "Hugo (static site generator)"
stack: "Hugo + Go templates, Cloudflare Workers (static assets), GitHub, DigitalPlat free domain"
demo: "https://sophianawasreh.dpdns.org/"
repo: "https://github.com/purpIeroses/portfolio"
---

## What it is

This case study is the site itself. No Squarespace, no Webflow, no template
marketplace — a Hugo project with custom layouts, a Go-template homepage and
case-study page, and CSS written from scratch. The other four projects show
what I can build; this one shows how I actually ship and host something, end
to end.

## Why this one

It's easy to claim "I can deploy things." It's more convincing to point at the
exact repo, the exact DNS setup, and the exact page you're reading, and say
"this is that." A portfolio built in a no-code tool is a demonstration of
someone else's engineering. This one is mine.

## The build

Hugo over a JS framework because a portfolio is content, not an app — static
generation means no client-side routing bugs, no hydration cost, and a build
that's fast enough to iterate on instantly. The homepage and case-study
templates are custom `baseof`/`single`/`index` layouts using Hugo's Go
templating rather than a downloaded theme, so every section — hero, work grid,
about — is exactly as opinionated as I want it.

## The deploy

This is the part a website builder hides completely, and the part that ended
up being the real engineering story:

- **Git-based CI/CD**: pushed to GitHub, connected the repo to Cloudflare so
  every `git push` to `main` triggers a fresh Hugo build and redeploy — no
  manual upload step, ever.
- **Landed mid-migration**: Cloudflare was actively folding Pages into Workers
  while I was setting this up, so the dashboard didn't match the docs. Fixed it
  by adding a `wrangler.jsonc` pointing at the Hugo output directory so the new
  Workers-based static-asset deploy path picked it up correctly.
- **Free domain, real DNS**: registered `sophianawasreh.dpdns.org` through
  DigitalPlat, delegated it to Cloudflare via external nameservers (not
  DigitalPlat's own DNS), and waited out real-world nameserver propagation
  rather than assuming it "just works."

## The takeaway

Anyone can point a builder at a domain and click publish. This is what it
looks like to own every layer instead: the templates, the git history, the
DNS, and the platform's own moving target — and to debug each one for real
when it didn't work on the first try.
