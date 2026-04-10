import { Goal, formatAmount } from '@/lib/types'

interface GoalCardProps {
  goal: Goal
  size?: 'large' | 'medium'
}

const colorMap = {
  primary: {
    text: 'text-[#aaffdc]',
    bg: 'bg-[#aaffdc]',
    glow: '0_0_12px_rgba(170,255,220,0.4)',
    badge: 'bg-[#aaffdc]/10 text-[#aaffdc]',
  },
  secondary: {
    text: 'text-[#929bfa]',
    bg: 'bg-[#929bfa]',
    glow: '0_0_8px_rgba(146,155,250,0.3)',
    badge: 'bg-[#929bfa]/10 text-[#929bfa]',
  },
  tertiary: {
    text: 'text-[#7ae6ff]',
    bg: 'bg-[#7ae6ff]',
    glow: '0_0_8px_rgba(122,230,255,0.3)',
    badge: 'bg-[#7ae6ff]/10 text-[#7ae6ff]',
  },
}

export default function GoalCard({ goal, size = 'medium' }: GoalCardProps) {
  const colors = colorMap[goal.color]
  const progress = Math.min((goal.current_amount / goal.target_amount) * 100, 100)
  const remaining = goal.target_amount - goal.current_amount

  const statusLabel =
    progress >= 100 ? 'Completed' :
    progress >= 80 ? 'Almost there' :
    'Ongoing'

  if (size === 'large') {
    return (
      <div className="bg-[#131313] rounded-xl p-8 flex flex-col justify-between min-h-[300px]">
        <div className="flex justify-between items-start">
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 rounded-xl bg-[#262626] flex items-center justify-center">
              <span className={`material-symbols-outlined text-3xl ${colors.text}`}>{goal.icon}</span>
            </div>
            <div>
              <h2 className="font-bold text-2xl text-white" style={{ fontFamily: 'Manrope, sans-serif' }}>{goal.title}</h2>
              {goal.subtitle && (
                <p className="text-[#adaaaa] text-xs uppercase tracking-widest">{goal.subtitle}</p>
              )}
            </div>
          </div>
          {goal.target_date && (
            <div className="text-right">
              <p className="text-[#adaaaa] text-xs mb-1">Target Date</p>
              <p className="font-bold text-white" style={{ fontFamily: 'Manrope, sans-serif' }}>
                {new Date(goal.target_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </p>
            </div>
          )}
        </div>
        <div className="mt-auto">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-[#adaaaa] text-xs mb-1">Current Balance</p>
              <p className={`font-bold text-3xl ${colors.text}`} style={{ fontFamily: 'Manrope, sans-serif' }}>
                {formatAmount(goal.current_amount)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[#adaaaa] text-xs mb-1">Target</p>
              <p className="font-bold text-xl text-white" style={{ fontFamily: 'Manrope, sans-serif' }}>
                {formatAmount(goal.target_amount)}
              </p>
            </div>
          </div>
          <div className="h-3 w-full bg-[#262626] rounded-full overflow-hidden">
            <div
              className={`h-full ${colors.bg} relative transition-all duration-700`}
              style={{ width: `${progress}%`, boxShadow: colors.glow }}
            >
              <div className="absolute right-0 top-0 h-full w-4 bg-white/20 blur-sm" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#131313] rounded-xl p-6 flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div className="w-10 h-10 rounded-xl bg-[#262626] flex items-center justify-center">
          <span className={`material-symbols-outlined ${colors.text}`}>{goal.icon}</span>
        </div>
        <span className={`${colors.badge} px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase`}>
          {statusLabel}
        </span>
      </div>
      <div>
        <h3 className="font-bold text-xl text-white" style={{ fontFamily: 'Manrope, sans-serif' }}>{goal.title}</h3>
        {goal.subtitle && <p className="text-[#adaaaa] text-xs mb-6">{goal.subtitle}</p>}
        <div className="h-2 w-full bg-[#262626] rounded-full mb-4">
          <div
            className={`h-full ${colors.bg} rounded-full transition-all duration-700`}
            style={{ width: `${progress}%`, boxShadow: colors.glow }}
          />
        </div>
        <div className="flex justify-between items-center">
          <p className={`font-bold text-lg ${colors.text}`} style={{ fontFamily: 'Manrope, sans-serif' }}>
            {formatAmount(goal.current_amount)}
          </p>
          <p className="text-[#adaaaa] text-sm">{Math.round(progress)}%</p>
        </div>
      </div>
    </div>
  )
}
