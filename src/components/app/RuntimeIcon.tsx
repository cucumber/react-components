import type { Product } from '@cucumber/messages'
import type { FC } from 'react'

import { Jvm } from './icons/Jvm.js'
import { NodeJs } from './icons/NodeJs.js'
import { Ruby } from './icons/Ruby.js'

export const RuntimeIcon: FC<{ runtime: Product }> = ({ runtime }) => {
  const { name } = runtime
  if (name.match(/(oracle|openjdk|java)/i)) {
    return <Jvm />
  }
  if (name.match(/ruby/i)) {
    return <Ruby />
  }
  if (name.match(/node/i)) {
    return <NodeJs />
  }
  return null
}
