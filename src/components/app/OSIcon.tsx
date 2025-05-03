import { Meta } from '@cucumber/messages'
import React, { FC } from 'react'

import { Linux } from './icons/Linux.js'
import { MacOS } from './icons/MacOS.js'
import { Windows } from './icons/Windows.js'

export const OSIcon: FC<{ os: Meta['os'] }> = ({ os }) => {
  const { name } = os
  if (name.match(/windows|win32/i)) {
    return <Windows />
  }
  if (name.match(/(darwin|mac)/i)) {
    return <MacOS />
  }
  if (name.match(/linux/i)) {
    return <Linux />
  }
  return null
}
