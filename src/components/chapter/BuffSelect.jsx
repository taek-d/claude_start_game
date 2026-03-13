import { useEffect, useMemo, useState } from 'react'
import { evaluateBridgeResponse, getBridgeVariantMeta } from '../../data/roles/pm/questSupport'
import { applyCoachingTone, getCoachingTone } from '../../utils/coachingTone'

function RewardChip({ label, value, tone }) {
  const styles = {
    xp: 'border-amber-300/35 bg-amber-400/15 text-amber-50',
    confidence: 'border-rose-300/35 bg-rose-400/15 text-rose-50',
    bridge: 'border-cyan-300/35 bg-cyan-400/15 text-cyan-50',
    route: 'border-emerald-300/35 bg-emerald-400/12 text-emerald-50',
  }

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${styles[tone] || styles.bridge}`}>
      {label} {value}
    </span>
  )
}

function ReadinessBadge({ label }) {
  const styles = {
    ready: 'border-emerald-300/20 bg-emerald-400/10 text-emerald-100',
    solid: 'border-cyan-300/20 bg-cyan-400/10 text-cyan-100',
    needs_work: 'border-amber-300/20 bg-amber-400/10 text-amber-100',
    skipped: 'border-slate-300/20 bg-white/10 text-white/80',
  }

  const text = {
    ready: '준비 완료',
    solid: '거의 됨',
    needs_work: '보완 필요',
    skipped: '바로 넘어감',
  }

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${styles[label] || styles.needs_work}`}>
      {text[label] || '보완 필요'}
    </span>
  )
}

