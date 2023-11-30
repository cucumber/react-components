import { Query as GherkinQuery } from '@cucumber/gherkin-utils'
import { Query as CucumberQuery } from '@cucumber/query'
import { render } from '@testing-library/react'
import React, { FunctionComponent, PropsWithChildren, ReactElement } from 'react'

import CucumberQueryContext from '../src/CucumberQueryContext.js'
import GherkinQueryContext from '../src/GherkinQueryContext.js'
import UriContext from '../src/UriContext.js'

export interface TestRenderOptions {
  uri?: string
  gherkinQuery?: GherkinQuery
  cucumberQuery?: CucumberQuery
}

const AllTheProviders: FunctionComponent<PropsWithChildren<{ options: TestRenderOptions }>> = ({
  children,
  options,
}) => {
  return (
    <GherkinQueryContext.Provider value={options.gherkinQuery ?? new GherkinQuery()}>
      <UriContext.Provider value={options.uri ?? 'some.feature'}>
        <CucumberQueryContext.Provider value={options.cucumberQuery ?? new CucumberQuery()}>
          {children}
        </CucumberQueryContext.Provider>
      </UriContext.Provider>
    </GherkinQueryContext.Provider>
  )
}

const customRender = (ui: ReactElement, options: Partial<TestRenderOptions> = {}) => {
  const WrappedWithOptions: FunctionComponent<PropsWithChildren> = ({ children }) => (
    <AllTheProviders options={options}>{children}</AllTheProviders>
  )
  return render(ui, { wrapper: WrappedWithOptions })
}

export * from './CucumberQueryStream.js'
export * from './runFeature.js'
export * from './search.js'
export * from '@testing-library/react'

export { customRender as render }
