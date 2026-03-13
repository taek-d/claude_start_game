import { useEffect, useState } from 'react'

export default function TransitionScene({ day, title, subtitle, onComplete }) {
  const [phase, setPhase] = useState('enter')

  useEffect(() => {
    const holdTimer = window.setTimeout(() => setPhase('hold'), 180)
    const exitTimer = window.setTimeout(() => setPhase('exit'), 2400)
    const doneTimer = window.setTimeout(() => onComplete(), 3000)
    return () => {
      window.clearTimeout(holdTimer)
      window.clearTimeout(exitTimer)
      window.clearTimeout(doneTimer)
    }
  }, [onComplete])

  const visible = phase === 'hold'
  const exiting = phase === 'exit'

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#020817',
        opacity: exiting ? 0 : 1,
        transition: 'opacity 0.6s ease',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: '540px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(111,177,255,0.16) 0%, transparent 70%)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.8s ease',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(18px) scale(0.96)',
          opacity: visible ? 1 : 0,
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <p style={{ fontSize: '12px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(103,198,255,0.75)', fontWeight: 700 }}>
          Quest {day}
        </p>
        <h1 style={{ marginTop: '16px', fontSize: 'clamp(30px, 5vw, 48px)', lineHeight: 1.1, color: '#f8fafc', fontWeight: 900 }}>
          {title}
        </h1>
        <p style={{ marginTop: '12px', fontSize: '16px', color: 'rgba(255,255,255,0.55)' }}>
          {subtitle}
        </p>
      </div>
    </div>
  )
}
