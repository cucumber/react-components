import * as messages from '@cucumber/messages'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Element } from 'react-markdown/src/ast-to-react'

import GherkinQueryContext from '../../GherkinQueryContext'
import { HighLight } from '../app/HighLight'
import rehypePlugins from '../app/rehypePlugins'
import { Header } from '../customise'
import dataTableStyles from './DataTable.module.scss'
import { ExamplesTable } from './ExamplesTable'
import { GherkinStep } from './GherkinStep'
import { Keyword } from './Keyword'
import styles from './MDG.module.scss'
import { Title } from './Title'

interface IProps {
  uri: string
  children: string
}

export const MDG: React.FunctionComponent<IProps> = ({ uri, children }) => {
  const gherkinQuery = React.useContext(GherkinQueryContext)

  let hasExamples = false
  let examples: messages.Examples | undefined = undefined

  function header(line: number, level: number, children: string) {
    const scenario = gherkinQuery.getScenario(uri, line)
    hasExamples = !!scenario && scenario.examples.length > 0
    examples = gherkinQuery.getExamples(uri, line)

    const titleAstNode =
      scenario ||
      gherkinQuery.getBackground(uri, line) ||
      gherkinQuery.getRule(uri, line) ||
      examples
    if (titleAstNode) {
      const header = `h${level}` as Header
      return (
        <Title header={header} id={titleAstNode.id}>
          <Keyword>{titleAstNode.keyword}:</Keyword>
          <HighLight text={titleAstNode.name} />
        </Title>
      )
    }
    return <h3>{children}</h3>
  }

  return (
    <ReactMarkdown
      rehypePlugins={rehypePlugins}
      components={{
        h1({ node, level, children }) {
          return header(line(node), level, children as string)
        },
        h2({ node, level, children }) {
          return header(line(node), level, children as string)
        },
        h3({ node, level, children }) {
          return header(line(node), level, children as string)
        },
        h4({ node, level, children }) {
          return header(line(node), level, children as string)
        },
        h5({ node, level, children }) {
          return header(line(node), level, children as string)
        },
        table({ node, children }) {
          if (examples && examples.tableHeader && line(node) >= 3) {
            return (
              <ExamplesTable tableHeader={examples.tableHeader} tableBody={examples.tableBody} />
            )
          }
          return <table className={dataTableStyles.table}>{children}</table>
        },
        ul({ node, children }) {
          const step = gherkinQuery.getStep(uri, line(node))
          if (!step) {
            // Non-Gherkin list
            return <ul>{children}</ul>
          }
          return <ul className={styles.steps}>{children}</ul>
        },
        li({ node, children }) {
          const step = gherkinQuery.getStep(uri, line(node))
          if (!step) {
            // Non-Gherkin list item
            return <li>{children}</li>
          }
          return (
            <li>
              <GherkinStep step={step} hasExamples={hasExamples} />
            </li>
          )
        },
      }}
    >
      {children}
    </ReactMarkdown>
  )
}

function line(node: Element): number {
  if (node.position === undefined) throw new Error(`undefined position in ${JSON.stringify(node)}`)
  return node.position.start.line
}
