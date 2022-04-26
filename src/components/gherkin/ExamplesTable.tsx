import * as messages from '@cucumber/messages'
import { getWorstTestStepResult } from '@cucumber/messages'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
import { ExamplesContext } from './ExamplesContext'
import defaultStyles from './ExamplesTable.module.scss'
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
      <tbody>
        {tableBody.map((row, i) => (
          <ExampleRow row={row} key={i} />
        ))}
      </tbody>
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

const ExampleRow: React.FunctionComponent<{
  row: messages.TableRow
}> = ({ row }) => {
  const gherkinQuery = useContext(GherkinQueryContext)
  const cucumberQuery = useContext(CucumberQueryContext)
  const uri = useContext(UriContext)
  const { setSelectedExample } = useContext(ExamplesContext)
  const pickleIds = uri ? gherkinQuery.getPickleIds(uri, row.id) : []
  const testStepResult = getWorstTestStepResult(cucumberQuery.getPickleTestStepResults(pickleIds))

  return (
    <>
      <tr onClick={() => setSelectedExample(pickleIds[0])}>
        <td>
          <StatusIcon status={testStepResult.status} />
        </td>
        {row.cells.map((cell, j) => (
          <td key={j} style={{ textAlign: isNumber(cell.value) ? 'right' : 'left' }}>
            {cell.value}
          </td>
        ))}
      </tr>
    </>
  )
}
