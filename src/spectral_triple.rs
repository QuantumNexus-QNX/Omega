//! Finite spectral triple construction for Markov chains (Addendum B compatible).
//!
//! This module implements the machinery for building a spectral triple from either
//! a continuous-time generator `L` or from a discrete-time transition matrix `P`.
//! It follows the specification of Addendum B, with the following clarifications:
//! - When provided with a transition matrix `P` (row-stochastic), we set
//!   `L = P - I` and estimate the stationary distribution from the left-nullspace
//!   of `P^T - I`.
//! - The Dirac operator is constructed from the eigenpairs of `-L^{sym}`, so the
//!   eigenvalues `λᵢ` are non-negative before regularisation.
//! - The Lipschitz seminorm is computed via the operator norm of ` [D, diag(f)] `
//!   and a projected subgradient ascent is used to approximate the Connes distance.

use nalgebra::{DMatrix, DVector, SymmetricEigen, SVD};
use rand::{rngs::StdRng, Rng, SeedableRng};
use thiserror::Error;

/// Errors that can occur when constructing or evaluating a spectral triple.
#[derive(Debug, Error)]
pub enum ConnesError {
    #[error("matrix must be square (got {rows}x{cols})")]
    NotSquare { rows: usize, cols: usize },

    #[error("dimension mismatch: len={len}, expected n={n}")]
    DimensionMismatch { len: usize, n: usize },

    #[error("stationary distribution must have strictly positive entries")]
    StationaryNonPositive,

    #[error("stationary distribution must sum to 1 (got {sum})")]
    StationaryNotNormalized { sum: f64 },

    #[error("rows must sum to ~0 for generator L (max |row-sum| = {max_abs})")]
    RowSumsNotZero { max_abs: f64 },

    #[error("rows must sum to ~1 for transition P (max |row-sum-1| = {max_abs})")]
    RowSumsNotOne { max_abs: f64 },

    #[error("epsilon must be positive (got {0})")]
    NonPositiveEpsilon(f64),
}

/// Finite spectral triple data derived from a Markov model.
#[derive(Clone, Debug)]
pub struct SpectralTriple {
    /// Generator L (rows sum to 0)
    pub generator: DMatrix<f64>,
    /// Stationary distribution π (strictly positive, sums to 1)
    pub stationary: DVector<f64>,
    /// Regularizer ε > 0
    pub epsilon: f64,
}

impl SpectralTriple {
    /// Construct from a generator `L` **and** a stationary distribution `π`.
    pub fn new(generator: DMatrix<f64>, stationary: DVector<f64>, epsilon: f64) -> Result<Self, ConnesError> {
        Self::validate_generator(&generator)?;
        Self::validate_stationary(&stationary)?;
        if epsilon <= 0.0 {
            return Err(ConnesError::NonPositiveEpsilon(epsilon));
        }
        Ok(Self { generator, stationary, epsilon })
    }

    /// Construct from a generator `L`, **estimating** the stationary distribution.
    pub fn from_generator(generator: DMatrix<f64>, epsilon: f64) -> Result<Self, ConnesError> {
        Self::validate_generator(&generator)?;
        let pi = Self::left_nullspace_prob(&generator)?;
        Self::new(generator, pi, epsilon)
    }

    /// Construct from a transition matrix `P` (row-stochastic), setting `L = P - I`
    /// and estimating the stationary distribution from `P`.
    pub fn from_transition(transition: DMatrix<f64>, epsilon: f64) -> Result<Self, ConnesError> {
        Self::validate_transition(&transition)?;
        let (n, _) = transition.shape();
        let l = &transition - DMatrix::<f64>::identity(n, n);
        let pi = Self::left_nullspace_prob(&(transition.transpose() - DMatrix::<f64>::identity(n, n)))?;
        // The nullspace of (P^T - I) equals the left-eigenvector of P with eigenvalue 1
        Self::new(l, pi, epsilon)
    }

