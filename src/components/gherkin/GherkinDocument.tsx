import { type GherkinDocumentProps, useCustomRendering } from '../customise/index.js'
import { Feature } from './Feature.js'

const DefaultRenderer: React.FunctionComponent<GherkinDocumentProps> = ({ gherkinDocument }) => {
  return gherkinDocument.feature ? <Feature feature={gherkinDocument.feature} /> : null
}

export const GherkinDocument: React.FunctionComponent<GherkinDocumentProps> = (props) => {
  const ResolvedRenderer = useCustomRendering<GherkinDocumentProps>(
    'GherkinDocument',
    {},
    DefaultRenderer
  )
  return <ResolvedRenderer {...props} />
}
