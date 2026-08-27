import { CheckCircle2 } from 'lucide-react'

const STEPS = [
  { n: 1, label: 'Competition' },
  { n: 2, label: 'Team' },
  { n: 3, label: 'Members' },
]

export default function StepBar({ current }) {
  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {STEPS.map((s, i) => {
        const done = current > s.n
        const active = current === s.n
        return (
          <div key={s.n} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div className={`
                flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-200
                ${done
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_0_12px_rgba(124,58,237,0.6)]'
                  : active
                  ? 'bg-violet-950/80 text-[#00f0ff] ring-2 ring-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                  : 'bg-white/5 text-slate-400 border border-white/10'
                }
              `}>
                {done ? <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#00f0ff]" /> : s.n}
              </div>
              <span className={`hidden sm:block text-[10px] font-semibold tracking-wider uppercase transition-colors ${active ? 'text-[#00f0ff]' : done ? 'text-violet-300' : 'text-slate-400'}`}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 w-6 sm:w-12 mx-1.5 sm:mx-2 mb-0 sm:mb-4 transition-all duration-300 ${done ? 'bg-gradient-to-r from-violet-500 to-[#00f0ff]' : 'bg-white/10'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
