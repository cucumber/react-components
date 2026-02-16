import type React from 'react'

import { HighLight } from '../app/HighLight.js'
import {
  type DefaultComponent,
  type DocStringClasses,
  type DocStringProps,
  useCustomRendering,
} from '../customise/index.js'
import defaultStyles from './DocString.module.scss'

const DefaultRenderer: DefaultComponent<DocStringProps, DocStringClasses> = ({
  docString,
  styles,
}) => {
  return (
    <pre className={styles.docString}>
      <HighLight text={docString.content} />
    </pre>
  )
}

export const DocString: React.FunctionComponent<DocStringProps> = (props) => {
  const ResolvedRenderer = useCustomRendering<DocStringProps, DocStringClasses>(
    'DocString',
    defaultStyles,
    DefaultRenderer
  )
  return <ResolvedRenderer {...props} />
}
