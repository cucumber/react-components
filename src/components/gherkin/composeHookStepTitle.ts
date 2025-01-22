import { Hook, HookType } from '@cucumber/messages'

const labels: Record<HookType, string> = {
  [HookType.BEFORE_TEST_RUN]: 'BeforeAll',
  [HookType.BEFORE_TEST_CASE]: 'Before',
  [HookType.BEFORE_TEST_STEP]: 'BeforeStep',
  [HookType.AFTER_TEST_STEP]: 'AfterStep',
  [HookType.AFTER_TEST_CASE]: 'After',
  [HookType.AFTER_TEST_RUN]: 'AfterAll',
}

export function composeHookStepTitle(hook?: Hook): string {
  let result = ''

  if (hook?.type) {
    result = labels[hook.type]
  } else {
    result += 'Hook'
  }

  if (hook?.name) {
    result += ': ' + hook.name
  }

  return result
}
