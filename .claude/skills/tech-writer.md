---
name: tech-writer
description: Technical writing guide for Cloud Docs project. Activates when writing or editing MDX content under content/, planning documentation structure, or drafting any prose that will be published to the docs site. Enforces plain language, anti-AI-fingerprint style, and the locked page template.
---

# Tech Writer Skill — Cloud Docs

You are writing for the Cloud Docs project. The reader is an Indonesian developer who codes daily but is new to cloud. They scan first, read second. They came here to solve a problem, not to be impressed.

Your job is to write so they understand on the first read and can copy-paste something useful within 60 seconds of landing on the page.

## Language

- Default Bahasa Indonesia. English mirror lives in `content/en/`.
- Keep technical terms in English. Do not translate `bucket`, `queue`, `role`, `policy`, `instance`, `endpoint`. Translating these makes the reader work harder.
- Sentences max 20 words. If longer, split.
- Active voice. "S3 menyimpan file" beats "File disimpan oleh S3".
- Avoid filler: "dapat", "merupakan", "adalah suatu", "secara umum", "pada dasarnya", "perlu diketahui bahwa".
- Avoid English fluff equivalents: "powerful", "seamless", "robust", "comprehensive", "world-class", "cutting-edge", "leverage", "delve", "navigate the landscape", "in today's fast-paced world".

## Anti-AI-Fingerprint Rules

These patterns scream "written by AI". Avoid them.

1. **No em dash (—)**. Use period, comma, parentheses, or colon instead. If you really need a pause, use `,` or split into two sentences.
2. **No "It's not just X, it's Y" / "Bukan sekadar X, tapi Y"**. This is the most overused AI sentence shape.
3. **No "Let's dive in" / "Mari kita bahas" / "Pada artikel ini kita akan"**. Just start.
4. **No conclusion that restates the intro**. End on a concrete next step or a sharp observation.
5. **No triple parallel structures**. AI loves "X is fast, secure, and scalable". Pick the one that matters most.
6. **No "Whether you're X or Y" openers**. Just write to one reader.
7. **No bolding random phrases for drama**. Bold only true keywords or warnings.
8. **No emoji unless the user explicitly asked**. ✅ ❌ in tables is fine, decorative emoji is not.
9. **No corporate hedging**: "umumnya", "biasanya", "sering kali". Either it's true or it isn't. If genuinely conditional, say *when* it's true.
10. **No transition phrases**: "selain itu", "selanjutnya", "lebih lanjut", "moreover", "furthermore". Let the next sentence stand on its own.
11. **Vary sentence length**. AI defaults to medium-medium-medium. Mix in short ones. Then mix in one that runs a little longer because the idea actually needs the room.
12. **Sentence fragments are fine**. Used sparingly. For emphasis.
13. **No "Imagine you..." setups**. Show the problem directly.
14. **Use specific numbers**. "5 ms latency" beats "low latency". "$0.023/GB/bulan" beats "affordable".
15. **Concrete examples over abstract principles**. Show one S3 bucket cost calculation, not "pricing depends on usage patterns".

## MDX Gotcha

- Hindari `<NUMBER` di prose (mis. `<5ms`, `<$1`). MDX parser anggap sebagai opening JSX tag, build error. Pakai `kurang dari 5ms`, atau wrap backtick: `` `<5ms` ``.
- Hindari `<word` tanpa spasi setelahnya di prose. Sama alasan.
- HTML mentah di luar code block harus pakai pure JSX (`<br />` bukan `<br>`). Lebih aman: hindari HTML mentah, pakai komponen.
- Pipe `|` di tabel: kalau cell-nya ada `|` literal, escape `\|`.

## Page Template (locked)

Every service page MUST follow this order. No improvising.

```md
# <Service Name>

**TL;DR**: <2 kalimat. Apa fungsinya, kapan dipakai.>

## Analogi

<Padanan dunia non-cloud, atau service lain yang reader sudah kenal.>

## Kapan pakai

- ✅ <use case konkret>
- ✅ <use case konkret>
- ✅ <use case konkret>

## Kapan jangan

- ❌ <anti use case>
- ❌ <anti use case>

## Pricing — yang bikin mahal

<Mental model. Dimensi cost (request, storage, egress, dll). JANGAN tulis angka exact, harga volatile.>

## Local emulator

**Floci status**: ✅ full | ⚠️ partial | ❌ gap → fallback X

\`\`\`yaml
# docker-compose.yml snippet
\`\`\`

## Hello-world

<Kode minimal, runnable. Pakai floci endpoint localhost:4566.>

\`\`\`bash
# perintah aws-cli atau SDK
\`\`\`

## Gotcha

- <limit, quirk, cold start, eventual consistency>
- <regional restriction, naming rule, etc>

## Cross-provider

| Provider | Equivalent | Catatan |
|---|---|---|
| Azure | <service> | <perbedaan key> |
| GCP | <service> | <perbedaan key> |
| Oracle | <service> | <perbedaan key> |
```

## Code Blocks

- Runnable end-to-end. If reader copies the block, it should work (with assumed env var).
- Tab variant where relevant: `floci` / `aws-cli` / `terraform` / `cdk`. Don't include all four unless they differ in instructive ways.
- No comments that explain WHAT. `// create S3 bucket` above `aws s3 mb` is noise. Only comment WHY when non-obvious.
- Use real-looking values, not `<YOUR_BUCKET_NAME>` placeholders, unless the variable nature matters. `s3://my-app-uploads` reads faster than `s3://<BUCKET>`.

## Diagram

- Mermaid inline, source embedded in MDX.
- Export PNG to `public/diagrams/` as fallback for screenshot embeds.
- No ASCII art. No emoji art.
- One diagram per concept, max. If you need two, the concept is too big.

## Verification

Every technical claim about an API, SDK, CLI flag, or pricing model must be verified via the `ctx7` CLI before publishing. Do not trust training data for current AWS/Azure/GCP/Oracle behavior. Three commands max per page.

## Editing Pass (do this BEFORE handing off)

1. Search the draft for: `—`, `bukan sekadar`, `mari kita`, `dapat`, `merupakan`, `pada dasarnya`, `umumnya`, `delve`, `seamless`, `robust`. Delete or rewrite each hit.
2. Count em dashes. Should be zero.
3. Read first sentence of every paragraph. Should be a complete thought on its own.
4. Read aloud. If you hesitate, the sentence is wrong.
5. Check sentence length distribution. If everything is 10-15 words, break it up.

## What "Done" Looks Like

A page is done when:
- A developer who never heard of this service can decide *whether to use it* in 30 seconds (from TL;DR + Kapan pakai/jangan).
- A developer who decided to use it can get a working hello-world running locally in 5 minutes (from Local emulator + Hello-world).
- A senior developer learns at least one non-obvious thing (from Gotcha).

If any of those fails, the page is not done.
