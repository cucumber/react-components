import React, { FC, PropsWithChildren } from 'react'

import UriContext from '../../UriContext.js'

export const UriProvider: FC<PropsWithChildren<{ uri: string }>> = ({ uri, children }) => {
  return <UriContext.Provider value={uri}>{children}</UriContext.Provider>
}
