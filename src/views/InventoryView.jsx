import { useState, useEffect, useRef } from 'react'

const SpeechRecognition =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null

const DEFAULT_CAT_DEFS = [
  { slug: 'professional', icon: '💼', label: 'Professional' },
  { slug: 'chores',       icon: '🧹', label: 'Chores'       },
  { slug: 'health',       icon: '💪', label: 'Health'       },
  { slug: 'creative',     icon: '🎨', label: 'Creative'     },
]

const TIME_TAGS = [10, 20, 30, 60]

const IMPORTANCE_OPTS = [
  { value: 1, label: '!',   tip: 'Low' },
  { value: 2, label: '!!',  tip: 'Med' },
  { value: 3, label: '!!!', tip: 'High' },
]

const importanceColor = {
  1: 'var(--accent-lemon)',
  2: 'var(--accent-yellow)',
  3: 'var(--accent-pink)',
}

function starsLabel(n) {
  return '★'.repeat(n) + '☆'.repeat(3 - n)
}

function useMicInput(onTranscript) {
  const [listening, setListening] = useState(false)
  const recRef = useRef(null)

  useEffect(() => {
    if (!SpeechRecognition) return
    const rec = new SpeechRecognition()
    rec.continuous = false
    rec.interimResults = false
    rec.lang = 'en-US'
    rec.onresult = (e) => {
      const text = e.results[0]?.[0]?.transcript ?? ''
      if (text) onTranscript(text)
    }
    rec.onend = () => setListening(false)
    rec.onerror = () => setListening(false)
    recRef.current = rec
    return () => rec.abort()
  }, []) // eslint-disable-line

  function toggle() {
    if (!recRef.current) return
    if (listening) {
      recRef.current.stop()
      setListening(false)
    } else {
      recRef.current.start()
      setListening(true)
    }
  }

  return { listening, toggle, supported: !!SpeechRecognition }
}

