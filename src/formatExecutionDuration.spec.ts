import { expect } from 'chai'
import { add, addMilliseconds } from 'date-fns'

import { formatExecutionDuration } from './formatExecutionDuration.js'

describe('formatExecutionDuration', () => {
  const startDate = new Date(1639753096000)
  const examples: [text: string, finishDate: Date][] = [
    ['1 hour 45 minutes 23 seconds', add(startDate, { hours: 1, minutes: 45, seconds: 23 })],
    ['12 minutes 15 seconds', add(startDate, { minutes: 12, seconds: 15 })],
    ['10 seconds', add(startDate, { seconds: 10.01 })],
    ['9.88 seconds', addMilliseconds(startDate, 9876)],
    ['6.54 seconds', addMilliseconds(startDate, 6543)],
  ]

  for (const [text, finishDate] of examples) {
    it(`should render correctly for ${text}`, () => {
      expect(formatExecutionDuration(startDate, finishDate)).to.eq(text)
    })
  }
})
