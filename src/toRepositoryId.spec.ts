import toRepositoryId from './toRepositoryId'

const testData = [
  ['github.com/owner/name', 'https://github.com/owner/name'],
  ['github.com/owner/name', 'git+ssh://git@github.com/owner/name.git'],
  ['github.com/owner/name', 'git@github.com:owner/name.git'],
]

describe('toRepositoryId', () => {
  for (const [expected, url] of testData) {
    it(`parses ${url} to ${expected}`, () => {
      const repositoryId = toRepositoryId(url)
      expect(repositoryId).toEqual(expected)
    })
  }
})
