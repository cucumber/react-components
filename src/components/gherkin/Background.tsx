import React from 'react'

import { BackgroundProps, DefaultComponent, useCustomRendering } from '../customise/index.js'
import { Description } from './Description.js'
import { Keyword } from './Keyword.js'
import { Title } from './Title.js'

const DefaultRenderer: DefaultComponent<BackgroundProps> = ({ background }) => {
  const hasName = background.name && background.name.trim() !== ''
  const hasDescription = background.description && background.description.trim() !== ''

  if (!hasName && !hasDescription) {
    return null
  }

  return (
    <section>
      <Title header="h2" id={background.id}>
        <Keyword>{background.keyword}:</Keyword>
        <span>{background.name}</span>
      </Title>
      <Description description={background.description} />
    </section>
  )
}

export const Background: React.FunctionComponent<BackgroundProps> = (props) => {
  const ResolvedRenderer = useCustomRendering<BackgroundProps>('Background', {}, DefaultRenderer)
  return <ResolvedRenderer {...props} />
}
