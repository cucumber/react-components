import { type FC, useEffect, useRef, useState } from 'react'
import { DataSet } from 'vis-data'
import { Timeline as VisTimeline } from 'vis-timeline'
import { formatExecutionDuration } from '../../formatExecutionDuration.js'
import { type TimelineItem, useTimelineData } from '../../hooks/useTimelineData.js'
import { StatusIcon } from '../gherkin/StatusIcon.js'
import statusName from '../gherkin/statusName.js'
import { Tags } from '../gherkin/Tags.js'
import { TestCaseOutcome } from '../results/index.js'
import styles from './Timeline.module.scss'

import 'vis-timeline/styles/vis-timeline-graph2d.css'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type DataSetGroup = {
  id: string
  content: string
}

type DataSetItem = {
  id: string
  content: string
  group: string
  start: Date
  end: Date
  status: string
  className: string
}
export const Timeline: FC = () => {
  const { groups, items, fullStart, fullEnd, filtered } = useTimelineData()
  const [selectedId, setSelectedId] = useState<string | undefined>()

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    const dataSetGroups = new DataSet<DataSetGroup>()
    groups.forEach((g) => {
      dataSetGroups.add({ id: g.id, content: g.label })
    })

    const dataSetItems = new DataSet<DataSetItem>()
    items.forEach((i) => {
      dataSetItems.add({
        id: i.id,
        content: i.scenario,
        group: i.groupId,
        start: new Date(i.start),
        end: new Date(i.end),
        status: i.status,
        className: styles.visItem,
      })
    })

    const timeline = new VisTimeline(containerRef.current, dataSetItems, dataSetGroups, {
      stack: false,
      zoomable: true,
      moveable: true,
      selectable: true,
      editable: false,
      showCurrentTime: false,
      orientation: 'top',
      min: fullStart,
      max: fullEnd,
      start: fullStart,
      end: fullEnd,
      dataAttributes: ['status'],
    })

    timeline.on('select', (props: { items: string[] }) => {
      setSelectedId(props.items[0] ?? undefined)
    })

    return () => {
      timeline.destroy()
    }
  }, [fullStart, fullEnd, groups, items])

  if (items.length === 0) {
    return filtered ? (
      <p className={styles.empty}>No scenarios match your query and/or filters.</p>
    ) : (
      <p className={styles.empty}>No scenarios were executed.</p>
    )
  }

  const selectedItem = items.find((item) => item.id === selectedId)

  return (
    <div>
      <div ref={containerRef} className={styles.container} />
      {selectedItem && (
        <TimelineDetail item={selectedItem} onClose={() => setSelectedId(undefined)} />
      )}
    </div>
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
