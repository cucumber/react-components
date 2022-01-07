import React from 'react'

import { HighLight } from '../app/HighLight'
import { DefaultComponent, FeatureProps, useCustomRendering } from '../customise'
import { Background } from './Background'
import { Children } from './Children'
import { Description } from './Description'
import { Keyword } from './Keyword'
import { Rule } from './Rule'
import { Scenario } from './Scenario'
import { Tags } from './Tags'
import { Title } from './Title'

const DefaultRenderer: DefaultComponent<FeatureProps> = ({ feature }) => {
  return (
    <section>
      <Tags tags={feature.tags} />
      <Title header="h1" id={feature.name}>
        <Keyword>{feature.keyword}:</Keyword>
        <HighLight text={feature.name} />
      </Title>
      <Description description={feature.description} />
      <Children>
        {(feature.children || []).map((child, index) => {
          if (child.background) {
            return <Background key={index} background={child.background} />
          } else if (child.scenario) {
            return <Scenario key={index} scenario={child.scenario} />
          } else if (child.rule) {
            return <Rule key={index} rule={child.rule} />
          } else {
            throw new Error('Expected background, scenario or rule')
          }
        })}
      </Children>
    </section>
  )
}

export const Feature: React.FunctionComponent<FeatureProps> = (props) => {
  const ResolvedRenderer = useCustomRendering<FeatureProps>('Feature', {}, DefaultRenderer)
  return <ResolvedRenderer {...props} />
}