    /// Validate generator: square and row sums ≈ 0.
    fn validate_generator(l: &DMatrix<f64>) -> Result<(), ConnesError> {
        let (r, c) = l.shape();
        if r != c {
            return Err(ConnesError::NotSquare { rows: r, cols: c });
        }
        let mut max_abs = 0.0;
        for i in 0..r {
            let s = l.row(i).sum();
            max_abs = max_abs.max(s.abs());
        }
        if max_abs > 1e-9 {
            return Err(ConnesError::RowSumsNotZero { max_abs });
        }
        Ok(())
    }

    /// Validate transition matrix: square and row sums ≈ 1.
    fn validate_transition(p: &DMatrix<f64>) -> Result<(), ConnesError> {
        let (r, c) = p.shape();
        if r != c {
            return Err(ConnesError::NotSquare { rows: r, cols: c });
        }
        let mut max_abs = 0.0;
        for i in 0..r {
            let s = p.row(i).sum();
            max_abs = max_abs.max((s - 1.0).abs());
        }
        if max_abs > 1e-9 {
            return Err(ConnesError::RowSumsNotOne { max_abs });
        }
        Ok(())
    }

    /// Validate stationary distribution.
    fn validate_stationary(pi: &DVector<f64>) -> Result<(), ConnesError> {
        if pi.iter().any(|&x| x <= 0.0) {
            return Err(ConnesError::StationaryNonPositive);
        }
        let sum = pi.sum();
        if (sum - 1.0).abs() > 1e-9 {
            return Err(ConnesError::StationaryNotNormalized { sum });
        }
        Ok(())
    }

    /// Compute a probability vector from the **left nullspace** using SVD.
    ///
    /// - If `A = L^T`, solves `A π = 0`.
    /// - If `A = P^T - I`, solves `(P^T - I) π = 0`.
    /// Ensures positivity by shifting small negatives to a tiny positive floor, then renormalizing.
    fn left_nullspace_prob(a: &DMatrix<f64>) -> Result<DVector<f64>, ConnesError> {
        let svd = SVD::new(a.clone(), true, true);
        let vt = svd.v_t.expect("SVD V^T should exist");
        let n = vt.ncols();
        // Right singular vector corresponding to smallest singular value:
        // columns of V minimize ||A x||; last column of V (row of V^T).
        let mut idx_min = 0usize;
        let mut min_s = f64::INFINITY;
        for (k, &s) in svd.singular_values.iter().enumerate() {
            if s < min_s {
                min_s = s;
                idx_min = k;
            }
        }
        let v = vt.row(idx_min).transpose(); // n x 1
        let mut pi = v.clone_owned();

        // Make entries nonnegative
        let floor = 1e-15;
        for i in 0..n {
            if pi[i] < floor {
                pi[i] = floor;
            }
        }
        let sum = pi.sum();
        let pi = pi.scale(1.0 / sum);
        Self::validate_stationary(&pi)?;
        Ok(pi)
    }

    /// Compute `L^sym = 0.5 ( Π^{1/2} L Π^{-1/2} + Π^{-1/2} L^T Π^{1/2} )`.
    fn symmetrized_generator(&self) -> DMatrix<f64> {
        let n = self.generator.nrows();
        let mut pi_sqrt = DMatrix::<f64>::zeros(n, n);
        let mut pi_isqrt = DMatrix::<f64>::zeros(n, n);
        for i in 0..n {
            let s = self.stationary[i].sqrt();
            pi_sqrt[(i, i)] = s;
            pi_isqrt[(i, i)] = 1.0 / s;
        }
        let l1 = &pi_sqrt * &self.generator * &pi_isqrt;
        let l2 = &pi_isqrt * self.generator.transpose() * &pi_sqrt;
        (l1 + l2) * 0.5
    }

    /// Compute the Dirac operator
    ///
    /// **Sign convention:** we diagonalize `-L^sym` to get nonnegative `λ_i`,
    /// then set `D = U diag(1/(ε + λ_i)) U^T`.
    pub fn compute_dirac_operator(&self) -> DMatrix<f64> {
        let lsym = self.symmetrized_generator();
        let SymmetricEigen { eigenvalues, eigenvectors: u } = SymmetricEigen::new(-lsym);
        let n = eigenvalues.len();
        let mut d = DMatrix::<f64>::zeros(n, n);
        for i in 0..n {
            let lam = eigenvalues[i].max(0.0);
            d[(i, i)] = 1.0 / (self.epsilon + lam);
        }
        &u * d * u.transpose()
    }

