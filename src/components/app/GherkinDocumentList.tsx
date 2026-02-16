import * as messages from '@cucumber/messages'
import { TestStepResultStatus } from '@cucumber/messages'
import React, { type FC, useState } from 'react'

import { useMostSevereStatusByUri } from '../../hooks/useMostSevereStatusByUri.js'
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
  const validDocuments = gherkinDocuments.filter(
    (doc) => !!doc.uri
  ) as ReadonlyArray<ValidGherkinDocument>
  const mostSevereStatusByUri = useMostSevereStatusByUri()
  const [expanded] = useState<ReadonlyArray<string>>(() => {
    // Pre-expand any document that is *not* passed - assuming this is what people want to look at first
    return preExpand
      ? (validDocuments
          .filter(
            (doc) => mostSevereStatusByUri.get(doc.uri) !== messages.TestStepResultStatus.PASSED
          )
          .map((doc) => doc.uri) as string[])
      : []
  })

  return (
    <DocumentAccordion expanded={expanded}>
      {validDocuments.map((validDocument) => {
        const status = mostSevereStatusByUri.get(validDocument.uri) ?? TestStepResultStatus.UNKNOWN
        return (
          <DocumentAccordionItem key={validDocument.uri} uri={validDocument.uri} status={status}>
            <GherkinDocument gherkinDocument={validDocument} />
          </DocumentAccordionItem>
        )
      })}
    </DocumentAccordion>
  )
}
