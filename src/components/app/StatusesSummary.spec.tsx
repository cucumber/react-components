import { TestStepResultStatus } from '@cucumber/messages'
import { render } from '@testing-library/react'
import React from 'react'

import { makeEmptyScenarioCountsByStatus } from '../../countScenariosByStatuses.js'
import { StatusesSummary } from './StatusesSummary.js'

describe('StatusesSummary', () => {
  it('should render correctly', () => {
    const { getAllByRole } = render(
      <StatusesSummary
        scenarioCountByStatus={{
          ...makeEmptyScenarioCountsByStatus(),
          ...{
            [TestStepResultStatus.PASSED]: 100,
            [TestStepResultStatus.FAILED]: 3,
            [TestStepResultStatus.UNDEFINED]: 1,
          },
        }}
        totalScenarioCount={104}
      />
    )

    expect(getAllByRole('listitem').map((li) => li.textContent)).toEqual([
      '3 failed',
      '100 passed',
      '1 undefined',
    ])
  })
})
