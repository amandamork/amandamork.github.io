# amandamork.com — System Notes

## What this is

A personal site (`/`) plus a folder of tailored application pages (`/applications/[company]/`). All pages share design tokens via `shared/core.css` and scroll behavior via `shared/scroll.js`.

## File structure

```
website/
├── index.html                          # Homepage (amandamork.com)
├── shared/
│   ├── core.css                        # Design tokens, typography, components
│   └── scroll.js                       # Reveal triggers, counters, parallax
└── applications/
    └── deeplearning-ai/
        └── index.html                  # Lives at amandamork.com/applications/deeplearning-ai/
```

## Deployment

Drag the entire `website/` folder onto [app.netlify.com/drop](https://app.netlify.com/drop). Netlify treats it as a single site. No build step.

For custom domain (`amandamork.com`):
1. In Netlify: Site settings → Domain management → Add custom domain → `amandamork.com`
2. Netlify gives you DNS targets (usually an A record + CNAME for `www`)
3. Update DNS at your registrar (Squarespace, Cloudflare, wherever)
4. Wait for SSL to provision (~minutes to an hour)

## Adding a new application page

Three steps, ~30 minutes per page once you know the pattern:

1. **Copy the template:**
   ```
   cp -r applications/deeplearning-ai applications/[new-company-slug]
   ```

2. **Edit the new `index.html`:**
   - Hero label: `Application — [Company] / [Role]`
   - Hero h1: tailored hook
   - Story pull-quote: a thesis specific to this company
   - Numbers section: keep or trim depending on relevance
   - Experience: reorder bullets to lead with the most relevant
   - Cover letter: the new letter, with a drop-cap on first paragraph
   - CTA: tailored to this company

3. **Link it from the homepage** by adding a card in the `#applications` section of `/index.html`:
   ```html
   <a href="applications/[new-company-slug]/" class="app-card reveal">
     <div class="label">For [Company]</div>
     <h3 class="italic-accent">[Role title] — for [team or person].</h3>
     <div class="arrow">View</div>
   </a>
   ```

## Design system

All colors and type live in `:root` in `shared/core.css`. Change a value there, every page updates.

Key tokens:
- `--bg`: page background (warm cream)
- `--ink`: primary text
- `--accent`: TED-adjacent red, used sparingly
- `--font-display`: Fraunces (variable serif)
- `--font-body`: Geist
- `--font-mono`: Geist Mono

Reusable utility classes:
- `.display-xl`, `.display-lg`, `.display-md`, `.display-sm` — type scale
- `.italic-accent em` — italic + red treatment for emphasis
- `.label` — small caps mono labels
- `.btn-arrow` — link with arrow that pushes on hover
- `.reveal` — fade up on scroll
- `.reveal-stagger > *` — stagger children on reveal
- `[data-counter data-target="X"]` — animated counter (see `shared/scroll.js` for formats)

## Privacy on application pages

Application pages are publicly accessible if anyone knows the URL. They aren't linked from the homepage by default unless you add them to the `#applications` section. Two options:

- **Public:** add the card to the homepage, signals confidence and breadth
- **Unlisted:** keep the URL out of the homepage list, share the link only with the recipient

DeepLearning.AI is currently linked publicly. Consider whether to leave it that way after you've sent the application.
