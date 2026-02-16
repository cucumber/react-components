import { type Duration, TimeConversion } from '@cucumber/messages'
import React, { type FC } from 'react'

import styles from './TestStepDuration.module.scss'

const subSecondFormat = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 0,
})

const secondPlusFormat = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 3,
})

export const TestStepDuration: FC<{ duration: Duration }> = ({ duration }) => {
  const millis = TimeConversion.durationToMilliseconds(duration)
  if (millis < 1) {
    return null
  }
  return (
    <span className={styles.duration}>
      {millis < 1000 ? (
        <>{`${subSecondFormat.format(millis)}ms`}</>
      ) : (
        <>{`${secondPlusFormat.format(millis / 1000)}s`}</>
      )}
    </span>
  )
}
