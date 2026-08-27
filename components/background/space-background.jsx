'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

const VIOLET = [139, 92, 246]
const CYAN = [0, 240, 255]
const INDIGO = [99, 102, 241]

export function SpaceBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let width = 0
    let height = 0
    let dpr = 1
    let particles = []
    let animationFrame = 0

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.min(45, Math.max(25, Math.round(width / 35)))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: height * 0.2 + Math.random() * (height * 0.8),
        radius: Math.random() * 1.5 + 0.6,
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: -(Math.random() * 0.35 + 0.15),
        alpha: Math.random() * 0.75 + 0.25,
        color: Math.random() > 0.6 ? VIOLET : Math.random() > 0.3 ? CYAN : INDIGO,
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      // Floating ambient glowing particles (Violet, Indigo, Cyan)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.y += p.speedY
        p.x += p.speedX
        if (p.y < -10) {
          p.y = height + 10
          p.x = Math.random() * width
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color.join(',')}, ${p.alpha})`
        ctx.shadowBlur = p.radius * 7
        ctx.shadowColor = `rgba(${p.color.join(',')}, 0.85)`
        ctx.fill()
      }

      animationFrame = requestAnimationFrame(draw)
    }

    resize()
    draw()

    const handleResize = () => {
      resize()
    }

    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#030014] will-change-transform"
    >
      {/* ── 1. The High-Fidelity Electro-Violet & Cyan Theme Artwork ── */}
      <div className="absolute inset-0">
        <Image
          src="/theme_bg.png"
          alt="EntreVerse Electro-Violet Cyber Theme"
          fill
          priority
          className="object-cover object-center select-none opacity-90"
          sizes="100vw"
        />
      </div>

      {/* ── 2. Subtle Dark Vignette for Text Contrast ── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(3,0,20,0.25)_0%,rgba(3,0,20,0.55)_70%,rgba(3,0,20,0.85)_100%)]" />

      {/* ── 3. High-Voltage Neon Core Glows ── */}
      <div className="absolute -left-12 bottom-0 h-[30rem] w-[30rem] rounded-full bg-[#7c3aed]/25 blur-[120px]" />
      <div className="absolute -right-12 bottom-0 h-[30rem] w-[30rem] rounded-full bg-[#00f0ff]/20 blur-[120px]" />

      {/* ── 4. Interactive Live Particle Canvas ── */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full pointer-events-none" />
    </div>
  )
}

export default SpaceBackground
