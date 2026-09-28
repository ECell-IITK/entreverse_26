'use client'

export function EntreVerseLogo({ className = '' }) {
  // Official authentic EntreVerse + Continuum of Innovation lockup matching user reference
  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      <picture className="w-full flex justify-center">
        <source srcSet="/entreverse_lockup_clean.webp" type="image/webp" />
        <img
          src="/entreverse_lockup_clean.png"
          alt="ENTREVERSE — CONTINUUM OF INNOVATION"
          className="w-full h-auto max-w-[860px] object-contain drop-shadow-[0_12px_32px_rgba(0,0,0,0.95)] drop-shadow-[0_0_40px_rgba(0,240,255,0.3)] filter"
          draggable={false}
          priority="true"
        />
      </picture>
    </div>
  )
}
