import { render } from '@testing-library/react'
import { expect } from 'chai'
import React from 'react'

import examplesTablesFeature from '../../../acceptance/examples-tables/examples-tables.feature.js'
import { EnvelopesProvider } from './EnvelopesProvider.js'
import { StatusesSummary } from './StatusesSummary.js'

describe('StatusesSummary', () => {
  it('should render correctly', () => {
    const { getAllByRole } = render(
      <EnvelopesProvider envelopes={examplesTablesFeature}>
        <StatusesSummary />
      </EnvelopesProvider>
    )

    expect(getAllByRole('listitem').map((li) => li.textContent)).to.deep.eq([
      '5 passed',
      '2 undefined',
      '2 failed',
    ])
  })
})
