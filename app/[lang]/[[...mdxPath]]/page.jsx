import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { notFound } from 'next/navigation'
import { useMDXComponents as getMDXComponents } from '../../../mdx-components'

const SUPPORTED_LOCALES = ['id', 'en']

export const generateStaticParams = generateStaticParamsFor('mdxPath')

export async function generateMetadata(props) {
  const params = await props.params
  if (!SUPPORTED_LOCALES.includes(params.lang)) return {}
  const { metadata } = await importPage(params.mdxPath, params.lang)
  return metadata
}

export default async function Page(props) {
  const params = await props.params
  if (!SUPPORTED_LOCALES.includes(params.lang)) notFound()

  const result = await importPage(params.mdxPath, params.lang)
  const { default: MDXContent, toc, metadata, sourceCode } = result
  const Wrapper = getMDXComponents().wrapper
  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  )
}
