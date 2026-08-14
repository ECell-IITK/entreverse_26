'use client'

import { useEffect, useRef } from 'react'

const VIOLET = [30, 63, 255]
const BLUE = [22, 153, 255]
const WARM = [94, 200, 255]

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

      // Lean particle count for maximum performance
      const count = Math.min(45, Math.max(25, Math.round(width / 35)))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.2 + 0.4,
        speed: Math.random() * 0.2 + 0.05,
        alpha: Math.random() * 0.6 + 0.2,
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      // Ambient glows (drawn once per tick simply)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.y -= p.speed
        if (p.y < -4) {
          p.y = height + 4
          p.x = Math.random() * width
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${WARM.join(',')}, ${p.alpha})`
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
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#060a14] will-change-transform"
    >
      {/* Deep space radial background */}
      <div className="absolute inset-0 bg-[radial-gradient(140%_120%_at_50%_10%,#0c1533_0%,#070c1a_55%,#040710_100%)]" />

      {/* GPU accelerated ambient glow orbs */}
      <div className="absolute -left-20 bottom-0 h-[32rem] w-[32rem] rounded-full bg-[#1e3fff]/12 blur-[100px] will-change-transform" />
      <div className="absolute -right-20 top-20 h-[30rem] w-[30rem] rounded-full bg-[#3b6bff]/10 blur-[100px] will-change-transform" />
      <div className="absolute left-1/2 top-[35%] h-[40rem] w-[55rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(5,4,15,0.6),transparent)] blur-2xl will-change-transform" />

      {/* Lightweight canvas particle starfield */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full pointer-events-none" />

      {/* Vignette edge layer */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(4,7,16,0.35)_80%,rgba(4,7,16,0.7)_100%)]" />
    </div>
  )
}

export default SpaceBackground
