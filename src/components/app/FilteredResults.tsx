import { GherkinDocument } from '@cucumber/messages'
import React from 'react'

import countScenariosByStatuses from '../../countScenariosByStatuses.js'
import filterByStatus from '../../filter/filterByStatus.js'
import { useQueries, useSearch } from '../../hooks/index.js'
import Search from '../../search/Search.js'
import { ExecutionSummary } from './ExecutionSummary.js'
import styles from './FilteredResults.module.scss'
import { GherkinDocumentList } from './GherkinDocumentList.js'
import { NoMatchResult } from './NoMatchResult.js'
import { SearchBar } from './SearchBar.js'
import { StatusesSummary } from './StatusesSummary.js'

interface IProps {
  className?: string
}

export const FilteredResults: React.FunctionComponent<IProps> = ({ className }) => {
  const { cucumberQuery, gherkinQuery, envelopesQuery } = useQueries()
  const { query, hideStatuses, update } = useSearch()
  const allDocuments = gherkinQuery.getGherkinDocuments()

  const { scenarioCountByStatus, statusesWithScenarios, totalScenarioCount } =
    countScenariosByStatuses(gherkinQuery, cucumberQuery, envelopesQuery)

  const search = new Search(gherkinQuery)
  for (const gherkinDocument of allDocuments) {
    search.add(gherkinDocument)
  }

  const onlyShowStatuses = statusesWithScenarios.filter((s) => !hideStatuses.includes(s))

  const matches = query ? search.search(query) : allDocuments
  const filtered = matches
    .map((document) => filterByStatus(document, gherkinQuery, cucumberQuery, onlyShowStatuses))
    .filter((document) => document !== null) as GherkinDocument[]

  return (
    <div className={className}>
      <div className={styles.reportHeader}>
        <StatusesSummary
          scenarioCountByStatus={scenarioCountByStatus}
          totalScenarioCount={totalScenarioCount}
        />
        <ExecutionSummary
          scenarioCountByStatus={scenarioCountByStatus}
          totalScenarioCount={totalScenarioCount}
          testRunStarted={envelopesQuery.getTestRunStarted()}
          testRunFinished={envelopesQuery.getTestRunFinished()}
          meta={envelopesQuery.getMeta()}
        />
        <SearchBar
          query={query}
          onSearch={(query) => update({ query })}
          statusesWithScenarios={statusesWithScenarios}
          hideStatuses={hideStatuses}
          onFilter={(hideStatuses) => update({ hideStatuses })}
        />
      </div>

      {filtered.length > 0 && <GherkinDocumentList gherkinDocuments={filtered} preExpand={true} />}
      {filtered.length < 1 && <NoMatchResult query={query} />}
    </div>
  )
}
