import {
  type PickleTag,
  type TestCaseStarted,
  TestStepResultStatus,
  TimeConversion,
} from '@cucumber/messages'
import { useMemo } from 'react'
import { useFilteredTestCases } from './useFilteredTestCases.js'
import { useQueries } from './useQueries.js'

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
  readonly items: TimelineItem[]
}

export interface TimelineData {
  readonly groups: readonly TimelineGroup[]
  readonly fullStart: number
  readonly fullEnd: number
}

const UNASSIGNED_GROUP_ID = ''

export function useTimelineData(): TimelineData {
  const { cucumberQuery } = useQueries()

  const finishedTestCases = useFilteredTestCases()
  return useMemo(() => {
    const groupMap: Record<string, TimelineGroup> = {}
    let fullStart: number = Number.MAX_SAFE_INTEGER
    let fullEnd: number = Number.MIN_SAFE_INTEGER

    for (const testCaseFinished of finishedTestCases) {
      const testCaseStarted = cucumberQuery.findTestCaseStartedBy(testCaseFinished.testCaseEvent)
      if (!testCaseStarted) {
        continue
      }
      const pickle = testCaseFinished.pickle
      if (!pickle) {
        continue
      }

      const itemStart = TimeConversion.timestampToMillisecondsSinceEpoch(testCaseStarted.timestamp)
      const itemEnd = TimeConversion.timestampToMillisecondsSinceEpoch(
        testCaseFinished.testCaseEvent.timestamp
      )

      if (itemStart < fullStart) {
        fullStart = itemStart
      }
      if (fullEnd === undefined || itemEnd > fullEnd) {
        fullEnd = itemEnd
      }

      // A test case with no step results at all is considered passed by definition
      const status =
        cucumberQuery.findMostSevereTestStepResultBy(testCaseFinished.testCaseEvent)?.status ??
        TestStepResultStatus.PASSED

      const feature = testCaseFinished.lineage.feature?.name ?? ''
      const scenario = pickle.name

      const groupId = testCaseStarted.workerId ?? UNASSIGNED_GROUP_ID


      const item = {
        id: testCaseStarted.id,
        groupId,
        groupLabel: describeGroup(groupId),
        feature,
        scenario,
        tags: pickle.tags,
        status,
        start: itemStart,
        end: itemEnd,
        testCaseStarted,
      }

      if(groupMap[groupId]) {
        groupMap[groupId].items.push(item)
      } else {
        groupMap[groupId] = {id: groupId, label: describeGroup(groupId), items: [item]}
      }
    }

    for(const grp of Object.values(groupMap)) {
      grp.items.sort((a, b) => a.start - b.start || a.end - b.end)
    }

    const groups: TimelineGroup[] = Object.values(groupMap);
    groups.sort((a, b) => compareGroupIds(a.id, b.id))

    return { groups, fullStart, fullEnd }
  }, [cucumberQuery, finishedTestCases])
}

function describeGroup(id: string): string {
  return id === UNASSIGNED_GROUP_ID ? '' : `Worker ${id}`
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
