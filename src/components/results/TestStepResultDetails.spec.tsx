import { TestStepResultStatus } from '@cucumber/messages'
import { expect } from 'chai'
import React from 'react'

import { render } from '../../../test-utils/index.js'
import { TestStepResultDetails } from './TestStepResultDetails.js'

describe('TestStepResultDetails', () => {
  it('should render nothing if no message or exception', () => {
    const { container } = render(
      <TestStepResultDetails
        duration={{ seconds: 1, nanos: 0 }}
        status={TestStepResultStatus.PASSED}
      />
    )

    expect(container).to.be.empty
  })

  it('should render the message for a legacy message', () => {
    const { container } = render(
      <TestStepResultDetails
        duration={{ seconds: 1, nanos: 0 }}
        status={TestStepResultStatus.FAILED}
        message="Oh no a bad thing happened"
      />
    )

    expect(container).to.include.text('Oh no a bad thing happened')
  })

  it('should render the message for a typed exception', () => {
    const { container } = render(
      <TestStepResultDetails
        duration={{ seconds: 1, nanos: 0 }}
        status={TestStepResultStatus.FAILED}
        message="Dont use the legacy field"
        exception={{
          type: 'Whoopsie',
          message: 'Bad things happened',
        }}
      />
    )

    expect(container).to.include.text('Whoopsie Bad things happened')
    expect(container).not.to.include.text('Dont use the legacy field')
  })

  it('should render a stack trace where present', () => {
    const { container } = render(
      <TestStepResultDetails
        duration={{ seconds: 1, nanos: 0 }}
        status={TestStepResultStatus.FAILED}
        message="Dont use the legacy field"
        exception={{
          type: 'Whoopsie',
          message: 'Bad things happened',
          stackTrace: 'at /some/file.js:1:2',
        }}
      />
    )

    expect(container).to.include.text('at /some/file.js:1:2')
  })
})
