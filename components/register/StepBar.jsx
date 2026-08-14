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
                ${done ? 'bg-primary text-white' : active ? 'bg-primary/20 text-primary ring-2 ring-primary' : 'bg-white/5 text-muted-foreground'}
              `}>
                {done ? <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : s.n}
              </div>
              <span className={`hidden sm:block text-[10px] font-medium tracking-wide uppercase transition-colors ${active ? 'text-primary' : done ? 'text-foreground/60' : 'text-muted-foreground'}`}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-px w-6 sm:w-14 mx-1.5 sm:mx-2 mb-0 sm:mb-4 transition-all duration-300 ${done ? 'bg-primary/60' : 'bg-white/10'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
