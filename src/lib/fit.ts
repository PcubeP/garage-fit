import type { Car } from '@/data/cars'

export type Verdict = 'fits' | 'tight' | 'no'

export interface FitResult {
  verdict: Verdict
  fitsLength: boolean
  fitsWidth: boolean
  lengthClearMm: number // total front + back
  widthClearMm: number // total both sides
  perSideMm: number // width clearance per side
  doorNote: string
  headroomMm: number // if a garage height is given (0 = not checked)
  fitsHeight: boolean
}

// Comfortable door opening needs ~600mm per side; ~300mm is a squeeze.
const DOOR_COMFORT_MM = 600
const DOOR_MIN_MM = 300

export function computeFit(
  car: Car,
  spaceLengthMm: number,
  spaceWidthMm: number,
  spaceHeightMm: number,
): FitResult {
  const lengthClearMm = spaceLengthMm - car.lengthMm
  const widthClearMm = spaceWidthMm - car.widthMm
  const perSideMm = widthClearMm / 2

  const fitsLength = lengthClearMm >= 0
  const fitsWidth = widthClearMm >= 0
  const fitsHeight = spaceHeightMm === 0 || spaceHeightMm >= car.heightMm
  const headroomMm = spaceHeightMm === 0 ? 0 : spaceHeightMm - car.heightMm

  let verdict: Verdict
  if (!fitsLength || !fitsWidth || !fitsHeight) verdict = 'no'
  else if (perSideMm < DOOR_MIN_MM || lengthClearMm < 300) verdict = 'tight'
  else verdict = 'fits'

  let doorNote: string
  if (!fitsWidth) doorNote = 'Too wide for the space.'
  else if (perSideMm >= DOOR_COMFORT_MM) doorNote = 'Doors open comfortably on both sides.'
  else if (perSideMm >= DOOR_MIN_MM) doorNote = 'Doors open partway — getting in is snug.'
  else doorNote = 'Barely any door clearance — very tight.'

  return {
    verdict,
    fitsLength,
    fitsWidth,
    lengthClearMm,
    widthClearMm,
    perSideMm,
    doorNote,
    headroomMm,
    fitsHeight,
  }
}
