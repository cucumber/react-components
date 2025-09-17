// Lifted from cucumber-expressions/javascript/src/ParameterTypeRegistry#FLOAT_REGEXP
// Modified to allow spaces, commas and periods as decimal- and/or as thousand-separators
const numberPattern = /^(?=.*\d.*)[-+]?\d*(?:[., ](?=\d.*)\d*)*(?:\d+E[+-]?\d+)?$/

export default function isNumber(s: string): boolean {
  return !!s.match(numberPattern)
}
