function starsLabel(n) {
  return '★'.repeat(n) + '☆'.repeat(3 - n)
}

function pad(n) {
  return String(n).padStart(2, '0')
}

export default function TaskOverlay({ open, task, selectedMins, onStart, onSkip, onClose }) {
  const mins = task ? task.mins : selectedMins
  const timeLabel = `${pad(mins)}:00`

  return (
    <div className={`task-overlay${open ? ' active' : ''}`}>
      <button className="overlay-close-btn" onClick={onClose} style={{
        position: 'absolute',
        top: 16,
        right: 16,
        background: 'none',
        border: 'none',
        fontSize: 24,
        cursor: 'pointer',
        padding: 8,
        opacity: 0.7,
        transition: 'opacity 0.2s'
      }} title="Close">
        ✕
      </button>
      <div className="label" style={{ marginBottom: 24 }}>Your Task</div>
      <div className="pulled-capsule">
        <div className="timer-display">{timeLabel}</div>
        <div className="task-name">{task ? task.title : ''}</div>
        <div className="label" style={{ marginTop: 16, opacity: 0.7 }}>
          {task ? starsLabel(task.stars) : ''}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
        <button className="btn-close-overlay" onClick={onStart}>
          ▶ Start Timer
        </button>
        <button className="btn-skip" onClick={onSkip} style={{
          background: 'var(--bg-light)',
          color: 'var(--text-dark)',
          border: '2px solid var(--text-dark)',
          borderRadius: 8,
          padding: '12px 24px',
          fontSize: 16,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}>
          Skip Task
        </button>
      </div>
    </div>
  )
}
