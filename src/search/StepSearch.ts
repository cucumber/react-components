import * as messages from '@cucumber/messages'
import elasticlunr from 'elasticlunr'

interface SearchableStep {
  id: string
  keyword: string
  text: string
  docString?: string
  dataTable?: string
}

export default class StepSearch {
  private readonly index = elasticlunr<SearchableStep>((ctx) => {
    ctx.addField('keyword')
    ctx.addField('text')
    ctx.addField('docString')
    ctx.addField('dataTable')
    ctx.setRef('id')
    ctx.saveDocument(true)
  })
  private stepById = new Map<string, messages.Step>()

  public add(step: messages.Step): void {
    const doc = {
      id: step.id,
      keyword: step.keyword,
      text: step.text,
      docString: step.docString && StepSearch.docStringToString(step.docString),
      dataTable: step.dataTable && StepSearch.dataTableToString(step.dataTable),
    }

    this.index.addDoc(doc)
    this.stepById.set(step.id, step)
  }

  public search(query: string): messages.Step[] {
    const results = this.index.search(query, {
      fields: {
        keyword: { bool: 'OR', boost: 1 },
        text: { bool: 'OR', boost: 2 },
        docString: { bool: 'OR', boost: 1 },
        dataTable: { bool: 'OR', boost: 1 },
      },
    })

    return results.map((result) => this.get(result.ref))
  }

  private get(ref: string): messages.Step {
    let rule = this.stepById.get(ref)
    if(!rule) throw new Error(`No step for ref ${ref}`)
    return rule
  }

  private static docStringToString(docString: messages.DocString): string {
    return docString.content
  }

  private static dataTableToString(dataTable: messages.DataTable): string {
    return dataTable.rows.map((row) => row.cells.map((cell) => cell.value).join(' ')).join(' ')
  }
}
