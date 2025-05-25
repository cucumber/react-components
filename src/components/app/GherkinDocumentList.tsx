import * as messages from '@cucumber/messages'
import { getWorstTestStepResult } from '@cucumber/messages'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { FC, useMemo, useState } from 'react'
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from 'react-accessible-accordion'

import { useQueries } from '../../hooks/index.js'
import { GherkinDocument, MDG, StatusIcon } from '../gherkin/index.js'
import styles from './GherkinDocumentList.module.scss'
import { UriProvider } from './UriProvider.js'

interface ValidGherkinDocument extends messages.GherkinDocument {
  uri: string
}

interface Props {
  gherkinDocuments: readonly messages.GherkinDocument[]
  // Set to true if non-PASSED documents should be pre-expanded
  preExpand?: boolean
}

const idByUri = new Map<string, string>()
function getIdByUri(uri: string): string {
  if (!idByUri.has(uri)) {
    idByUri.set(uri, crypto.randomUUID())
  }
  return idByUri.get(uri) as string
}

export const GherkinDocumentList: FC<Props> = ({ gherkinDocuments, preExpand }) => {
  const { gherkinQuery, cucumberQuery } = useQueries()
  const documents = gherkinDocuments.filter(
    (doc) => !!doc.uri
  ) as ReadonlyArray<ValidGherkinDocument>
  const statusByUri = useMemo(() => {
    const entries: Array<[string, messages.TestStepResultStatus]> = documents.map(
      (gherkinDocument) => {
        const gherkinDocumentStatus = gherkinDocument.feature
          ? getWorstTestStepResult(
              cucumberQuery.getPickleTestStepResults(gherkinQuery.getPickleIds(gherkinDocument.uri))
            ).status
          : messages.TestStepResultStatus.UNDEFINED
        return [gherkinDocument.uri, gherkinDocumentStatus]
      }
    )
    return new Map(entries)
  }, [documents, gherkinQuery, cucumberQuery])
  const [expanded, setExpanded] = useState<Array<string | number>>(() => {
    // Pre-expand any document that is *not* passed - assuming this is what people want to look at first
    return preExpand
      ? (documents
          .filter((doc) => statusByUri.get(doc.uri) !== messages.TestStepResultStatus.PASSED)
          .map((doc) => getIdByUri(doc.uri)) as string[])
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
      {documents.map((doc) => {
        const id = getIdByUri(doc.uri)
        const status = statusByUri.get(doc.uri)
        if (!status) throw new Error(`No status for ${doc.uri}`)
        const source = gherkinQuery.getSource(doc.uri)
        if (!source) throw new Error(`No source for ${doc.uri}`)

        return (
          <AccordionItem key={id} uuid={id} className={styles.accordionItem}>
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
                <span>{doc.uri}</span>
              </AccordionItemButton>
            </AccordionItemHeading>
            {expanded.includes(id) && (
              <AccordionItemPanel className={styles.accordionPanel}>
                <UriProvider uri={doc.uri}>
                  {source.mediaType === messages.SourceMediaType.TEXT_X_CUCUMBER_GHERKIN_PLAIN ? (
                    <GherkinDocument gherkinDocument={doc} source={source} />
                  ) : (
                    <MDG uri={doc.uri}>{source.data}</MDG>
                  )}
                </UriProvider>
              </AccordionItemPanel>
            )}
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}