export default function InventoryView({ active, tasks, onAddTask, onDeleteTask }) {
  const [filterCat, setFilterCat]     = useState('all')
  const [taskInput, setTaskInput]     = useState('')
  const [selectedTagMins, setTagMins] = useState(30)
  const [selectedStars, setStars]     = useState(2)
  const [selectedCat, setCat]         = useState('professional')
  const [importance, setImportance]   = useState(2)
  const [modalOpen, setModalOpen]     = useState(false)
  const [newCatName, setNewCatName]   = useState('')
  const [extraCats, setExtraCats]     = useState([])

  const allCatDefs = [...DEFAULT_CAT_DEFS, ...extraCats]
  const catMap = Object.fromEntries(allCatDefs.map(c => [c.slug, c]))

  const { listening, toggle: toggleMic, supported: micSupported } = useMicInput((text) => {
    setTaskInput(prev => prev ? prev + ' ' + text : text)
  })

  function handleAddTask() {
    const title = taskInput.trim()
    if (!title) return
    onAddTask({ title, category: selectedCat, mins: selectedTagMins, stars: selectedStars, importance })
    setTaskInput('')
  }

  function handleAddCategory() {
    const name = newCatName.trim()
    if (!name) return
    const slug = name.toLowerCase().replace(/\s+/g, '-')
    if (!allCatDefs.find(c => c.slug === slug)) {
      setExtraCats(prev => [...prev, { slug, icon: '📁', label: name }])
    }
    setNewCatName('')
    setModalOpen(false)
  }

  const visibleTasks = filterCat === 'all'
    ? tasks
    : tasks.filter(t => t.category === filterCat)

  return (
    <div id="view-inventory" className={`view${active ? ' active' : ''}`}>
      {/* Header */}
      <div className="header-row">
        <h1>Inventory</h1>
        <div className="label">{tasks.length} Active</div>
      </div>

      {/* Filter tabs */}
      <div className="cat-tabs">
        <button
          className={`cat-tab${filterCat === 'all' ? ' active' : ''}`}
          onClick={() => setFilterCat('all')}
        >All</button>
        {allCatDefs.map(c => (
          <button
            key={c.slug}
            className={`cat-tab${filterCat === c.slug ? ' active' : ''}`}
            onClick={() => setFilterCat(c.slug)}
          >
            {c.icon} {c.label}
          </button>
        ))}
        <button className="cat-tab add-cat" onClick={() => setModalOpen(true)}>+ New</button>
      </div>

      {/* Add task card */}
      <div className="input-card">
        {/* Text input + diction mic */}
        <div className="input-row">
          <input
            className="task-text-input"
            type="text"
            placeholder="Add a new task…"
            value={taskInput}
            onChange={e => setTaskInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddTask()}
          />
          <button
            className={`mic-btn${listening ? ' mic-btn--listening' : ''}`}
            onClick={micSupported ? toggleMic : handleAddTask}
            title={micSupported ? 'Diction — tap to speak' : 'Add task'}
            style={{ flexDirection: 'column', height: 54, width: 54, gap: 2 }}
          >
            {listening
              ? <svg width="20" height="20" viewBox="0 0 24 24"><path d="M6 6h12v12H6z"/></svg>
              : micSupported
                ? <svg width="20" height="20" viewBox="0 0 24 24"><path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/></svg>
                : <svg width="20" height="20" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            }
            <span style={{ fontSize: '0.6rem', fontWeight: 800, lineHeight: 1 }}>
              {listening ? 'Stop' : micSupported ? 'Diction' : '+'}
            </span>
          </button>
        </div>

        {/* Time chips + stars */}
        <div className="tag-row">
          <span className="label" style={{ fontSize: '0.7rem', flexShrink: 0 }}>Time</span>
          {TIME_TAGS.map(m => (
            <div
              key={m}
              className={`tag-chip${selectedTagMins === m ? ' active-tag' : ''}`}
              onClick={() => setTagMins(m)}
            >{m}m</div>
          ))}
          <div className="star-rating">
            {[1, 2, 3].map(n => (
              <svg key={n} className={n <= selectedStars ? 'active' : ''} width="20" height="20" viewBox="0 0 24 24" onClick={() => setStars(n)} style={{ cursor: 'pointer' }}>
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
          </div>
        </div>

        {/* Category picker */}
        <div className="tag-row">
          <span className="label" style={{ fontSize: '0.7rem', flexShrink: 0 }}>Cat.</span>
          {allCatDefs.map(c => (
            <div
              key={c.slug}
              className={`tag-chip${selectedCat === c.slug ? ' active-tag' : ''}`}
              onClick={() => setCat(c.slug)}
            >
              {c.icon} {c.label}
            </div>
          ))}
        </div>

        {/* Priority picker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="label" style={{ fontSize: '0.7rem', flexShrink: 0 }}>Priority</span>
          <div style={{ display: 'flex', gap: 6, flex: 1 }}>
            {IMPORTANCE_OPTS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setImportance(opt.value)}
                title={opt.tip}
                style={{
                  flex: 1, padding: '9px 4px',
                  borderRadius: 12, border: 'none',
                  background: importance === opt.value ? importanceColor[opt.value] : 'var(--bg-sage)',
                  fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '0.95rem',
                  color: 'var(--text-dark)', cursor: 'pointer', transition: 'background 0.15s',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-medium)', minWidth: 30 }}>
            {IMPORTANCE_OPTS.find(o => o.value === importance)?.tip}
          </span>
        </div>

        {/* Add button */}
        <button
          onClick={handleAddTask}
          style={{
            width: '100%', padding: '14px', borderRadius: 20, border: 'none',
            background: 'var(--text-dark)', color: 'var(--surface-light)',
            fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
          }}
        >
          + Add Task
        </button>
      </div>

      {/* Task list */}
      <div className="task-list">
        {visibleTasks.map((task, idx) => {
          const cat = catMap[task.category] ?? { icon: '📁', label: task.category }
          return (
            <div key={task.id} className="task-item">
              {/* Importance stripe */}
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, width: 8,
                background: importanceColor[task.importance ?? 2],
              }} />
              <div className="task-info" style={{ paddingLeft: 12 }}>
                <div className="task-title">{task.title}</div>
                <div className="task-meta">
                  {starsLabel(task.stars ?? 2)} · {cat.icon} {cat.label} · {'!'.repeat(task.importance ?? 2)}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <div className="task-time">{task.mins}m</div>
                <button
                  onClick={() => onDeleteTask(task.id)}
                  style={{
                    background: 'var(--bg-sage)', border: 'none',
                    width: 32, height: 32, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: 'var(--text-medium)', fontSize: '1.1rem', fontWeight: 700,
                  }}
                >×</button>
              </div>
            </div>
          )
        })}
      </div>

      {/* New category modal */}
      <div className={`new-cat-modal${modalOpen ? ' open' : ''}`}>
        <div className="new-cat-card">
          <div className="new-cat-title">New Category</div>
          <input
            className="new-cat-input"
            type="text"
            placeholder="e.g. Learning, Finance…"
            value={newCatName}
            onChange={e => setNewCatName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
          />
          <div className="new-cat-actions">
            <button className="new-cat-btn cancel" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="new-cat-btn confirm" onClick={handleAddCategory}>Add</button>
          </div>
        </div>
      </div>
    </div>
  )
}
