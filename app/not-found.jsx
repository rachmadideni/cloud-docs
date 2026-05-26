import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
      <h1>404 — Halaman tidak ditemukan</h1>
      <p>
        <Link href="/id">Kembali ke beranda</Link>
      </p>
    </div>
  )
}
