'use client'
import { useEffect } from 'react'

export default function PWAInit() {
  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => {
          console.log('✅ SW registered:', reg.scope)

          // Check for updates every 30 minutes
          setInterval(() => reg.update(), 30 * 60 * 1000)
        })
        .catch(err => console.error('SW registration failed:', err))
    }

    // Generate PWA icons dynamically (canvas-based)
    generateIcons()
  }, [])

  return null
}

function generateIcons() {
  const sizes = [72, 96, 128, 144, 152, 192, 384, 512]

  sizes.forEach(size => {
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Background
    const grad = ctx.createLinearGradient(0, 0, size, size)
    grad.addColorStop(0, '#2d9cdb')
    grad.addColorStop(1, '#1a7ab8')
    ctx.fillStyle = grad

    // Rounded rectangle
    const r = size * 0.22
    ctx.beginPath()
    ctx.moveTo(r, 0)
    ctx.lineTo(size - r, 0)
    ctx.quadraticCurveTo(size, 0, size, r)
    ctx.lineTo(size, size - r)
    ctx.quadraticCurveTo(size, size, size - r, size)
    ctx.lineTo(r, size)
    ctx.quadraticCurveTo(0, size, 0, size - r)
    ctx.lineTo(0, r)
    ctx.quadraticCurveTo(0, 0, r, 0)
    ctx.closePath()
    ctx.fill()

    // Cross/plus (medical symbol)
    const cw = size * 0.16
    const cx = size / 2
    const cy = size / 2
    const arm = size * 0.28
    ctx.fillStyle = 'white'

    // Vertical bar
    ctx.beginPath()
    ctx.roundRect(cx - cw / 2, cy - arm, cw, arm * 2, cw / 3)
    ctx.fill()

    // Horizontal bar
    ctx.beginPath()
    ctx.roundRect(cx - arm, cy - cw / 2, arm * 2, cw, cw / 3)
    ctx.fill()
  })
}