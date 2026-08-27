import { motion } from 'motion/react'
import { Crown, Trash2 } from 'lucide-react'
import { Field, Input } from '@/components/register/ui'

export default function MemberCard({
  member,
  index,
  isOnly,
  onChange,
  onRemove,
  onSetLeader,
  errors = {},
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.22 }}
      className={`relative rounded-2xl border p-5 transition-all duration-300
        ${member.is_leader ? 'border-violet-500/50 bg-violet-950/40 shadow-[0_0_20px_rgba(124,58,237,0.15)]' : 'border-white/[0.08] bg-white/[0.03]'}`}
    >
      {member.is_leader && (
        <div className="absolute -top-2.5 left-4 flex items-center gap-1 rounded-full border border-[#00f0ff]/50 bg-[#030014] px-2.5 py-0.5 text-[10px] font-bold text-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.4)]">
          <Crown className="h-3 w-3 text-[#00f0ff]" /> Team Leader
        </div>
      )}

      <div className="mb-4 flex items-center justify-between">
        <span className="font-heading text-sm font-semibold text-white">
          Member {index + 1}
        </span>
        <div className="flex items-center gap-2">
          {!member.is_leader && (
            <button type="button" onClick={onSetLeader}
              className="flex items-center gap-1 rounded-lg border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 text-[10px] font-medium text-violet-300 transition-all hover:border-[#00f0ff]/40 hover:text-white">
              <Crown className="h-3 w-3 text-violet-400" /> Set as Leader
            </button>
          )}
          {!isOnly && (
            <button type="button" onClick={onRemove}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition-all hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full Name" required error={errors.name}>
          <Input placeholder="Rahul Sharma" value={member.name}
            onChange={e => onChange('name', e.target.value)} error={errors.name} />
        </Field>
        <Field label="Roll Number" required error={errors.roll_no}>
          <Input placeholder="24XX0XXX" value={member.roll_no}
            onChange={e => onChange('roll_no', e.target.value)} error={errors.roll_no} />
        </Field>
        <Field label="Email" required error={errors.email}>
          <Input type="email" placeholder="rahul@iitk.ac.in" value={member.email}
            onChange={e => onChange('email', e.target.value)} error={errors.email} />
        </Field>
        <Field label="Phone" required error={errors.phone}>
          <Input type="tel" placeholder="+91 98765 43210" value={member.phone}
            onChange={e => onChange('phone', e.target.value)} error={errors.phone} />
        </Field>
      </div>
    </motion.div>
  )
}
