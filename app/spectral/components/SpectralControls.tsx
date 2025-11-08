'use client';

import React, { useState } from 'react';
import { PRESET_MODELS, validateTransitionMatrix } from '../lib/spectral-triple';

interface SpectralControlsProps {
  onModelChange: (matrix: number[][], epsilon: number) => void;
  currentDimension: number;
}

export const SpectralControls: React.FC<SpectralControlsProps> = ({
  onModelChange,
  currentDimension
}) => {
  const [selectedPreset, setSelectedPreset] = useState('ADDENDUM_B');
  const [epsilon, setEpsilon] = useState(1e-3);
  const [customMatrix, setCustomMatrix] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handlePresetChange = (presetKey: string) => {
    setSelectedPreset(presetKey);
    setShowCustom(false);
    setValidationError(null);
    
    const preset = PRESET_MODELS[presetKey as keyof typeof PRESET_MODELS];
    onModelChange(preset.matrix, preset.epsilon);
  };

  const handleCustomSubmit = () => {
    try {
      // Parse custom matrix
      const parsed = JSON.parse(customMatrix);
      
      if (!Array.isArray(parsed) || !parsed.every(row => Array.isArray(row))) {
        throw new Error('Matrix must be a 2D array');
      }

      // Validate
      const validation = validateTransitionMatrix(parsed);
      if (!validation.valid) {
        setValidationError(validation.errors.join('; '));
        return;
      }

      setValidationError(null);
      onModelChange(parsed, epsilon);
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : 'Invalid JSON');
    }
  };

  const handleEpsilonChange = (value: number) => {
    setEpsilon(value);
    
    // Re-apply current model with new epsilon
    if (showCustom && customMatrix) {
      try {
        const parsed = JSON.parse(customMatrix);
        onModelChange(parsed, value);
      } catch (e) {
        // Ignore if custom matrix is invalid
      }
    } else {
      const preset = PRESET_MODELS[selectedPreset as keyof typeof PRESET_MODELS];
      onModelChange(preset.matrix, value);
    }
  };

  return (
    <div className="space-y-6">
      {/* Preset Models */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          Preset Markov Models
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(PRESET_MODELS).map(([key, model]) => (
            <button
              key={key}
              onClick={() => handlePresetChange(key)}
              className={`
                p-4 rounded-lg border-2 transition-all text-left
                ${selectedPreset === key && !showCustom
                  ? 'border-cyan-500 bg-cyan-500/10'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                }
              `}
            >
              <div className="font-semibold text-white mb-1">{model.name}</div>
              <div className="text-sm text-gray-400">{model.description}</div>
              <div className="text-xs text-gray-500 mt-2 font-mono">
                {model.matrix.length}×{model.matrix.length} states
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Model Builder */}
      <div>
        <button
          onClick={() => setShowCustom(!showCustom)}
          className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors mb-3"
        >
          <span className="text-xl">{showCustom ? '▼' : '▶'}</span>
          <span className="font-semibold">Custom Model Builder</span>
        </button>

        {showCustom && (
          <div className="space-y-3 pl-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Transition Matrix (JSON format)
              </label>
              <textarea
                value={customMatrix}
                onChange={(e) => setCustomMatrix(e.target.value)}
                placeholder='[[0.95, 0.05], [0.02, 0.98]]'
                className="w-full h-32 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-purple-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter a square matrix where each row sums to 1.0
              </p>
            </div>

            {validationError && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                ⚠️ {validationError}
              </div>
            )}

            <button
              onClick={handleCustomSubmit}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
            >
              Apply Custom Model
            </button>
          </div>
        )}
      </div>

      {/* Epsilon Parameter */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span className="text-2xl">⚙️</span>
          Regularization Parameter
        </h3>
        
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-gray-400">ε (epsilon)</label>
            <span className="text-cyan-400 font-mono font-bold">
              {epsilon.toExponential(2)}
            </span>
          </div>
          
          <input
            type="range"
            min="-6"
            max="-1"
            step="0.1"
            value={Math.log10(epsilon)}
            onChange={(e) => handleEpsilonChange(Math.pow(10, parseFloat(e.target.value)))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>10⁻⁶</span>
            <span>10⁻¹</span>
          </div>

          <p className="text-xs text-gray-400 mt-3">
            Controls Dirac operator regularization. Smaller values increase sensitivity to state differences.
          </p>
        </div>
      </div>

      {/* Info Panel */}
      <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-lg p-4">
        <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
          <span>💡</span>
          About Spectral Triples
        </h4>
        <p className="text-sm text-gray-300 leading-relaxed">
          A spectral triple (𝒜, ℋ, 𝒟) encodes the geometry of a finite state space. 
          The <span className="text-cyan-400 font-semibold">Dirac operator 𝒟</span> measures 
          distinguishability between states via the <span className="text-purple-400 font-semibold">Connes distance</span>.
        </p>
      </div>
    </div>
  );
};
