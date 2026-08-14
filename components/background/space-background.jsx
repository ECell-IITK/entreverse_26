'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'

const VIOLET = [30, 63, 255]    // #1e3fff — deep saturated blue
const BLUE = [22, 153, 255]
const WARM = [94, 200, 255]      // #5ec8ff — electric light-blue highlight
const ICE = [190, 230, 255]

const CLEAR_ZONE = { x: 0.52, y: 0.4, rx: 0.34, ry: 0.3 }

function clearZoneFalloff(nx, ny) {
  const dx = (nx - CLEAR_ZONE.x) / CLEAR_ZONE.rx
  const dy = (ny - CLEAR_ZONE.y) / CLEAR_ZONE.ry
  const d = Math.sqrt(dx * dx + dy * dy)
  return Math.min(1, Math.max(0, (d - 0.55) / 0.65))
}

/** The braided crossing wave — violet in from the left, blue out to the right. */
function drawFlowWave(ctx, width, height, time) {
  const sway = Math.sin(time * 0.00026) * 16
  const breathe = 0.88 + Math.sin(time * 0.00042) * 0.12

  const p0 = { x: -width * 0.12, y: height * 0.7 }
  const c1 = { x: width * 0.1, y: height * 1.0 + sway }
  const c2 = { x: width * 0.42, y: height * 0.5 - sway }
  const p1 = { x: width * 1.08, y: height * 0.6 }

  const crossX = width * 0.23
  const crossY = height * 0.89

  for (let line = 0; line < 11; line += 1) {
    const offset = (line - 5) * 5.5
    const t = line / 10

    const gradient = ctx.createLinearGradient(p0.x, p0.y, p1.x, p1.y)
    gradient.addColorStop(0, `rgba(${VIOLET.join(',')}, 0)`)
    gradient.addColorStop(0.16, `rgba(${VIOLET.join(',')}, ${(0.4 - Math.abs(t - 0.12) * 0.55) * breathe})`)
    gradient.addColorStop(0.29, `rgba(${WARM.join(',')}, ${(0.62 - Math.abs(t - 0.5) * 0.7) * breathe})`)
    gradient.addColorStop(0.5, `rgba(${BLUE.join(',')}, ${(0.36 - Math.abs(t - 0.65) * 0.45) * breathe})`)
    gradient.addColorStop(1, `rgba(${BLUE.join(',')}, 0)`)

    ctx.beginPath()
    ctx.moveTo(p0.x, p0.y + offset)
    ctx.bezierCurveTo(c1.x, c1.y + offset, c2.x, c2.y + offset, p1.x, p1.y + offset * 1.4)
    ctx.strokeStyle = gradient
    ctx.lineWidth = line === 5 ? 2.4 : 0.8
    ctx.shadowBlur = line === 5 ? 24 : 0
    ctx.shadowColor = `rgba(${WARM.join(',')}, 0.7)`
    ctx.stroke()
  }
  ctx.shadowBlur = 0

  const flare = ctx.createRadialGradient(crossX, crossY, 0, crossX, crossY, 110)
  flare.addColorStop(0, `rgba(${WARM.join(',')}, ${0.3 * breathe})`)
  flare.addColorStop(0.35, `rgba(${VIOLET.join(',')}, ${0.14 * breathe})`)
  flare.addColorStop(1, 'rgba(151,46,255,0)')
  ctx.fillStyle = flare
  ctx.fillRect(crossX - 110, crossY - 110, 220, 220)

  return { crossX, crossY }
}

/** Bright diagonal streaks tearing off toward the top corners, with a traveling pulse. */
function drawCometStreaks(ctx, width, height, time) {
  const streaks = [
    { from: [width * 0.02, height * 0.62], to: [width * -0.06, -30], color: VIOLET, width: 1.1, speed: 0.00018, phase: 0 },
    { from: [width * 0.1, height * 0.5], to: [width * 0.02, -40], color: VIOLET, width: 0.7, speed: 0.00014, phase: 1.4 },
    { from: [width * 0.98, height * 0.5], to: [width * 1.07, -30], color: BLUE, width: 1.6, speed: 0.0002, phase: 0.6 },
    { from: [width * 0.88, height * 0.58], to: [width * 0.98, -40], color: ICE, width: 0.9, speed: 0.00022, phase: 2.1 },
    { from: [width * 0.93, height * 0.68], to: [width * 1.02, 20], color: BLUE, width: 0.6, speed: 0.00016, phase: 3.0 },
  ]

  for (const s of streaks) {
    const g = ctx.createLinearGradient(s.from[0], s.from[1], s.to[0], s.to[1])
    g.addColorStop(0, `rgba(${s.color.join(',')}, 0.02)`)
    g.addColorStop(0.6, `rgba(${s.color.join(',')}, 0.22)`)
    g.addColorStop(1, `rgba(${s.color.join(',')}, 0)`)
    ctx.beginPath()
    ctx.moveTo(s.from[0], s.from[1])
    ctx.lineTo(s.to[0], s.to[1])
    ctx.strokeStyle = g
    ctx.lineWidth = s.width
    ctx.stroke()

    // Traveling bright pulse along the streak.
    const tPos = (Math.sin(time * s.speed + s.phase) + 1) / 2
    const px = s.from[0] + (s.to[0] - s.from[0]) * tPos
    const py = s.from[1] + (s.to[1] - s.from[1]) * tPos
    const pulse = ctx.createRadialGradient(px, py, 0, px, py, 14)
    pulse.addColorStop(0, `rgba(${s.color.join(',')}, 0.55)`)
    pulse.addColorStop(1, `rgba(${s.color.join(',')}, 0)`)
    ctx.fillStyle = pulse
    ctx.fillRect(px - 14, py - 14, 28, 28)
  }
}

