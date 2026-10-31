import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { CARS } from '@/data/cars'
import { computeFit, type Verdict } from '@/lib/fit'
import { TopDownDiagram } from '@/components/TopDownDiagram'
import { CameraOverlay } from '@/components/CameraOverlay'
import { cn, mm, mToMm } from '@/lib/units'

const VERDICT_META: Record<Verdict, { label: string; ring: string; text: string }> = {
  fits: { label: 'It fits', ring: 'border-emerald-500/40 bg-emerald-500/10', text: 'text-emerald-400' },
  tight: { label: 'Tight fit', ring: 'border-amber-500/40 bg-amber-500/10', text: 'text-amber-400' },
  no: { label: "Won't fit", ring: 'border-red-500/40 bg-red-500/10', text: 'text-red-400' },
}

export default function App() {
  const [carId, setCarId] = useState(CARS[0].id)
  const [lengthM, setLengthM] = useState(5.0)
  const [widthM, setWidthM] = useState(2.5)
  const [heightM, setHeightM] = useState(0)
  const [camera, setCamera] = useState(false)

  const car = useMemo(() => CARS.find((c) => c.id === carId)!, [carId])
  const fit = useMemo(
    () => computeFit(car, mToMm(lengthM), mToMm(widthM), mToMm(heightM)),
    [car, lengthM, widthM, heightM],
  )
  const meta = VERDICT_META[fit.verdict]

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col px-5 py-10">
      <header className="mb-6">
        <div className="flex items-center gap-3">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent" />
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-zinc-500">Garage Fit</span>
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-50">Will it fit?</h1>
        <p className="mt-2 text-zinc-400">
          Pick a car and your parking space to see if it fits — with door and length clearances.
        </p>
      </header>

      <div className="space-y-4">
        <Field label="Car">
          <select
            value={carId}
            onChange={(e) => setCarId(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm"
          >
            {CARS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <p className="mt-1.5 font-mono text-[11px] text-zinc-500">
            {mm(car.lengthMm)} L · {mm(car.widthMm)} W · {mm(car.heightMm)} H
          </p>
        </Field>

        <div className="grid grid-cols-3 gap-3">
          <NumberField label="Space length" unit="m" value={lengthM} onChange={setLengthM} step={0.1} />
          <NumberField label="Space width" unit="m" value={widthM} onChange={setWidthM} step={0.1} />
          <NumberField label="Height (opt)" unit="m" value={heightM} onChange={setHeightM} step={0.1} />
        </div>
      </div>

      <motion.div layout className={cn('mt-6 rounded-2xl border p-5', meta.ring)}>
        <div className="flex items-baseline justify-between">
          <span className={cn('text-2xl font-semibold', meta.text)}>{meta.label}</span>
          <span className="font-mono text-xs text-zinc-400">{car.name}</span>
        </div>
        <p className="mt-2 text-sm text-zinc-300">{fit.doorNote}</p>
        <div className="mt-3 grid grid-cols-2 gap-2 font-mono text-xs text-zinc-400">
          <Stat label="Length gap" ok={fit.fitsLength} value={fit.fitsLength ? clearance(fit.lengthClearMm) : 'too long'} />
          <Stat label="Per-side gap" ok={fit.fitsWidth} value={fit.fitsWidth ? clearance(fit.perSideMm) : 'too wide'} />
          {heightM > 0 && (
            <Stat label="Headroom" ok={fit.fitsHeight} value={fit.fitsHeight ? clearance(fit.headroomMm) : 'too tall'} />
          )}
        </div>
      </motion.div>

      <div className="mt-6 flex justify-center">
        <TopDownDiagram car={car} spaceLengthMm={mToMm(lengthM)} spaceWidthMm={mToMm(widthM)} fit={fit} />
      </div>

      <button
        type="button"
        onClick={() => setCamera(true)}
        className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 font-medium text-zinc-900 transition-transform active:scale-[0.99]"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 8a2 2 0 0 1 2-2h1l1-2h8l1 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
          <circle cx="12" cy="12.5" r="3.2" />
        </svg>
        Overlay on live camera
      </button>

      <footer className="mt-8 font-mono text-[11px] leading-relaxed text-zinc-600">
        Dimensions are approximate manufacturer figures (mirrors folded). Camera overlay is a visual
        aid — calibrate the scale by eye against the ground.
      </footer>

      {camera && <CameraOverlay car={car} onClose={() => setCamera(false)} />}
    </div>
  )
}

function clearance(mmVal: number): string {
  return `${Math.round(mmVal / 10)} cm`
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  )
}

function NumberField({
  label,
  unit,
  value,
  onChange,
  step,
}: {
  label: string
  unit: string
  value: number
  onChange: (v: number) => void
  step: number
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">{label}</span>
      <div className="mt-1.5 flex items-center rounded-lg border border-zinc-700 bg-zinc-950 px-2">
        <input
          type="number"
          min={0}
          step={step}
          value={value || ''}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full bg-transparent py-2.5 text-sm outline-none"
        />
        <span className="font-mono text-xs text-zinc-500">{unit}</span>
      </div>
    </label>
  )
}

function Stat({ label, ok, value }: { label: string; ok: boolean; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={cn('h-1.5 w-1.5 rounded-full', ok ? 'bg-emerald-400' : 'bg-red-400')} />
      <span className="text-zinc-500">{label}:</span>
      <span className="text-zinc-200">{value}</span>
    </div>
  )
}
