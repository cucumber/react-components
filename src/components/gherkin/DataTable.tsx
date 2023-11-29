import * as messages from '@cucumber/messages'
import React from 'react'

import { HighLight } from '../app/HighLight.js'
import {
  DataTableClasses,
  DataTableProps,
  DefaultComponent,
  useCustomRendering,
} from '../customise/index.js'
import defaultStyles from './DataTable.module.scss'
import isNumber from './isNumber.js'

const TableBody: React.FunctionComponent<{
  rows: readonly messages.TableRow[] | readonly messages.PickleTableRow[]
}> = ({ rows }) => {
  return (
    <tbody>
      {rows.map((row, i) => (
        <tr key={i}>
          {(row.cells || []).map((cell, j) => (
            <td key={j} style={{ textAlign: isNumber(cell.value) ? 'right' : 'left' }}>
              <HighLight text={cell.value} />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  )
}

const DefaultRenderer: DefaultComponent<DataTableProps, DataTableClasses> = ({
  dataTable,
  styles,
}) => {
  return (
    <table className={styles.table}>
      <TableBody rows={dataTable.rows || []} />
    </table>
  )
}

export const DataTable: React.FunctionComponent<DataTableProps> = (props) => {
  const ResolvedRenderer = useCustomRendering<DataTableProps, DataTableClasses>(
    'DataTable',
    defaultStyles,
    DefaultRenderer
  )
  return <ResolvedRenderer {...props} />
}
