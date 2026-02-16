import { TestStepResultStatus } from '@cucumber/messages'
import type { FC } from 'react'

import { useResultStatistics } from '../../hooks/useResultStatistics.js'
import styles from './HealthChart.module.scss'

export const HealthChart: FC = () => {
  const { scenarioCountByStatus, totalScenarioCount, statusesWithScenarios } = useResultStatistics()
  let offsetAccumulator = 0
  return (
    <svg viewBox="0 0 100 100">
      <title>Pie chart showing proportion of results by status</title>
      <g transform="rotate(-90 50 50)">
        {statusesWithScenarios.length > 0 ? (
          [...statusesWithScenarios].map((status) => {
            const scenarioCount = scenarioCountByStatus[status]
            offsetAccumulator += scenarioCount
            return (
              <path
                key={status}
                className={styles.segment}
                data-status={status}
                pathLength={totalScenarioCount}
                strokeDasharray={`${scenarioCount} ${totalScenarioCount - scenarioCount}`}
                strokeDashoffset={offsetAccumulator}
                strokeWidth="50"
                d="M75 50a1 1 90 10-50 0a1 1 90 10 50 0"
                fill="none"
              />
            )
          })
        ) : (
          <path
            className={styles.segment}
            data-status={TestStepResultStatus.UNKNOWN}
            pathLength="1"
            strokeDasharray="1 0"
            strokeDashoffset="1"
            strokeWidth="50"
            d="M75 50a1 1 90 10-50 0a1 1 90 10 50 0"
            fill="none"
          />
        )}
      </g>
    </svg>
  )
}
