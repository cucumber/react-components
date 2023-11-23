import * as messages from '@cucumber/messages'
import { Step } from '@cucumber/messages'

import { makeStep } from '../../test-utils'
import { createStepSearch } from './StepSearch'
import { TypedIndex } from './types'

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
    // TODO 'there' is being matched against 'here'
    xit('returns an empty list when there is no hits', async () => {
      const searchResults = await stepSearch.search('no match there')
      expect(searchResults).toEqual([])
    })

    it('returns step which text match the query', async () => {
      const searchResults = await stepSearch.search('failed')
      expect(searchResults).toEqual([steps[2]])
    })

    it('may not return results in the original order', async () => {
      const searchResults = await stepSearch.search('step')

      for (const step of steps) {
        expect(searchResults).toContain(step)
      }
    })

    it('returns step which keyword match the query', async () => {
      const searchResults = await stepSearch.search('Given')
      expect(searchResults).toEqual([steps[0]])
    })

    xit('it does not exclude "Then" and "When" from indexing', () => {
      // By default, ElasticLurn exclude some words from indexing/searching,
      // amongst them are 'Then' and 'When'.
      // See: http://elasticlunr.com/docs/stop_word_filter.js.html#resetStopWords
    })

    it('returns step which DocString matches the query', async () => {
      const searchResults = await stepSearch.search('docstring')
      expect(searchResults).toEqual([steps[0]])
    })

    it('returns step which datatable matches the query', async () => {
      const searchResults = await stepSearch.search('NullPointerException')
      expect(searchResults).toEqual([steps[2]])
    })
  })
})
