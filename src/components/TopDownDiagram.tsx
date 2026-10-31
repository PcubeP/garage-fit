import type { Car } from '@/data/cars'
import type { FitResult } from '@/lib/fit'
import { cm } from '@/lib/units'

interface Props {
  car: Car
  spaceLengthMm: number
  spaceWidthMm: number
  fit: FitResult
}

const VW = 300
const VH = 400
const PAD = 44

const COLORS: Record<FitResult['verdict'], string> = {
  fits: '#34d399',
  tight: '#fbbf24',
  no: '#f87171',
}

export function TopDownDiagram({ car, spaceLengthMm, spaceWidthMm, fit }: Props) {
  const color = COLORS[fit.verdict]

  // Fit both the space and the car (car may exceed the space) into the viewport.
  const boundL = Math.max(spaceLengthMm, car.lengthMm)
  const boundW = Math.max(spaceWidthMm, car.widthMm)
  const scale = Math.min((VW - PAD * 2) / boundW, (VH - PAD * 2) / boundL)

  const cx = VW / 2
  const cy = VH / 2
  const sW = spaceWidthMm * scale
  const sL = spaceLengthMm * scale
  const cW = car.widthMm * scale
  const cL = car.lengthMm * scale

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full max-w-[320px]" role="img" aria-label="Top-down fit diagram">
      {/* Parking space */}
      <rect
        x={cx - sW / 2}
        y={cy - sL / 2}
        width={sW}
        height={sL}
        rx={6}
        fill="#18181b"
        stroke="#52525b"
        strokeDasharray="6 5"
        strokeWidth={1.5}
      />
      {/* Car footprint */}
      <rect
        x={cx - cW / 2}
        y={cy - cL / 2}
        width={cW}
        height={cL}
        rx={10}
        fill={`${color}22`}
        stroke={color}
        strokeWidth={2}
      />
      {/* Windshield hint (nose up) */}
      <line
        x1={cx - cW / 2 + 4}
        y1={cy - cL / 2 + cL * 0.22}
        x2={cx + cW / 2 - 4}
        y2={cy - cL / 2 + cL * 0.22}
        stroke={color}
        strokeWidth={1.5}
        opacity={0.6}
      />

      {/* Length clearance label (top gap) */}
      {fit.fitsLength && (
        <text x={cx} y={cy - sL / 2 - 8} fill="#a1a1aa" fontSize="11" textAnchor="middle" fontFamily="monospace">
          {cm(fit.lengthClearMm)} length
        </text>
      )}
      {/* Side clearance label */}
      {fit.fitsWidth && (
        <text
          x={cx + sW / 2 + 6}
          y={cy}
          fill="#a1a1aa"
          fontSize="11"
          textAnchor="start"
          fontFamily="monospace"
          transform={`rotate(90 ${cx + sW / 2 + 6} ${cy})`}
        >
          {cm(fit.perSideMm)}/side
        </text>
      )}
      {!fit.fitsWidth && (
        <text x={cx} y={cy + sL / 2 + 20} fill="#f87171" fontSize="12" textAnchor="middle" fontFamily="monospace">
          too wide by {cm(Math.abs(fit.widthClearMm / 2)).replace('+', '')}/side
        </text>
      )}
    </svg>
  )
}
