import React from 'react'

import { DefaultComponent, ExamplesProps, useCustomRendering } from '../customise/index.js'
import { Children } from './Children.js'
import { Description } from './Description.js'
import defaultStyles from './Examples.module.scss'
import { ExamplesTable } from './ExamplesTable.js'
import { Keyword } from './Keyword.js'
import { Tags } from './Tags.js'
import { Title } from './Title.js'

const DefaultRenderer: DefaultComponent<ExamplesProps> = ({ examples, styles }) => {
  return (
    <section className={styles.example}>
      <Tags tags={examples.tags} />
      <Title header="h3" id={examples.id}>
        <Keyword>{examples.keyword}:</Keyword>
        <span>{examples.name}</span>
      </Title>
      <Description description={examples.description} />
      {examples.tableHeader && (
        <Children>
          <ExamplesTable tableHeader={examples.tableHeader} tableBody={examples.tableBody} />
        </Children>
      )}
    </section>
  )
}

export const Examples: React.FunctionComponent<ExamplesProps> = (props) => {
  const ResolvedRenderer = useCustomRendering<ExamplesProps>(
    'Examples',
    defaultStyles,
    DefaultRenderer
  )
  return <ResolvedRenderer {...props} />
}
