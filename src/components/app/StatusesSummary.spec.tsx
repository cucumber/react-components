import { render } from '@testing-library/react'
import { expect } from 'chai'
import React from 'react'

import examplesTablesFeature from '../../../acceptance/examples-tables/examples-tables.feature.js'
import { EnvelopesWrapper } from './EnvelopesWrapper.js'
import { StatusesSummary } from './StatusesSummary.js'

describe('StatusesSummary', () => {
  it('should render correctly', () => {
    const { getAllByRole } = render(
      <EnvelopesWrapper envelopes={examplesTablesFeature}>
        <StatusesSummary />
      </EnvelopesWrapper>
    )

    expect(getAllByRole('listitem').map((li) => li.textContent)).to.deep.eq([
      '5 passed',
      '2 undefined',
      '2 failed',
    ])
  })
})
