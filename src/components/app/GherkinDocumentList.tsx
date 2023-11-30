import * as messages from '@cucumber/messages'
import { getWorstTestStepResult } from '@cucumber/messages'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { FunctionComponent, useContext, useMemo, useState } from 'react'
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from 'react-accessible-accordion'

import CucumberQueryContext from '../../CucumberQueryContext.js'
import GherkinQueryContext from '../../GherkinQueryContext.js'
import UriContext from '../../UriContext.js'
import { GherkinDocument, MDG, StatusIcon } from '../gherkin/index.js'
import styles from './GherkinDocumentList.module.scss'

interface IProps {
  gherkinDocuments?: readonly messages.GherkinDocument[] | null
  // Set to true if non-PASSED documents should be pre-expanded
  preExpand?: boolean
}

export const GherkinDocumentList: FunctionComponent<IProps> = ({ gherkinDocuments, preExpand }) => {
  const gherkinQuery = useContext(GherkinQueryContext)
  const cucumberQuery = useContext(CucumberQueryContext)
  const gherkinDocs = gherkinDocuments || gherkinQuery.getGherkinDocuments()
  const gherkinDocumentStatusByUri = useMemo(() => {
    const entries: Array<[string, messages.TestStepResultStatus]> = gherkinDocs.map(
      (gherkinDocument) => {
        if (!gherkinDocument.uri) throw new Error('No url for gherkinDocument')
        const gherkinDocumentStatus = gherkinDocument.feature
          ? getWorstTestStepResult(
              cucumberQuery.getPickleTestStepResults(gherkinQuery.getPickleIds(gherkinDocument.uri))
            ).status
          : messages.TestStepResultStatus.UNDEFINED
        return [gherkinDocument.uri, gherkinDocumentStatus]
      }
    )
    return new Map(entries)
  }, [gherkinDocs, gherkinQuery, cucumberQuery])
  const [expanded, setExpanded] = useState<Array<string | number>>(() => {
    // Pre-expand any document that is *not* passed - assuming this is what people want to look at first
    return preExpand
      ? (gherkinDocs
          .filter(
            (doc) =>
              doc.uri &&
              gherkinDocumentStatusByUri.get(doc.uri) !== messages.TestStepResultStatus.PASSED
          )
          .map((doc) => doc.uri) as string[])
      : []
  })

  return (
    <Accordion
      allowMultipleExpanded={true}
      allowZeroExpanded={true}
      preExpanded={expanded}
      onChange={setExpanded}
      className={styles.accordion}
    >
      {gherkinDocs.map((doc) => {
        if (!doc.uri) throw new Error('No url for gherkinDocument')
        const gherkinDocumentStatus = gherkinDocumentStatusByUri.get(doc.uri)
        if (!gherkinDocumentStatus) throw new Error(`No status for ${doc.uri}`)
        const source = gherkinQuery.getSource(doc.uri)
        if (!source) throw new Error(`No source for ${doc.uri}`)

        return (
          <AccordionItem key={doc.uri} uuid={doc.uri} className={styles.accordionItem}>
            <AccordionItemHeading>
              <AccordionItemButton className={styles.accordionButton}>
                <FontAwesomeIcon
                  className={styles.accordionChevron}
                  aria-hidden="true"
                  icon={faChevronRight}
                />
                <span className={styles.icon}>
                  <StatusIcon status={gherkinDocumentStatus} />
                </span>
                <span>{doc.uri}</span>
              </AccordionItemButton>
            </AccordionItemHeading>
            {expanded.includes(doc.uri) && (
              <AccordionItemPanel className={styles.accordionPanel}>
                <UriContext.Provider value={doc.uri}>
                  {source.mediaType === messages.SourceMediaType.TEXT_X_CUCUMBER_GHERKIN_PLAIN ? (
                    <GherkinDocument gherkinDocument={doc} source={source} />
                  ) : (
                    <MDG uri={doc.uri}>{source.data}</MDG>
                  )}
                </UriContext.Provider>
              </AccordionItemPanel>
            )}
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}
