# Tri-Logic Visualizer

An interactive 3D visualization of the tri-logic system {0, 1, ∅} mapped onto the Riemann sphere, demonstrating stereographic projection, Möbius transformations, and Kleene three-valued logic.

## Overview

Tri-logic is the minimal complete logic system that allows superposition. Unlike binary logic which only has true (1) and false (0), tri-logic includes a third value: **undefined (∅)**. This visualizer demonstrates how these three truth values map naturally onto the Riemann sphere and how Möbius transformations preserve the structure of this logical system.

## Mathematical Foundation

### Truth Value Mapping

The three truth values map to specific points on the Riemann sphere:

- **False (0)** → South pole: (0, -1, 0)
- **True (1)** → North pole: (0, 1, 0)
- **Undefined (∅)** → Point at infinity (visualized at north pole)

### Stereographic Projection

The stereographic projection maps points on the unit sphere S² to the complex plane ℂ:

```
π(X, Y, Z) = (X + iY)/(1 - Z)
```

**Inverse projection** (complex plane to sphere):

```
π⁻¹(x + iy) = (2x/(1+|z|²), 2y/(1+|z|²), (|z|²-1)/(1+|z|²))
where z = x + iy
```

**Properties:**
- Conformal (angle-preserving)
- Maps circles to circles
- North pole maps to infinity
- Invertible everywhere except at north pole

### Möbius Transformations

Möbius transformations are the symmetries of the Riemann sphere:

```
M(z) = (az + b)/(cz + d) where ad - bc ≠ 0
```

**Properties:**
- Preserve cross-ratios
- Map circles to circles
- Form a group under composition
- Conformal (angle-preserving)

**Example transformations:**
- Identity: M(z) = z
- Inversion: M(z) = 1/z (swaps 0 ↔ ∞)
- Rotation: M(z) = e^(iθ)z
- Translation: M(z) = z + b

### Cross-Ratio Preservation

The cross-ratio of four points is preserved under Möbius transformations:

```
(z₁, z₂; z₃, z₄) = [(z₁ - z₃)(z₂ - z₄)] / [(z₁ - z₄)(z₂ - z₃)]
```

This invariant demonstrates that while individual points move under transformation, their relative configuration remains constant—analogous to how quantum entanglement preserves correlations.

### K3 (Kleene) Logic

Kleene three-valued logic defines operations with undefined values:

**AND (∧):**
```
AND | 0 | 1 | ∅
----|---|---|---
 0  | 0 | 0 | 0
 1  | 0 | 1 | ∅
 ∅  | 0 | ∅ | ∅
```

**OR (∨):**
```
OR  | 0 | 1 | ∅
----|---|---|---
 0  | 0 | 1 | ∅
 1  | 1 | 1 | 1
 ∅  | ∅ | 1 | ∅
```

**NOT (¬):**
```
NOT | Result
----|-------
 0  |   1
 1  |   0
 ∅  |   ∅
```

**Key principle:** Undefined (∅) propagates through operations unless a definite value forces a result.

## Component Structure

```
/app/trilogic/
├── page.tsx                    # Main page component
├── README.md                   # This file
├── components/
│   ├── RiemannSphere.tsx      # 3D visualization with Three.js
│   ├── ControlPanel.tsx       # Transformation controls
│   ├── TruthTable.tsx         # K3 logic truth tables
│   └── EducationalInfo.tsx    # Explanatory content
└── lib/
    ├── constants.ts           # Truth value mappings, colors
    ├── math.ts                # Mathematical functions
    ├── kleene.ts              # K3 logic operations
    └── __tests__/
        └── math.test.ts       # Unit tests
```

## Technology Stack

- **Next.js 14+** - App Router
- **TypeScript** - Strict mode
- **Three.js** - 3D rendering
- **React Three Fiber** - React renderer for Three.js
- **@react-three/drei** - Helper components
- **Tailwind CSS** - Styling
- **Framer Motion** - UI animations
- **mathjs** - Complex number calculations

## Features

### Interactive 3D Visualization
- Rotatable Riemann sphere with mouse/touch controls
- Three marked truth value points
- Grid lines for spatial reference
- Stereographic projection lines
- Smooth animations

### Transformation Controls
- Preset Möbius transformations
- Custom parameter inputs (a, b, c, d)
- Animation speed control
- Reset functionality
- Real-time validation

### Truth Tables
- Interactive K3 logic tables
- Operations: AND, OR, NOT, IMPLIES, EQUIVALENT
- Hover highlighting
- Color-coded results

### Educational Content
- Expandable explanation sections
- Mathematical formulas
- Conceptual descriptions
- References to theoretical framework

## Design

### Color Palette
- Background: `#0a0a0a`
- Purple accent: `#7c3aed`
- Blue accent: `#2563eb`
- Cyan accent: `#06b6d4`
- Truth values:
  - False: `#ef4444` (red)
  - True: `#22c55e` (green)
  - Undefined: `#f59e0b` (amber)

### Visual Style
- Dark cosmic theme
- Glass morphism effects (backdrop-blur)
- Subtle gradient accents
- Glow effects on interactive elements
- Sans-serif font (system default)
- 60fps animations

### Responsive Design
- Mobile: 320px+
- Tablet: 768px+
- Desktop: 1024px+
- Large desktop: 1920px+

## Usage

### Basic Interaction
1. **Rotate sphere:** Click and drag
2. **Zoom:** Scroll wheel
3. **Apply transformation:** Click preset buttons or enter custom parameters
4. **Reset:** Click "Reset to Identity" button
5. **Toggle projection lines:** Use checkbox in controls

### Custom Transformations
1. Enter complex number parameters (real and imaginary parts)
2. Ensure determinant (ad - bc) ≠ 0
3. Click "Apply Transform"
4. Watch the sphere morph and truth values move

### Truth Tables
1. Select an operation (AND, OR, NOT, etc.)
2. Hover over cells to highlight
3. Observe how undefined (∅) propagates

## Testing

Unit tests verify mathematical accuracy:

```bash
npm test -- app/trilogic/lib/__tests__/math.test.ts
```

Tests cover:
- Stereographic projection accuracy
- Inverse projection correctness
- Möbius transformation validity
- Cross-ratio preservation
- Round-trip projection consistency

## Performance Optimization

- Dynamic import of 3D components (no SSR)
- Memoized calculations
- Efficient Three.js geometry
- Lazy loading of heavy components
- Optimized animation loops

## Accessibility

- Keyboard navigation support
- ARIA labels on interactive elements
- High contrast color scheme
- Readable font sizes
- Clear visual hierarchy

## References

- **Integrated Consciousness Framework v2.1** (Addendum E: Tri-Logic and Quantum Semantics)
- Kleene, S.C. (1938). "On notation for ordinal numbers"
- Needham, T. (1997). "Visual Complex Analysis"
- Penrose, R. (2004). "The Road to Reality"

## Future Enhancements

- Export configuration as shareable URL
- Save/load transformation presets
- Animation recording (GIF export)
- Educational tooltips on hover
- Dark/light mode toggle
- Additional transformation presets
- Interactive cross-ratio demonstration
- Quantum state analogy visualizations

## License

Part of the trivector.ai quantum-native AI platform.

---

**Built with mathematical rigor and cosmic aesthetics.** ✨

