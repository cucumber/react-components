import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { type FC, useState } from 'react'

import { formatExecutionDuration } from '../../formatExecutionDuration.js'
import { type TimelineItem, useTimelineData } from '../../hooks/useTimelineData.js'
import { StatusIcon } from '../gherkin/StatusIcon.js'
import statusName from '../gherkin/statusName.js'
import { Tags } from '../gherkin/Tags.js'
import styles from './Timeline.module.scss'

const AXIS_TICKS = 4

export const Timeline: FC = () => {
  const { groups, items, start, end, filtered } = useTimelineData()
  const [selectedId, setSelectedId] = useState<string>()

  if (items.length === 0) {
    return filtered ? (
      <p className={styles.empty}>No scenarios match your query and/or filters.</p>
    ) : (
      <p className={styles.empty}>No scenarios were executed.</p>
    )
  }

  const duration = Math.max(end - start, 1)
  const ticks = Array.from({ length: AXIS_TICKS + 1 }, (_, index) => {
    const offset = (duration / AXIS_TICKS) * index
    return {
      index,
      position: (offset / duration) * 100,
      label: formatExecutionDuration(new Date(start), new Date(start + offset)),
    }
  })
  const selectedItem = items.find((item) => item.id === selectedId)

  return (
    <div className={styles.container} data-testid="cucumber.timeline">
      <div className={styles.chart}>
        <ol className={styles.axis} aria-hidden="true">
          {ticks.map((tick) => (
            <li
              key={tick.index}
              className={styles.tick}
              style={{ left: `${tick.position}%` }}
              data-edge={tick.index === 0 ? 'start' : tick.index === AXIS_TICKS ? 'end' : undefined}
            >
              <span>{tick.label}</span>
            </li>
          ))}
        </ol>
        <ol className={styles.groups}>
          {groups.map((group) => (
            <li key={group.id} className={styles.group} data-testid="cucumber.timeline.group">
              <span className={styles.groupLabel}>{group.label}</span>
              <div className={styles.lane}>
                {items
                  .filter((item) => item.groupId === group.id)
                  .map((item) => (
                    <TimelineBar
                      key={item.id}
                      item={item}
                      rangeStart={start}
                      duration={duration}
                      selected={item.id === selectedId}
                      onSelect={() =>
                        setSelectedId((current) => (current === item.id ? undefined : item.id))
                      }
                    />
                  ))}
              </div>
            </li>
          ))}
        </ol>
      </div>
      {selectedItem && (
        <TimelineDetail item={selectedItem} onClose={() => setSelectedId(undefined)} />
      )}
    </div>
  )
}

const TimelineBar: FC<{
  item: TimelineItem
  rangeStart: number
  duration: number
  selected: boolean
  onSelect: () => void
}> = ({ item, rangeStart, duration, selected, onSelect }) => {
  const left = ((item.start - rangeStart) / duration) * 100
  const width = Math.max(((item.end - item.start) / duration) * 100, 0.3)
  return (
    <button
      type="button"
      className={styles.item}
      data-status={item.status}
      aria-label={item.scenario}
      aria-pressed={selected}
      style={{ left: `${left}%`, width: `${width}%` }}
      onClick={onSelect}
      title={item.feature ? `${item.feature} — ${item.scenario}` : item.scenario}
    >
      <span className={styles.itemLabel}>{item.scenario}</span>
    </button>
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
    </div>
  )
}
