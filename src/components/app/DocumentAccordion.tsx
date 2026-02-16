import type { TestStepResultStatus } from '@cucumber/messages'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { FC, ReactNode } from 'react'
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from 'react-accessible-accordion'
import { v4 as uuidv4 } from 'uuid'

import { StatusIcon } from '../gherkin/index.js'
import styles from './DocumentAccordion.module.scss'

const idByUri = new Map<string, string>()
function getIdByUri(uri: string): string {
  if (!idByUri.has(uri)) {
    idByUri.set(uri, uuidv4())
  }
  return idByUri.get(uri) as string
}

interface DocumentAccordionProps {
  expanded: ReadonlyArray<string>
  children: ReactNode
}

interface DocumentAccordionItemProps {
  status: TestStepResultStatus
  uri: string
  children: ReactNode
}

export const DocumentAccordion: FC<DocumentAccordionProps> = ({ expanded, children }) => {
  const preExpand = expanded.map((uri) => getIdByUri(uri))
  return (
    <Accordion
      allowMultipleExpanded={true}
      allowZeroExpanded={true}
      preExpanded={preExpand}
      className={styles.accordion}
    >
      {children}
    </Accordion>
  )
}

export const DocumentAccordionItem: FC<DocumentAccordionItemProps> = ({
  status,
  uri,
  children,
}) => {
  const id = getIdByUri(uri)
  return (
    <AccordionItem uuid={id} className={styles.accordionItem}>
      <AccordionItemHeading>
        <AccordionItemButton className={styles.accordionButton}>
          <FontAwesomeIcon
            className={styles.accordionChevron}
            aria-hidden="true"
            icon={faChevronRight}
          />
          <span className={styles.icon}>
            <StatusIcon status={status} />
          </span>
          <span>{uri}</span>
        </AccordionItemButton>
      </AccordionItemHeading>
      <AccordionItemPanel className={styles.accordionPanel}>{children}</AccordionItemPanel>
    </AccordionItem>
  )
}
