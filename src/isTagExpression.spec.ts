import isTagExpression from './isTagExpression'

describe('isTagExpression', () => {
  it('returns false with empty string', () => {
    expect(isTagExpression('')).toBe(false)
  })

  it('returns false when there is no tag in the expression', () => {
    expect(isTagExpression('Something')).toBe(false)
  })

  it('returns true when with a tag', () => {
    expect(isTagExpression('@something')).toBe(true)
  })

  it('is pretty permissive on what a tag is', () => {
    expect(isTagExpression('@&é"(§è!çà)-')).toBe(true)
  })

  it('accepts spaces around the tag', () => {
    expect(isTagExpression('  @something  ')).toBe(true)
  })

  it('recognises "and", "or" and "not" keywords', () => {
    expect(isTagExpression('@2b or not @2b')).toBe(true)
    expect(isTagExpression('@turner and @hootch')).toBe(true)
  })

  it('needs non-keywords to be tags to be recognized as tag expressions', () => {
    expect(isTagExpression('2b or not 2b')).toBe(false)
    expect(isTagExpression('turner and hootch')).toBe(false)
  })

  it('accepts parenthesis in an expression', () => {
    expect(isTagExpression('(@2b or not @2b) and @true')).toBe(true)
  })

  it('does not ensure parenthesis are correctly written that said ...', () => {
    expect(isTagExpression('((((@2b or )not @2b) and @true')).toBe(true)
  })
})
