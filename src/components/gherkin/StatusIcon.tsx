import type * as messages from '@cucumber/messages'
import {
  type IconDefinition,
  faCheckCircle,
  faInfoCircle,
  faPauseCircle,
  faQuestionCircle,
  faStopCircle,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { type FunctionComponent } from 'react'

import {
  type DefaultComponent,
  type StatusIconClasses,
  type StatusIconProps,
  useCustomRendering,
} from '../customise/index.js'
import defaultStyles from './StatusIcon.module.scss'

const DefaultRenderer: DefaultComponent<StatusIconProps, StatusIconClasses> = ({
  status,
  styles,
}) => {
  return (
    <FontAwesomeIcon
      icon={statusIcon(status)}
      size="1x"
      className={styles.icon}
      data-status={status}
    />
  )
}

export const StatusIcon: FunctionComponent<StatusIconProps> = (props) => {
  const Customised = useCustomRendering<StatusIconProps, StatusIconClasses>(
    'StatusIcon',
    defaultStyles,
    DefaultRenderer
  )
  return <Customised {...props} />
}

const statusIcon = (status: messages.TestStepResultStatus): IconDefinition => {
  return {
    PASSED: faCheckCircle,
    SKIPPED: faStopCircle,
    PENDING: faPauseCircle,
    UNDEFINED: faQuestionCircle,
    AMBIGUOUS: faInfoCircle,
    FAILED: faTimesCircle,
    UNKNOWN: faQuestionCircle,
  }[status]
}
