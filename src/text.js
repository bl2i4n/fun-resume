/*
 * Text helpers for the 18 character x 2 line Game Boy text box.
 */
export const COLS = 18
export const ROWS = 2

/** Word-wrap a string into lines of at most `cols` characters. Honors explicit \n. */
export function wrap(str, cols = COLS) {
  const out = []
  for (const para of String(str).split('\n')) {
    let line = ''
    for (const word of para.split(' ')) {
      if (word.length > cols) {
        if (line) { out.push(line); line = '' }
        for (let i = 0; i < word.length; i += cols) out.push(word.slice(i, i + cols))
        continue
      }
      if (!line) line = word
      else if (line.length + 1 + word.length <= cols) line += ' ' + word
      else { out.push(line); line = word }
    }
    out.push(line)
  }
  return out
}

/**
 * Turn an array of strings into text-box pages: each page is `rows` lines.
 * Every input string starts a new page; long strings spill onto extra pages.
 */
export function pages(strings, cols = COLS, rows = ROWS) {
  const result = []
  for (const s of strings) {
    const lines = wrap(s, cols)
    for (let i = 0; i < lines.length; i += rows) result.push(lines.slice(i, i + rows))
  }
  return result
}
