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

export const Timeline: FC = () => {
  const { groups, items, fullStart, fullEnd, filtered } = useTimelineData()
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined)
  const [axisUnitIndex, setAxisUnitIndex] = useState(1);
  const [axisStart, setAxisStart] = useState<number | undefined>(undefined);
  const [rowWidthPx, setRowWidthPx] = useState(0);
  const pxPerUnit = 20

  const selectedItem = items.find((item) => item.id === selectedId)

  return (
    <>
      <div className={styles.timelineWrapper}>
        <TimelineAxis
          axisUnitIndex={axisUnitIndex}
          setAxisUnitIndex={setAxisUnitIndex}
          setRowWidthPx={setRowWidthPx}
          axisStart={axisStart ?? 0}
          setAxisStart={setAxisStart}
          fullStart={fullStart}
          fullEnd={fullEnd}
        ></TimelineAxis>

        {groups.map((grp) => {
          let pre = axisStart ?? 0;
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

                    const magnitude = axisUnits[axisUnitIndex].magnitude
                    const duration = item.end - item.start

                    const widthInUnits = duration / magnitude
                    const leftOffsetInUnits = (item.start - (pre)) / magnitude

                    const widthInPx = widthInUnits * pxPerUnit
                    const leftOffsetInPx = leftOffsetInUnits * pxPerUnit

                    const widthPercent = (widthInPx / rowWidthPx) * 100
                    const leftPercent = (leftOffsetInPx / rowWidthPx) * 100

                    pre = item.end;

                    return (
                      <TimelineBar
                        key={item.id}
                        item={item}
                        width={widthPercent}
                        left={leftPercent}
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
  axisUnitIndex: number
  setAxisUnitIndex: React.Dispatch<React.SetStateAction<number>>
  setRowWidthPx: React.Dispatch<React.SetStateAction<number>>
  fullStart: number
  fullEnd: number
  axisStart: number
  setAxisStart: React.Dispatch<React.SetStateAction<number>>
}> = ({ axisUnitIndex, setAxisUnitIndex, setRowWidthPx, fullStart, fullEnd, axisStart, setAxisStart }) => {
  const axisRef = useRef<HTMLButtonElement>(null)
  const isDragging = useRef<boolean>(false);

  // Setting Axis Start
  useEffect(() => {

    setAxisStart(fullStart);

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
  }, [setRowWidthPx, setAxisStart, fullStart])

  // Regisetering Handle Zoom Callback
  useEffect(() => {
    const element = axisRef.current
    if (!element) {
      return
    }

    const handleAxisZoom = (e: WheelEvent) => {
      const zoomDirection = e.deltaY < 0 ? -1 : 1
      e.preventDefault()

      if (zoomDirection === 1) {
        setAxisUnitIndex((prev) => Math.min(axisUnits.length - 1, prev + 1))
      } else {
        setAxisUnitIndex((prev) => Math.max(0, prev - 1))
      }
    }

    element.addEventListener('wheel', handleAxisZoom, { passive: false })

    return () => {
      element.removeEventListener('wheel', handleAxisZoom)
    }
  })


  const handleAxisPanning = (deltaX: number) => {
    if(!isDragging.current) {
      return;
    }
    
    if(deltaX < 0) {
      setAxisStart(prev => Math.min(fullEnd, prev + axisUnits[axisUnitIndex].magnitude));
    } else {
      setAxisStart(prev => Math.max(fullStart, prev - axisUnits[axisUnitIndex].magnitude));
    }
  } 

  return (
    <div className={styles.timelineRow}>
      <div className={`${styles.cell} ${styles.workerCell}`}></div>
      <Button ref={axisRef} className={`${styles.cell} ${styles.axis}`} type='button' onMouseDown={(_e) => isDragging.current = true} onMouseUp={(_e) => isDragging.current = false} onMouseMove={(e) => handleAxisPanning(e.movementX)}>
        {`Axis Unit: ${axisUnits[axisUnitIndex].label}`}
      </Button>
    </div>
  )
}

const TimelineBar: FC<{
  item: TimelineItem
  width: number
  left: number
  selectedId: string | undefined
  setSelectedId: (id: string) => void
}> = ({ item, width, left, selectedId, setSelectedId }) => {
  return (
    <TooltipTrigger key={item.id} delay={500}>
      <Button
        type="button"
        className={`${styles.timelineBar} ${item.id === selectedId ? styles.selected : ''}`}
        style={{ width: `${width}%`, marginLeft: `${left}%` }}
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
