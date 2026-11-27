import type { FC } from 'react'

import { HighLight } from '../app/HighLight.js'
import {
  type DefaultComponent,
  type DescriptionClasses,
  type DescriptionProps,
  useCustomRendering,
} from '../customise/index.js'
import defaultStyles from './Description.module.scss'

// Gherkin keeps the source file's indentation, which Markdown would otherwise treat as code blocks
function dedent(text: string): string {
  const lines = text.split('\n')
  const indents = lines
    .filter((line) => line.trim() !== '')
    .map((line) => line.match(/^[ \t]*/)?.[0].length ?? 0)
  const common = Math.min(...indents)
  return lines.map((line) => line.slice(common)).join('\n')
}

const DefaultRenderer: DefaultComponent<DescriptionProps, DescriptionClasses> = ({
  description,
  styles,
}) => {
  if (!description || description.trim() === '') {
    return null
  }
  return (
    <div className={styles.content}>
      <HighLight text={dedent(description)} markdown={true} />
    </div>
  )
}

export const Description: FC<DescriptionProps> = (props) => {
  const ResolvedRenderer = useCustomRendering<DescriptionProps, DescriptionClasses>(
    'Description',
    defaultStyles,
    DefaultRenderer
  )
  return <ResolvedRenderer {...props} />
}
