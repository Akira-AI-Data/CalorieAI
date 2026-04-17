'use client'

import { EMOJI_TO_ICON } from '@/data/emoji-icon-map'

interface FluentEmojiProps {
  emoji: string
  size?: number
  className?: string
}

export function FluentEmoji({ emoji, size = 48, className = '' }: FluentEmojiProps) {
  const src = EMOJI_TO_ICON[emoji]
  if (!src) {
    return (
      <span
        className={className}
        style={{ fontSize: size, lineHeight: 1, display: 'inline-block' }}
      >
        {emoji}
      </span>
    )
  }
  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      className={className}
      loading="lazy"
      style={{ width: size, height: size, display: 'inline-block' }}
    />
  )
}
