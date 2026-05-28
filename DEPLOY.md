# Deploy Checklist: Cloudflare Pages

Step-by-step deploy ke `cloud-docs.supanova.my.id`. Asumsi: zone `supanova.my.id` sudah di Cloudflare (sama akun yang host `drama.supanova.my.id`).

## Pre-flight

- [ ] `npm install` sukses lokal
- [ ] `npm run dev` jalan tanpa error
- [ ] `npm run build` sukses, output di `out/`
- [ ] Konten siap (foundation + journey + service + tools)
- [ ] Patch `patches/nextra-theme-docs+4.6.1.patch` ada di repo

## Step 1: Push ke GitHub

```bash
# Bikin repo di github.com/<user>/cloud-docs (atau pilih nama lain)
# Settings repo: public atau private bebas

git remote add origin git@github.com:<user>/cloud-docs.git
git branch -M main
git push -u origin main
```

Cek di GitHub web UI bahwa file masuk semua. `.env` harus TIDAK ada (di-gitignore).

## Step 2: CF Pages project setup

1. Login Cloudflare dashboard.
2. Sidebar → **Workers & Pages**.
3. Klik **Create** → **Pages** → **Connect to Git**.
4. Authorize GitHub (kalau belum).
5. Pilih repo `cloud-docs`.
6. Pilih branch `main`.

## Step 3: Build configuration

| Field | Value |
|---|---|
| **Project name** | `cloud-docs` (akan jadi `cloud-docs.pages.dev`) |
| **Production branch** | `main` |
| **Framework preset** | **Next.js (Static HTML Export)** |
| **Build command** | `npm run build` |
| **Build output directory** | `out` |
| **Root directory** | `/` (default) |

### Environment variables

Klik **Add variable**:

| Name | Value | Scope |
|---|---|---|
| `NODE_VERSION` | `20` | Production + Preview |

Klik **Save and Deploy**. Build pertama mulai (3-5 menit).

## Step 4: Verifikasi build

Tab **Deployments**:
- Wait status **Success** (build, deploy, sampai green check).
- URL preview: `cloud-docs-xxxx.pages.dev`. Buka, cek render benar.

Kalau gagal:
- Cek log build di tab Deployments → click failed deploy → View logs.
- Common issue:
  - `patch-package` gagal: cek `patches/` folder ada di repo.
  - Pagefind error: build berhasil tapi postbuild gagal. Cek `out/` exist sebelum pagefind run.
  - Memory: build heavy bisa OOM. Pakai Pro plan atau split build.

## Step 5: Custom domain

1. Tab **Custom domains** di project Pages.
2. Klik **Set up a custom domain**.
3. Input `cloud-docs.supanova.my.id`.
4. CF auto-detect zone di akun, bikin CNAME record otomatis.
5. SSL cert auto-issued (Universal SSL).

Verifikasi:
```bash
curl -I https://cloud-docs.supanova.my.id
# HTTP/2 200 ...
```

## Step 6: AI Crawler & Analytics

### Web Analytics

1. Sidebar → **Web Analytics**.
2. Klik **Add a site**.
3. Hostname: `cloud-docs.supanova.my.id`.
4. Method: Automatic (CF auto-inject saat serve dari Pages).

Privacy-friendly, gratis, tanpa cookie banner.

### AI Crawler Control (opsional)

1. Dashboard zone `supanova.my.id` → **Security** → **AI Crawl Control**.
2. Decide policy per crawler:
   - **GPTBot, ClaudeBot, PerplexityBot**: allow (boost discoverability via AI search) atau block (preserve content).
   - **Common Crawl** (CCBot): allow untuk dataset open source, atau block.

Suggest awal: allow semua. Konten docs ini educational, AI search jadi distribution channel tambahan.

## Step 7: Preview deploy per PR

Auto-aktif. Setiap PR ke GitHub trigger preview deploy di:
```
<branch-name>.cloud-docs.pages.dev
```

Comment otomatis di PR berisi URL preview. Useful untuk review change visually.

## Step 8: Monitoring deploy

Setup notification:
1. Pages project → **Settings** → **Builds & deployments** → **Notifications**.
2. Tambah webhook ke Slack/Discord/email.

Atau pakai built-in dashboard: tab **Deployments** menampilkan history.

## Cost expectation

Free tier CF Pages:
- 500 build per bulan
- Unlimited bandwidth
- Unlimited request
- 1 build at a time (concurrent)

Untuk docs site small-medium traffic, masuk free tier dengan jauh.

Trigger upgrade ke Pro ($20/bulan):
- Lebih dari 500 build/bulan.
- Concurrent build (lebih dari 1).
- Build duration di atas 20 menit (free max).

Untuk project ini: tidak butuh upgrade.

## Rollback

Tab **Deployments** → cari versi lama yang work → klik **...** → **Rollback to this deployment**.

Instant rollback, no rebuild.

## Troubleshooting

### Build sukses tapi page 404

- Cek `output: 'export'` di `next.config.mjs`.
- Cek `out/` folder berisi HTML file setelah build.
- Cek `[lang]` routing benar (visit `/id/` bukan `/`).

### Domain tidak resolve

- Cek CNAME di Cloudflare DNS tab. Harus point ke `cloud-docs.pages.dev`.
- Wait beberapa menit untuk SSL provisioning.
- Cek `nslookup cloud-docs.supanova.my.id`.

### Build lambat (>10 menit)

- Pagefind index 60+ HTML file butuh ~50 detik. Normal.
- Untuk speed up, pakai cache: `NEXT_TELEMETRY_DISABLED=1` env var.
- Atau pindah Pagefind ke GitHub Actions sebelum upload artifact ke CF.

### Patch-package error di build CF

- Pastikan `patches/` folder committed ke git.
- `npm install` di CF runs `postinstall: patch-package`, butuh patch file.

## Next step

Setelah deploy live:
- Monitor traffic via Web Analytics.
- Setup MCP server (P2.5) di subdomain `mcp-cloud-docs.supanova.my.id`.
- Mirror konten ke `content/en/` (P5).
- Tambah halaman service yang masih missing.
