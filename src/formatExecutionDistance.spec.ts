import { expect } from 'chai'
import { add } from 'date-fns'

import { formatExecutionDistance } from './formatExecutionDistance.js'

describe('formatExecutionDistance', () => {
  const startDate = new Date(1639753096000)
  const examples: [text: string, referenceDate: Date][] = [
    ['1 hour ago', add(startDate, { hours: 1 })],
    ['3 hours ago', add(startDate, { hours: 3, minutes: 24, seconds: 18 })],
    ['1 day ago', add(startDate, { days: 1, hours: 3, minutes: 24, seconds: 18 })],
    ['15 days ago', add(startDate, { weeks: 2, days: 1 })],
  ]

  for (const [text, referenceDate] of examples) {
    it(`should format correctly for ${text}`, () => {
      expect(formatExecutionDistance(startDate, referenceDate)).to.eq(text)
    })
  }
})
