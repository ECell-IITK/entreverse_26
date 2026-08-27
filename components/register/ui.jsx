'use client'

import { AlertCircle } from 'lucide-react'

export function Field({
  label,
  required,
  error,
  children,
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
        {label}{required && <span className="ml-1 text-[#00f0ff]">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-400">
          <AlertCircle className="h-3 w-3 shrink-0" />{error}
        </p>
      )}
    </div>
  )
}

export function Input({
  error,
  className = '',
  ...props
}) {
  return (
    <input
      className={`
        w-full rounded-xl border bg-black/40 px-4 py-3 text-sm text-white
        placeholder:text-slate-500 outline-none transition-all duration-200
        focus:bg-violet-950/30 focus:ring-2 focus:ring-[#00f0ff]/50 focus:border-[#00f0ff]
        ${error ? 'border-destructive/60 focus:ring-destructive/30' : 'border-violet-500/25'}
        ${className}
      `}
      {...props}
    />
  )
}

export function Textarea({
  error,
  className = '',
  ...props
}) {
  return (
    <textarea
      rows={3}
      className={`
        w-full rounded-xl border bg-black/40 px-4 py-3 text-sm text-white
        placeholder:text-slate-500 outline-none transition-all duration-200 resize-none
        focus:bg-violet-950/30 focus:ring-2 focus:ring-[#00f0ff]/50 focus:border-[#00f0ff]
        ${error ? 'border-destructive/60' : 'border-violet-500/25'}
        ${className}
      `}
      {...props}
    />
  )
}
