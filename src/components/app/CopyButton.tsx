import { faCheck, faCopy } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { type FC, useState } from 'react'

import styles from './CopyButton.module.scss'

export const CopyButton: FC<{ text: string; className?: string }> = ({ text, className }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true)
        setTimeout(() => {
          setCopied(false)
        }, 3000)
      })
      .catch((err) => {
        console.error('Failed to copy', err)
      })
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? 'Copied' : 'Copy'}
      disabled={copied}
      className={`${styles.button}${className ? ` ${className}` : ''}`}
    >
      <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
    </button>
  )
}
