export const metadata = {
  title: 'Pocket Guide',
  other: {
    'http-equiv': 'refresh',
    content: '0; url=/id/'
  }
}

export default function RootPage() {
  return (
    <main style={{ padding: '4rem 2rem', textAlign: 'center', fontFamily: 'system-ui' }}>
      <a href="/id/">Pocket Guide, Bahasa Indonesia</a>
    </main>
  )
}
