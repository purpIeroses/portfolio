# Portfolio Site — Build & Deploy Reference

Your portfolio hub, built with Hugo and deployed free. This folder is a ready-to-
run Hugo skeleton with all four case studies pre-written. Below is how to run it,
customize it with AI tools, and ship it.

---

## What you've got

A custom, non-templated Hugo site — homepage (hero + work grid + about) plus a
case-study page for each of Asteroids, Tally, Parsel, and Tidal, each pre-filled
with its hardening/craft story pulled from the individual build guides. Editorial
design: Fraunces display + Inter body, ink-on-paper with one warm accent.

```
portfolio/
  hugo.toml                     site config — edit name/email/links here
  netlify.toml                  Netlify deploy config (if using Netlify)
  .gitignore
  content/projects/*.md         the four case studies (edit these)
  layouts/
    _default/baseof.html        base HTML shell
    _default/single.html        case-study page template
    index.html                  homepage
    partials/{nav,footer}.html
  static/css/main.css           all styling
  static/images/                put your screenshots here
```

---

## 1. Run it locally

Install Hugo **extended** (the extended edition matters — it handles Sass and is
the standard):

```bash
# macOS
brew install hugo
# Windows (Chocolatey)  choco install hugo-extended
# Windows (Scoop)       scoop install hugo-extended
# Linux — use your package manager or grab a release binary from GitHub
```

Then from this folder:

```bash
hugo server
```

Open the printed localhost URL. Edits reload live.

---

## 2. Make it yours (the 10-minute pass)

1. **`hugo.toml`** — set `title`, `author`, `email`, `github`, `baseURL` (your
   real domain), and the `tagline`/`description`.
2. **Each `content/projects/*.md`** — fill the empty `demo:` and `repo:` URLs
   once those are live, and drop a screenshot path into `hero_image:`.
3. **Screenshots** — put PNGs in `static/images/`, reference as
   `images/your-file.png` in the front matter.
4. **About section** — it's in `layouts/index.html`; rewrite the three paragraphs
   in your own voice. The draft there is a starting point, not gospel.

The case studies are already written to lead with the hardening story — that's
deliberate, it's your strongest selling point. Keep that structure even as you
edit the wording.

---

## 3. Deploy free — Cloudflare Pages (recommended)

Why Cloudflare: unlimited bandwidth on the free tier, so if a case study gets
shared around while you're pitching, there are no surprise overage charges. Free
CDN, HTTPS, and continuous deployment.

**Steps:**

1. Push this folder to a new GitHub repo:
   ```bash
   git init && git add -A && git commit -m "portfolio"
   git branch -M main
   git remote add origin https://github.com/YOU/portfolio.git
   git push -u origin main
   ```
2. In the Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git**, pick the repo.
3. Build settings:
   - Framework preset: **Hugo**
   - Build command: `hugo`
   - Output directory: `public`
4. Add an environment variable so the host builds with your Hugo version (this
   prevents the #1 CI failure, version drift):
   - `HUGO_VERSION` = `0.163.3` (or whatever `hugo version` prints locally)
5. Deploy. You get a free `*.pages.dev` URL immediately.
6. Add your custom domain in the Pages project settings — HTTPS is automatic. If
   your domain is already on Cloudflare DNS, this takes about two minutes.

Every `git push` to `main` now rebuilds and redeploys automatically.

### Alternative — Netlify

The included `netlify.toml` already has everything (publish dir, build command,
pinned Hugo version). Just connect the repo at netlify.com and it reads the file.
Netlify's Git integration is a touch more beginner-friendly; the tradeoff is that
its free tier meters bandwidth where Cloudflare doesn't. Either is a solid choice.

---

## 4. How the pieces fit together

Your four prototypes are separate apps — some interactive JS, some living on
their own platforms. This Hugo site is the **hub**, not the host:

- **Asteroids** — static files; you can host the game itself anywhere (even the
  same Cloudflare account) and link its `demo:` URL, or embed it.
- **Tally / Parsel** — live where they were built (their platforms' hosting);
  the case study links out via `demo:`.
- **Tidal** — deploy from v0 or export and host it; link via `demo:`.

Each case study page is the story; the `demo:` link is the proof. Fill those URLs
as each goes live.

---

## 5. Before you call it shipped

- [ ] All `demo:` and `repo:` links filled or removed (empty ones just hide).
- [ ] A real screenshot on each case study (`hero_image:`), especially Tidal —
      a screen-recording GIF of the depth drag sells it better than a still.
- [ ] `baseURL` in `hugo.toml` set to your real domain (OG tags depend on it).
- [ ] About section rewritten in your voice.
- [ ] Tested on mobile — the grid and case pages are responsive; confirm.
- [ ] `HUGO_VERSION` env var matches your local `hugo version`.
- [ ] Placeholder pricing / testimonials in the linked demos clearly marked as
      samples (carried over from the individual guides — don't ship fake claims).

---

## 6. Honest notes

- The design here is intentionally restrained so it doesn't compete with Tidal.
  If you want the hub itself flashier, that's a valid choice — just keep it
  coherent, and remember the work should be the loudest thing on the page.
- Hugo versions move fast. If a build breaks after an upgrade, check the Hugo
  release notes for template API changes; the pinned `HUGO_VERSION` is your
  safety net against surprise drift.
- Everything here is a starting point. The case-study copy is written to sell the
  engineering judgment behind each build — edit freely, but keep that angle,
  because it's what actually differentiates you from someone just shipping
  prompts.
