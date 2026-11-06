/** A sprite from /public/sprites at pixel coordinates. */
export default function Sprite({ src, x, y, w, h, className = '', style }) {
  return (
    <img
      src={`/sprites/${src}.png`}
      alt=""
      draggable={false}
      className={`abs ${className}`}
      style={{ left: x, top: y, width: w, height: h, ...style }}
    />
  )
}
