import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { type FC, useEffect, useRef, useState } from 'react'
import { Button, OverlayArrow, Tooltip, TooltipTrigger } from 'react-aria-components'
import { formatExecutionDuration } from '../../formatExecutionDuration.js'
import { type TimelineItem, useTimelineData } from '../../hooks/useTimelineData.js'
import { StatusIcon } from '../gherkin/StatusIcon.js'
import statusName from '../gherkin/statusName.js'
import { Tags } from '../gherkin/Tags.js'
import { TestCaseOutcome } from '../results/index.js'
import styles from './Timeline.module.scss'
import { useDebouncedCallback } from 'use-debounce'

type unit = {
  label: string
  magnitude: number
}

const axisUnits: unit[] = [
  { label: '1 ms', magnitude: 1 },
  { label: '10 ms', magnitude: 10 },
  { label: '50 ms', magnitude: 50 },
  { label: '100 ms', magnitude: 100 },
  { label: '500 ms', magnitude: 500 },
  { label: '1 s', magnitude: 1 * 1000 },
  { label: '10 s', magnitude: 10 * 1000 },
  { label: '30 s', magnitude: 30 * 1000 },
  { label: '1 min', magnitude: 1 * 60 * 1000 },
  { label: '10 min', magnitude: 10 * 60 * 1000 },
  { label: '30 min', magnitude: 30 * 60 * 1000 },
  { label: '1 hr', magnitude: 1 * 60 * 60 * 1000 },
]

const pxPerUnit = 2

export const Timeline: FC = () => {
  const { groups, items, fullStart, fullEnd } = useTimelineData()
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined)
  const [rowWidthPx, setRowWidthPx] = useState(0);
  
  const timelineWrapperRef = useRef<HTMLDivElement>(null)
  const axisStartRef = useRef<number>(fullStart)
  const axisUnitRef = useRef<number>(0)

  const selectedItem = items.find((item) => item.id === selectedId)

  useEffect(() => {
    if (timelineWrapperRef.current) {
      console.log(`${fullStart} loaded`)
      timelineWrapperRef.current.style.setProperty('--magnitude', axisUnits[axisUnitRef.current].magnitude.toString())
      timelineWrapperRef.current.style.setProperty('--axis-start', axisStartRef.current.toString())
    }
  }, [fullStart])

  return (
    <>
      <div className={styles.timelineWrapper} ref={timelineWrapperRef}>
        <TimelineAxis
          axisUnitRef={axisUnitRef}
          setRowWidthPx={setRowWidthPx}
          fullStart={fullStart}
          fullEnd={fullEnd}
          timelineWrapperRef={timelineWrapperRef}
          axisStartRef={axisStartRef}
        ></TimelineAxis>

        {groups.map((grp) => {
          return (
            <div key={grp.id} className={styles.timelineRow}>
              <div className={`${styles.cell} ${styles.workerCell}`}>{grp.label}</div>

              
              <div className={`${styles.workerRow} ${styles.cell}`}>
                {items
                  .filter((i) => i.groupId === grp.id)
                  .map((item) => {
                    if (rowWidthPx === 0) {
                      return null
                    }
                    return (
                      <TimelineBar
                        key={item.id}
                        item={item}
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
  setRowWidthPx: React.Dispatch<React.SetStateAction<number>>
  fullStart: number
  fullEnd: number
  axisStartRef: React.RefObject<number>
  timelineWrapperRef: React.RefObject<HTMLDivElement | null>
  axisUnitRef: React.RefObject<number>
}> = ({ setRowWidthPx, fullStart, fullEnd, axisStartRef, timelineWrapperRef, axisUnitRef }) => {
  const axisRef = useRef<HTMLButtonElement>(null)
  const isDragging = useRef<boolean>(false);

  useEffect(() => {

    axisStartRef.current = fullStart;
    axisUnitRef.current = 0;

    const element = axisRef.current
    if (!element) {
      return
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setRowWidthPx(entry.contentRect.width)
      }
    })

    observer.observe(element)
    return () => observer.disconnect()
  }, [setRowWidthPx, axisStartRef, fullStart, axisUnitRef])

  // Regisetering Handle Zoom Callback
  const handleAxisZoom = useDebouncedCallback((deltaY: number) => {
    if(!timelineWrapperRef?.current || !axisRef.current) {
      return;
    }
    const zoomDirection = deltaY < 0 ? -1 : 1

    let newAxisUnitIndex = 0;
    if (zoomDirection === 1) {
      newAxisUnitIndex = Math.min(axisUnits.length - 1, axisUnitRef.current + 1)
    } else {
      newAxisUnitIndex = Math.max(0, axisUnitRef.current - 1)
    }

    axisUnitRef.current = newAxisUnitIndex;

    axisRef.current.textContent = `Axis Unit: ${axisUnits[newAxisUnitIndex].label}`
    timelineWrapperRef.current.style.setProperty('--magnitude', axisUnits[newAxisUnitIndex].magnitude.toString());
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
    if(!isDragging.current || !timelineWrapperRef?.current) {
      return;
    }
    
    let newStart = 0;
    if(deltaX < 0) {
      newStart = Math.min(fullEnd, axisStartRef.current + axisUnits[axisUnitRef.current].magnitude)
    } else {
      newStart = Math.max(fullStart, axisStartRef.current - axisUnits[axisUnitRef.current].magnitude)
    }

    axisStartRef.current = newStart;
    timelineWrapperRef.current.style.setProperty('--axis-start', newStart.toString());
  } 

  return (
    <div className={styles.timelineRow}>
      <div className={`${styles.cell} ${styles.workerCell}`}></div>
      <Button ref={axisRef} className={`${styles.cell} ${styles.axis}`} type='button' onMouseDown={(_e) => isDragging.current = true} onMouseUp={(_e) => isDragging.current = false} onMouseMove={(e) => handleAxisPanning(e.movementX)}>
        {`Axis Unit: ${axisUnits[axisUnitRef.current].label}`}
      </Button>
    </div>
  )
}

const TimelineBar: FC<{
  item: TimelineItem
  selectedId: string | undefined
  setSelectedId: (id: string) => void
}> = ({ item, selectedId, setSelectedId }) => {
  return (
    <TooltipTrigger key={item.id} delay={500}>
      <Button
        type="button"
        className={`${styles.timelineBar} ${item.id === selectedId ? styles.selected : ''}`}
        style={{ width: `calc( ( (${item.end - item.start + 1}) / var(--magnitude)) *${pxPerUnit} * 1px)`, marginLeft: `calc(((${item.start} - var(--axis-start)) / var(--magnitude)) *${pxPerUnit} * 1px)` }}
        data-status={item.status}
        onClick={(_e) => setSelectedId(item.id)} 
      ></Button>
      <Tooltip>
        <OverlayArrow className={styles.OverlayArrow}>
          <svg width={8} height={8} viewBox="0 0 8 8">
            <title>Tooltip Arrow</title>
            <path d="M0 0 L4 4 L8 0" />
          </svg>
        </OverlayArrow>
        <span>
          <StatusIcon status={item.status} />
        </span>
        <span>{item.scenario}</span>
      </Tooltip>
    </TooltipTrigger>
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
          <dd>{item.start}</dd>
        </div>
        <div>
<div>
          <dt>End</dt>
          <dd>{item.end}</dd>
        </div>
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
