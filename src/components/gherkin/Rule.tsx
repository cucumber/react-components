import type React from 'react'

import { HighLight } from '../app/HighLight.js'
import { type DefaultComponent, type RuleProps, useCustomRendering } from '../customise/index.js'
import { Background } from './Background.js'
import { Children } from './Children.js'
import { Description } from './Description.js'
import { Keyword } from './Keyword.js'
import { Scenario } from './Scenario.js'
import { Tags } from './Tags.js'
import { Title } from './Title.js'

const DefaultRenderer: DefaultComponent<RuleProps> = ({ rule }) => {
  return (
    <section>
      <Tags tags={rule.tags} />
      <Title header="h2" id={rule.id}>
        <Keyword>{rule.keyword}:</Keyword>
        <HighLight text={rule.name} />
      </Title>
      <Description description={rule.description} />
      <Children>
        {(rule.children || []).map((child, index) => {
          if (child.background) {
            return <Background key={index} background={child.background} />
          } else if (child.scenario) {
            return <Scenario key={index} scenario={child.scenario} />
          } else {
            throw new Error('Expected background or scenario')
          }
        })}
      </Children>
    </section>
  )
}

export const Rule: React.FunctionComponent<RuleProps> = (props) => {
  const ResolvedRenderer = useCustomRendering<RuleProps>('Rule', {}, DefaultRenderer)
  return <ResolvedRenderer {...props} />
}
