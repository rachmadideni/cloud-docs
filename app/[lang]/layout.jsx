import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'

export default async function LangLayout({ children, params }) {
  const { lang } = await params
  const pageMap = await getPageMap(`/${lang}`)

  return (
    <>
      <Head />
      <Layout
        navbar={<Navbar logo={<b>Cloud Docs</b>} />}
        pageMap={pageMap}
        footer={<Footer>MIT © Cloud Docs.</Footer>}
        i18n={[
          { locale: 'id', name: 'Bahasa Indonesia' },
          { locale: 'en', name: 'English' }
        ]}
      >
        {children}
      </Layout>
    </>
  )
}
