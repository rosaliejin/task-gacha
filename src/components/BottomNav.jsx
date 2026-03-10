export default function BottomNav({ activeView, setActiveView }) {
  const items = [
    {
      id: 'home',
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
        </svg>
      ),
    },
    {
      id: 'inventory',
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M4 14h4v-4H4v4zm0 5h4v-4H4v4zM4 9h4V5H4v4zm5 5h12v-4H9v4zm0 5h12v-4H9v4zM9 5v4h12V5H9z" />
        </svg>
      ),
    },
    {
      id: 'stats',
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2V9h2v8zm-4 0H8v-4h2v4zm8 0h-2V7h2v10z" />
        </svg>
      ),
    },
  ]

  return (
    <nav className="bottom-nav">
      {items.map(item => (
        <div
          key={item.id}
          className={`nav-item${activeView === item.id ? ' active' : ''}`}
          onClick={() => setActiveView(item.id)}
        >
          {item.icon}
        </div>
      ))}
    </nav>
  )
}
