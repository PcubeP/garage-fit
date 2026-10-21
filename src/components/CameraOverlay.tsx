import { useEffect, useRef, useState } from 'react'
import type { Car } from '@/data/cars'

interface Props {
  car: Car
  onClose: () => void
}

// Overlays the car's footprint on the live camera at a user-set scale, so you
// can eyeball it against a real parking spot. Requires camera permission.
export function CameraOverlay({ car, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [pxPerM, setPxPerM] = useState(70)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let stream: MediaStream | null = null
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false })
      .then((s) => {
        stream = s
        if (videoRef.current) videoRef.current.srcObject = s
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Camera unavailable'))
    return () => stream?.getTracks().forEach((t) => t.stop())
  }, [])

  const w = (car.widthMm / 1000) * pxPerM
  const l = (car.lengthMm / 1000) * pxPerM

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />

      {!error && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            className="rounded-lg border-2 border-accent bg-accent/10"
            style={{ width: `${w}px`, height: `${l}px` }}
          >
            <div className="flex h-full items-center justify-center font-mono text-[11px] text-accent">
              {(car.widthMm / 1000).toFixed(2)} × {(car.lengthMm / 1000).toFixed(2)} m
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
          <p className="font-mono text-sm text-zinc-300">
            Camera unavailable ({error}). The to-scale diagram works without a camera.
          </p>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 space-y-3 bg-gradient-to-t from-black/90 to-transparent p-5 pt-10">
        <label className="block">
          <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-300">
            Scale — match the box to the ground ({pxPerM} px/m)
          </span>
          <input
            type="range"
            min={20}
            max={200}
            value={pxPerM}
            onChange={(e) => setPxPerM(Number(e.target.value))}
            className="mt-2 w-full accent-accent"
          />
        </label>
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm font-medium text-zinc-100 backdrop-blur"
        >
          Close camera
        </button>
      </div>
    </div>
  )
}
