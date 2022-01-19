import { Query as GherkinQuery } from '@cucumber/gherkin-utils'
import { Query as CucumberQuery } from '@cucumber/query'
import React from 'react'

import CucumberQueryContext from '../../CucumberQueryContext.js'
import EnvelopesQueryContext, { EnvelopesQuery } from '../../EnvelopesQueryContext.js'
import GherkinQueryContext from '../../GherkinQueryContext.js'

interface IProps {
  cucumberQuery: CucumberQuery
  gherkinQuery: GherkinQuery
  envelopesQuery: EnvelopesQuery
}

export const QueriesWrapper: React.FunctionComponent<IProps> = (props) => (
  <CucumberQueryContext.Provider value={props.cucumberQuery}>
    <GherkinQueryContext.Provider value={props.gherkinQuery}>
      <EnvelopesQueryContext.Provider value={props.envelopesQuery}>
        {props.children}
      </EnvelopesQueryContext.Provider>
    </GherkinQueryContext.Provider>
  </CucumberQueryContext.Provider>
)