export default function BuffSelect({
  questId,
  bridgeTask,
  coachFallback,
  guide,
  choices,
  savedResponse,
  beginnerMode = false,
  playerGender = 'female',
  onSelect,
}) {
  const tone = getCoachingTone(playerGender)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [actionText, setActionText] = useState('')

  useEffect(() => {
    if (!savedResponse) {
      setSelectedIndex(null)
      setActionText('')
      return
    }

    const nextIndex = choices.findIndex((choice) => choice.bridgeChoice?.value === savedResponse.choiceValue)
    setSelectedIndex(nextIndex >= 0 ? nextIndex : null)
    setActionText(savedResponse.text || '')
  }, [choices, questId, savedResponse])

  const rewardInfo = useMemo(() => choices.map((choice) => {
    const chips = []
    const variant = getBridgeVariantMeta(choice.bridgeChoice?.value)
    if (choice.xpChange) chips.push({ label: 'XP', value: `${choice.xpChange > 0 ? '+' : ''}${choice.xpChange}`, tone: 'xp' })
    if (choice.confidenceChange) chips.push({ label: '자신감', value: `${choice.confidenceChange > 0 ? '+' : ''}${choice.confidenceChange}`, tone: 'confidence' })
    if (choice.bridgeChoice?.recommended) chips.push({ label: '추천', value: 'bridge', tone: 'bridge' })
    if (variant?.rewardLabel) chips.push({ label: '강화', value: variant.rewardLabel, tone: 'route' })
    return chips
  }), [choices])

  const selectedChoice = selectedIndex !== null ? choices[selectedIndex] : null
  const selectedVariant = getBridgeVariantMeta(selectedChoice?.bridgeChoice?.value)
  const isRecommendedBridge = Boolean(selectedChoice?.bridgeChoice?.recommended)
  const activeGuide = selectedVariant ? { ...guide, ...selectedVariant } : guide
  const trimmedText = actionText.trim()
  const rubric = useMemo(
    () => evaluateBridgeResponse(questId, trimmedText, selectedChoice?.bridgeChoice?.value),
    [questId, trimmedText, selectedChoice?.bridgeChoice?.value],
  )
  const minLength = activeGuide?.minLength || guide?.minLength || 10
  const displayRubric = isRecommendedBridge
    ? rubric
    : { ...rubric, matched: [], missing: [], readinessLabel: 'skipped' }
  const isReady = Boolean(selectedChoice) && (!isRecommendedBridge || (trimmedText.length >= minLength && rubric.passed))

  return (
    <div className="mx-auto w-full max-w-5xl rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/30 backdrop-blur">
      <div className="text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200/70">Bridge Quest</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-white">게임 밖으로 한 걸음 더</h2>
        <p className="mt-3 text-sm leading-relaxed text-white/55">
          추천 브릿지마다 키우는 감각이 다릅니다. 카드에 따라 실제 메모 질문과 통과 기준도 함께 달라집니다.
        </p>
      </div>

      {beginnerMode && (
        <div className="mt-5 rounded-3xl border border-amber-300/12 bg-amber-400/10 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-100/80">{tone.coachHeading}</p>
          <p className="mt-2 text-sm leading-relaxed text-amber-50/90">
            {applyCoachingTone(playerGender, '지금 당장 실제로 해보고 싶지 않다면 메모 없는 선택으로 넘어가도 괜찮아요. 대신 추천 브릿지는 각각 다른 실전 감각을 키우는 길입니다.', 'bridge')}
          </p>
        </div>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {choices.map((choice, index) => (
          <button
            key={`${choice.text}-${index}`}
            onClick={() => {
              const nextChoiceValue = choices[index]?.bridgeChoice?.value
              const currentChoiceValue = selectedChoice?.bridgeChoice?.value
              setSelectedIndex(index)
              if (nextChoiceValue !== currentChoiceValue && savedResponse?.choiceValue !== nextChoiceValue) {
                setActionText('')
              }
            }}
            className={`rounded-[28px] border p-5 text-left transition ${
              selectedIndex === index
                ? 'border-cyan-200/40 bg-cyan-400/12 shadow-[0_18px_40px_rgba(34,211,238,0.12)]'
                : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8'
            }`}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200/75">선택 {index + 1}</p>
            <p className="mt-4 min-h-[84px] text-[17px] font-semibold leading-relaxed text-white">{choice.text}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {rewardInfo[index].length > 0 ? rewardInfo[index].map((chip) => (
                <RewardChip key={`${chip.label}-${chip.value}`} {...chip} />
              )) : (
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/55">추가 보상 없음</span>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[28px] border border-cyan-300/15 bg-cyan-400/8 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200/75">Bridge Action</p>
          <h3 className="mt-3 text-xl font-black tracking-tight text-white">
            {activeGuide?.prompt || bridgeTask || '실제로 해보고 싶은 일을 한 줄로 적어보세요.'}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-cyan-50/75">
            {isRecommendedBridge
              ? (activeGuide?.benefitText || bridgeTask || '이번 퀘스트에서 배운 것을 내 실제 작업으로 연결하는 한 줄 메모를 남깁니다.')
              : '이 선택은 실제 행동 메모 없이 바로 넘어갈 수 있습니다. 메모를 적는다면 선택사항으로만 저장됩니다.'}
          </p>

          {selectedVariant?.benefitTitle && isRecommendedBridge && (
            <div className="mt-4 rounded-3xl border border-emerald-300/12 bg-emerald-400/10 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-100/75">{selectedVariant.benefitTitle}</p>
              <p className="mt-2 text-sm leading-relaxed text-emerald-50/90">{selectedVariant.benefitText}</p>
            </div>
          )}

          <div className="mt-4 rounded-3xl border border-white/10 bg-slate-950/55 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">선택한 방향</p>
            <p className="mt-2 text-sm leading-relaxed text-white/80">
              {selectedChoice ? selectedChoice.text : '먼저 카드 하나를 골라주세요.'}
            </p>
          </div>

          <label className="mt-4 block text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">
            {isRecommendedBridge ? '내 실제 한 줄' : '선택 메모 (선택사항)'}
          </label>
          <textarea
            value={actionText}
            onChange={(event) => setActionText(event.target.value)}
            disabled={!selectedChoice}
            placeholder={
              !selectedChoice
                ? '카드를 먼저 고르면 여기에 메모를 적을 수 있어요.'
                : isRecommendedBridge
                  ? (activeGuide?.placeholder || '내 실제 폴더, 파일, 다음 행동을 한 줄로 적어보세요.')
                  : '메모 없이 바로 저장해도 됩니다. 남기고 싶다면 왜 이 선택을 했는지만 짧게 적어도 괜찮아요.'
            }
            className="mt-2 min-h-[132px] w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-4 text-sm leading-relaxed text-white outline-none transition placeholder:text-white/28 focus:border-cyan-300/35 focus:ring-2 focus:ring-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-55"
          />

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/55">{trimmedText.length}/{minLength}자</span>
            {!isRecommendedBridge && selectedChoice && (
              <span className="text-xs text-emerald-100/75">이 선택은 메모 없이도 저장할 수 있어요.</span>
            )}
            {isRecommendedBridge && activeGuide?.hint && (
              <span className="text-xs text-white/55">{applyCoachingTone(playerGender, activeGuide.hint, 'hint')}</span>
            )}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">브릿지 기준 체크</p>
            <ReadinessBadge label={displayRubric.readinessLabel} />
          </div>

          <div className="mt-4 rounded-3xl border border-white/10 bg-black/15 p-4">
            {isRecommendedBridge ? (
              <>
                <p className="text-sm font-semibold text-white">통과 기준 {rubric.score}/{rubric.requiredCount}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {rubric.matched.map((item) => (
                    <span key={item.id} className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-100">
                      OK {item.label}
                    </span>
                  ))}
                  {rubric.missing.map((item) => (
                    <span key={item.id} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/65">
                      필요 {item.label}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-white">메모 없이 바로 저장 가능</p>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  이 선택은 브릿지 실전 연결을 적극적으로 하지는 않는 경로라서, 메모와 기준 통과를 요구하지 않습니다.
                </p>
              </>
            )}
          </div>

          <div className="mt-4 rounded-3xl border border-white/10 bg-black/15 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">{tone.coachHeading}</p>
            <p className="mt-2 text-sm leading-relaxed text-white/75">
              {isRecommendedBridge
                ? applyCoachingTone(playerGender, activeGuide?.coachFallback || coachFallback || '파일 이름, 폴더, 다음 행동, 원하는 결과를 조금만 더 구체적으로 적으면 훨씬 강한 브릿지 메모가 됩니다.', 'coach')
                : applyCoachingTone(playerGender, '지금은 그냥 넘어가도 괜찮아요. 나중에 다시 도전하고 싶을 때 추천 브릿지를 고르면 실전 메모와 현실 체크까지 이어집니다.', 'coach')}
            </p>

            {isRecommendedBridge && rubric.missing.length > 0 && (
              <div className="mt-4 space-y-2">
                {rubric.missing.map((item) => (
                  <p key={item.id} className="text-sm leading-relaxed text-amber-50/90">
                    - {item.feedback}
                  </p>
                ))}
              </div>
            )}
          </div>

          {!!activeGuide?.examples?.length && isRecommendedBridge && (
            <div className="mt-4 rounded-3xl border border-cyan-300/12 bg-cyan-400/8 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-200/75">예시 방향</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {activeGuide.examples.map((example) => (
                  <span key={example} className="rounded-full border border-white/10 bg-slate-950/45 px-3 py-1 text-xs text-cyan-50/85">
                    {example}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-white/55">
          {isRecommendedBridge
            ? '추천 브릿지는 카드 선택 + 실제 행동 메모 + 기준 통과가 모두 되면 완료됩니다.'
            : '이 선택은 카드만 고르면 바로 저장하고 다음 장면으로 넘어갈 수 있습니다.'}
        </p>
        <button
          onClick={() => {
            if (!isReady) return
            const bridgeRubricResult = isRecommendedBridge
              ? rubric
              : { skipped: true, passed: false, score: 0, requiredCount: rubric.requiredCount, matched: [], missing: [], readinessLabel: 'skipped' }
            onSelect(selectedIndex, selectedChoice, trimmedText, bridgeRubricResult)
          }}
          disabled={!isReady}
          className="inline-flex min-w-[144px] items-center justify-center whitespace-nowrap rounded-full bg-cyan-400 px-6 py-3 text-center text-sm font-bold leading-none text-slate-950 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-35"
        >
          브릿지 저장
        </button>
      </div>
    </div>
  )
}
