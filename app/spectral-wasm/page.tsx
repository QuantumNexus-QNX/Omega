'use client';


import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useSpectralTriple, unpackSquare } from '@/app/hooks/useSpectralTriple';
import { TransitionMatrixEditor } from '@/app/components/spectral/TransitionMatrixEditor';
import { DistanceHeatmap } from '@/app/components/spectral/DistanceHeatmap';
import { EigenvalueSpectrum } from '@/app/components/spectral/EigenvalueSpectrum';
import AddendumBValidation from '@/app/components/spectral/AddendumBValidation';
import { mdsClassical3D, normalizeToUnitBox } from '@/app/utils/mds';

// Lazy-load 3D bundle
const MdsEmbedding3D = dynamic(() => import('@/app/components/spectral/MdsEmbedding3D'), { ssr: false });

const PRESETS: Record<string, { matrix: number[][], labels: string[] }> = {
  'Addendum B (3-state)': {
    matrix: [
      [0.95, 0.05, 0.00],
      [0.02, 0.94, 0.04],
      [0.00, 0.05, 0.95],
    ],
    labels: ['State 1', 'State 2', 'State 3'],
  },
  'Uniform (3-state)': {
    matrix: [
      [1/3, 1/3, 1/3],
      [1/3, 1/3, 1/3],
      [1/3, 1/3, 1/3],
    ],
    labels: ['U1', 'U2', 'U3'],
  },
  '4-Cycle': {
    matrix: [
      [0.1, 0.9, 0.0, 0.0],
      [0.0, 0.1, 0.9, 0.0],
      [0.0, 0.0, 0.1, 0.9],
      [0.9, 0.0, 0.0, 0.1],
    ],
    labels: ['A', 'B', 'C', 'D'],
  },
};

export default function SpectralWASMPage() {
  const [presetKey, setPresetKey] = useState<keyof typeof PRESETS>('Addendum B (3-state)');
  const [matrix, setMatrix] = useState<number[][]>(PRESETS[presetKey].matrix);
  const [labels, setLabels] = useState<string[]>(PRESETS[presetKey].labels);
  const [epsilon, setEpsilon] = useState(0.001);
  const [show3D, setShow3D] = useState(true);

  const { result, error, loading } = useSpectralTriple(matrix, epsilon);
  const distances2D = useMemo(() => (result ? unpackSquare(result.distances, result.n) : null), [result]);

  // 3D MDS points (unit box normalized)
  const points3D = useMemo(() => {
    if (!distances2D) return [];
    const X = mdsClassical3D(distances2D);
    return normalizeToUnitBox(X).pts;
  }, [distances2D]);

  function loadPreset(k: keyof typeof PRESETS) {
    setPresetKey(k);
    setMatrix(PRESETS[k].matrix);
    setLabels(PRESETS[k].labels);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-purple-950/20 to-neutral-950 text-white p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <a href="/" className="text-gray-400 hover:text-white transition-colors text-sm">← Back</a>
                <a href="mailto:link@trivector.ai" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Contact</a>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">Spectral Triple Geometry (Rust/WASM)</h1>
            </div>
          </div>
          <p className="text-neutral-400">
            Connes distance via Rust + WebAssembly; 2D heatmap and 3D MDS embedding.
          </p>
        </header>

        {/* Top controls */}
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm opacity-80">Preset</label>
          <select
            className="px-2 py-1 rounded bg-neutral-900 border border-neutral-700"
            value={presetKey}
            onChange={e => loadPreset(e.target.value as any)}
          >
            {Object.keys(PRESETS).map(key => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>

          <div className="ml-auto flex items-center gap-3">
            <label className="text-sm opacity-80">ε</label>
            <input
              aria-label="epsilon"
              type="range" min="-6" max="-1" step="0.1"
              value={Math.log10(epsilon)}
              onChange={e => setEpsilon(Math.pow(10, parseFloat(e.target.value)))}
            />
            <span className="text-sm tabular-nums w-20">{epsilon.toExponential(2)}</span>

            <label className="text-sm opacity-80 flex items-center gap-2">
              <input
                type="checkbox"
                checked={show3D}
                onChange={e => setShow3D(e.target.checked)}
              />
              Show 3D MDS
            </label>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Matrix Editor */}
            <div className="rounded-2xl p-4 border border-neutral-700 space-y-4">
              <TransitionMatrixEditor
                matrix={matrix}
                onChange={setMatrix}
                labels={labels}
                onLabelsChange={setLabels}
              />
              <p className="text-xs opacity-70">Tip: Use "Normalize" per-row or "Normalize All Rows" to ensure a valid stochastic matrix.</p>
            </div>

            {/* Results */}
            {loading && (
              <div className="rounded-2xl p-4 border border-neutral-700" role="status" aria-live="polite">
                Computing spectral triple via WASM…
              </div>
            )}
            {error && (
              <div className="rounded-2xl p-4 border border-rose-700 bg-rose-950/40" role="alert">
                <h3 className="font-semibold mb-1">Computation Error</h3>
                <pre className="text-sm whitespace-pre-wrap">{error}</pre>
              </div>
            )}
            {result && distances2D && (
              <DistanceHeatmap distances={distances2D} labels={labels} />
            )}

            {/* 3D MDS (lazy-loaded) */}
            {result && distances2D && show3D && (
              <MdsEmbedding3D points={points3D as any} labels={labels} />
            )}
          </div>

          <aside className="space-y-6">
            {result && (
              <>
                {/* Stationary distribution */}
                <div className="rounded-2xl p-4 border border-neutral-700">
                  <h3 className="font-semibold mb-2">Stationary Distribution π</h3>
                  <div className="space-y-1 text-sm">
                    {result.stationary.map((pi, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-24 opacity-70">{labels[i]}</div>
                        <div className="flex-1 bg-neutral-800 rounded h-2 overflow-hidden" aria-hidden>
                          <div className="bg-emerald-400 h-2" style={{ width: `${(pi * 100).toFixed(2)}%` }} />
                        </div>
                        <div className="w-20 text-right tabular-nums" aria-label={`π[${labels[i]}]`}>{pi.toFixed(4)}</div>
                      </div>
                    ))}
                    <div className="text-xs opacity-70">
                      Sum: {result.stationary.reduce((a, b) => a + b, 0).toFixed(6)}
                    </div>
                  </div>
                </div>

                {/* Eigenvalues + gap */}
                <EigenvalueSpectrum
                  eigenvalues={result.eigenvalues}
                  spectralGap={result.conditioning.spectral_gap}
                />

                {/* Ill-conditioning indicator */}
                {result.conditioning.ill_conditioned && (
                  <div className="rounded-lg p-3 border border-amber-700/50 bg-amber-900/10 text-sm">
                    <div className="font-semibold text-amber-400">⚠️ Ill-conditioned</div>
                    <div className="text-xs opacity-70 mt-1">
                      Tiny spectral gap or nonzero λ₀; results may be numerically fragile.
                    </div>
                  </div>
                )}

                {/* Addendum B validation */}
                <AddendumBValidation />
              </>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
