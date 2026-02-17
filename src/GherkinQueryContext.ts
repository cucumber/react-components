import { Query as GherkinQuery } from '@cucumber/gherkin-utils'
import { createContext } from 'react'

export default createContext(new GherkinQuery())
