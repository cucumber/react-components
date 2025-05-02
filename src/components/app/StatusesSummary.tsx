import React, { FC } from 'react'

import { useResultStatistics } from '../../hooks/useResultStatistics.js'
import statuses from '../../statuses.js'
import statusName from '../gherkin/statusName.js'
import styles from './StatusesSummary.module.scss'

export const StatusesSummary: FC = () => {
  const { scenarioCountByStatus, totalScenarioCount } = useResultStatistics()

  return (
    <ol className={styles.statusesList}>
      {statuses.map((status) => {
        const scenarioCount = scenarioCountByStatus[status]
        if (!scenarioCount) {
          return
        }
        return (
          <li
            key={status}
            data-status={status}
            className={styles.statusesItem}
            style={{ width: `calc(${scenarioCount} / ${totalScenarioCount} * 100%)` }}
          >
            {scenarioCount} {statusName(status)}
          </li>
        )
      })}
    </ol>
  )
}
