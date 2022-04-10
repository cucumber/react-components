import { IHook, ISupportCodeExecutor, runCucumber, SupportCode } from '@cucumber/fake-cucumber'
import { makeSourceEnvelope } from '@cucumber/gherkin'
import { GherkinStreams } from '@cucumber/gherkin-streams'
import { Query as GherkinQuery } from '@cucumber/gherkin-utils'
import * as messages from '@cucumber/messages'
import { Writable } from 'stream'

export class FailingCodeSupport implements ISupportCodeExecutor {
  constructor(readonly stepDefinitionId: string) {}

  public execute() {
    throw new Error('Woops ...')
  }
  public argsToMessages(): messages.StepMatchArgument[] {
    return []
  }
}

export class FailingHook implements IHook {
  constructor(public readonly id: string) {}

  match(): ISupportCodeExecutor {
    return new FailingCodeSupport('')
  }

  toMessage(): messages.Envelope {
    return {
      hook: {
        id: this.id,
        sourceReference: {
          uri: __dirname,
        },
      },
    }
  }
}

export async function runFeature(
  feature: string,
  gherkinQuery: GherkinQuery,
  supportCode: SupportCode = new SupportCode()
): Promise<messages.Envelope[]> {
  const emitted: messages.Envelope[] = []
  const out = new Writable({
    objectMode: true,
    write(
      envelope: messages.Envelope,
      encoding: string,
      callback: (error?: Error | null) => void
    ): void {
      emitted.push(envelope)
      try {
        callback()
      } catch (err) {
        callback(err)
      }
    },
  })

  const gherkinEnvelopeStream = GherkinStreams.fromSources(
    [makeSourceEnvelope(feature, 'test.feature')],
    {
      newId: messages.IdGenerator.incrementing(),
    }
  )

  await runCucumber(supportCode, gherkinEnvelopeStream, gherkinQuery, out)
  return emitted
}
