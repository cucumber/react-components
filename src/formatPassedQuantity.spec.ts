import { expect } from 'chai'

import { formatPassedQuantity } from './formatPassedQuantity.js'

describe('formatPassedQuantity', () => {
  const examples: [passed: number, total: number, proportion: string][] = [
    [13, 45, '(13 / 45)'],
    [5, 45, '(5 / 45)'],
    [45, 45, '(45 / 45)'],
    [0, 45, '(0 / 45)'],
    [0, 0, '(0 / 0)'],
    [999, 1000, '(999 / 1000)'],
    [99999, 100000, '(99999 / 100000)'],
    [9999999, 10000000, '(9999999 / 10000000)'],
  ]

  for (const [passed, total, proportion] of examples) {
    it(`should render correctly for ${proportion}`, () => {
      expect(formatPassedQuantity(passed, total)).to.eq(proportion)
    })
  }
})
