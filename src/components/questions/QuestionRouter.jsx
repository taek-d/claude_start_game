import { getProblemById } from '../../data/roleRegistry'
import { useGameState } from '../../hooks/useGameState'
import CardSortQuestion from './CardSortQuestion'
import PromptBuildQuestion from './PromptBuildQuestion'
import QuickChoiceQuestion from './QuickChoiceQuestion'
import WorkflowSimQuestion from './WorkflowSimQuestion'

export default function QuestionRouter({ problemId, onComplete }) {
  const state = useGameState()
  const role = state.playerRole || 'pm'
  const problem = getProblemById(problemId, role)

  if (!problem) {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-8 text-center text-white/75">
        <p>문제를 찾을 수 없어요: {problemId}</p>
        <button onClick={() => onComplete(true)} className="mt-4 rounded-full bg-cyan-400 px-5 py-2.5 font-bold text-slate-950">
          건너뛰기
        </button>
      </div>
    )
  }

  switch (problem.type) {
    case 'quick_choice':
      return <QuickChoiceQuestion problem={problem} onComplete={onComplete} />
    case 'prompt_build':
      return <PromptBuildQuestion problem={problem} onComplete={onComplete} />
    case 'workflow_sim':
      return <WorkflowSimQuestion problem={problem} onComplete={onComplete} />
    case 'card_sort':
      return <CardSortQuestion problem={problem} onComplete={onComplete} />
    default:
      return null
  }
}
