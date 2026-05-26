# aws-docs — Project Context

> Dokumentasi cloud services komprehensif (mulai AWS, lanjut Azure/GCP/Oracle) dengan insight, perfect use-case, dan local emulator setup. Audience: developer community Indonesia (bilingual ID/EN).

## Status

Phase: **P0 — planning & repo bootstrap**. Belum ada konten/Nextra terpasang. Next step disepakati: **tulis J1 (static site) sebagai template referensi**, atau J2 (serverless REST) untuk full-floci showcase.

## Audience & Tone

- Public community Indonesia, bilingual.
- Default Bahasa Indonesia di `content/id/`. English mirror di `content/en/` (folder mirror, BUKAN file sibling). ID = source of truth, EN best-effort.
- Istilah teknis tetap English (bucket, queue, role — jangan diterjemah).
- Pembaca asumsi: developer yang sudah ngoding, belum tentu kenal cloud.

## Stack & Tooling

- **Docs framework**: Nextra (App Router, MDX, Pagefind search, i18n native, dark mode). Dipilih over Docusaurus karena lebih ringan + native Next.js.
- **Hosting**: Vercel (auto deploy on push).
- **Diagram**: mermaid inline (source) + PNG fallback di `public/diagrams/`.
- **Code examples**: runnable, di `examples/` per journey.

## Repo Layout (actual — Nextra 4 App Router)

```
cloud-docs/
  app/
    layout.jsx                       # root layout, navbar, footer, i18n switch
    [lang]/[[...mdxPath]]/page.jsx   # catch-all renderer for content/<lang>/...
  content/
    id/                              # konten Bahasa Indonesia (default)
      _meta.js                       # sidebar top-level
      index.mdx
      foundation/, journeys/, services/, tools/
    en/                              # English mirror
  components/                        # Callout, ServiceCard, EmulatorBadge, CostMeter
  public/diagrams/
  examples/                          # runnable code per use-case journey
  docker/                            # compose files emulator stack
  mdx-components.jsx                 # MDX component overrides
  next.config.mjs                    # Nextra + static export
```

**Penting**: Nextra 4 pakai `content/` (bukan `pages/`). `_meta.js` per folder = sidebar order & label. i18n via folder structure (`content/id/`, `content/en/`) + `[lang]` segment di App Router — BUKAN middleware (middleware tidak jalan di static export).

## Information Architecture — Use-Case Journey

Service muncul sesuai konteks journey, BUKAN daftar abjad. Setiap service yang muncul juga punya satu deep page yang di-link dari berbagai journey.

| ID  | Journey | Service AWS muncul |
|-----|---------|---|
| J1  | Static site + custom domain | S3, CloudFront, Route53, ACM |
| J2  | REST API serverless | Lambda, API Gateway, DynamoDB, IAM |
| J3  | Auth & user mgmt | Cognito, IAM, Secrets Manager |
| J4  | File upload pipeline | S3 presigned, Lambda, SQS, Rekognition |
| J5  | Event-driven backend | EventBridge, SQS, SNS, Lambda, Step Functions |
| J6  | Relational app | RDS Postgres, RDS Proxy, VPC, Bastion |
| J7  | Data pipeline / analytics | Kinesis, Firehose, Glue, Athena, S3 lake |
| J8  | Container workload | ECR, ECS Fargate, ALB, CloudMap |
| J9  | Kubernetes | EKS, ALB Controller, IRSA, Karpenter |
| J10 | Observability | CloudWatch, X-Ray, OpenSearch |
| J11 | Security baseline | IAM, SCP, GuardDuty, KMS, Secrets Manager |
| J12 | AI/ML inference | Bedrock, SageMaker, S3 |

## Template Halaman Service (WAJIB struktur ini)

```md
# <Service>
**TL;DR** 2 kalimat.
**Analogi** padanan non-cloud / di provider lain.
**Perfect use-case** ✅ bullet list.
**Anti use-case** ❌ bullet list.
**Pricing mental model** — dimensi yang bikin mahal (BUKAN angka exact, harga volatile).
**Local emulator** — perintah floci/compose, port, env. Status: ✅ full | ⚠️ partial | ❌ gap → fallback X.
**Hello-world** — kode minimal, runnable.
**Gotcha** — limit, quirks, cold start, eventual consistency.
**Cross-provider** — Azure/GCP/Oracle equivalent.
```

