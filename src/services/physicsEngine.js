/**
 * Physics Engine providing pure mathematical computations for:
 * 1. Projectile Motion with optional Air Resistance
 * 2. Damped & Forced Harmonic Oscillators
 * 3. Keplerian Orbital Mechanics
 */

/**
 * Ideal Projectile Motion (No Drag)
 * Equations:
 * x(t) = v0 * cos(theta) * t
 * y(t) = h0 + v0 * sin(theta) * t - 0.5 * g * t^2
 */
export function computeIdealProjectile(v0 = 25, angleDeg = 45, h0 = 0, g = 9.81, points = 300) {
  v0 = Number(v0); angleDeg = Number(angleDeg); h0 = Number(h0); g = Number(g); points = Number(points);
  if (g <= 0) g = 0;

  const rad = (angleDeg * Math.PI) / 180;
  const vx0 = v0 * Math.cos(rad);
  const vy0 = v0 * Math.sin(rad);

  let tFlight, hMax;
  if (g === 0) {
    tFlight = (vy0 < 0 && h0 > 0) ? -h0 / vy0 : 10;
    hMax = vy0 > 0 ? h0 + vy0 * tFlight : h0;
  } else {
    const disc = vy0 * vy0 + 2 * g * h0;
    tFlight = (vy0 + Math.sqrt(disc)) / g;
    hMax = vy0 > 0 ? h0 + (vy0 * vy0) / (2 * g) : h0;
  }
  // Max Distance (Range)
  const range = vx0 * tFlight;

  const tValues = [];
  const xValues = [];
  const yValues = [];
  const vxValues = [];
  const vyValues = [];
  const speedValues = [];
  const keValues = []; // Kinetic Energy (per unit mass = 0.5*v^2)
  const peValues = []; // Potential Energy (per unit mass = g*y)

  const step = tFlight / (points - 1);

  for (let i = 0; i < points; i++) {
    const t = i * step;
    const x = vx0 * t;
    const y = Math.max(0, h0 + vy0 * t - 0.5 * g * t * t);
    const vx = vx0;
    const vy = vy0 - g * t;
    const speed = Math.sqrt(vx * vx + vy * vy);

    tValues.push(Number(t.toFixed(3)));
    xValues.push(Number(x.toFixed(3)));
    yValues.push(Number(y.toFixed(3)));
    vxValues.push(Number(vx.toFixed(3)));
    vyValues.push(Number(vy.toFixed(3)));
    speedValues.push(Number(speed.toFixed(3)));
    keValues.push(Number((0.5 * speed * speed).toFixed(3)));
    peValues.push(Number((g * y).toFixed(3)));
  }

  return {
    tFlight: Number(tFlight.toFixed(3)),
    hMax: Number(hMax.toFixed(3)),
    range: Number(range.toFixed(3)),
    tValues,
    xValues,
    yValues,
    vxValues,
    vyValues,
    speedValues,
    keValues,
    peValues
  };
}

/**
 * Projectile Motion WITH Air Resistance (Linear Drag: F_drag = -k * v)
 * Differential equations solved via Euler-Cromer integration:
 * dvx/dt = - (k/m) * vx
 * dvy/dt = -g - (k/m) * vy
 */
export function computeDragProjectile(v0 = 25, angleDeg = 45, h0 = 0, g = 9.81, dragK = 0.1, mass = 1, dt = 0.01) {
  v0 = Number(v0); angleDeg = Number(angleDeg); h0 = Number(h0); g = Number(g); dragK = Number(dragK); mass = Math.max(0.01, Number(mass)); dt = Number(dt);
  const rad = (angleDeg * Math.PI) / 180;
  let vx = v0 * Math.cos(rad);
  let vy = v0 * Math.sin(rad);
  let x = 0;
  let y = h0;
  let t = 0;

  const tValues = [];
  const xValues = [];
  const yValues = [];

  let hMax = h0;
  let iters = 0;

  while (y >= 0 && t < 100 && iters < 2000) {
    iters++;
    tValues.push(Number(t.toFixed(3)));
    xValues.push(Number(x.toFixed(3)));
    yValues.push(Number(y.toFixed(3)));

    if (y > hMax) hMax = y;

    // Forces & Accelerations
    const ax = -(dragK / mass) * vx;
    const ay = -g - (dragK / mass) * vy;

    // Update Velocities & Positions (Euler-Cromer)
    vx += ax * dt;
    vy += ay * dt;
    x += vx * dt;
    y += vy * dt;
    t += dt;
  }

  return {
    tFlight: Number(t.toFixed(3)),
    hMax: Number(hMax.toFixed(3)),
    range: Number(x.toFixed(3)),
    tValues,
    xValues,
    yValues
  };
}

/**
 * Mass-Spring-Damper Harmonic Oscillator
 * Differential Equation: m * x'' + c * x' + k * x = F0 * cos(omega * t)
 */
export function computeHarmonicOscillator(m = 1, c = 0.5, k = 10, F0 = 0, omega = 2, x0 = 1, v0 = 0, tMax = 10, points = 400) {
  m = Math.max(0.01, Number(m)); c = Number(c); k = Number(k); F0 = Number(F0); omega = Number(omega); x0 = Number(x0); v0 = Number(v0); tMax = Number(tMax); points = Number(points);
  const omega0 = Math.sqrt(k / m); // Natural frequency
  const gamma = c / (2 * m); // Damping factor

  const tValues = [];
  const xValues = [];
  const vValues = [];

  const dt = tMax / (points - 1);
  let x = x0;
  let v = v0;

  for (let i = 0; i < points; i++) {
    const t = i * dt;
    tValues.push(Number(t.toFixed(3)));
    xValues.push(Number(x.toFixed(3)));
    vValues.push(Number(v.toFixed(3)));

    // Acceleration: a = (F0*cos(omega*t) - c*v - k*x) / m
    const force = F0 * Math.cos(omega * t);
    const a = (force - c * v - k * x) / m;

    v += a * dt;
    x += v * dt;
  }

  // Damping regime classification
  const zeta = c / (2 * Math.sqrt(k * m));
  let regime = 'Underdamped';
  if (Math.abs(zeta - 1) < 1e-4) regime = 'Critically Damped';
  else if (zeta > 1) regime = 'Overdamped';

  return {
    omega0: Number(omega0.toFixed(3)),
    gamma: Number(gamma.toFixed(3)),
    regime,
    tValues,
    xValues,
    vValues
  };
}
