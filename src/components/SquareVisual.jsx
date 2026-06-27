export function SquareVisual({ visual }) {
  if (!visual || visual.type !== 'squares') {
    return null
  }

  const columns = Math.min(10, visual.total)

  return (
    <div
      className="square-visual"
      style={{ '--square-columns': columns }}
      aria-label={`${visual.filled} ifyllda av ${visual.total} rutor`}
    >
      {Array.from({ length: visual.total }, (_, index) => (
        <span
          key={`${visual.total}-${index}`}
          className={`square-cell ${index < visual.filled ? 'filled' : 'empty'}`}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}
