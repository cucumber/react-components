import type { FC } from 'react'
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'react-aria-components'

import { ExecutionSummary } from './ExecutionSummary.js'
import { FilteredDocuments } from './FilteredDocuments.js'
import styles from './Report.module.scss'
import { SearchBar } from './SearchBar.js'
import { TestRunHooks } from './TestRunHooks.js'
import { Timeline } from './Timeline.js'

export const Report: FC = () => {
  return (
    <article className={styles.layout}>
      <section>
        <ExecutionSummary />
        <SearchBar />
      </section>
      <section>
        <Tabs className={styles.tabs}>
          <TabList aria-label="Report views" className={styles.tabList}>
            <Tab id="scenarios" className={styles.tab}>
              Scenarios
            </Tab>
            <Tab id="timeline" className={styles.tab}>
              Timeline
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel id="scenarios" className={styles.tabPanel}>
              <FilteredDocuments />
            </TabPanel>
            <TabPanel id="timeline" className={styles.tabPanel}>
              <Timeline />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </section>
      <section>
        <h2 className={styles.heading}>Hooks</h2>
        <TestRunHooks />
      </section>
    </article>
  )
}