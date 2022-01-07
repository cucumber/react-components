import { Query as GherkinQuery } from '@cucumber/gherkin-utils'
import { Query as CucumberQuery } from '@cucumber/query'
import { useContext } from 'react'

import CucumberQueryContext from '../CucumberQueryContext'
import EnvelopesQueryContext, { EnvelopesQuery } from '../EnvelopesQueryContext'
import GherkinQueryContext from '../GherkinQueryContext'

interface IQueries {
  cucumberQuery: CucumberQuery
  gherkinQuery: GherkinQuery
  envelopesQuery: EnvelopesQuery
}

export function useQueries(): IQueries {
  const envelopesQuery = useContext(EnvelopesQueryContext)
  const gherkinQuery = useContext(GherkinQueryContext)
  const cucumberQuery = useContext(CucumberQueryContext)
  return { cucumberQuery, gherkinQuery, envelopesQuery }
}
