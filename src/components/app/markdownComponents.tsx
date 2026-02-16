import React, { type ReactNode } from 'react'

const components = {
  a: ({ href, children }: { href?: string; children?: ReactNode }) => (
    <a href={href} target="_blank" rel="noopener nofollow noreferrer">
      {children}
    </a>
  ),
}

export default components
