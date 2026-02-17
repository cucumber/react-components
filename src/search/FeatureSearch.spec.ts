import type { Feature, GherkinDocument } from '@cucumber/messages'
import { expect } from 'chai'

import { makeFeature } from '../../test/search.js'
import { createFeatureSearch } from './FeatureSearch.js'
import type { TypedIndex } from './types.js'

describe('FeatureSearch', () => {
  let featureSearch: TypedIndex<Feature, GherkinDocument>
  let gherkinDocument: GherkinDocument

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

      expect(searchResult).to.deep.eq([])
    })

    it('finds results with equal feature name', async () => {
      const searchResult = await featureSearch.search('this exists')

      expect(searchResult).to.deep.eq([gherkinDocument.feature])
    })

    it('finds results with substring of feature name', async () => {
      const searchResult = await featureSearch.search('exists')

      expect(searchResult).to.deep.eq([gherkinDocument.feature])
    })

    it('finds results with equal feature description', async () => {
      const searchResult = await featureSearch.search('description')

      expect(searchResult).to.deep.eq([gherkinDocument.feature])
    })
  })
})
