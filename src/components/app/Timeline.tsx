import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { type FC, useEffect, useMemo, useRef, useState } from 'react'
import { Button, Tooltip, TooltipTrigger } from 'react-aria-components'
import { useDebouncedCallback } from 'use-debounce'
import { formatExecutionDuration } from '../../formatExecutionDuration.js'
import { type TimelineItem, useTimelineData } from '../../hooks/useTimelineData.js'
import { StatusIcon } from '../gherkin/StatusIcon.js'
import statusName from '../gherkin/statusName.js'
import { Tags } from '../gherkin/Tags.js'
import { TestCaseOutcome } from '../results/index.js'
import styles from './Timeline.module.scss'

type Unit = {
  label: string
  magnitude: number
}

const pxPerUnit = 2

const AXIS_CONFIG = {
  minorInterval: 5, // Minor tick every N × magnitude ms
  majorInterval: 50, // Major tick every N × magnitude ms (must be a multiple of minorInterval)
  PANNING_SPEED: 5,
}

const axisUnits: Unit[] = [
  { label: `${1 * AXIS_CONFIG.minorInterval} ms`, magnitude: 1 },
  { label: `${10 * AXIS_CONFIG.minorInterval} ms`, magnitude: 10 },
  { label: `${50 * AXIS_CONFIG.minorInterval} ms`, magnitude: 50 },
  { label: `${100 * AXIS_CONFIG.minorInterval} ms`, magnitude: 100 },
  { label: `${500 * AXIS_CONFIG.minorInterval} ms`, magnitude: 500 },
  { label: `${1 * AXIS_CONFIG.minorInterval} s`, magnitude: 1 * 1000 },
  { label: `${10 * AXIS_CONFIG.minorInterval} s`, magnitude: 10 * 1000 },
  { label: `${30 * AXIS_CONFIG.minorInterval} s`, magnitude: 30 * 1000 },
  { label: `${1 * AXIS_CONFIG.minorInterval} min`, magnitude: 1 * 60 * 1000 },
  { label: `${10 * AXIS_CONFIG.minorInterval} min`, magnitude: 10 * 60 * 1000 },
  { label: `${30 * AXIS_CONFIG.minorInterval} min`, magnitude: 30 * 60 * 1000 },
  { label: `${1 * AXIS_CONFIG.minorInterval} hr`, magnitude: 1 * 60 * 60 * 1000 },
  { label: `${5 * AXIS_CONFIG.minorInterval} hr`, magnitude: 5 * 60 * 60 * 1000 },
  { label: `${10 * AXIS_CONFIG.minorInterval} hr`, magnitude: 10 * 60 * 60 * 1000 },
  { label: `${15 * AXIS_CONFIG.minorInterval} hr`, magnitude: 15 * 60 * 60 * 1000 },
  { label: `${20 * AXIS_CONFIG.minorInterval} hr`, magnitude: 20 * 60 * 60 * 1000 },
  { label: `${24 * AXIS_CONFIG.minorInterval} hr`, magnitude: 24 * 60 * 60 * 1000 },
]
export const Timeline: FC = () => {
  const { groups, fullStart, fullEnd } = useTimelineData()
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined)
  const [currentUnitIndex, setCurrentUnitIndex] = useState(0)

  const timelineWrapperRef = useRef<HTMLDivElement>(null)
  const axisStartRef = useRef<number>(fullStart)
  const axisUnitRef = useRef<number>(0)

  const selectedItem = useMemo(() => {
    if (!selectedId) {
      return null
    }

    for (const grp of groups) {
      const found = grp.items.find((item) => item.id === selectedId)
      if (found) {
        return found
      }
    }

    return null
  }, [groups, selectedId])

  useEffect(() => {
    if (timelineWrapperRef.current) {
      timelineWrapperRef.current.style.setProperty(
        '--magnitude',
        axisUnits[axisUnitRef.current].magnitude.toString()
      )
      timelineWrapperRef.current.style.setProperty('--axis-start', fullStart.toString())
    }
  }, [fullStart])

  return (
    <>
      <div className={styles.timelineWrapper} ref={timelineWrapperRef}>
        <TimelineAxis
          axisUnitRef={axisUnitRef}
          fullStart={fullStart}
          fullEnd={fullEnd}
          currentUnitIndex={currentUnitIndex}
          setCurrentUnitIndex={setCurrentUnitIndex}
          timelineWrapperRef={timelineWrapperRef}
          axisStartRef={axisStartRef}
        ></TimelineAxis>

        {groups.map((grp) => {
          return (
            <div key={grp.id} className={styles.timelineRow}>
              <div className={`${styles.cell} ${styles.leftCell}`}>{grp.label}</div>

              <div className={`${styles.timelineBarWrapper} ${styles.cell}`}>
                {bucketItems(grp.items, axisUnits[axisUnitRef.current].magnitude).map((itemIds) => {
                  return (
                    <TimelineBar
                      key={grp.items[itemIds[0]].id}
                      items={grp.items.slice(itemIds[0], itemIds[itemIds.length - 1] + 1)}
                      selectedId={selectedId}
                      setSelectedId={setSelectedId}
                    ></TimelineBar>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
      {selectedItem && (
        <TimelineDetail item={selectedItem} onClose={() => setSelectedId(undefined)} />
      )}
    </>
  )
}

const TimelineAxis: FC<{
  fullStart: number
  fullEnd: number
  currentUnitIndex: number
  setCurrentUnitIndex: React.Dispatch<React.SetStateAction<number>>
  axisStartRef: React.RefObject<number>
  timelineWrapperRef: React.RefObject<HTMLDivElement | null>
  axisUnitRef: React.RefObject<number>
}> = ({
  fullStart,
  fullEnd,
  currentUnitIndex,
  setCurrentUnitIndex,
  axisStartRef,
  timelineWrapperRef,
  axisUnitRef,
}) => {
  // const [currentUnitIndex, setCurrentUnitIndex] = useState(0)

  const axisRef = useRef<HTMLButtonElement>(null)
  const isDragging = useRef<boolean>(false)

  useEffect(() => {
    axisStartRef.current = fullStart
    axisUnitRef.current = 0
    setCurrentUnitIndex(0)
  }, [axisStartRef, fullStart, axisUnitRef, setCurrentUnitIndex])

  const checkAxisStartBounds = (magnitude: number) => {
    axisStartRef.current = Math.min(
      fullEnd + AXIS_CONFIG.majorInterval * magnitude,
      axisStartRef.current
    )
    axisStartRef.current = Math.max(
      fullStart - AXIS_CONFIG.majorInterval * magnitude,
      axisStartRef.current
    )
  }

  const handleAxisZoom = useDebouncedCallback((deltaY: number) => {
    if (!timelineWrapperRef?.current) {
      return
    }
    const zoomDirection = deltaY < 0 ? -1 : 1

    const newIndex =
      zoomDirection === 1
        ? Math.min(axisUnits.length - 1, axisUnitRef.current + 1)
        : Math.max(0, axisUnitRef.current - 1)

    axisUnitRef.current = newIndex
    timelineWrapperRef.current.style.setProperty(
      '--magnitude',
      axisUnits[newIndex].magnitude.toString()
    )

    // Check axis start for new zoom level
    checkAxisStartBounds(axisUnits[newIndex].magnitude)
    timelineWrapperRef.current.style.setProperty('--axis-start', axisStartRef.current.toString())

    setCurrentUnitIndex(newIndex)
  }, 100)

  useEffect(() => {
    const element = axisRef.current
    if (!element) {
      return
    }

    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      handleAxisZoom(event.deltaY)
    }

    element.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      element.removeEventListener('wheel', onWheel)
      handleAxisZoom.cancel()
    }
  }, [handleAxisZoom])

  const handleAxisPanning = (deltaX: number) => {
    if (!isDragging.current || !timelineWrapperRef?.current) {
      return
    }

    const newStart =
      deltaX < 0
        ? axisStartRef.current +
          axisUnits[axisUnitRef.current].magnitude * AXIS_CONFIG.PANNING_SPEED
        : axisStartRef.current -
          axisUnits[axisUnitRef.current].magnitude * AXIS_CONFIG.PANNING_SPEED

    axisStartRef.current = newStart
    checkAxisStartBounds(axisUnits[axisUnitRef.current].magnitude)

    timelineWrapperRef.current.style.setProperty('--axis-start', newStart.toString())
  }

  const ticks = useMemo(() => {
    const magnitude = axisUnits[currentUnitIndex].magnitude
    const minorInterval = AXIS_CONFIG.minorInterval * magnitude
    const minorStepsPerMajor = AXIS_CONFIG.majorInterval / AXIS_CONFIG.minorInterval

    const firstK = Math.floor(fullStart / minorInterval)
    const lastK = Math.ceil(fullEnd / minorInterval)

    const result: Array<{ time: number; isMajor: boolean }> = []
    for (let k = firstK; k <= lastK; k++) {
      const time = k * minorInterval
      const isMajor = k % minorStepsPerMajor === 0
      result.push({ time, isMajor })
    }
    return result
  }, [currentUnitIndex, fullStart, fullEnd])

  return (
    <div className={styles.timelineRow}>
      <div className={`${styles.cell} ${styles.leftCell}`}>
        <span className={styles.axisUnit}>1 Minor Tick = {axisUnits[currentUnitIndex].label}</span>
      </div>

      <Button
        ref={axisRef}
        className={`${styles.cell} ${styles.axisRuler}`}
        onMouseDown={() => {
          isDragging.current = true
        }}
        onMouseUp={() => {
          isDragging.current = false
        }}
        onMouseLeave={() => {
          isDragging.current = false
        }}
        onMouseMove={(e) => handleAxisPanning(e.movementX)}
      >
        {ticks.map(({ time, isMajor }) => (
          <div
            key={time}
            className={isMajor ? styles.majorTick : styles.minorTick}
            style={{
              transform: `translateX(calc(((${time} - var(--axis-start)) / var(--magnitude)) *${pxPerUnit} * 1px))`,
            }}
          >
            {isMajor && <span className={styles.tickLabel}>{formatTime(time)}</span>}
          </div>
        ))}
      </Button>
    </div>
  )
}

const TimelineBar: FC<{
  items: TimelineItem[]
  selectedId: string | undefined
  setSelectedId: (id: string | undefined) => void
}> = ({ items, selectedId, setSelectedId }) => {
  const start = items.reduce((acc, item) => Math.min(acc, item.start), Number.MAX_SAFE_INTEGER)
  const end = items.reduce((acc, item) => Math.max(acc, item.end), Number.MIN_SAFE_INTEGER)
  const status = items.length === 1 ? items[0].status : 'UNKNOWN'

  return (
    items.length && (
      <TooltipTrigger delay={500}>
        <Button
          type="button"
          className={`${styles.timelineBar} ${items.some((item) => item.id === selectedId) ? styles.selected : ''}`}
          style={{
            width: `calc( (max(${end - start}, var(--magnitude)) / var(--magnitude)) * ${pxPerUnit} * 1px)`,
            transform: `translateX(calc(((${start} - var(--axis-start)) / var(--magnitude)) *${pxPerUnit} * 1px))`,
          }}
          data-status={status}
          onClick={() => setSelectedId(items.length === 1 ? items[0].id : undefined)}
        ></Button>
        <Tooltip>
          {items.map((item) => {
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedId(item.id)}
                className={styles.tooltipBtn}
              >
                <span>
                  <StatusIcon status={item.status} />
                </span>
                <span>{item.scenario}</span>{' '}
              </button>
            )
          })}
        </Tooltip>
      </TooltipTrigger>
    )
  )
}

const TimelineDetail: FC<{ item: TimelineItem; onClose: () => void }> = ({ item, onClose }) => {
  return (
    <div className={styles.detail} data-testid="cucumber.timeline.detail">
      <button type="button" className={styles.detailClose} onClick={onClose} aria-label="Close">
        <FontAwesomeIcon aria-hidden="true" icon={faXmark} />
      </button>
      <h3 className={styles.detailTitle}>
        <StatusIcon status={item.status} />
        {item.scenario}
      </h3>
      {item.feature && <p className={styles.detailFeature}>{item.feature}</p>}
      <Tags tags={item.tags} />
      <dl className={styles.detailMeta}>
        <div>
          <dt>Status</dt>
          <dd>{statusName(item.status)}</dd>
        </div>
        <div>
          <dt>Start</dt>
          <dd>{formatTime(item.start)}</dd>
        </div>
        <div>
          <dt>End</dt>
          <dd>{formatTime(item.end)}</dd>
        </div>
        <div>
          <dt>Duration</dt>
          <dd>{formatExecutionDuration(new Date(item.start), new Date(item.end))}</dd>
        </div>
        <div>
          <dt>Worker</dt>
          <dd>{item.groupLabel}</dd>
        </div>
      </dl>
      <TestCaseOutcome testCaseStarted={item.testCaseStarted} />
    </div>
  )
}

function formatTime(time: number): string {
  const d = new Date(time)
  const formattedTime = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}:${d.getMilliseconds()}`
  return formattedTime
}

function bucketItems(items: TimelineItem[], minDuration: number) {
  const canMerge = (item1End: number, item2End: number) => {
    // Merge if both ends are in the range [n * minDuration, (n + 1) * minDuration)
    return Math.floor(item1End / minDuration) === Math.floor(item2End / minDuration)
  }

  const result: number[][] = []

  let i = 0
  while (i < items.length) {
    const bucket: number[] = []
    let bucketDuration = 0
    const bucketStart = items[i].start

    do {
      bucket.push(i)
      bucketDuration = items[i].end - bucketStart
      i++
    } while (
      i < items.length &&
      bucketDuration < minDuration &&
      canMerge(items[i - 1].end, items[i].end)
    )

    if (bucketDuration >= minDuration) {
      result.push(bucket)
    } else {
      // Try merging with left

      if (result.length > 0) {
        const leftBucket = result[result.length - 1]
        const leftBucketEnd = items[leftBucket[leftBucket.length - 1]].end
        const currentBucketEnd = items[bucket[bucket.length - 1]].end

        if (canMerge(leftBucketEnd, currentBucketEnd)) {
          result[result.length - 1].push(...bucket)
        } else {
          // Cannot merge with left
          result.push(bucket)
        }
      } else {
        // No adjacent bucket exist
        result.push(bucket)
      }
    }
  }

  return result
}
