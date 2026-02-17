import { Query as CucumberQuery } from '@cucumber/query'
import { createContext } from 'react'

export default createContext(new CucumberQuery())
