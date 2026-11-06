/** Positioned text on the 8px grid. */
export default function Text({ x, y, children, className = '', style }) {
  return (
    <div className={`t ${className}`} style={{ left: x, top: y, ...style }}>
      {children}
    </div>
  )
}
