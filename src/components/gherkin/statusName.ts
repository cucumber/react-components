import type { TestStepResultStatus } from '@cucumber/messages'

export default (status: TestStepResultStatus): string => {
  return status.toLowerCase()
}
