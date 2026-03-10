import { useState } from 'react'
import GachaMachine from '../components/GachaMachine'

const TIME_OPTIONS = [10, 20, 30, 60]

const CATEGORIES = [
  { slug: 'professional', icon: '💼', label: 'Work'     },
  { slug: 'chores',       icon: '🧹', label: 'Chores'   },
  { slug: 'health',       icon: '💪', label: 'Health'   },
  { slug: 'creative',     icon: '🎨', label: 'Creative' },
]

export default function HomeView({
  active, tasks, selectedMins, setSelectedMins,
  selectedCats, setSelectedCats, onDraw,
}) {
  const [shaking, setShaking] = useState(false)
  const [drawing, setDrawing] = useState(false)

  function toggleCat(slug) {
    setSelectedCats(prev =>
      prev.includes(slug) ? prev.filter(c => c !== slug) : [...prev, slug]
    )
  }

  const activeCats = selectedCats.length > 0 ? selectedCats : CATEGORIES.map(c => c.slug)
  const matchCount = tasks.filter(t => t.mins <= selectedMins && activeCats.includes(t.category)).length
  const displayCount = matchCount > 0 ? matchCount : tasks.length

  function handleDraw() {
    if (drawing) return
    setShaking(true)
    setDrawing(true)
    setTimeout(() => {
      setShaking(false)
      onDraw()
      setTimeout(() => setDrawing(false), 300)
    }, 500)
  }

  return (
    <div id="view-home" className={`view${active ? ' active' : ''}`}>
      {/* Header */}
      <div className="header-row">
        <div>
          <div className="label">Ready to roll?</div>
          <h1>Let's go.</h1>
        </div>
        <button className="info-btn">
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
          </svg>
        </button>
      </div>

      {/* Time selector */}
      <div className="time-selector-row">
        <span className="label" style={{ marginBottom: 6, display: 'block' }}>I have…</span>
        <div className="time-chip-group">
          {TIME_OPTIONS.map(m => (
            <button
              key={m}
              className={`time-chip${selectedMins === m ? ' active' : ''}`}
              onClick={() => setSelectedMins(m)}
            >
              {m}m
            </button>
          ))}
        </div>
      </div>

      {/* Category multi-select */}
      <div>
        <span className="label" style={{ marginBottom: 8, display: 'block' }}>
          From{selectedCats.length === 0 ? ' all categories' : ` ${selectedCats.length} categor${selectedCats.length === 1 ? 'y' : 'ies'}`}
        </span>
        <div className="cat-filter-grid">
          {CATEGORIES.map(cat => {
            const isSelected = selectedCats.includes(cat.slug)
            return (
              <button
                key={cat.slug}
                className={`cat-filter-chip${isSelected ? ' selected' : ''}`}
                onClick={() => toggleCat(cat.slug)}
              >
                <span className="cat-filter-icon">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Gacha stage */}
      <div className="gacha-stage" style={{ position: 'relative' }}>
        <div className="task-count-badge">🎲 {displayCount} tasks</div>
        <GachaMachine shaking={shaking} />
      </div>

      {/* Draw button */}
      <div className="draw-btn-wrapper">
        <button className="draw-btn" onClick={handleDraw}>
          {drawing ? 'DRAWING...' : 'DRAW TASK'}
        </button>
      </div>
    </div>
  )
}
