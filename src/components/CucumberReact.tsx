import React, { FunctionComponent, PropsWithChildren } from 'react'

import styles from './CucumberReact.module.scss'
import { CustomRenderingContext, CustomRenderingSupport, IncludedTheme } from './customise'

interface IProps {
  theme?: IncludedTheme
  customRendering?: CustomRenderingSupport
  className?: string
}

export const CucumberReact: FunctionComponent<PropsWithChildren<IProps>> = ({
  children,
  theme = 'light',
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
