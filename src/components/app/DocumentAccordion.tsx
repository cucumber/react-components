import type { TestStepResultStatus } from '@cucumber/messages'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { type FC, type ReactElement, type ReactNode, useContext, useState } from 'react'
import {
  Button,
  Disclosure,
  DisclosureGroup,
  DisclosurePanel,
  DisclosureStateContext,
  Heading,
} from 'react-aria-components'

import { StatusIcon } from '../gherkin/index.js'
import styles from './DocumentAccordion.module.scss'

interface DocumentAccordionProps {
  expanded: Iterable<string>
  children: ReactNode
}

interface DocumentAccordionItemProps {
  status: TestStepResultStatus
  uri: string
  children: ReactNode
}

const LazyContent: FC<{ children: ReactElement }> = ({ children }) => {
  const state = useContext(DisclosureStateContext)
  const [hasBeenExpanded, setHasBeenExpanded] = useState(state?.isExpanded ?? false)

  if (state?.isExpanded && !hasBeenExpanded) {
    setHasBeenExpanded(true)
  }

  return hasBeenExpanded ? children : null
}

export const DocumentAccordion: FC<DocumentAccordionProps> = ({ expanded, children }) => {
  return (
    <DisclosureGroup
      allowsMultipleExpanded
      defaultExpandedKeys={expanded}
      className={styles.accordion}
    >
      {children}
    </DisclosureGroup>
  )
}

export const DocumentAccordionItem: FC<DocumentAccordionItemProps> = ({
  status,
  uri,
  children,
}) => {
  return (
    <Disclosure id={uri} className={styles.item}>
      <Heading className={styles.heading}>
        <Button slot="trigger" className={styles.button}>
          <FontAwesomeIcon className={styles.chevron} aria-hidden="true" icon={faChevronRight} />
          <span className={styles.icon}>
            <StatusIcon status={status} />
          </span>
          <span>{uri}</span>
        </Button>
      </Heading>
      <DisclosurePanel>
        <LazyContent>
          <div className={styles.content}>{children}</div>
        </LazyContent>
      </DisclosurePanel>
    </Disclosure>
  )
}
