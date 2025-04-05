import { Query as GherkinQuery } from '@cucumber/gherkin-utils'
import { Query as CucumberQuery } from '@cucumber/query'
import React, { FunctionComponent, PropsWithChildren } from 'react'

import CucumberQueryContext from '../../CucumberQueryContext.js'
import GherkinQueryContext from '../../GherkinQueryContext.js'

interface IProps {
  cucumberQuery: CucumberQuery
  gherkinQuery: GherkinQuery
}

export const QueriesWrapper: FunctionComponent<PropsWithChildren<IProps>> = (props) => (
  <CucumberQueryContext.Provider value={props.cucumberQuery}>
    <GherkinQueryContext.Provider value={props.gherkinQuery}>
      {props.children}
    </GherkinQueryContext.Provider>
  </CucumberQueryContext.Provider>
)
