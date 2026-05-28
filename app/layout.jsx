import { Roboto, Roboto_Mono } from 'next/font/google'
import 'nextra-theme-docs/style.css'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto'
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto-mono'
})

export const metadata = {
  title: 'Pocket Guide'
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      dir="ltr"
      suppressHydrationWarning
      className={`${roboto.variable} ${robotoMono.variable}`}
      style={{
        '--x-font-sans': 'var(--font-roboto)',
        '--x-font-mono': 'var(--font-roboto-mono)'
      }}
    >
      <body>{children}</body>
    </html>
  )
}
