/** Positioned text on the 8px grid. `center` centers it horizontally across the screen (or `width`). */
export default function Text({ x = 0, y, children, className = '', style, center = false, width = 240 }) {
  const pos = center ? { left: x, width, textAlign: 'center' } : { left: x }
  return (
    <div className={`t ${className}`} style={{ ...pos, top: y, ...style }}>
      {children}
    </div>
  )
}
