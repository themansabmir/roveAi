import { PortableText, type PortableTextComponents } from "@portabletext/react"

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2 className="mt-8 text-2xl font-semibold">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-6 text-xl font-semibold">{children}</h3>,
    normal: ({ children }) => <p className="mb-4 leading-relaxed text-muted-foreground">{children}</p>,
  },
}

export function PortableTextBlock({ value }: { value?: unknown[] | null }) {
  if (!value?.length) return null
  return <PortableText value={value as never} components={components} />
}
