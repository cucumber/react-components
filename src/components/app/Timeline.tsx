import { type FC, useEffect, useRef, useState, WheelEventHandler } from 'react'
import { formatExecutionDuration } from '../../formatExecutionDuration.js'
import { type TimelineItem, useTimelineData } from '../../hooks/useTimelineData.js'
import { StatusIcon } from '../gherkin/StatusIcon.js'
import statusName from '../gherkin/statusName.js'
import { Tags } from '../gherkin/Tags.js'
import { TestCaseOutcome } from '../results/index.js'
import styles from './Timeline.module.scss'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import {TooltipTrigger} from 'react-aria-components';
import {

  TooltipTrigger,
  Tooltip,
  Button,
  type TooltipProps,
  type TooltipTriggerComponentProps
} from 'react-aria-components';


export const Timeline: FC = () => {
  const { groups, items, fullStart, fullEnd, filtered } = useTimelineData();
  const axisRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  const [axisUnit, setAxisUnit] = useState(100);
  const [pxPerMs, setPxPerMs] = useState(10);
  
  // const pxPerMs = 10;
  
  useEffect(() => {
    const element = axisRef.current;
    if (!element) {
      return;
    }
    const handleAxisZoom = (e: WheelEvent) => {
      e.preventDefault();
      const zoomDirection = e.deltaY < 0 ? 1: -1;
      const zoomFactor = 1.1;
      if(zoomDirection === -1) {
        setAxisUnit(prev => prev * zoomFactor);
        setPxPerMs(prev => prev / zoomFactor);
      } else {
        setAxisUnit(prev => prev / zoomFactor);
        setPxPerMs(prev => prev * zoomFactor);
      }
    }
    element.addEventListener('wheel', handleAxisZoom, { passive: false });

    return () => {
      element.removeEventListener('wheel', handleAxisZoom);
    };
  }, []);

  const selectedItem = items.find((item) => item.id === selectedId);

  return (
    <>
    <div className={styles.timelineWrapper}>
      {/* Header */}

      <div className={styles.timelineRow}>
        <div className={`${styles.cell} ${styles.workerCell}`}></div>
        <div ref={axisRef} className={styles.cell}>Axis Unit: {axisUnit}ms</div>
      </div>

      {
        groups.map((grp) => {
          return <div key={grp.id} className={styles.timelineRow}>

            <div className={`${styles.cell} ${styles.workerCell}`}>
              {grp.label}
            </div>
            <div className={`${styles.workerRow} ${styles.cell}`}>
              {items.filter((i) => i.groupId === grp.id).map((item) => {
                const width = (item.end - item.start) * pxPerMs;

                return <TooltipTrigger key={item.id}>
                  <Button type='button' className={styles.timelineBar} style={{width: `${width}px`}} data-status={item.status} onClick={(_e) => setSelectedId(item.id)} ></Button>
                  <Tooltip>
                      EDIT
                  </Tooltip>
                </TooltipTrigger>
  
              })}
            </div>

          </div>
        })
      }



    </div>
    {selectedItem && (
        <TimelineDetail item={selectedItem} onClose={() => setSelectedId(undefined)} />
      )}
    </>
  );

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
