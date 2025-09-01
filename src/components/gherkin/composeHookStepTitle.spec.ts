import { Hook, HookType } from '@cucumber/messages'
import { expect } from 'chai'

import { composeHookStepTitle } from './composeHookStepTitle.js'

describe('composeHookStepTitle', () => {
  const baseHook: Hook = {
    id: '123',
    sourceReference: {},
  }

  it('just says Hook if no hook definition found', () => {
    expect(composeHookStepTitle(undefined)).to.eq('Hook')
  })

  it('just says Hook if no useful metadata', () => {
    expect(composeHookStepTitle({ ...baseHook })).to.eq('Hook')
  })

  it('just says the type if type but no name', () => {
    expect(composeHookStepTitle({ ...baseHook, type: HookType.AFTER_TEST_CASE })).to.eq('After')
  })

  it('says Hook and the name if name but no type', () => {
    expect(composeHookStepTitle({ ...baseHook, name: 'My fancy hook' })).to.eq(
      'Hook: My fancy hook'
    )
  })

  it('says the type and name if both present', () => {
    expect(
      composeHookStepTitle({ ...baseHook, type: HookType.BEFORE_TEST_CASE, name: 'My fancy hook' })
    ).to.eq('Before: My fancy hook')
  })
})
