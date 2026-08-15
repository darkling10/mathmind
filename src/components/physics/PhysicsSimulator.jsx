import React, { useState, useEffect } from 'react';
import ProjectileMotion from './ProjectileMotion';
import HarmonicOscillator from './HarmonicOscillator';

export default function PhysicsSimulator({ activeSubTool = 'projectile' }) {
  const [subTool, setSubTool] = useState(activeSubTool);

  useEffect(() => {
    if (activeSubTool) setSubTool(activeSubTool);
  }, [activeSubTool]);

  return (
    <div className="w-full space-y-6">
      {subTool === 'projectile' && <ProjectileMotion />}
      {subTool === 'oscillator' && <HarmonicOscillator />}
    </div>
  );
}
