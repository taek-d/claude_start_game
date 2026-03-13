import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts'
import { useGameState } from '../../hooks/useGameState'

export default function StatsRadar() {
  const state = useGameState()
  const stats = state.stats || { toolSense: 10, promptCraft: 10, recovery: 10, workflow: 10 }

  const data = [
    { subject: '도구 감각', value: stats.toolSense, fullMark: 100 },
    { subject: '요청 설계', value: stats.promptCraft, fullMark: 100 },
    { subject: '복구 감각', value: stats.recovery, fullMark: 100 },
    { subject: '흐름 운영', value: stats.workflow, fullMark: 100 },
  ]

  return (
    <div className="h-[190px] w-full rounded-3xl border border-white/8 bg-white/[0.03] p-2">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="66%">
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.72)', fontSize: 11, fontWeight: 700 }} />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          <Radar dataKey="value" stroke="#6fb1ff" strokeWidth={2} fill="#6fb1ff" fillOpacity={0.35} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
