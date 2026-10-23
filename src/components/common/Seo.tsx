import { useEffect } from 'react'

interface SeoProps {
  title: string
  description?: string
  canonicalPath?: string
  noindex?: boolean
}

const BASE = 'BIMZ'

/**
 * Lightweight SEO head manager: title, description, canonical, og tags, robots.
 * Admin routes pass noindex.
 */
export default function Seo({ title, description, canonicalPath, noindex = false }: SeoProps) {
  useEffect(() => {
    document.title = title.includes(BASE) ? title : `${title} — ${BASE}`

    const setMeta = (selector: string, attr: 'name' | 'property', key: string, content: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(selector)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    if (description) setMeta('meta[name="description"]', 'name', 'description', description)
    setMeta('meta[property="og:title"]', 'property', 'og:title', title)
    setMeta('meta[property="og:type"]', 'property', 'og:type', 'website')
    if (description) setMeta('meta[property="og:description"]', 'property', 'og:description', description)
    setMeta('meta[name="robots"]', 'name', 'robots', noindex ? 'noindex,nofollow' : 'index,follow')

    const setLink = (rel: string, href: string) => {
      let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
      if (!el) {
        el = document.createElement('link')
        el.setAttribute('rel', rel)
        document.head.appendChild(el)
      }
      el.setAttribute('href', href)
    }
    if (canonicalPath) setLink('canonical', `https://bimz.dev${canonicalPath}`)

    return () => {}
  }, [title, description, canonicalPath, noindex])

  return null
}
