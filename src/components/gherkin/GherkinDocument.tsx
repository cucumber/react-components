import type { FC } from 'react'

import { type GherkinDocumentProps, useCustomRendering } from '../customise/index.js'
import { Feature } from './Feature.js'

const DefaultRenderer: FC<GherkinDocumentProps> = ({ gherkinDocument }) => {
  return gherkinDocument.feature ? <Feature feature={gherkinDocument.feature} /> : null
}

export const GherkinDocument: FC<GherkinDocumentProps> = (props) => {
  const ResolvedRenderer = useCustomRendering<GherkinDocumentProps>(
    'GherkinDocument',
    {},
    DefaultRenderer
  )
  return <ResolvedRenderer {...props} />
}
