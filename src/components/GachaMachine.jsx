export default function GachaMachine({ shaking }) {
  return (
    <div className={`scallop-shape${shaking ? ' shake' : ''}`}>
      <div className="bg-capsule bg-cap-1" />
      <div className="bg-capsule bg-cap-2" />
      <div className="bg-capsule bg-cap-3" />

      {/* Mascot SVG */}
      <svg className="mascot" viewBox="0 0 100 100">
        {/* ears */}
        <path d="M20 50 L20 10 L45 35 Z" fill="var(--text-dark)" />
        <path d="M80 50 L80 10 L55 35 Z" fill="var(--text-dark)" />
        {/* head */}
        <circle cx="50" cy="55" r="40" fill="var(--text-dark)" />
        {/* face */}
        <circle cx="50" cy="60" r="32" fill="var(--bg-sage)" />
        {/* eyes */}
        <circle cx="38" cy="55" r="4" fill="var(--text-dark)" />
        <circle cx="62" cy="55" r="4" fill="var(--text-dark)" />
        {/* mouth */}
        <path d="M48 62 Q50 65 52 62" stroke="var(--text-dark)" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M50 62 L50 66" stroke="var(--text-dark)" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M45 68 Q50 72 55 68" stroke="var(--text-dark)" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  )
}
