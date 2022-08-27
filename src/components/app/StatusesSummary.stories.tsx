import { TestStepResultStatus } from '@cucumber/messages'
import { Story } from '@ladle/react'
import React from 'react'

import { makeEmptyScenarioCountsByStatus } from '../../countScenariosByStatuses'
import { CucumberReact } from '../CucumberReact'
import { IStatusesSummaryProps, StatusesSummary } from './StatusesSummary'

export default {
  title: 'App/StatusesSummary',
}

const Template: Story<IStatusesSummaryProps> = (props) => {
  return (
    <CucumberReact>
      <StatusesSummary {...props} />
    </CucumberReact>
  )
}

const scenarioCountByStatus = {
  ...makeEmptyScenarioCountsByStatus(),
  ...{
    [TestStepResultStatus.PASSED]: 100,
    [TestStepResultStatus.FAILED]: 3,
    [TestStepResultStatus.UNDEFINED]: 1,
  },
}

export const Typical = Template.bind({})
Typical.args = {
  scenarioCountByStatus,
  totalScenarioCount: 104,
} as IStatusesSummaryProps

export const All = Template.bind({})
All.args = {
  scenarioCountByStatus: {
    [TestStepResultStatus.PASSED]: 3,
    [TestStepResultStatus.FAILED]: 3,
    [TestStepResultStatus.PENDING]: 3,
    [TestStepResultStatus.SKIPPED]: 3,
    [TestStepResultStatus.UNDEFINED]: 3,
    [TestStepResultStatus.AMBIGUOUS]: 3,
    [TestStepResultStatus.UNKNOWN]: 3,
  },
  totalScenarioCount: 21,
} as IStatusesSummaryProps
