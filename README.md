# cloud-docs

Cloud services documentation site, bilingual (ID/EN), built with [Nextra](https://nextra.site).

Live: https://cloud-docs.supanova.my.id

## Stack

- Next.js 15 + Nextra 4 (App Router, MDX)
- Pagefind for static search
- Static export to Cloudflare Pages
- Local emulator: [floci.io](https://floci.io)

## Dev

```bash
npm install
npm run dev      # localhost:3000
npm run build    # static export to ./out
```

## Structure

```
app/
  layout.jsx                # root layout
  [lang]/layout.jsx         # Nextra Layout with pageMap per lang
  [lang]/[[...mdxPath]]/    # dynamic catch-all that renders content/<lang>/...
content/
  id/                       # Bahasa Indonesia (default)
  en/                       # English mirror
mdx-components.jsx          # MDX component overrides
next.config.mjs             # Nextra + static export
public/
  _redirects                # CF Pages redirect rules
  _headers                  # CF Pages custom headers
  robots.txt
patches/                    # patch-package overrides for upstream bug
```

## Adding content

1. Create `.mdx` file under `content/<lang>/<section>/`.
2. Register in nearest `_meta.js` for sidebar order.
3. Mirror to other locale (best-effort, ID is source of truth).
4. Follow tech-writer skill at `.claude/skills/tech-writer.md` for style guide.

## Deployment

Auto-deploy on push to `main` via Cloudflare Pages git integration.

### One-time setup

1. Push repo to GitHub.
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → pick repo.
3. Build configuration:
   - Framework preset: **None** (jangan pilih "Next.js", lihat DEPLOY.md untuk alasan)
   - Build command: `npm run build`
   - Build output directory: `out`
   - Root directory: `/`
   - Environment variable: `NODE_VERSION=20`
4. Custom domain → `cloud-docs.supanova.my.id`. Zone is already on Cloudflare so CNAME auto-created.
5. SSL: auto-issued (Universal SSL + wildcard from zone).

After setup, every push to `main` triggers a new deploy. Preview deploys spin up automatically per PR at `<branch>.cloud-docs.pages.dev`.

See [DEPLOY.md](DEPLOY.md) for step-by-step checklist with screenshots.

## License

MIT.
