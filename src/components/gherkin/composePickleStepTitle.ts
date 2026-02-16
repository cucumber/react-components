import type { StepMatchArgumentsList } from '@cucumber/messages'

interface TitleFragment {
  value: string
  parameterTypeName?: string
}

export function composePickleStepTitle(
  text: string,
  stepMatchArgumentsLists?: ReadonlyArray<StepMatchArgumentsList>
): ReadonlyArray<TitleFragment> {
  if (stepMatchArgumentsLists?.length === 1) {
    const stepMatchArguments = stepMatchArgumentsLists[0].stepMatchArguments
    let offset = 0
    let plain: string
    const fragments: TitleFragment[] = []
    for (const argument of stepMatchArguments) {
      plain = text.slice(offset, argument.group.start)
      if (plain.length > 0) {
        fragments.push({ value: plain })
      }
      const arg = argument.group.value
      if (arg) {
        if (arg.length > 0) {
          fragments.push({
            value: arg,
            parameterTypeName: argument.parameterTypeName || 'anonymous',
          })
        }
        offset += plain.length + arg.length
      }
    }
    plain = text.slice(offset)
    if (plain.length > 0) {
      fragments.push({ value: plain })
    }
    return fragments
  }
  // no argument matching, just a single text value
  return [
    {
      value: text,
    },
  ]
}
