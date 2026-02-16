import { faLink } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type React from 'react'

import {
  type AnchorClasses,
  type AnchorProps,
  type DefaultComponent,
  useCustomRendering,
} from '../customise/index.js'
import defaultStyles from './Anchor.module.scss'

const DefaultRenderer: DefaultComponent<AnchorProps, AnchorClasses> = ({
  id,
  styles,
  children,
}) => {
  return (
    <div className={styles.wrapper}>
      <a href={`#${id}`} className={defaultStyles.anchor}>
        <FontAwesomeIcon icon={faLink} />
      </a>
      {children}
    </div>
  )
}

export const Anchor: React.FunctionComponent<AnchorProps> = (props) => {
  const ResolvedRenderer = useCustomRendering<AnchorProps, AnchorClasses>(
    'Anchor',
    defaultStyles,
    DefaultRenderer
  )
  return <ResolvedRenderer {...props} />
}
