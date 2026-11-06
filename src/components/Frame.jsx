/** A Gen 1 double-line box at pixel coordinates. */
export default function Frame({ x, y, w, h, children, style, className = '' }) {
  return (
    <div className={`frame ${className}`} style={{ left: x, top: y, width: w, height: h, ...style }}>
      {children}
    </div>
  )
}
