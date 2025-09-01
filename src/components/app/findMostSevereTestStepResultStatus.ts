import { TestStepResultStatus } from '@cucumber/messages'

export function findMostSevereTestStepResultStatus(
  statuses: Iterable<TestStepResultStatus>
): TestStepResultStatus {
  return (
    [...statuses].sort((a, b) => statusOrdinal(a) - statusOrdinal(b)).at(-1) ??
    TestStepResultStatus.UNKNOWN
  )
}

function statusOrdinal(status: TestStepResultStatus) {
  return [
    TestStepResultStatus.UNKNOWN,
    TestStepResultStatus.PASSED,
    TestStepResultStatus.SKIPPED,
    TestStepResultStatus.PENDING,
    TestStepResultStatus.UNDEFINED,
    TestStepResultStatus.AMBIGUOUS,
    TestStepResultStatus.FAILED,
  ].indexOf(status)
}
