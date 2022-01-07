import { TestStepResultStatus } from '@cucumber/messages'
import { render } from '@testing-library/react'
import assert from 'assert'
import React from 'react'

import { StatusesSummary } from '../../../src/components/app'
import { makeEmptyScenarioCountsByStatus } from '../../../src/countScenariosByStatuses'

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

    assert.deepStrictEqual(
      getAllByRole('listitem').map((li) => li.textContent),
      ['3 failed', '100 passed', '1 undefined']
    )
  })
})
