import type { Product } from '@cucumber/messages'
import React, { type FC } from 'react'

import { CucumberLogo } from './icons/CucumberLogo.js'

export const ImplementationIcon: FC<{ implementation: Product }> = ({ implementation }) => {
  const { name } = implementation
  if (name.toLowerCase().includes('cucumber')) {
    return <CucumberLogo />
  }
  return null
}
