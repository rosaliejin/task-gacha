const WEEK_DATA = [
  { day: 'Mon', height: 40 },
  { day: 'Tue', height: 65 },
  { day: 'Wed', height: 55 },
  { day: 'Thu', height: 80 },
  { day: 'Fri', height: 100, today: true },
  { day: 'Sat', height: 30 },
  { day: 'Sun', height: 10, dim: true },
]

const CAT_BARS = [
  { icon: '💼', label: 'Professional', width: '72%', color: 'var(--text-dark)',   val: '96m' },
  { icon: '🧹', label: 'Chores',       width: '30%', color: 'var(--accent-pink)', val: '40m' },
  { icon: '💪', label: 'Health',       width: '22%', color: 'var(--accent-lemon)',val: '24m' },
  { icon: '🎨', label: 'Creative',     width: '15%', color: 'var(--bg-sage)',      val: '20m', outline: true },
]

const TROPHIES = [
  { emoji: '🪴', label: 'Task 10', filled: true, bg: 'var(--surface-light)' },
  { emoji: '☕️', label: 'Task 20', filled: true, bg: 'var(--accent-pink)' },
  { emoji: '',   label: 'Task 30', filled: false },
  { emoji: '',   label: 'Task 40', filled: false },
]

export default function StatsView({ active }) {
  return (
    <div id="view-stats" className={`view${active ? ' active' : ''}`}>
      <div className="header-row">
        <h1>Trophies</h1>
      </div>

      {/* Today summary */}
      <div className="today-row">
        <div className="today-card" style={{ background: 'var(--accent-yellow)' }}>
          <div className="today-icon">✅</div>
          <div className="today-num">7</div>
          <div className="today-lbl">Tasks today</div>
        </div>
        <div className="today-card" style={{ background: 'var(--accent-pink)' }}>
          <div className="today-icon">⏱️</div>
          <div className="today-num">2h 40m</div>
          <div className="today-lbl">Time focused</div>
        </div>
      </div>

      {/* Time by category */}
      <div className="label" style={{ marginTop: 4 }}>Time by Category</div>
      <div className="cat-time-list">
        {CAT_BARS.map(bar => (
          <div key={bar.label} className="cat-time-row">
            <span className="cat-time-icon">{bar.icon}</span>
            <div className="cat-time-bar-wrap">
              <div className="cat-time-label">{bar.label}</div>
              <div className="cat-time-track">
                <div
                  className="cat-time-fill"
                  style={{
                    width: bar.width,
                    background: bar.color,
                    ...(bar.outline ? { border: '1.5px solid var(--text-dark)' } : {}),
                  }}
                />
              </div>
            </div>
            <span className="cat-time-val">{bar.val}</span>
          </div>
        ))}
      </div>

      {/* Weekly chart */}
      <div className="label" style={{ marginTop: 4 }}>This Week</div>
      <div className="week-chart-card">
        <div className="week-bars">
          {WEEK_DATA.map(d => (
            <div key={d.day} className="week-bar-col">
              <div className="week-bar-wrap">
                <div
                  className="week-bar"
                  style={{
                    height: `${d.height}%`,
                    background: d.today ? 'var(--text-dark)' : d.dim ? '#D3DCA9' : 'var(--accent-lemon)',
                  }}
                />
              </div>
              <div className={`week-day${d.today ? ' today' : ''}`}>{d.day}</div>
            </div>
          ))}
        </div>
        <div className="week-chart-legend">🔥 Best day: Friday — 12 tasks</div>
      </div>

      {/* Streak card */}
      <div className="stats-header" style={{ marginTop: 4 }}>
        <div className="stats-info">
          <div className="label" style={{ color: 'var(--text-dark)' }}>Current Streak</div>
          <div className="big-number">27</div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" />
          </div>
          <div className="label" style={{ marginTop: 8, fontSize: '0.75rem', color: 'var(--text-dark)' }}>
            3 more to next prize!
          </div>
        </div>
        <svg width="64" height="64" viewBox="0 0 24 24" style={{ color: 'var(--text-dark)', opacity: 0.2 }}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </div>

      {/* Trophy grid */}
      <div className="label" style={{ marginTop: 4 }}>The Collection</div>
      <div className="trophy-grid">
        {TROPHIES.map((t, i) => (
          <div
            key={i}
            className={`trophy-slot${t.filled ? '' : ' empty'}`}
            style={t.bg ? { backgroundColor: t.bg } : {}}
          >
            {t.filled ? t.emoji : ''}
            <div className="slot-label">{t.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
