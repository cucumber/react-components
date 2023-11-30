import { expect } from 'chai'

import isTagExpression from './isTagExpression.js'

describe('isTagExpression', () => {
  it('returns false with empty string', () => {
    expect(isTagExpression('')).to.eq(false)
  })

  it('returns false when there is no tag in the expression', () => {
    expect(isTagExpression('Something')).to.eq(false)
  })

  it('returns true when with a tag', () => {
    expect(isTagExpression('@something')).to.eq(true)
  })

  it('is pretty permissive on what a tag is', () => {
    expect(isTagExpression('@&é"(§è!çà)-')).to.eq(true)
  })

  it('accepts spaces around the tag', () => {
    expect(isTagExpression('  @something  ')).to.eq(true)
  })

  it('recognises "and", "or" and "not" keywords', () => {
    expect(isTagExpression('@2b or not @2b')).to.eq(true)
    expect(isTagExpression('@turner and @hootch')).to.eq(true)
  })

  it('needs non-keywords to be tags to be recognized as tag expressions', () => {
    expect(isTagExpression('2b or not 2b')).to.eq(false)
    expect(isTagExpression('turner and hootch')).to.eq(false)
  })

  it('accepts parenthesis in an expression', () => {
    expect(isTagExpression('(@2b or not @2b) and @true')).to.eq(true)
  })

  it('does not ensure parenthesis are correctly written that said ...', () => {
    expect(isTagExpression('((((@2b or )not @2b) and @true')).to.eq(true)
  })
})
