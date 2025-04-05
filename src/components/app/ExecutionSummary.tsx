import { TestStepResultStatus, TimeConversion } from '@cucumber/messages'
import { faCodeBranch, faTag } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { FC } from 'react'

import { formatExecutionDistance } from '../../formatExecutionDistance.js'
import { formatExecutionDuration } from '../../formatExecutionDuration.js'
import { formatStatusRate } from '../../formatStatusRate.js'
import { useQueries } from '../../hooks/index.js'
import { useResultStatistics } from '../../hooks/useResultStatistics.js'
import { CICommitLink } from './CICommitLink.js'
import { CIJobLink } from './CIJobLink.js'
import styles from './ExecutionSummary.module.scss'
import { CucumberLogo } from './icons/CucumberLogo.js'
import { OSIcon } from './OSIcon.js'
import { RuntimeIcon } from './RuntimeIcon.js'

export const ExecutionSummary: FC = () => {
  const { cucumberQuery } = useQueries()
  const testRunStarted = cucumberQuery.findTestRunStarted()
  const testRunFinished = cucumberQuery.findTestRunFinished()
  const meta = cucumberQuery.findMeta()
  const { scenarioCountByStatus, totalScenarioCount } = useResultStatistics()

  const percentagePassed: string =
    formatStatusRate(scenarioCountByStatus[TestStepResultStatus.PASSED], totalScenarioCount) +
    ' passed'

  const startDate = testRunStarted?.timestamp
    ? new Date(TimeConversion.timestampToMillisecondsSinceEpoch(testRunStarted.timestamp))
    : undefined

  const finishDate = testRunFinished?.timestamp
    ? new Date(TimeConversion.timestampToMillisecondsSinceEpoch(testRunFinished.timestamp))
    : undefined

  const formattedTimestamp = startDate ? formatExecutionDistance(startDate) : 'Unknown start time'
  const formattedDuration =
    startDate && finishDate ? formatExecutionDuration(startDate, finishDate) : 'Unknown duration'
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
