import { expect } from 'chai'

import { formatPassRate } from './formatPassRate.js'

describe('formatPassRate', () => {
  const examples: [passed: number, total: number, percentage: string][] = [
    [13, 45, '29%'],
    [5, 45, '11%'],
    [45, 45, '100%'],
    [0, 45, '0%'],
    [0, 0, '0%'],
  ]

  for (const [passed, total, percentage] of examples) {
    it(`should render correctly for ${percentage} passed`, () => {
      expect(formatPassRate(passed, total)).to.eq(percentage)
    })
  }
})
