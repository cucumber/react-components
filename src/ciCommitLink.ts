import type { Ci } from '@cucumber/messages'

import toRepositoryId from './toRepositoryId.js'

// TODO move upstream to create-meta
export default function ciCommitLink(ci: Ci): string | undefined {
  if (ci.git && ci.git.remote) {
    const repositoryId = toRepositoryId(ci.git.remote)
    const github = repositoryId.startsWith('github.com') || ci.name === 'GitHub Actions'
    if (ci.git.revision && github) {
      return `https://${repositoryId}/commit/${ci.git.revision}`
    }
  }
}
