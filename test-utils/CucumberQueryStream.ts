import * as messages from '@cucumber/messages'
import { Query } from '@cucumber/query'
import { Writable } from 'stream'

export class CucumberQueryStream extends Writable {
  constructor(private readonly query: Query) {
    super({ objectMode: true })
  }

  _write(envelope: messages.Envelope, _: string, callback: (error?: Error | null) => void): void {
    this.query.update(envelope)
    callback(null)
  }
}
