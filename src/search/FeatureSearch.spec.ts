import * as messages from '@cucumber/messages'

import { makeFeature } from '../../test-utils/index.js'
import FeatureSearch from './FeatureSearch.js'

describe('FeatureSearch', () => {
  let featureSearch: FeatureSearch
  let gherkinDocument: messages.GherkinDocument

  beforeEach(() => {
    featureSearch = new FeatureSearch()
    gherkinDocument = {
      uri: 'some/feature.file',
      comments: [],
      feature: makeFeature('this exists', 'description feature', []),
    }

    featureSearch.add(gherkinDocument)
  })

  describe('#search', () => {
    it('returns an empty array when there are no hits', () => {
      const searchResult = featureSearch.search('banana')

      expect(searchResult).toEqual([])
    })

    it('finds results with equal feature name', () => {
      const searchResult = featureSearch.search('this exists')

      expect(searchResult).toEqual([gherkinDocument.feature])
    })

    it('finds results with substring of feature name', () => {
      const searchResult = featureSearch.search('exists')

      expect(searchResult).toEqual([gherkinDocument.feature])
    })

    it('finds results with equal feature description', () => {
      const searchResult = featureSearch.search('description')

      expect(searchResult).toEqual([gherkinDocument.feature])
    })
  })
})
