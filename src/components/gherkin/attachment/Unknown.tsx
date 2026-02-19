import { faPaperclip } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { type FC, useCallback, useEffect, useState } from 'react'

import { NavigationButton } from '../../app/NavigationButton.js'
import type { AttachmentProps } from '../../customise/index.js'
import { attachmentFilename } from './attachmentFilename.js'
import { createDownloadUrl } from './createDownloadUrl.js'

export const Unknown: FC<AttachmentProps> = ({ attachment }) => {
  if (attachment.url) {
    return <UnknownExternalised attachment={attachment} />
  }
  return <UnknownEmbedded attachment={attachment} />
}

const UnknownExternalised: FC<AttachmentProps> = ({ attachment }) => {
  const filename = attachmentFilename(attachment)
  const onClick = () => {
    const anchor = document.createElement('a')
    anchor.href = attachment.url as string
    anchor.download = filename
    anchor.click()
  }
  return (
    <NavigationButton onClick={onClick}>
      <FontAwesomeIcon icon={faPaperclip} />
      Download {filename}
    </NavigationButton>
  )
}

const UnknownEmbedded: FC<AttachmentProps> = ({ attachment }) => {
  const [downloadUrl, setDownloadUrl] = useState<string>()
  useEffect(() => () => cleanupDownloadUrl(downloadUrl), [downloadUrl])
  const filename = attachmentFilename(attachment)
  const onClick = useCallback(() => {
    let href: string
    if (downloadUrl) {
      href = downloadUrl
    } else {
      const createdUrl = createDownloadUrl(attachment)
      setDownloadUrl(createdUrl)
      href = createdUrl
    }

    const anchor = document.createElement('a')
    anchor.href = href
    anchor.download = filename
    anchor.click()
  }, [attachment, filename, downloadUrl])
  return (
    <NavigationButton onClick={onClick}>
      <FontAwesomeIcon icon={faPaperclip} />
      Download {filename}
    </NavigationButton>
  )
}

function cleanupDownloadUrl(url?: string) {
  if (url) {
    console.debug('Revoking download url')
    URL.revokeObjectURL(url)
  }
}
