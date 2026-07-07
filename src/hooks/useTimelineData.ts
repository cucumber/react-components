import {
  type PickleTag,
  type TestCaseStarted,
  TestStepResultStatus,
  TimeConversion,
} from '@cucumber/messages'
import { useMemo } from 'react'

import { useQueries } from './useQueries.js'
import { useSearch } from './useSearch.js'

export interface TimelineItem {
  readonly id: string
  readonly groupId: string
  readonly groupLabel: string
  readonly feature: string
  readonly scenario: string
  readonly tags: readonly PickleTag[]
  readonly status: TestStepResultStatus
  readonly start: number
  readonly end: number
  readonly testCaseStarted: TestCaseStarted
}

export interface TimelineGroup {
  readonly id: string
  readonly label: string
}

export interface TimelineData {
  readonly groups: readonly TimelineGroup[]
  readonly items: readonly TimelineItem[]
  readonly start: number
  readonly end: number
  readonly filtered: boolean
}

const UNASSIGNED_GROUP_ID = ''

export function useTimelineData(): TimelineData {
  const { cucumberQuery } = useQueries()
  const { hideStatuses, tagExpression, searchTerm, unchanged } = useSearch()

  return useMemo(() => {
    const items: TimelineItem[] = []
    const groupIds = new Set<string>()
    const normalizedSearchTerm = searchTerm?.trim().toLowerCase()

    for (const testCaseFinished of cucumberQuery.findAllTestCaseFinished()) {
      const testCaseStarted = cucumberQuery.findTestCaseStartedBy(testCaseFinished)
      if (!testCaseStarted) {
        continue
      }
      const pickle = cucumberQuery.findPickleBy(testCaseStarted)
      if (!pickle) {
        continue
      }

      // A test case with no step results at all is considered passed by definition
      const status =
        cucumberQuery.findMostSevereTestStepResultBy(testCaseFinished)?.status ??
        TestStepResultStatus.PASSED

      if (hideStatuses.includes(status)) {
        continue
      }

      if (tagExpression) {
        const tagNames = pickle.tags.map((tag) => tag.name)
        if (!tagExpression.evaluate(tagNames)) {
          continue
        }
      }

      const feature = cucumberQuery.findLineageBy(testCaseStarted)?.feature?.name ?? ''
      const scenario = pickle.name

      if (
        normalizedSearchTerm &&
        !`${feature} ${scenario}`.toLowerCase().includes(normalizedSearchTerm)
      ) {
        continue
      }

      const groupId = testCaseStarted.workerId ?? UNASSIGNED_GROUP_ID
      groupIds.add(groupId)

      items.push({
        id: testCaseStarted.id,
        groupId,
        groupLabel: describeGroup(groupId),
        feature,
        scenario,
        tags: pickle.tags,
        status,
        start: TimeConversion.timestampToMillisecondsSinceEpoch(testCaseStarted.timestamp),
        end: TimeConversion.timestampToMillisecondsSinceEpoch(testCaseFinished.timestamp),
        testCaseStarted,
      })
    }

    items.sort((a, b) => a.start - b.start || a.end - b.end)

    const groups: TimelineGroup[] = [...groupIds]
      .sort(compareGroupIds)
      .map((id) => ({ id, label: describeGroup(id) }))

    const start = items.length > 0 ? Math.min(...items.map((item) => item.start)) : 0
    const end = items.length > 0 ? Math.max(...items.map((item) => item.end)) : 0

    return { groups, items, start, end, filtered: !unchanged }
  }, [cucumberQuery, hideStatuses, tagExpression, searchTerm, unchanged])
}

function describeGroup(id: string): string {
  return id === UNASSIGNED_GROUP_ID ? 'Main process' : `Worker ${id}`
}

function compareGroupIds(a: string, b: string): number {
  if (a === UNASSIGNED_GROUP_ID) {
    return -1
  }
  if (b === UNASSIGNED_GROUP_ID) {
    return 1
  }
  const aNum = Number(a)
  const bNum = Number(b)
  if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
    return aNum - bNum
  }
  return a.localeCompare(b)
}
