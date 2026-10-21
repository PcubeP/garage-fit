export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

export function mToMm(m: number): number {
  return m * 1000
}

/** Format millimetres as metres with 2 decimals, e.g. 1.74 m. */
export function mm(v: number): string {
  return `${(v / 1000).toFixed(2)} m`
}

/** Format a signed clearance in cm, e.g. +34 cm / −12 cm. */
export function cm(vMm: number): string {
  const c = Math.round(vMm / 10)
  const sign = c > 0 ? '+' : c < 0 ? '−' : ''
  return `${sign}${Math.abs(c)} cm`
}
