import * as messages from '@cucumber/messages'
import {
  TestRunFinished,
  TestRunStarted,
  TestStepResultStatus,
  TimeConversion,
} from '@cucumber/messages'
import { faCodeBranch, faTag } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { formatDistanceStrict, formatDuration, intervalToDuration } from 'date-fns'
import React from 'react'

import { CICommitLink } from './CICommitLink.js'
import { CIJobLink } from './CIJobLink.js'
import styles from './ExecutionSummary.module.scss'
import { CucumberLogo } from './icons/CucumberLogo.js'
import { OSIcon } from './OSIcon.js'
import { RuntimeIcon } from './RuntimeIcon.js'

function formatDurationNicely(startDate: Date, finishDate: Date) {
  const inMilllis = finishDate.getTime() - startDate.getTime()
  // if under 10s, use 0.01s precision, otherwise 1s is fine
  if (inMilllis < 10000) {
    return `${new Intl.NumberFormat(undefined, {
      maximumFractionDigits: 2,
    }).format(inMilllis / 1000)} seconds`
  }
  return formatDuration(intervalToDuration({ start: startDate, end: finishDate }), {})
}

export interface IExecutionSummaryProps {
  scenarioCountByStatus: Record<messages.TestStepResultStatus, number>
  totalScenarioCount: number
  testRunStarted?: TestRunStarted
  testRunFinished?: TestRunFinished
  referenceDate?: Date
  meta?: messages.Meta
}

export const ExecutionSummary: React.FunctionComponent<IExecutionSummaryProps> = ({
  scenarioCountByStatus,
  totalScenarioCount,
  testRunStarted,
  testRunFinished,
  referenceDate,
  meta,
}) => {
  const percentagePassed: string =
    new Intl.NumberFormat(undefined, {
      style: 'percent',
    }).format(scenarioCountByStatus[TestStepResultStatus.PASSED] / totalScenarioCount) + ' passed'
  const startDate = testRunStarted?.timestamp
    ? new Date(TimeConversion.timestampToMillisecondsSinceEpoch(testRunStarted.timestamp))
    : undefined

  const finishDate = testRunFinished?.timestamp
    ? new Date(TimeConversion.timestampToMillisecondsSinceEpoch(testRunFinished.timestamp))
    : undefined

  const formattedTimestamp = startDate
    ? formatDistanceStrict(startDate, referenceDate ?? new Date(), {
        addSuffix: true,
      })
    : 'Unknown start time'
  const formattedDuration =
    startDate && finishDate ? formatDurationNicely(startDate, finishDate) : 'Unknown duration'
  return (
    <div className={styles.backdrop}>
      <dl className={styles.list}>
        <div className={styles.item}>
          <dt className={styles.suffix}>{totalScenarioCount} executed</dt>
          <dd className={styles.value}>{percentagePassed}</dd>
        </div>
        <div className={styles.item}>
          <dt className={styles.suffix}>last run</dt>
          <dd className={styles.value}>{formattedTimestamp}</dd>
        </div>
        <div className={styles.item}>
          <dt className={styles.suffix}>duration</dt>
          <dd className={styles.value}>{formattedDuration}</dd>
        </div>
        {meta?.ci && (
          <div className={`${styles.item} ${styles.itemCi}`}>
            <dt className={styles.suffix}>
              {meta.ci.git ? (
                <>
                  {meta.ci.git.branch && (
                    <span className={styles.gitItem}>
                      <FontAwesomeIcon icon={faCodeBranch} />
                      {meta.ci.git.branch}
                    </span>
                  )}
                  {meta.ci.git.tag && (
                    <span className={styles.gitItem}>
                      <FontAwesomeIcon icon={faTag} />
                      {meta.ci.git.tag}
                    </span>
                  )}
                  <span className={styles.gitItem}>
                    <CICommitLink ci={meta.ci} />
                  </span>
                  <span className={styles.gitItem}>
                    <CIJobLink ci={meta.ci} />
                  </span>
                </>
              ) : (
                '-'
              )}
            </dt>
            <dd className={styles.value}>{meta.ci.name}</dd>
          </div>
        )}
        {meta && (
          <>
            <div className={styles.item}>
              <dt className={styles.suffix}>{meta.os.name}</dt>
              <dd className={styles.value}>
                <OSIcon name={meta.os.name} />
              </dd>
            </div>
            <div className={styles.item}>
              <dt className={styles.suffix}>{meta.runtime.name + ' ' + meta.runtime.version}</dt>
              <dd className={styles.value}>
                <RuntimeIcon name={meta.runtime.name} />
              </dd>
            </div>
            <div className={styles.item}>
              <dt className={styles.suffix}>
                {`${meta.implementation.name} ${meta.implementation.version}`}
              </dt>
              <dd className={styles.value}>
                <CucumberLogo />
              </dd>
            </div>
          </>
        )}
      </dl>
    </div>
  )
}
