import React, { VoidFunctionComponent } from 'react'

import { Jvm } from './icons/Jvm.js'
import { NodeJs } from './icons/NodeJs.js'
import { Ruby } from './icons/Ruby.js'

export const RuntimeIcon: VoidFunctionComponent<{ name: string }> = ({ name }) => {
  if (!name) {
    return <>Unknown Runtime</>
  }
  if (name.match(/(oracle|openjdk|java)/i)) {
    return <Jvm />
  }
  if (name.match(/ruby/i)) {
    return <Ruby />
  }
  if (name.match(/node/i)) {
    return <NodeJs />
  }
  return <>{name}</>
}
