import * as messages from '@cucumber/messages'
import { Feature, GherkinDocument } from '@cucumber/messages'

import { makeFeature } from '../../test-utils/index.js'
import { createFeatureSearch } from './FeatureSearch.js'
import { TypedIndex } from './types.js'

describe('FeatureSearch', () => {
  let featureSearch: TypedIndex<Feature, GherkinDocument>
  let gherkinDocument: messages.GherkinDocument

  beforeEach(async () => {
    featureSearch = await createFeatureSearch()
    gherkinDocument = {
      uri: 'some/feature.file',
      comments: [],
      feature: makeFeature('this exists', 'description feature', []),
    }
    await featureSearch.add(gherkinDocument)
  })

  describe('#search', () => {
    it('returns an empty array when there are no hits', async () => {
      const searchResult = await featureSearch.search('banana')

      expect(searchResult).toEqual([])
    })

    it('finds results with equal feature name', async () => {
      const searchResult = await featureSearch.search('this exists')

      expect(searchResult).toEqual([gherkinDocument.feature])
    })

    it('finds results with substring of feature name', async () => {
      const searchResult = await featureSearch.search('exists')

      expect(searchResult).toEqual([gherkinDocument.feature])
    })

    it('finds results with equal feature description', async () => {
      const searchResult = await featureSearch.search('description')

      expect(searchResult).toEqual([gherkinDocument.feature])
    })
  })
})
