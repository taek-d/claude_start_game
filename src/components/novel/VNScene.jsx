import { useState, useCallback, useMemo, useEffect } from 'react'
import { getRoleBackgrounds } from '../../data/roleRegistry'
import CharacterSprite from './CharacterSprite'
import DialogueBox from './DialogueBox'
import { soundFx } from '../../utils/feedback'

export default function VNScene({
  background = null,
  characters = [],
  dialogues = [],
  onComplete,
  playerName = '',
  choices = null,
  onChoice = null,
}) {
  const [dialogueIndex, setDialogueIndex] = useState(0)
  const [showChoices, setShowChoices] = useState(false)
  const [choiceSelected, setChoiceSelected] = useState(null)
  const [showChoiceResponse, setShowChoiceResponse] = useState(false)
  const [choiceResponseIndex, setChoiceResponseIndex] = useState(0)

  const currentDialogue = dialogues[dialogueIndex]

  const getLatestSceneValue = useCallback((items, index, key, fallback) => {
    if (!Array.isArray(items) || items.length === 0) return fallback
    for (let i = index; i >= 0; i--) {
      const item = items[i]
      if (item && Object.prototype.hasOwnProperty.call(item, key)) {
        return item[key]
      }
    }
    return fallback
  }, [])

  // Compute effective background by walking backwards through seen dialogues
  const effectiveBg = useMemo(() => {
    if (showChoiceResponse && choiceSelected !== null) {
      const resp = choices[choiceSelected].response
      return getLatestSceneValue(resp, choiceResponseIndex, 'background', background)
    }
    return getLatestSceneValue(dialogues, dialogueIndex, 'background', background)
  }, [
    dialogueIndex,
    choiceResponseIndex,
    showChoiceResponse,
    choiceSelected,
    dialogues,
    choices,
    background,
    getLatestSceneValue,
  ])

  // Compute effective characters by walking backwards through seen dialogues
  const effectiveChars = useMemo(() => {
    if (showChoiceResponse && choiceSelected !== null) {
      const resp = choices[choiceSelected].response
      return getLatestSceneValue(resp, choiceResponseIndex, 'characters', characters)
    }
    return getLatestSceneValue(dialogues, dialogueIndex, 'characters', characters)
  }, [
    dialogueIndex,
    choiceResponseIndex,
    showChoiceResponse,
    choiceSelected,
    dialogues,
    choices,
    characters,
    getLatestSceneValue,
  ])

  // Get backgrounds from roleRegistry
  const BACKGROUNDS = useMemo(() => getRoleBackgrounds(), [])
  const bgUrl = effectiveBg ? (BACKGROUNDS[effectiveBg] || BACKGROUNDS.office_day) : null

  const handleAdvance = useCallback(() => {
    if (showChoiceResponse) {
      const response = choices[choiceSelected]?.response
      if (response && choiceResponseIndex < response.length - 1) {
        setChoiceResponseIndex(choiceResponseIndex + 1)
        return
      }
      if (onChoice) onChoice(choiceSelected, choices[choiceSelected])
      return
    }

    if (dialogueIndex < dialogues.length - 1) {
      setDialogueIndex(dialogueIndex + 1)
    } else if (choices && !showChoices) {
      setShowChoices(true)
    } else {
      onComplete()
    }
  }, [dialogueIndex, dialogues.length, choices, showChoices, onComplete, showChoiceResponse, choiceSelected, choiceResponseIndex, onChoice])

  const handleChoice = useCallback((index) => {
    soundFx.click()
    setChoiceSelected(index)
    const choice = choices[index]
    if (choice.response && choice.response.length > 0) {
      setShowChoiceResponse(true)
      setChoiceResponseIndex(0)
      setShowChoices(false)
    } else {
      if (onChoice) onChoice(index, choice)
    }
  }, [choices, onChoice])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showChoices && choices) {
        const num = parseInt(e.key, 10)
        if (!isNaN(num) && num >= 1 && num <= choices.length) {
          e.preventDefault()
          handleChoice(num - 1)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showChoices, choices, handleChoice])

  const getDialogueToShow = () => {
    if (showChoiceResponse && choiceSelected !== null) {
      return choices[choiceSelected].response[choiceResponseIndex]
    }
    return currentDialogue
  }

  const dialogue = getDialogueToShow()

  const normalizeCharacters = useCallback((chars = []) => (
    chars.map((char) => ({
      ...char,
      position: 'center',
    }))
  ), [])

  const renderedChars = useMemo(() => {
    if (!dialogue) return normalizeCharacters(effectiveChars)
    const speakerId = dialogue.speaker
    if (!speakerId || speakerId === 'narrator' || speakerId === 'player') {
      return normalizeCharacters(effectiveChars)
    }
    if (effectiveChars.some((char) => char.id === speakerId)) {
      return normalizeCharacters(effectiveChars)
    }

    return [
      ...normalizeCharacters(effectiveChars),
      { id: speakerId, position: 'center' },
    ]
  }, [dialogue, effectiveChars, normalizeCharacters])

  if (!dialogue && !showChoices) return null

  return (
    <div className="vn-container">
      {/* Background */}
      {bgUrl ? (
        <div
          className="vn-background"
          style={{ backgroundImage: `url(${bgUrl})` }}
        />
      ) : (
        <div className="vn-background vn-background-dark" />
      )}

      {/* Characters */}
      {renderedChars.map((char) => {
        const isSpeaking = dialogue?.speaker === char.id
        const expression = isSpeaking && dialogue?.expression
          ? dialogue.expression
          : 'default'
        return (
          <CharacterSprite
            key={char.id}
            characterId={char.id}
            expression={expression}
            position={char.position || 'center'}
            isActive={isSpeaking || renderedChars.length === 1}
          />
        )
      })}

      {/* Choices overlay */}
      {showChoices && choices && (
        <div className="vn-choices-overlay">
          <div className="vn-choices-container">
            {choices.map((choice, i) => (
              <button
                key={i}
                onClick={() => handleChoice(i)}
                className="vn-choice-btn"
              >
                <span className="vn-choice-number">{i + 1}</span>
                <span className="vn-choice-text">{choice.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dialogue */}
      {dialogue && !showChoices && (
        <DialogueBox
          speaker={dialogue.speaker}
          text={dialogue.text}
          onAdvance={handleAdvance}
          playerName={playerName}
        />
      )}
    </div>
  )
}
