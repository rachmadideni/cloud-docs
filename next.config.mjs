import nextra from 'nextra'

const withNextra = nextra({
  search: { codeblocks: false },
  unstable_shouldAddLocaleToLinks: true
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
  i18n: {
    locales: ['id', 'en'],
    defaultLocale: 'id'
  }
}

export default withNextra(nextConfig)
