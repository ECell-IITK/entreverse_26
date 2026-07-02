'use client'

import { AlertCircle } from 'lucide-react'

export function Field({
  label,
  required,
  error,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}{required && <span className="ml-0.5 text-primary">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-destructive">
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
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  return (
    <input
      className={`
        w-full rounded-xl border bg-white/[0.04] px-4 py-3 text-sm text-foreground
        placeholder:text-muted-foreground/50 outline-none transition-all duration-200
        focus:bg-white/[0.07] focus:ring-2 focus:ring-primary/40
        ${error ? 'border-destructive/60 focus:ring-destructive/30' : 'border-white/[0.08] focus:border-primary/40'}
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
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }) {
  return (
    <textarea
      rows={3}
      className={`
        w-full rounded-xl border bg-white/[0.04] px-4 py-3 text-sm text-foreground
        placeholder:text-muted-foreground/50 outline-none transition-all duration-200 resize-none
        focus:bg-white/[0.07] focus:ring-2 focus:ring-primary/40
        ${error ? 'border-destructive/60' : 'border-white/[0.08] focus:border-primary/40'}
        ${className}
      `}
      {...props}
    />
  )
}
