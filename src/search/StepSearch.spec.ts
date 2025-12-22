import * as messages from '@cucumber/messages'
import { Step } from '@cucumber/messages'
import { expect } from 'chai'

import { makeStep } from '../../test/search.js'
import { createStepSearch } from './StepSearch.js'
import { TypedIndex } from './types.js'

describe('StepSearch', () => {
  let stepSearch: TypedIndex<Step>
  let steps: messages.Step[]

  beforeEach(async () => {
    stepSearch = await createStepSearch()

    steps = [
      makeStep('Given', 'a passed step', 'There is a docstring here'),
      makeStep('When', 'another passed step'),
      makeStep('Then', 'a failed step', '', [
        ['name', 'value'],
        ['errorType', 'NullPointerException'],
        ['message', 'Something really bad hapenned here'],
      ]),
    ]

    for (const step of steps) {
      await stepSearch.add(step)
    }
  })

  describe('#search', () => {
    it('returns an empty list when there is no hits', async () => {
      const searchResults = await stepSearch.search('no match')
      expect(searchResults).to.deep.eq([])
    })

    it('returns step which text match the query', async () => {
      const searchResults = await stepSearch.search('failed')
      expect(searchResults).to.deep.eq([steps[2]])
    })

    it('may not return results in the original order', async () => {
      const searchResults = await stepSearch.search('step')

      for (const step of steps) {
        expect(searchResults).to.contain(step)
      }
    })

    it('returns step which keyword match the query', async () => {
      for (const step of steps) {
        const searchResults = await stepSearch.search(step.keyword)
        expect(searchResults).to.deep.eq([step])
      }
    })

    it('returns step which DocString matches the query', async () => {
      const searchResults = await stepSearch.search('docstring')
      expect(searchResults).to.deep.eq([steps[0]])
    })

    it('returns step which datatable matches the query', async () => {
      const searchResults = await stepSearch.search('NullPointerException')
      expect(searchResults).to.deep.eq([steps[2]])
    })
  })
})
