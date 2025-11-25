import { Query as GherkinQuery } from '@cucumber/gherkin-utils'
import React from 'react'

export default React.createContext<GherkinQuery | undefined>(new GherkinQuery())
