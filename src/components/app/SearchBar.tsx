import { TestStepResultStatus as Status } from '@cucumber/messages'
import { faCheck, faFilter, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { FC } from 'react'
import { useDebouncedCallback } from 'use-debounce'

import { useSearch } from '../../hooks/index.js'
import { useResultStatistics } from '../../hooks/useResultStatistics.js'
import statuses from '../../statuses.js'
import statusName from '../gherkin/statusName.js'
import { HeaderItem, HeaderSection, HeaderSubItem } from './Header.js'
import styles from './SearchBar.module.scss'

export const SearchBar: FC = () => {
  const { scenarioCountByStatus, statusesWithScenarios } = useResultStatistics()
  const { query, hideStatuses, update } = useSearch()

  const debouncedSearchChange = useDebouncedCallback((newValue) => update({ query: newValue }), 500)
  const searchSubmitted = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    debouncedSearchChange.flush()
  }
  const filterChanged = (name: Status, show: boolean) => {
    update({
      hideStatuses: show ? hideStatuses.filter((s) => s !== name) : hideStatuses.concat(name),
    })
  }

  return (
    <HeaderSection>
      <HeaderItem>
        <form onSubmit={searchSubmitted}>
          <HeaderSubItem>
            <FontAwesomeIcon aria-hidden="true" style={{ opacity: 0.75 }} icon={faSearch} />
            <input
              className={styles.field}
              aria-label="Search"
              type="text"
              name="query"
              placeholder="Search with text or @tags"
              defaultValue={query}
              onChange={(e) => debouncedSearchChange(e.target.value)}
            />
          </HeaderSubItem>
        </form>
      </HeaderItem>

      {statusesWithScenarios.length > 1 && (
        <HeaderItem>
          <HeaderSubItem>
            <FontAwesomeIcon aria-hidden="true" style={{ opacity: 0.75 }} icon={faFilter} />
            <ul className={styles.statuses}>
              {statuses.map((status) => {
                if (!statusesWithScenarios.includes(status)) {
                  return
                }
                const name = statusName(status)
                const enabled = !hideStatuses.includes(status)

                return (
                  <li key={name}>
                    <label className={styles.label}>
                      <input
                        className={styles.checkbox}
                        type="checkbox"
                        defaultChecked={enabled}
                        onChange={(evt) => filterChanged(status, evt.target.checked)}
                      />
                      <span className={styles.status} data-status={status}>
                        <FontAwesomeIcon aria-hidden="true" icon={faCheck} />
                        <span>{name}</span> <strong>{scenarioCountByStatus[status]}</strong>
                      </span>
                    </label>
                  </li>
                )
              })}
            </ul>
          </HeaderSubItem>
        </HeaderItem>
      )}
    </HeaderSection>
  )
}
