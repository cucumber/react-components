import { expect } from 'chai'

import isNumber from './isNumber.js'

describe('isNumber is true', () => {
  const numbers = ['1', '-1', '10', '1.0', '.0', '1,0', '1 000,00', '127.0.0.0', '10E-05', '10E+05']

  numbers.forEach((value) => {
    it(`${value}`, () => {
      expect(isNumber(value)).to.be.true
    })
  })
})
describe('isNumber is false', () => {
  const nonNumbers = ['hello', 'hello world', '-', '+', '1.', '1,', 'Ramayan 3392 A.D.', 'E+10']

  nonNumbers.forEach((value) => {
    it(`${value}`, () => {
      expect(isNumber(value)).to.be.false
    })
  })
})
