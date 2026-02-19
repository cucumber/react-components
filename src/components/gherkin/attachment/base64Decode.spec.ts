import { expect } from 'chai'

import { base64DecodeBytes, base64DecodeText } from './base64Decode.js'

describe('base64DecodeText', () => {
  it('decodes ASCII base64 to the correct string', () => {
    expect(base64DecodeText(Buffer.from('hello').toString('base64'))).to.eq('hello')
  })

  it('decodes multi-byte UTF-8 (Cyrillic) base64 to the correct string', () => {
    const cyrillicText = 'СЧА ИРК'
    expect(base64DecodeText(Buffer.from(cyrillicText, 'utf-8').toString('base64'))).to.eq(
      cyrillicText
    )
  })

  it('decodes multi-byte UTF-8 (emoji) base64 to the correct string', () => {
    const emojiText = '🥒🌍'
    expect(base64DecodeText(Buffer.from(emojiText, 'utf-8').toString('base64'))).to.eq(emojiText)
  })

  it('throws on invalid base64 input', () => {
    expect(() => base64DecodeText('not valid base64!!!')).to.throw()
  })
})

describe('base64DecodeBytes', () => {
  it('decodes ASCII base64 to the correct bytes', () => {
    const original = Buffer.from('hello')
    const decoded = base64DecodeBytes(original.toString('base64'))
    expect(Array.from(decoded)).to.deep.eq(Array.from(original))
  })

  it('preserves byte accuracy for bytes > 127 (binary content)', () => {
    // These bytes are NOT valid UTF-8 text; a Unicode-aware decoder would corrupt them
    const original = new Uint8Array([0xc3, 0xa9, 0x00, 0xff, 0x80, 0xfe])
    const decoded = base64DecodeBytes(Buffer.from(original).toString('base64'))
    expect(Array.from(decoded)).to.deep.eq(Array.from(original))
  })

  it('preserves byte accuracy for a sequence that looks like multi-byte UTF-8', () => {
    // 0xC3 0xA9 is the UTF-8 encoding of é — as raw bytes they must survive unchanged
    const original = new Uint8Array([0xc3, 0xa9])
    const decoded = base64DecodeBytes(Buffer.from(original).toString('base64'))
    expect(Array.from(decoded)).to.deep.eq([0xc3, 0xa9])
  })

  it('throws on invalid base64 input', () => {
    expect(() => base64DecodeBytes('not valid base64!!!')).to.throw()
  })
})
