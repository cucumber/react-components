import React, { FunctionComponent, PropsWithChildren } from 'react'

import styles from './CucumberReact.module.scss'
import { CustomRenderingContext, CustomRenderingSupport, IncludedTheme } from './customise/index.js'

interface IProps {
  theme?: IncludedTheme
  customRendering?: CustomRenderingSupport
  className?: string
}

export const CucumberReact: FunctionComponent<PropsWithChildren<IProps>> = ({
  children,
  theme = 'auto',
  customRendering = {},
  className,
}) => {
  const classes = [styles.cucumberReact, styles[`${theme}Theme`], className]
  return (
    <CustomRenderingContext.Provider value={customRendering}>
      <div data-testid="cucumber-react" className={classes.filter((c) => !!c).join(' ')}>
        {children}
      </div>
    </CustomRenderingContext.Provider>
  )
}
