import { expect } from 'chai'

import { formatStatusRate } from './formatStatusRate.js'

describe('formatStatusRate', () => {
  const examples: [passed: number, total: number, percentage: string][] = [
    [13, 45, '28.8%'],
    [5, 45, '11.1%'],
    [45, 45, '100%'],
    [0, 45, '0%'],
    [0, 0, '0%'],
    [999, 1000, '99.9%'],
    [99999, 100000, '99.9%'],
    [9999999, 10000000, '99.9%'],
  ]

  for (const [passed, total, percentage] of examples) {
    it(`should render correctly for ${percentage}`, () => {
      expect(formatStatusRate(passed, total)).to.eq(percentage)
    })
  }
})
