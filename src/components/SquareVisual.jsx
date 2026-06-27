export function SquareVisual({ visual }) {
  if (!visual) {
    return null
  }

  if (visual.type === 'bondCircles') {
    const topValue = visual.top ?? ''
    const leftValue = visual.left ?? ''
    const rightValue = visual.right ?? ''

    return (
      <div className="bond-visual" aria-label="Talcirkel med uppdelning">
        <div className={`bond-circle ${visual.top == null ? 'blank' : ''}`}>{topValue}</div>
        <svg className="bond-branches" viewBox="0 0 100 26" aria-hidden="true">
          <line className="bond-line" x1="50" y1="2" x2="18" y2="24" />
          <line className="bond-line" x1="50" y1="2" x2="82" y2="24" />
        </svg>
        <div className="bond-row">
          <div className={`bond-circle ${visual.left == null ? 'blank' : ''}`}>{leftValue}</div>
          <div className={`bond-circle ${visual.right == null ? 'blank' : ''}`}>{rightValue}</div>
        </div>
      </div>
    )
  }

  if (visual.type !== 'squares') {
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
