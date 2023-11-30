import * as messages from '@cucumber/messages'
import {
  faCheckCircle,
  faInfoCircle,
  faPauseCircle,
  faQuestionCircle,
  faStopCircle,
  faTimesCircle,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { FunctionComponent } from 'react'

import {
  DefaultComponent,
  StatusIconClasses,
  StatusIconProps,
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
    ['PASSED']: faCheckCircle,
    ['SKIPPED']: faStopCircle,
    ['PENDING']: faPauseCircle,
    ['UNDEFINED']: faQuestionCircle,
    ['AMBIGUOUS']: faInfoCircle,
    ['FAILED']: faTimesCircle,
    ['UNKNOWN']: faQuestionCircle,
  }[status]
}