    /// Spectral norm (largest singular value).
    fn spectral_norm(m: &DMatrix<f64>) -> f64 {
        let svd = SVD::new(m.clone(), false, false);
        svd.singular_values.iter().fold(0.0f64, |acc, &s| acc.max(s))
    }

    /// Lipschitz seminorm for `a = diag(f)`: `L(f) = ||[D, diag(f)]||_2`.
    fn lipschitz(&self, d: &DMatrix<f64>, f: &DVector<f64>) -> (f64, DMatrix<f64>) {
        let n = f.len();
        let mut diagf = DMatrix::<f64>::zeros(n, n);
        for i in 0..n { diagf[(i, i)] = f[i]; }
        let m = d * &diagf - &diagf * d;
        (Self::spectral_norm(&m), m)
    }

    /// Subgradient of `L(f) = ||[D, diag(f)]||_2` using the top singular triplet.
    fn lipschitz_subgradient(dirac: &DMatrix<f64>, m: &DMatrix<f64>) -> DVector<f64> {
        let n = dirac.nrows();
        let svd = SVD::new(m.clone(), true, true);
        if svd.u.is_none() || svd.v_t.is_none() { return DVector::zeros(n); }
        let u = svd.u.unwrap().column(0).into_owned();
        let v = svd.v_t.unwrap().row(0).transpose().into_owned();
        let ut_d = u.transpose() * dirac;
        let d_v = dirac * &v;
        let mut g = DVector::<f64>::zeros(n);
        for k in 0..n {
            g[k] = ut_d[(0, k)] * v[k] - u[k] * d_v[k];
        }
        g
    }

    /// Connes distance between pure states i and j over diagonal observables.
    pub fn connes_distance(&self, state_i: usize, state_j: usize) -> Result<f64, ConnesError> {
        let n = self.generator.nrows();
        if state_i >= n || state_j >= n {
            return Err(ConnesError::DimensionMismatch { len: state_i.max(state_j) + 1, n });
        }

        let dmat = self.compute_dirac_operator();
        let mut c = DVector::<f64>::zeros(n);
        c[state_i] = 1.0;
        c[state_j] = -1.0;

        // Baseline (direction c)
        let (lc, _) = self.lipschitz(&dmat, &c);
        let mut best_val = if lc > 0.0 { c.dot(&c) / lc } else { 0.0 };
        let mut _best_f = if lc > 0.0 { &c / lc } else { c.clone() };

        // Projected subgradient ascent on φ(f) = c^T f / L(f).
        let restarts = 8usize;
        let iterations = 600usize;
        let lr = 0.5;

        let mut rng = StdRng::seed_from_u64(42);
        for _ in 0..restarts {
            let mut f = DVector::<f64>::from_fn(n, |_r, _c| rng.gen::<f64>() * 2.0 - 1.0);
            let (mut lf, mut m) = self.lipschitz(&dmat, &f);
            if lf < 1e-12 {
                f = &f + DVector::<f64>::from_element(n, 1e-3);
                let t = self.lipschitz(&dmat, &f);
                lf = t.0; m = t.1;
            }
            for _ in 0..iterations {
                if lf <= 1e-15 { break; }
                let g = Self::lipschitz_subgradient(&dmat, &m);
                let num = c.dot(&f);
                let grad = (&c * lf - &g * num) / (lf * lf);
                f = f + grad.scale(lr);

                // Project to { L(f) ≤ 1 } by radial scaling
                let (new_lf, new_m) = self.lipschitz(&dmat, &f);
                if new_lf > 1.0 { f = f / new_lf; }
                lf = new_lf; m = new_m;
            }
            let (lf_fin, _) = self.lipschitz(&dmat, &f);
            let val = c.dot(&f) / lf_fin.max(1.0);
            if val > best_val { best_val = val; _best_f = f; }
        }
        Ok(best_val.abs())
    }
}
