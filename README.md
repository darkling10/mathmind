# MathMind AI 🧮✨

> **Next-Generation Interactive 2D/3D Mathematical Plotter, Calculus Laboratory, & Symbolic AI Solver.**

[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Plotly](https://img.shields.io/badge/Plotly.js-WebGL-3F4F75?style=for-the-badge&logo=plotly&logoColor=white)](https://plotly.com/)
[![KaTeX](https://img.shields.io/badge/KaTeX-Math--Typesetting-008080?style=for-the-badge)](https://katex.org/)

---

## 🌟 Overview

**MathMind AI** is an advanced, web-based mathematical studio designed for students, engineers, researchers, and educators. Built with React, TailwindCSS v4, Plotly WebGL, Math.js, and KaTeX, it provides real-time 2D & 3D visualizations, step-by-step symbolic equation solving, interactive calculus visualizers, and an intelligent AI Math Tutor.

---

## 🔥 Key Features

### 📈 1. 2D Interactive Function Plotter
- **Multi-Curve Overlays**: Plot multiple mathematical functions ($f_1(x), f_2(x), f_3(x)$) simultaneously with custom color palettes.
- **Live Coefficient Sliders**: Adjust parameters ($a, b, c, k$) dynamically and observe real-time graph transformations.
- **Critical Feature Inspector**: Automated detection of roots ($x$-intercepts) and local extrema (minima/maxima).
- **Definite Area Integration**: Compute $\int_a^b f(x) dx$ with visual shading beneath function curves.

### 🧊 2. 3D WebGL Studio & Vector Fields
- **Multivariable 3D Surfaces**: Render $z = f(x, y)$ multivariable surfaces (e.g., saddle points $z = x^2 - y^2$, ripple waves $z = \cos(\sqrt{x^2 + y^2})$).
- **3D Parametric Geometry**: Interactive orbit, pan, and zoom controls for Torus, Sphere, and Mobius strip surfaces.
- **Vector Field Visualizer**: Plot 2D/3D vector fields $(P(x,y), Q(x,y))$ for fluid dynamics and phase portraits.
- **Color Themes**: Viridis, Plasma, Electric, Rainbow, and Thermal gradients.

### 📐 3. Interactive Calculus Laboratory
- **Tangent Line & Derivative Inspector**: Slide $x_0 \in [-4, 4]$ along curve $f(x)$ to watch the tangent line $y - f(x_0) = f'(x_0)(x - x_0)$ update live.
- **Riemann Sums Visualizer**: Compare **Left Sum**, **Right Sum**, **Midpoint Rule**, and **Trapezoidal Rule** with adjustable sub-rectangles ($N \in [2, 40]$).
- **Taylor Series Polynomial Expansion**: Observe polynomial convergence $P_n(x)$ onto true function curves as order $n$ increases.
- **ODE Slope Fields**: Direction field plotter for first-order differential equations $\frac{dy}{dx} = f(x, y)$.

### 🧮 4. Step-by-Step Symbolic Solver
- **Algebraic & Calculus Resolutions**: Derivation step cards for quadratic equations, polynomial roots, derivatives ($\frac{d}{dx}$), and integrals.
- **KaTeX Typesetting**: Crisp, publication-grade LaTeX formulas with one-click copy and plot shortcuts.

### 🔢 5. Linear Algebra Matrix Laboratory
- **Matrix Operations**: Solve $2 \times 2$ and $3 \times 3$ matrices for determinants $\det(A)$, matrix inverse $A^{-1}$, transpose $A^T$, and eigenvalues $\lambda$.

### 🤖 6. AI Math Assistant & Tutor
- **Natural Language Parsing**: Ask questions like *"Explain saddle point geometry"* or *"Calculate derivative of x^3 * sin(x)"* for structured explanations and direct graph plotting buttons.
- **Preset Library**: Preset gallery covering calculus, physics (damped harmonic oscillator, wave superposition), and 3D geometry.
- **Formula Cheatsheet**: Quick reference guide for derivatives, integrals, and trigonometric identities.

---

## 🏗️ Architecture & Tech Stack

- **Frontend Core**: React 18, Vite
- **Styling & UI**: TailwindCSS v4, Dark Glassmorphism, Lucide Icons
- **Math Engines**: Math.js (Symbolic AST parser & numerical solver), KaTeX (LaTeX renderer)
- **Visualization**: Plotly.js WebGL Engine

### Dual-Tier Navigation Architecture
```text
┌────────────────────────────────────────────────────────────────────────┐
│ Tier 1: Primary Category Header                                       │
│ [ Graphing & Geometry ] [ Calculus Suite ] [ Algebra & Solvers ] [ AI Tutor ] │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
┌────────────────────────────────────▼───────────────────────────────────┐
│ Tier 2: Contextual Sub-Toolbar                                         │
│ e.g. [ Tangent & Derivative ] [ Riemann Sums ] [ Taylor ] [ Slope Fields ] │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/darkling10/mathmind.git
   cd mathmind
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173/`.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📦 Project Structure

```text
mathmind/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── AiAssistant.jsx
│   │   ├── CalculusLab.jsx
│   │   ├── CheatSheetModal.jsx
│   │   ├── EquationSolver.jsx
│   │   ├── Graph3DPlotter.jsx
│   │   ├── GraphPlotter.jsx
│   │   ├── MathInput.jsx
│   │   ├── MatrixLab.jsx
│   │   ├── Navbar.jsx
│   │   ├── PresetLibrary.jsx
│   │   └── VirtualKeyboard.jsx
│   ├── services/
│   │   ├── aiMathService.js
│   │   └── mathEngine.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json
```

---

## 👤 Author

- **Abbas Pathan** - [GitHub Profile](https://github.com/darkling10)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
