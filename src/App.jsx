import { useState, useEffect, useRef } from 'react'
import BottomNav from './components/BottomNav'
import TaskOverlay from './components/TaskOverlay'
import TimerPage from './components/TimerPage'
import HomeView from './views/HomeView'
import InventoryView from './views/InventoryView'
import StatsView from './views/StatsView'

const ALL_CATS = ['professional', 'chores', 'health', 'creative']

const INITIAL_TASKS = [
  { id: 1, title: 'Read Design Article', category: 'professional', mins: 20, stars: 2, importance: 2 },
  { id: 2, title: 'Water the Plants',    category: 'chores',       mins: 10, stars: 1, importance: 1 },
  { id: 3, title: 'Clean out Inbox',     category: 'professional', mins: 30, stars: 3, importance: 3 },
  { id: 4, title: 'Stretching Routine',  category: 'health',       mins: 15, stars: 2, importance: 2 },
  { id: 5, title: 'Sketch UI Concepts',  category: 'creative',     mins: 60, stars: 3, importance: 1 },
  { id: 6, title: 'Tidy Desk',           category: 'chores',       mins: 10, stars: 1, importance: 1 },
]

export default function App() {
  const containerRef = useRef(null)
  const [activeView, setActiveView]         = useState('home')
  const [tasks, setTasks]                   = useState(INITIAL_TASKS)
  const [selectedMins, setSelectedMins]     = useState(20)
  // All categories selected by default (empty array = all)
  const [selectedCats, setSelectedCats]     = useState([])
  const [drawnTask, setDrawnTask]           = useState(null)
  const [overlayOpen, setOverlayOpen]       = useState(false)
  const [timerOpen, setTimerOpen]           = useState(false)
  const [timerTask, setTimerTask]           = useState(null)

  // Prevent browser scroll-into-view from scrolling the app container
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const reset = () => { if (el.scrollTop !== 0) el.scrollTop = 0 }
    el.addEventListener('scroll', reset)
    return () => el.removeEventListener('scroll', reset)
  }, [])

  function handleDraw() {
    if (tasks.length === 0) return
    // Filter by time and category
    const activeCats = selectedCats.length > 0 ? selectedCats : ALL_CATS
    let pool = tasks.filter(t => t.mins <= selectedMins && activeCats.includes(t.category))
    if (pool.length === 0) pool = tasks.filter(t => activeCats.includes(t.category))
    if (pool.length === 0) pool = tasks
    // Weight by importance
    const weighted = pool.flatMap(t => Array(t.importance ?? 1).fill(t))
    const picked = weighted[Math.floor(Math.random() * weighted.length)]
    setDrawnTask(picked)
    setOverlayOpen(true)
  }

  function handleStartTimer() {
    setOverlayOpen(false)
    setTimerTask(drawnTask)
    setTimerOpen(true)
  }

  function handleTimerClose() {
    setTimerOpen(false)
    setTimerTask(null)
  }

  function handleOverlayClose() {
    setOverlayOpen(false)
    setDrawnTask(null)
  }

  function addTask(task) {
    setTasks(prev => [...prev, { importance: 2, ...task, id: Date.now() }])
  }

  function deleteTask(id) {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div className="app-container" ref={containerRef}>
      <HomeView
        active={activeView === 'home'}
        tasks={tasks}
        selectedMins={selectedMins}
        setSelectedMins={setSelectedMins}
        selectedCats={selectedCats}
        setSelectedCats={setSelectedCats}
        onDraw={handleDraw}
      />
      <InventoryView
        active={activeView === 'inventory'}
        tasks={tasks}
        onAddTask={addTask}
        onDeleteTask={deleteTask}
      />
      <StatsView active={activeView === 'stats'} tasks={tasks} />

      <BottomNav activeView={activeView} setActiveView={setActiveView} />

      <TaskOverlay
        open={overlayOpen}
        task={drawnTask}
        selectedMins={selectedMins}
        onStart={handleStartTimer}
        onSkip={handleDraw}
        onClose={handleOverlayClose}
      />
      <TimerPage
        open={timerOpen}
        task={timerTask}
        onClose={handleTimerClose}
      />
    </div>
  )
}
