import * as messages from '@cucumber/messages'
import { getWorstTestStepResult } from '@cucumber/messages'
import React, { useContext } from 'react'

import CucumberQueryContext from '../../CucumberQueryContext'
import GherkinQueryContext from '../../GherkinQueryContext'
import UriContext from '../../UriContext'
import {
  DefaultComponent,
  ExamplesTableClasses,
  ExamplesTableProps,
  useCustomRendering,
} from '../customise'
import { Attachment } from './Attachment'
import defaultStyles from './DataTable.module.scss'
import { ErrorMessage } from './ErrorMessage'
import { ExamplesContext } from './ExamplesContext'
import isNumber from './isNumber'
import { StatusIcon } from './StatusIcon'

const DefaultRenderer: DefaultComponent<ExamplesTableProps, ExamplesTableClasses> = ({
  tableHeader,
  tableBody,
  styles,
}) => {
  return (
    <table className={styles.examplesTable}>
      <thead>
        <tr>
          <th>&nbsp;</th>
          {tableHeader.cells.map((cell, j) => (
            <th key={j}>{cell.value}</th>
          ))}
        </tr>
      </thead>
      <ExamplesTableBody rows={tableBody || []} detailClass={styles.detailRow} />
    </table>
  )
}

export const ExamplesTable: React.FunctionComponent<ExamplesTableProps> = (props) => {
  const ResolvedRenderer = useCustomRendering<ExamplesTableProps, ExamplesTableClasses>(
    'ExamplesTable',
    defaultStyles,
    DefaultRenderer
  )
  return <ResolvedRenderer {...props} />
}

const ExamplesTableBody: React.FunctionComponent<{
  rows: readonly messages.TableRow[]
  detailClass?: string
}> = ({ rows, detailClass }) => {
  return (
    <tbody>
      {rows.map((row, i) => (
        <RowOrRows row={row} key={i} detailClass={detailClass} />
      ))}
    </tbody>
  )
}

const RowOrRows: React.FunctionComponent<{
  row: messages.TableRow
  detailClass?: string
}> = ({ row, detailClass }) => {
  const gherkinQuery = useContext(GherkinQueryContext)
  const cucumberQuery = useContext(CucumberQueryContext)
  const uri = useContext(UriContext)
  const { setSelectedExample } = useContext(ExamplesContext)
  const pickleIds = uri ? gherkinQuery.getPickleIds(uri, row.id) : []
  const testStepResult = getWorstTestStepResult(cucumberQuery.getPickleTestStepResults(pickleIds))

  const pickleStepIds = gherkinQuery.getPickleStepIds(row.id)
  const attachments = cucumberQuery.getPickleStepAttachments(pickleStepIds)

  return (
    <>
      <tr>
        <td>
          <StatusIcon status={testStepResult.status} />
          <button onClick={() => setSelectedExample(pickleIds[0])}>Detail</button>
        </td>
        {row.cells.map((cell, j) => (
          <td key={j} style={{ textAlign: isNumber(cell.value) ? 'right' : 'left' }}>
            {cell.value}
          </td>
        ))}
      </tr>
      <AttachmentAndErrorRow
        key="row-error"
        className={detailClass}
        attachments={attachments}
        errorMessage={testStepResult.message}
        colSpan={row.cells.length}
      />
    </>
  )
}

interface IAttachmentAndErrorRowProps {
  attachments: readonly messages.Attachment[]
  errorMessage: string | undefined
  colSpan: number
  className?: string
}

const AttachmentAndErrorRow: React.FunctionComponent<IAttachmentAndErrorRowProps> = ({
  attachments,
  errorMessage,
  colSpan,
  className,
}) => {
  if (!errorMessage && attachments.length === 0) return null
  return (
    <tr className={className}>
      <td>&nbsp;</td>
      <td colSpan={colSpan}>
        {errorMessage && <ErrorMessage message={errorMessage} />}
        {attachments.map((attachment, i) => (
          <Attachment key={i} attachment={attachment} />
        ))}
      </td>
    </tr>
  )
}
