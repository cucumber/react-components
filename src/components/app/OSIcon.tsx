import React, { VoidFunctionComponent } from 'react'

import { Linux } from './icons/Linux'
import { MacOS } from './icons/MacOS'
import { Windows } from './icons/Windows'

export const OSIcon: VoidFunctionComponent<{ name: string }> = ({ name }) => {
  if (!name) {
    return <>Unknown OS</>
  }
  if (name.match(/windows|win32/i)) {
    return <Windows />
  }
  if (name.match(/(darwin|mac)/i)) {
    return <MacOS />
  }
  if (name.match(/linux/i)) {
    return <Linux />
  }
  return <>{name}</>
}
