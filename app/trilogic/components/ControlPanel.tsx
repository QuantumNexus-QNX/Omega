'use client';

/**
 * ControlPanel Component
 * 
 * Interactive controls for applying Möbius transformations
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MOBIUS_PRESETS, COLORS } from '../lib/constants';
import { MobiusParams } from '../lib/math';

interface ControlPanelProps {
  onTransform: (params: MobiusParams) => void;
  onReset: () => void;
  animationSpeed: number;
  onAnimationSpeedChange: (speed: number) => void;
  showProjectionLines: boolean;
  onToggleProjectionLines: () => void;
}

export default function ControlPanel({
  onTransform,
  onReset,
  animationSpeed,
  onAnimationSpeedChange,
  showProjectionLines,
  onToggleProjectionLines
}: ControlPanelProps) {
  const [customParams, setCustomParams] = useState({
    a_re: '1',
    a_im: '0',
    b_re: '0',
    b_im: '0',
    c_re: '0',
    c_im: '0',
    d_re: '1',
    d_im: '0'
  });
  
  const handlePresetClick = (preset: typeof MOBIUS_PRESETS[keyof typeof MOBIUS_PRESETS]) => {
    onTransform(preset);
  };
  
  const handleCustomTransform = () => {
    try {
      const params: MobiusParams = {
        a: { re: parseFloat(customParams.a_re), im: parseFloat(customParams.a_im) },
        b: { re: parseFloat(customParams.b_re), im: parseFloat(customParams.b_im) },
        c: { re: parseFloat(customParams.c_re), im: parseFloat(customParams.c_im) },
        d: { re: parseFloat(customParams.d_re), im: parseFloat(customParams.d_im) }
      };
      
      // Validate that ad - bc ≠ 0
      const a = params.a as { re: number; im: number };
      const b = params.b as { re: number; im: number };
      const c = params.c as { re: number; im: number };
      const d = params.d as { re: number; im: number };
      
      const det = (a.re * d.re - a.im * d.im) - (b.re * c.re - b.im * c.im);
      
      if (Math.abs(det) < 1e-10) {
        alert('Invalid transformation: determinant (ad - bc) must be non-zero');
        return;
      }
      
      onTransform(params);
    } catch (error) {
      alert('Invalid parameters. Please enter valid numbers.');
    }
  };
  
  const updateParam = (key: string, value: string) => {
    setCustomParams(prev => ({ ...prev, [key]: value }));
  };
  
  return (
    <div className="space-y-6">
      {/* Preset Transformations */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-white">Preset Transformations</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.values(MOBIUS_PRESETS).map((preset, idx) => (
            <motion.button
              key={idx}
              onClick={() => handlePresetClick(preset)}
              className="p-4 rounded-lg bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 hover:border-purple-500/60 transition-all backdrop-blur-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-left">
                <div className="font-semibold text-white mb-1">{preset.name}</div>
                <div className="text-xs text-gray-400 font-mono">{preset.description}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Custom Transformation */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-white">Custom Transformation</h3>
        <div className="p-4 rounded-lg bg-black/30 border border-purple-500/20 backdrop-blur-sm">
          <div className="text-sm text-gray-400 mb-3 font-mono">
            M(z) = (az + b)/(cz + d)
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Parameter a */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">a (real)</label>
              <input
                type="number"
                step="0.1"
                value={customParams.a_re}
                onChange={(e) => updateParam('a_re', e.target.value)}
                className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded text-white text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">a (imag)</label>
              <input
                type="number"
                step="0.1"
                value={customParams.a_im}
                onChange={(e) => updateParam('a_im', e.target.value)}
                className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded text-white text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
            
            {/* Parameter b */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">b (real)</label>
              <input
                type="number"
                step="0.1"
                value={customParams.b_re}
                onChange={(e) => updateParam('b_re', e.target.value)}
                className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded text-white text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">b (imag)</label>
              <input
                type="number"
                step="0.1"
                value={customParams.b_im}
                onChange={(e) => updateParam('b_im', e.target.value)}
                className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded text-white text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
            
            {/* Parameter c */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">c (real)</label>
              <input
                type="number"
                step="0.1"
                value={customParams.c_re}
                onChange={(e) => updateParam('c_re', e.target.value)}
                className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded text-white text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">c (imag)</label>
              <input
                type="number"
                step="0.1"
                value={customParams.c_im}
                onChange={(e) => updateParam('c_im', e.target.value)}
                className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded text-white text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
            
            {/* Parameter d */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">d (real)</label>
              <input
                type="number"
                step="0.1"
                value={customParams.d_re}
                onChange={(e) => updateParam('d_re', e.target.value)}
                className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded text-white text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">d (imag)</label>
              <input
                type="number"
                step="0.1"
                value={customParams.d_im}
                onChange={(e) => updateParam('d_im', e.target.value)}
                className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded text-white text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
          
          <motion.button
            onClick={handleCustomTransform}
            className="w-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg text-white font-semibold transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Apply Transform
          </motion.button>
        </div>
      </div>
      
      {/* Controls */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-white">Controls</h3>
        
        {/* Animation Speed */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">
            Animation Speed: {animationSpeed}x
          </label>
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={animationSpeed}
            onChange={(e) => onAnimationSpeedChange(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        
        {/* Toggle Projection Lines */}
        <label className="flex items-center space-x-3 mb-4 cursor-pointer">
          <input
            type="checkbox"
            checked={showProjectionLines}
            onChange={onToggleProjectionLines}
            className="w-5 h-5 rounded border-purple-500/30 bg-black/50 checked:bg-purple-600"
          />
          <span className="text-sm text-gray-300">Show Projection Lines</span>
        </label>
        
        {/* Reset Button */}
        <motion.button
          onClick={onReset}
          className="w-full py-3 bg-gradient-to-r from-red-600/80 to-pink-600/80 hover:from-red-500 hover:to-pink-500 rounded-lg text-white font-semibold transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Reset to Identity
        </motion.button>
      </div>
    </div>
  );
}

