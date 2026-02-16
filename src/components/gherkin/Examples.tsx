import type { TableRow } from '@cucumber/messages'
import type { Lineage } from '@cucumber/query'

import type { FC } from 'react'

import { useQueries } from '../../hooks/index.js'
import { useTestCaseStarted } from '../../hooks/useTestCaseStarted.js'
import {
  type DefaultComponent,
  type ExamplesProps,
  useCustomRendering,
} from '../customise/index.js'
import { TestCaseOutcome } from '../results/index.js'
import { Children } from './Children.js'
import { Description } from './Description.js'
import defaultStyles from './Examples.module.scss'
import { Keyword } from './Keyword.js'
import { Tags } from './Tags.js'
import { Title } from './Title.js'

const DefaultRenderer: DefaultComponent<ExamplesProps> = ({ examples }) => {
  return (
    <section>
      <Tags tags={examples.tags} />
      <Title header="h2" id={examples.id}>
        <Keyword>{examples.keyword}:</Keyword>
        <span>{examples.name}</span>
      </Title>
      <Description description={examples.description} />
      <Children>
        {examples.tableBody.map((tableRow) => {
          return <Example key={tableRow.id} tableRow={tableRow} />
        })}
      </Children>
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

const Example: FC<{ tableRow: TableRow }> = ({ tableRow }) => {
  const { cucumberQuery } = useQueries()
  const testCaseStarted = useTestCaseStarted(tableRow.id)
  if (testCaseStarted) {
    const lineage = cucumberQuery.findLineageBy(testCaseStarted) as Lineage
    const name = `#${(lineage.examplesIndex ?? 0) + 1}.${(lineage.exampleIndex ?? 0) + 1}`
    return (
      <section>
        <Title header="h3" id={tableRow.id}>
          <span className={defaultStyles.exampleNumber}>{name}</span>
        </Title>
        <TestCaseOutcome testCaseStarted={testCaseStarted} />
      </section>
    )
  }
  return null
}