## Local Emulator Strategy

**Default**: [floci.io](https://floci.io) — single endpoint `localhost:4566`, 45 service AWS, MIT, free total, no auth token. Drop-in LocalStack replacement.

**Compose master**:
```yaml
services:
  floci:
    image: floci/floci:latest
    ports: ["4566:4566"]
    volumes: ["/var/run/docker.sock:/var/run/docker.sock"]
```

### Floci coverage vs journey

| Journey | Floci status | Catatan |
|---|---|---|
| J1 | ⚠️ partial | S3+Route53+ACM ✅. CloudFront ❌ → nginx local |
| J2 | ✅ full | Lambda Docker-native, API GW v2 |
| J3 | ✅ full | Cognito = Floci-exclusive (LocalStack Free ga ada) |
| J4 | ⚠️ partial | Rekognition ❌ → stub manual |
| J5 | ✅ full | Step Functions ASL support |
| J6 | ✅ full | RDS PG/MySQL real (Floci-exclusive) |
| J7 | ✅ full | Athena via DuckDB — query SQL beneran |
| J8 | ✅ full | ECS real Docker + ECR OCI registry |
| J9 | ✅ full | EKS real k3s cluster |
| J10 | ⚠️ partial | X-Ray ❌ → Jaeger / OTel Collector |
| J11 | ⚠️ partial | GuardDuty/Inspector/Macie ❌ → conceptual only |
| J12 | ❌ minim | Bedrock stub. Fallback Ollama untuk LLM |

### Fallback matrix (gap service)

| Service | Fallback lokal |
|---|---|
| CloudFront | nginx reverse proxy + cache headers |
| Rekognition | stub manual / skip |
| X-Ray | Jaeger / OTel Collector |
| GuardDuty / Inspector / Macie | conceptual doc + note LocalStack Pro |
| Bedrock / SageMaker | Ollama (LLM local), training = doc only |
| WAF, Shield | conceptual doc |
| SES outbound | Mailpit / MailHog |

**Catatan production**: floci masih relatif baru. Tiap halaman service tambah note "kalau stuck di floci, fallback LocalStack Pro" untuk pembaca production-grade.

## Cross-Provider Capability Map (untuk fase 2-4)

Halaman `concepts/<capability>.md` = pivot point lintas-provider.

| Capability | AWS | Azure | GCP | Oracle |
|---|---|---|---|---|
| Object storage | S3 | Blob Storage | Cloud Storage | OCI Object Storage |
| Serverless fn | Lambda | Functions | Cloud Run / Functions | Functions |
| NoSQL KV | DynamoDB | Cosmos DB | Firestore / Bigtable | NoSQL DB |
| Managed Postgres | RDS PG | DB for PG | Cloud SQL | Autonomous DB |
| Pub/sub | SNS+SQS | Service Bus | Pub/Sub | Streaming |
| Identity | Cognito | Entra ID B2C | Identity Platform | IDCS |

## Phase Plan

| Phase | Est | Deliverable |
|---|---|---|
| P0 | 1d | Nextra repo, i18n, theme, CI deploy Vercel |
| P1 | 3d | Foundation: IAM, VPC, Region/AZ, billing model, glossary, floci setup |
| P2 | 1-2w | AWS J1-J4 + service pages + compose |
| P3 | 2w | AWS J5-J8 |
| P4 | 2w | AWS J9-J12 |
| P2.5 | 3-5d | MCP server (lihat section MCP as Distribution Channel) — setelah J1-J4 siap |
| P5 | — | Azure (Azurite + Func Core Tools) |
| P6 | — | GCP (gcloud emulator suite) |
| P7 | — | Oracle (emulator lemah → Oracle Cloud Free Tier) |

## Konvensi Konten

- Code block tab variant: `floci` / `aws-cli` / `terraform` / `cdk` di mana relevan.
- Pricing: mental model, BUKAN angka exact (volatile).
- Diagram: mermaid source inline + PNG fallback.
- Setiap claim teknis cross-check via `ctx7` CLI (lihat global CLAUDE.md rule context7) — jangan ngandelin training data.

## Decision Log

- **2026-05-26**: Pilih Nextra over Docusaurus (lighter, native Next.js, i18n built-in).
- **2026-05-26**: IA = use-case journey, BUKAN service alphabetical. Service deep-page tetap ada tapi dilink dari journey.
- **2026-05-26**: Floci dipilih sebagai default emulator (vs LocalStack Free) karena coverage Cognito/RDS/ECS/EKS/Athena di free tier. LocalStack Pro disebut sebagai escape hatch saja.
- **2026-05-26**: Bilingual ID default, EN mirror. Istilah teknis tidak diterjemah.
- **2026-05-26**: Tambah MCP server sebagai distribution channel kedua (selain web). Phase P2.5, setelah J1-J4. Source of truth tetap MDX; MCP = layer akses.
- **2026-05-26**: Deploy target = Cloudflare Pages. Domain `cloud-docs.supanova.my.id` (subdomain existing, zone sudah di CF). Stack tetap Nextra (bukan RR v7) — docs site = solved problem, jangan reinvent. MCP subdomain `mcp-cloud-docs.supanova.my.id` (flat).
- **2026-05-26**: Bootstrap P0 selesai — Nextra 4 App Router, struktur `content/<lang>/` (BUKAN `pages/`), i18n via folder (BUKAN middleware proxy — static export tidak support middleware). Repo siap deploy. Install deps & first commit pending user action (npm registry timeout saat bootstrap).
- **2026-05-26**: Package manager = npm (BUKAN pnpm). Patch workflow via `patch-package` + `postinstall` hook.
- **2026-05-26**: Custom skill `tech-writer` di [.claude/skills/tech-writer.md](.claude/skills/tech-writer.md). Auto-aktif saat nulis/edit MDX. Enforce: plain language, no em dash, anti-AI-fingerprint patterns, locked page template, ctx7 verification.
- **2026-05-26**: Patch upstream — nextra-theme-docs 4.6.1 punya bug di `Layout` (strip children sebelum Zod validate, schema marks children required → always fail). Workaround: patch `dist/schemas.js` ubah `children: reactNode` → `children: reactNode.optional()`. Captured via `patches/nextra-theme-docs+4.6.1.patch`. Cek pin version (downgrade ke 4.5.x) sebagai alt kalau patch break di versi selanjutnya.

## Deployment — Cloudflare

### Constraint terkunci

- **Domain**: `cloud-docs.supanova.my.id` (subdomain dari `supanova.my.id`).
- **DNS zone**: `supanova.my.id` sudah di Cloudflare (nameserver pointed). Full zone mode → wildcard SSL aktif, subdomain bebas.
- **CF account**: sama dengan yang host `drama.supanova.my.id` (React Router v7, sudah live di Pages). Multi-project free.
- **Cost domain**: $0 (subdomain existing).

### Service mapping

| Komponen | CF service | Catatan |
|---|---|---|
| Docs web | **Pages** (static export Nextra) | `output: 'export'` di next.config |
| MCP server (P2.5) | **Workers** | Subdomain `mcp-cloud-docs.supanova.my.id` (flat, bukan nested) |
| Vector index MCP | **Vectorize** | Generate saat build via Workers AI embedding |
| Telemetry MCP | **Analytics Engine** | Time-series query log |
| Search docs | **Pagefind** (static, bundled) | Zero infra, client-side |
| Asset (diagram) | `public/` di Pages | Skip R2 sampai bandwidth justifies |
| Web analytics | **Cloudflare Web Analytics** | Privacy-first, gratis |
| Bot control | **AI Crawler Control** | Decide block vs allow saat go-live |
| Preview deploy | Pages branch deploy | `<branch>.cloud-docs.pages.dev` otomatis |

### Setup step (D0-D1)

1. CF dashboard → Pages → bikin project `cloud-docs`, connect GitHub repo.
2. Custom domain attach `cloud-docs.supanova.my.id` → CF auto-bikin CNAME (full zone).
3. SSL auto-issued (Universal SSL + wildcard dari zone).
4. CI: GitHub Actions auto-deploy on push main + preview per PR (bawaan Pages git integration).
5. Secrets via `wrangler secret put` — JANGAN commit ke repo.

### Cost estimate

- Pages: gratis (500 builds/bulan, unlimited bandwidth).
- Workers (MCP): 100k req/hari gratis.
- Vectorize: 30M dim-bulan gratis.
- Workers AI: 10k neurons/hari gratis (embedding saat build).
- Analytics Engine: 10M datapoint/bulan gratis.
- **Total: $0/bulan** sampai traffic besar.

### Pola dari `drama.supanova.my.id`

Replikasi setup yang sudah works. Jangan invent jalur baru. `drama` = RR v7, `cloud-docs` = Nextra — runtime beda tapi pola deploy (Pages + git integration + CF DNS) identik.

## MCP as Distribution Channel

aws-docs TIDAK cuma static site. Konten juga di-expose lewat **MCP server** supaya reader bisa konsumsi langsung dari Claude Code, Cursor, Windsurf, dll — tanpa context switch ke browser.

### Why (manfaat strategis)

- **Diferensiasi**: 99% docs cloud cuma static. AI-native docs jarang, di Indonesia belum ada.
- **Distribution baru**: in-IDE channel di luar SEO Google. Target audience (developer pakai AI coding tool) langsung kena.
- **Telemetry konten**: log query MCP → tahu service paling sering ditanya, gap konten apa, journey mana underused. Roadmap data-driven.
- **Listing ekosistem**: Smithery, Anthropic MCP catalog, awesome-mcp lists.
- **Brand stickiness**: sekali reader add ke config, brand muncul tiap mereka coding cloud.
- **Authority signal**: bukti engineering muscle, bukan cuma teks.
- **Monetisasi future**: Free (search/lookup) vs Pro (scaffold starter repo, team workspace, private notes).
- **Lock-in positif**: konten tetap MDX di repo (portable). MCP cuma layer akses.

### Why (manfaat untuk reader)

- Tanya konsep cloud dari IDE, jawab pakai konten kita — bukan halusinasi LLM.
- AI agent scaffold project dari journey: "buatkan starter J2" → generate Lambda+DynamoDB+API GW + floci compose.
- Cross-provider lookup instant tanpa browser.
- Konten fresh (fetch source, bukan training cutoff LLM).

### Tool skeleton (target P2.5)

```ts
search_service(query)              // semantic search service
get_service(name, provider)        // detail halaman
compare_capability(cap)            // cross-provider matrix
get_journey(id)                    // walkthrough J1-J12
get_emulator_setup(service)        // floci compose + fallback
scaffold_starter(journey, stack)   // generate runnable repo
get_pricing_model(service)         // dimensi cost (mental model)
```

### Implementasi

- **Stack**: Node + `@modelcontextprotocol/sdk` (TypeScript).
- **Source of truth**: MDX di `pages/` — MCP server PARSE MDX, jangan duplikasi konten.
- **Vector index**: untuk `search_service` — generate dari MDX saat build, simpan di file (sqlite-vss atau LanceDB embedded) supaya zero-infra.
- **Distribution**: `npx aws-docs-mcp` (zero-infra, install di config user). Opsional hosted di Cloudflare Workers untuk reader yang ga mau npx.
- **Lokasi code**: `mcp-server/` di repo (monorepo style, share types dgn konten parser).

### Versioning & risk

- MCP spec masih muda — kemungkinan breaking change. Mitigasi: thin layer di atas MDX, konten aman walau MCP server rewrite.
- Sync schema MCP dengan struktur halaman service (template di CLAUDE.md ini = kontrak). Kalau template berubah, MCP parser ikut update.
- Tagged release per major MCP spec version.

### Phase positioning

P2.5 — dimulai SETELAH J1-J4 selesai (konten cukup untuk demo MCP yang meaningful). Jangan bangun MCP duluan dengan konten kosong — useless dan bikin first impression jelek.

## Open Questions

- Versioning strategy untuk perubahan API provider — Nextra version selector? Atau git tag per major rewrite?
- Apakah perlu interactive playground (StackBlitz/CodeSandbox embed) untuk hello-world?
- Monetisasi / sponsor? Affiliate cloud signup link? (kalau iya, perlu disclosure halaman).

## Working Tips for Claude

- Default working dir: `d:\personal\projects\aws-docs`.
- Shell: PowerShell utama. Bash via Bash tool kalau perlu POSIX.
- **Package manager: npm** (BUKAN pnpm). Patch workflow via `patch-package` (devDep, postinstall script).
- Selalu prefix command dengan `rtk` (lihat global CLAUDE.md) — `rtk git status`, `rtk npm install`, dll.
- Untuk doc library/API/SDK: pakai `ctx7` CLI dulu, jangan asumsi dari training.
- Saat tulis halaman service baru, IKUTI template struktur di atas — jangan improvise field order.
