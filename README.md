# cloud-docs

Cloud services documentation site — bilingual (ID/EN), built with [Nextra](https://nextra.site).

Live: https://cloud-docs.supanova.my.id

## Stack

- Next.js 15 + Nextra 4 (App Router, MDX)
- Pagefind for static search
- Static export → Cloudflare Pages
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
  layout.jsx                # root layout, navbar, footer, i18n config
  [lang]/[[...mdxPath]]/    # dynamic catch-all that renders content/<lang>/...
content/
  id/                       # Bahasa Indonesia (default)
  en/                       # English mirror
mdx-components.jsx          # MDX component overrides
next.config.mjs             # Nextra + static export
```

## Adding content

1. Create `.mdx` file under `content/<lang>/<section>/`.
2. Register in nearest `_meta.js` for sidebar order.
3. Mirror to other locale (best-effort — ID is source of truth).

## Deployment

Auto-deploy on push to `main` via Cloudflare Pages git integration. Build settings:

- Build command: `npm run build`
- Output directory: `out`
- Node version: 20+

## License

MIT.
