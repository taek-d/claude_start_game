import { useCallback, useEffect, useRef, useState } from 'react'
import { getRoleCharacters } from '../../data/roleRegistry'
import { soundFx } from '../../utils/feedback'

export default function DialogueBox({ speaker, text, onAdvance, playerName }) {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const intervalRef = useRef(null)

  const fullText = text.replace(/{playerName}/g, playerName || '')

  useEffect(() => {
    setDisplayedText('')
    setIsTyping(true)
    let index = 0
    intervalRef.current = setInterval(() => {
      index += 1
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index))
        if (index % 2 === 0) soundFx.type()
      } else {
        setIsTyping(false)
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }, 25)

    return () => {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [fullText])

  const handleAdvance = useCallback(() => {
    soundFx.click()
    if (isTyping) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
      setDisplayedText(fullText)
      setIsTyping(false)
      return
    }
    onAdvance()
  }, [fullText, isTyping, onAdvance])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault()
        handleAdvance()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleAdvance])

  const isNarrator = speaker === 'narrator'
  const isPlayer = speaker === 'player'
  const characters = getRoleCharacters()
  const character = characters[speaker]
  const speakerName = isNarrator ? '' : isPlayer ? playerName : character?.name || speaker
  const nameColor = isPlayer ? '#c59cff' : character?.nameColor || '#6fb1ff'

  return (
    <div className="vn-dialogue-container" onClick={handleAdvance}>
      <div className="vn-dialogue-box">
        {speakerName && (
          <div className="vn-speaker-name" style={{ color: nameColor }}>
            {speakerName}
          </div>
        )}
        <div className={`vn-dialogue-text ${isNarrator ? 'narrator' : ''}`}>
          {displayedText}
          {isTyping && <span className="vn-cursor" />}
        </div>
        <div className="vn-dialogue-hint">
          {isTyping ? '' : 'Enter 또는 클릭'}
        </div>
      </div>
    </div>
  )
}
