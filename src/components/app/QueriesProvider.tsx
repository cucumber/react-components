import type { Query as GherkinQuery } from '@cucumber/gherkin-utils'
import type { Query as CucumberQuery } from '@cucumber/query'
import type { FC, PropsWithChildren } from 'react'

import CucumberQueryContext from '../../CucumberQueryContext.js'
import GherkinQueryContext from '../../GherkinQueryContext.js'

interface Props {
  cucumberQuery: CucumberQuery
  gherkinQuery: GherkinQuery
}

export const QueriesProvider: FC<PropsWithChildren<Props>> = ({
  cucumberQuery,
  gherkinQuery,
  children,
}) => {
  return (
    <CucumberQueryContext.Provider value={cucumberQuery}>
      <GherkinQueryContext.Provider value={gherkinQuery}>{children}</GherkinQueryContext.Provider>
    </CucumberQueryContext.Provider>
  )
}
