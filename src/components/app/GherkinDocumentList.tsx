import * as messages from '@cucumber/messages'
import { getWorstTestStepResult } from '@cucumber/messages'
import React, { FC, useMemo, useState } from 'react'

import { useQueries } from '../../hooks/index.js'
import { GherkinDocument } from '../gherkin/index.js'
import { DocumentAccordion, DocumentAccordionItem } from './DocumentAccordion.js'

interface ValidGherkinDocument extends messages.GherkinDocument {
  uri: string
}

interface Props {
  gherkinDocuments: readonly messages.GherkinDocument[]
  // Set to true if non-PASSED documents should be pre-expanded
  preExpand?: boolean
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
  const [expanded] = useState<ReadonlyArray<string>>(() => {
    // Pre-expand any document that is *not* passed - assuming this is what people want to look at first
    return preExpand
      ? (documents
          .filter((doc) => statusByUri.get(doc.uri) !== messages.TestStepResultStatus.PASSED)
          .map((doc) => doc.uri) as string[])
      : []
  })

  return (
    <DocumentAccordion expanded={expanded}>
      {documents.map((gherkinDocument) => {
        const status = statusByUri.get(gherkinDocument.uri)
        if (!status) {
          throw new Error(`No status for ${gherkinDocument.uri}`)
        }

        return (
          <DocumentAccordionItem
            key={gherkinDocument.uri}
            uri={gherkinDocument.uri}
            status={status}
          >
            <GherkinDocument gherkinDocument={gherkinDocument} />
          </DocumentAccordionItem>
        )
      })}
    </DocumentAccordion>
  )
}
