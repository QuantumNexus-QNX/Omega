'use client';

import { useEffect, useState } from 'react';

export interface SpectralTripleResult {
  n: number;
  stationary: number[];          // length n
  eigenvalues: number[];         // Dirac/Laplacian spectrum (as returned by wasm)
  dirac: number[];               // flattened n x n (if exported by wasm)
  distances: number[];           // flattened n x n Connes distances
  conditioning: {
    spectral_gap: number;
    epsilon: number;
    max_commutator_norm: number;
    ill_conditioned: boolean;
  };
}

let wasmModule: any = null;
let wasmLoading: Promise<any> | null = null;

async function initWasm() {
  if (wasmModule) return wasmModule;
  if (wasmLoading) return wasmLoading;
  
  if (typeof window === 'undefined') {
    return null;
  }

  const GLUE = '/wasm/connes_distance_wasm.js';

  async function loadGlue() {
    try {
      // Sanity-check that we aren't about to import an HTML error page
      const res = await fetch(GLUE, { method: 'HEAD' });
      if (!res.ok) {
        throw new Error(`Failed to load ${GLUE} (HTTP ${res.status}). WASM files may not be deployed correctly.`);
      }
      const ct = res.headers.get('content-type') || '';
      if (ct.includes('text/html')) {
        throw new Error(`Expected JS at ${GLUE} but got HTML (likely missing in deployment). Please check if public/wasm/ files are deployed.`);
      }
      
      // Avoid bundler transforms; load from /public at runtime
      // @ts-ignore
      const mod = await import(/* webpackIgnore: true */ GLUE);
      if (typeof mod?.default === 'function') {
        await mod.default();
      }
      wasmModule = mod;
      return mod;
    } catch (e: any) {
      console.error('WASM loading failed:', e);
      wasmLoading = null;
      throw new Error(`WASM module loading failed: ${e.message}. This likely means the WASM files in public/wasm/ are not being served correctly by the deployment.`);
    }
  }

  wasmLoading = loadGlue();
  return wasmLoading;
}

export function useSpectralTriple(P: number[][], epsilon = 0.001) {
  const [result, setResult] = useState<SpectralTripleResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true); setError(null);
      try {
        const wasm = await initWasm();
        if (!wasm || cancelled) return;
        
        const n = P.length;
        const flat = new Float64Array(P.flat());
        const out: SpectralTripleResult = wasm.compute_spectral_triple(flat, n, epsilon);
        if (!cancelled) setResult(out);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(P), epsilon]);

  return { result, error, loading };
}

export async function getWasmModule(): Promise<any> {
  return initWasm();
}

export function unpackSquare(flat: number[], n: number) {
  const M: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) M[i][j] = flat[i * n + j];
  return M;
}
