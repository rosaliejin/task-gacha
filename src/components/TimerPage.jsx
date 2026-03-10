import { useState, useEffect, useRef } from 'react'

function pad(n) {
  return String(n).padStart(2, '0')
}

const CAT_LABELS = { professional: '💼 Work', chores: '🧹 Chores', health: '💪 Health', creative: '🎨 Creative' }

export default function TimerPage({ open, task, onClose }) {
  const initialSecs = task ? task.mins * 60 : 0
  const [secsLeft, setSecsLeft] = useState(initialSecs)
  const [running, setRunning]   = useState(false)
  const intervalRef = useRef(null)

  // Reset & auto-start when opened with a new task
  useEffect(() => {
    if (open && task) {
      const secs = task.mins * 60
      setSecsLeft(secs)
      setRunning(true)
    }
    if (!open) {
      clearInterval(intervalRef.current)
      setRunning(false)
    }
  }, [open, task])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecsLeft(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            return 0
          }
          return s - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running])

  function handlePause() {
    setRunning(r => !r)
  }

  function handleDone() {
    clearInterval(intervalRef.current)
    setRunning(false)
    onClose()
  }

  const typeLabel = task ? (CAT_LABELS[task.category] ?? '🎯 Task') : '🎯 Task'
  const m = pad(Math.floor(secsLeft / 60))
  const s = pad(secsLeft % 60)

  return (
    <div className={`timer-page${open ? ' active' : ''}`}>
      <button className="timer-back-btn" onClick={handleDone}>← Back</button>

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 4 }}>🎯</div>
        <div className="timer-task-title">{task ? task.title : ''}</div>
        <div className="timer-type-tag">{typeLabel}</div>
      </div>

      <div className="timer-countdown">{m}:{s}</div>

      <div className="timer-btns">
        <button className="timer-action-btn pause" onClick={handlePause}>
          {running ? '⏸ Pause' : '▶ Resume'}
        </button>
        <button className="timer-action-btn done" onClick={handleDone}>
          ✅ Done!
        </button>
      </div>
    </div>
  )
}
