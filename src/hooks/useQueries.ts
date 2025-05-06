import { Query as GherkinQuery } from '@cucumber/gherkin-utils'
import { Query as CucumberQuery } from '@cucumber/query'
import { useContext } from 'react'

import CucumberQueryContext from '../CucumberQueryContext.js'
import GherkinQueryContext from '../GherkinQueryContext.js'

export function useQueries(): {
  cucumberQuery: CucumberQuery
  gherkinQuery: GherkinQuery
} {
  const gherkinQuery = useContext(GherkinQueryContext)
  const cucumberQuery = useContext(CucumberQueryContext)
  return { cucumberQuery, gherkinQuery }
}