function drawShards(ctx, shards, time) {
  for (const s of shards) {
    const angle = s.rotation + time * s.spin * 0.0002
    const color = s.hue === 'violet' ? VIOLET : WARM
    ctx.save()
    ctx.translate(s.x, s.y)
    ctx.rotate(angle)
    ctx.beginPath()
    ctx.moveTo(0, -s.size)
    ctx.lineTo(s.size * 0.55, s.size * 0.4)
    ctx.lineTo(-s.size * 0.5, s.size * 0.5)
    ctx.closePath()
    ctx.fillStyle = `rgba(${color.join(',')}, ${s.alpha})`
    ctx.fill()
    ctx.restore()
  }
}

function drawCornerDots(ctx, width, height) {
  const spacing = 20
  const cols = 8
  const rows = 7
  const corners = [
    { ox: width * 0.035, oy: height * 0.06, dir: 1 },
    { ox: width * 0.965, oy: height * 0.08, dir: -1 },
  ]

  ctx.save()
  for (const corner of corners) {
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const x = corner.ox + corner.dir * col * spacing
        const y = corner.oy + row * spacing
        const fade = 1 - Math.hypot(col / cols, row / rows)
        if (fade <= 0.05) continue
        ctx.beginPath()
        ctx.arc(x, y, 1.2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(61, 107, 255, ${0.28 * fade})`   // #3d6bff dots
        ctx.fill()
      }
    }
  }
  ctx.restore()
}

function drawHexAccent(ctx, cx, cy, size, alpha) {
  ctx.beginPath()
  for (let i = 0; i < 6; i += 1) {
    const angle = (Math.PI / 3) * i - Math.PI / 6
    const px = cx + size * Math.cos(angle)
    const py = cy + size * Math.sin(angle)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
  ctx.strokeStyle = `rgba(61, 107, 255, ${alpha})`   // #3d6bff hex outlines
  ctx.lineWidth = 1
  ctx.stroke()
}

function drawHexAccents(ctx, width, height, time) {
  const pulse = 0.7 + Math.sin(time * 0.0006) * 0.3
  const spots = [
    { x: width * 0.82, y: height * 0.34, size: 38 },
    { x: width * 0.91, y: height * 0.48, size: 24 },
    { x: width * 0.87, y: height * 0.63, size: 17 },
    { x: width * 0.79, y: height * 0.56, size: 14 },
    { x: width * 0.15, y: height * 0.2, size: 20 },
  ]
  for (const s of spots) drawHexAccent(ctx, s.x, s.y, s.size, 0.11 * pulse)
}

function drawNebula(ctx, width, height, time) {
  const driftX = Math.sin(time * 0.00008) * width * 0.03
  const driftY = Math.cos(time * 0.00009) * height * 0.02
  const cx = width * 0.55 + driftX
  const cy = height * 0.38 + driftY
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, width * 0.5)
  g.addColorStop(0, 'rgba(8, 30, 100, 0.07)')    // deep navy core
  g.addColorStop(0.5, 'rgba(10, 30, 90, 0.04)')
  g.addColorStop(1, 'rgba(5, 15, 60, 0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, width, height)
}

export function SpaceBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = 0
    let height = 0
    let dpr = 1
    let particles = []
    let shards = []
    let animationFrame = 0
    let resizeObserver

    const resize = () => {
      width = canvas.clientWidth
      height = canvas.clientHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.min(160, Math.max(60, Math.round((width * height) / 12500)))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.3 + 0.3,
        speed: Math.random() * 0.15 + 0.03,
        drift: (Math.random() - 0.5) * 0.06,
        alpha: Math.random() * 0.55 + 0.18,
        phase: Math.random() * Math.PI * 2,
        linkable: Math.random() < 0.3,
      }))

      const shardCount = Math.min(16, Math.max(8, Math.round(width / 130)))
      shards = Array.from({ length: shardCount }, () => {
        const angle = Math.random() * Math.PI * 2
        const dist = 60 + Math.random() * 220
        return {
          x: width * 0.24 + Math.cos(angle) * dist * 0.7,
          y: height * 0.86 + Math.sin(angle) * dist * 0.35,
          size: Math.random() * 7 + 3,
          rotation: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 2,
          alpha: Math.random() * 0.2 + 0.08,
          hue: Math.random() < 0.6 ? 'violet' : 'warm',
        }
      })
    }

    const draw = (time) => {
      ctx.clearRect(0, 0, width, height)

      const pulse = 0.9 + Math.sin(time * 0.0004) * 0.1
      const violetGlow = ctx.createRadialGradient(width * 0.12, height * 0.92, 0, width * 0.12, height * 0.92, width * 0.5)
      violetGlow.addColorStop(0, `rgba(${VIOLET.join(',')}, ${0.18 * pulse})`)
      violetGlow.addColorStop(1, 'rgba(30,63,255,0)')
      ctx.fillStyle = violetGlow
      ctx.fillRect(0, 0, width, height)

      const blueGlow = ctx.createRadialGradient(width * 0.92, height * 0.82, 0, width * 0.92, height * 0.82, width * 0.5)
      blueGlow.addColorStop(0, `rgba(${BLUE.join(',')}, ${0.15 * pulse})`)
      blueGlow.addColorStop(1, 'rgba(22,153,255,0)')
      ctx.fillStyle = blueGlow
      ctx.fillRect(0, 0, width, height)

      drawNebula(ctx, width, height, reducedMotion ? 0 : time)
      drawCornerDots(ctx, width, height)
      drawHexAccents(ctx, width, height, reducedMotion ? 0 : time)

      const linkDist = 105
      for (const p of particles) {
        if (!reducedMotion) {
          p.y -= p.speed
          p.x += Math.sin(time * 0.00025 + p.phase) * 0.1 + p.drift * 0.02
          if (p.y < -4) {
            p.y = height + 4
            p.x = Math.random() * width
          }
        }
      }

      for (let i = 0; i < particles.length; i += 1) {
        const a = particles[i]
        if (!a.linkable) continue
        for (let j = i + 1; j < particles.length; j += 1) {
          const b = particles[j]
          if (!b.linkable) continue
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.hypot(dx, dy)
          if (dist < linkDist) {
            const nx = (a.x + b.x) / 2 / width
            const ny = (a.y + b.y) / 2 / height
            const clear = 1 - clearZoneFalloff(nx, ny)
            const alpha = (1 - dist / linkDist) * 0.1 * (1 - clear * 0.8)
            if (alpha <= 0.002) continue
            ctx.strokeStyle = `rgba(61, 107, 255, ${alpha})`  // #3d6bff blue threads
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      for (const p of particles) {
        const nx = p.x / width
        const ny = p.y / height
        const clear = 1 - clearZoneFalloff(nx, ny)
        const twinkle = 0.6 + Math.sin(time * 0.0009 + p.phase) * 0.4
        const alpha = p.alpha * twinkle * (1 - clear * 0.7)
        if (alpha <= 0.01) continue
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(94, 200, 255, ${alpha})`   // #5ec8ff electric-blue dust
        ctx.fill()
      }

      drawFlowWave(ctx, width, height, reducedMotion ? 0 : time)
      drawShards(ctx, shards, reducedMotion ? 0 : time)
      drawCometStreaks(ctx, width, height, reducedMotion ? 0 : time)

      const shimmerX = ((time * 0.00006) % 1.6) - 0.3
      const shimmer = ctx.createLinearGradient(width * shimmerX, 0, width * shimmerX + width * 0.4, height)
      shimmer.addColorStop(0, 'rgba(255,255,255,0)')
      shimmer.addColorStop(0.5, 'rgba(210, 200, 255, 0.02)')
      shimmer.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = shimmer
      ctx.fillRect(0, 0, width, height)

      if (!reducedMotion) animationFrame = requestAnimationFrame(draw)
    }

    resize()
    draw(0)
    if (!reducedMotion) animationFrame = requestAnimationFrame(draw)

    resizeObserver = new ResizeObserver(() => {
      resize()
      draw(performance.now())
    })
    resizeObserver.observe(canvas)

    return () => {
      cancelAnimationFrame(animationFrame)
      resizeObserver?.disconnect()
    }
  }, [])

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#080d1a]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.4, ease: 'easeOut' }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(140%_120%_at_50%_10%,#0d1635_0%,#080d1a_55%,#050810_100%)]" />

      <motion.div
        className="absolute -left-24 bottom-0 h-[34rem] w-[34rem] rounded-full bg-[#1e3fff]/14 blur-[110px]"
        animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.08, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-20 bottom-10 h-[30rem] w-[30rem] rounded-full bg-[#3b6bff]/12 blur-[110px]"
        animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.1, 1] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      />
      <motion.div
        className="absolute left-1/2 top-[38%] h-[46rem] w-[62rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(5,4,15,0.6),transparent)] blur-2xl"
        animate={{ opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(5,8,16,0.30)_75%,rgba(5,8,16,0.65)_100%)]" />
    </motion.div>
  )
}

export default SpaceBackground
