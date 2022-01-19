import React from 'react'

import { HighLight } from '../app/HighLight.js'
import { DefaultComponent, TagsClasses, TagsProps, useCustomRendering } from '../customise/index.js'
import defaultStyles from './Tags.module.scss'

const DefaultRenderer: DefaultComponent<TagsProps, TagsClasses> = ({ tags, styles }) => {
  if (!tags.length) {
    return null
  }
  return (
    <ul className={styles.tags}>
      {tags.map((tag, index) => (
        <li className={styles.tag} key={index}>
          <HighLight text={tag.name} />
        </li>
      ))}
    </ul>
  )
}

export const Tags: React.FunctionComponent<TagsProps> = (props) => {
  const ResolvedRenderer = useCustomRendering<TagsProps, TagsClasses>(
    'Tags',
    defaultStyles,
    DefaultRenderer
  )
  return <ResolvedRenderer {...props} />
}
