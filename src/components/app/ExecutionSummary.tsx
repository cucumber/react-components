import { Product, TestStepResultStatus, TimeConversion } from '@cucumber/messages'
import { faCodeBranch, faStopwatch, faTag } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { FC } from 'react'

import { formatExecutionDistance } from '../../formatExecutionDistance.js'
import { formatExecutionDuration } from '../../formatExecutionDuration.js'
import { formatPassedQuantity } from '../../formatPassedQuantity.js'
import { formatStatusRate } from '../../formatStatusRate.js'
import { useQueries } from '../../hooks/index.js'
import { useResultStatistics } from '../../hooks/useResultStatistics.js'
import { CICommitLink } from './CICommitLink.js'
import { CIJobLink } from './CIJobLink.js'
import { CopyButton } from './CopyButton.js'
import styles from './ExecutionSummary.module.scss'
import { HeaderItem, HeaderSection, HeaderSubItem } from './Header.js'
import { HealthChart } from './HealthChart.js'
import { ImplementationIcon } from './ImplementationIcon.js'
import { makeSetupString } from './makeSetupString.js'
import { OSIcon } from './OSIcon.js'
import { RuntimeIcon } from './RuntimeIcon.js'

export const ExecutionSummary: FC = () => {
  const { cucumberQuery } = useQueries()
  const testRunStarted = cucumberQuery.findTestRunStarted()
  const testRunFinished = cucumberQuery.findTestRunFinished()
  const meta = cucumberQuery.findMeta()
  const { scenarioCountByStatus, totalScenarioCount } = useResultStatistics()

  const startDate = testRunStarted?.timestamp
    ? new Date(TimeConversion.timestampToMillisecondsSinceEpoch(testRunStarted.timestamp))
    : undefined
  const finishDate = testRunFinished?.timestamp
    ? new Date(TimeConversion.timestampToMillisecondsSinceEpoch(testRunFinished.timestamp))
    : undefined

  return (
    <>
      {meta && (
        <HeaderSection>
          <HeaderItem testId="cucumber.summary.setup">
            <HeaderSubItem>
              <ImplementationIcon implementation={meta.implementation} />
              <RuntimeIcon runtime={meta.runtime} />
              <OSIcon os={meta.os} />
            </HeaderSubItem>
            <span data-testid="cucumber.summary.setup.phrase">
              <VersionedTool {...meta.implementation} fallback="unknown tool" />
              <em className={styles.conjunction}> with </em>
              <VersionedTool {...meta.runtime} fallback="unknown runtime" />
              <em className={styles.conjunction}> on </em>
              <VersionedTool {...meta.os} fallback="unknown platform" />
            </span>
            <CopyButton text={makeSetupString(meta)} />
          </HeaderItem>
        </HeaderSection>
      )}
      <HeaderSection>
        <HeaderItem testId="cucumber.summary.status">
          <HeaderSubItem>
            <HealthChart />
            <span>
              {formatStatusRate(
                scenarioCountByStatus[TestStepResultStatus.PASSED],
                totalScenarioCount
              )}{' '}
              {formatPassedQuantity(
                scenarioCountByStatus[TestStepResultStatus.PASSED],
                totalScenarioCount
              )}
              {' passed'}
            </span>
          </HeaderSubItem>
        </HeaderItem>
        {startDate && (
          <HeaderItem testId="cucumber.summary.timing">
            <HeaderSubItem>
              <FontAwesomeIcon aria-hidden="true" style={{ opacity: 0.75 }} icon={faStopwatch} />
              <span>
                <time title={startDate.toString()} dateTime={startDate.toISOString()}>
                  {formatExecutionDistance(startDate)}
                </time>
                {finishDate && (
                  <>
                    <em className={styles.conjunction}> in </em>
                    <span>{formatExecutionDuration(startDate, finishDate)}</span>
                  </>
                )}
              </span>
            </HeaderSubItem>
          </HeaderItem>
        )}
        {meta?.ci && (
          <HeaderItem testId="cucumber.summary.ci">
            <HeaderSubItem>
              <CIJobLink ci={meta.ci} />
            </HeaderSubItem>
          </HeaderItem>
        )}
        {meta?.ci?.git && (
          <HeaderItem testId="cucumber.summary.git">
            <HeaderSubItem>
              <CICommitLink ci={meta.ci} />
            </HeaderSubItem>
            {meta.ci.git.branch && (
              <HeaderSubItem>
                <FontAwesomeIcon aria-hidden="true" style={{ opacity: 0.75 }} icon={faCodeBranch} />
                <code>{meta.ci.git.branch}</code>
              </HeaderSubItem>
            )}
            {meta.ci.git.tag && (
              <HeaderSubItem>
                <FontAwesomeIcon aria-hidden="true" style={{ opacity: 0.75 }} icon={faTag} />
                <code>{meta.ci.git.tag}</code>
              </HeaderSubItem>
            )}
          </HeaderItem>
        )}
      </HeaderSection>
    </>
  )
}

const VersionedTool: FC<Product & { fallback: string }> = ({ name, fallback, version }) => {
  return (
    <code>
      <strong>{name || fallback}</strong>
      {version && <span>@{version}</span>}
    </code>
  )
}
