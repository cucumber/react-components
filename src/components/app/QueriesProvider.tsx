import { Query as GherkinQuery } from '@cucumber/gherkin-utils'
import { Query as CucumberQuery } from '@cucumber/query'
import React, { FC, PropsWithChildren } from 'react'

import CucumberQueryContext from '../../CucumberQueryContext.js'
import GherkinQueryContext from '../../GherkinQueryContext.js'

interface Props {
  cucumberQuery: CucumberQuery
  gherkinQuery?: GherkinQuery
}

export const QueriesProvider: FC<PropsWithChildren<Props>> = (props) => (
  <CucumberQueryContext.Provider value={props.cucumberQuery}>
    <GherkinQueryContext.Provider value={props.gherkinQuery}>
      {props.children}
    </GherkinQueryContext.Provider>
  </CucumberQueryContext.Provider>
)
