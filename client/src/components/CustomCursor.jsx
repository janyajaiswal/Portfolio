import { useEffect, useRef } from 'react';

const SHIP_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <path d="M12 19 L4 29 L12 25 Z" fill="#C084FC" opacity="0.95"/>
  <path d="M20 19 L28 29 L20 25 Z" fill="#C084FC" opacity="0.95"/>
  <rect x="13" y="24" width="6" height="4" rx="1.5" fill="#0F1117" stroke="#4361EE" stroke-width="0.8"/>
  <path d="M16 3 L11 15 L11 25 L21 25 L21 15 Z" fill="#1A1D27" stroke="#4361EE" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M16 3 L11 15 L21 15 Z" fill="#4361EE"/>
  <line x1="12" y1="19" x2="6" y2="27" stroke="#A78BFA" stroke-width="0.6" opacity="0.6"/>
  <line x1="20" y1="19" x2="26" y2="27" stroke="#A78BFA" stroke-width="0.6" opacity="0.6"/>
  <circle cx="16" cy="18" r="3.2" fill="#0D1117" stroke="#4361EE" stroke-width="1"/>
  <circle cx="15.2" cy="17.2" r="1.1" fill="#C7D2FE" opacity="0.75"/>
  <ellipse cx="16" cy="28.5" rx="3.5" ry="1.2" fill="#4361EE" opacity="0.35"/>
</svg>`;

const FIRE_COLORS = ['#4361EE', '#C084FC', '#C7D2FE', '#A78BFA', '#3451B2', '#9333EA'];

// Lerp angle avoiding wrap-around jumps
function lerpAngle(current, target, t) {
  let diff = target - current;
  while (diff > 180) diff -= 360;
  while (diff < -180) diff += 360;
  return current + diff * t;
}

export default function CustomCursor() {
  const canvasRef = useRef(null);
  const shipRef = useRef(null);
  const particlesRef = useRef([]);
  const stateRef = useRef({
    mouse: { x: -200, y: -200 },
    lastMouse: { x: -200, y: -200 },
    rotation: -90,        // current smoothed rotation (degrees, 0 = pointing right in atan2 space)
    targetRotation: -90,  // where we want to point
    shipY: 0,             // shoot-up offset
    shipVY: 0,
    moving: false,
  });
  const raf = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const ship = shipRef.current;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Engine nozzle is 12px below the SVG center in LOCAL space.
    // Under CSS clockwise rotation θ (degrees), the world-space offset is:
    //   engineOffX = -12 * sin(θ_rad)
    //   engineOffY =  12 * cos(θ_rad)
    const engineOffset = (rotation) => {
      const r = (rotation * Math.PI) / 180;
      return { x: -12 * Math.sin(r), y: 12 * Math.cos(r) };
    };

    // Exhaust direction (unit vector pointing away from engine, i.e. behind ship)
    // Same direction as the engine offset
    const exhaustDir = (rotation) => {
      const r = (rotation * Math.PI) / 180;
      return { x: -Math.sin(r), y: Math.cos(r) };
    };

    const spawnTrail = (mouseX, mouseY, rotation, speed) => {
      const eng = engineOffset(rotation);
      const dir = exhaustDir(rotation);
      const count = Math.min(Math.ceil(speed / 4) + 1, 5);
      for (let i = 0; i < count; i++) {
        const color = FIRE_COLORS[Math.floor(Math.random() * FIRE_COLORS.length)];
        const spread = (Math.random() - 0.5) * 0.6;
        particlesRef.current.push({
          x: mouseX + eng.x + (Math.random() - 0.5) * 4,
          y: mouseY + eng.y + (Math.random() - 0.5) * 4,
          // velocity: exhaust direction + spread + slight speed from ship
          vx: dir.x * (Math.random() * 2.5 + 1.5) + spread,
          vy: dir.y * (Math.random() * 2.5 + 1.5) + spread,
          life: 1,
          decay: 0.04 + Math.random() * 0.05,
          size: Math.random() * 3 + 1.5,
          color,
          burst: false,
        });
      }
    };

    const spawnBurst = (x, y) => {
      // Radial burst — smaller than before
      for (let i = 0; i < 16; i++) {
        const angle = (Math.PI * 2 * i) / 16 + (Math.random() - 0.5) * 0.5;
        const speed = Math.random() * 3.5 + 1.5;
        const color = FIRE_COLORS[Math.floor(Math.random() * FIRE_COLORS.length)];
        particlesRef.current.push({
          x: x + (Math.random() - 0.5) * 4,
          y: y + (Math.random() - 0.5) * 4,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1,
          life: 1,
          decay: 0.025 + Math.random() * 0.03,
          size: Math.random() * 4 + 2,
          color,
          burst: true,
        });
      }
      // Small bright core flash
      for (let i = 0; i < 4; i++) {
        particlesRef.current.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 - 1.5,
          life: 1,
          decay: 0.08,
          size: Math.random() * 3 + 3,
          color: '#ffffff',
          burst: true,
        });
      }
    };

    const onMove = (e) => {
      const s = stateRef.current;
      const dx = e.clientX - s.lastMouse.x;
      const dy = e.clientY - s.lastMouse.y;
      const speed = Math.sqrt(dx * dx + dy * dy);

      s.mouse = { x: e.clientX, y: e.clientY };

      if (speed > 2) {
        // atan2 gives angle where right=0, up=-90, down=90, left=±180
        // CSS rotate(0deg) = ship points up, so we add 90° to convert
        s.targetRotation = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        s.moving = true;
        spawnTrail(e.clientX, e.clientY, s.rotation, speed);
        s.lastMouse = { x: e.clientX, y: e.clientY };
      } else {
        s.moving = false;
      }
    };

    const onClick = (e) => {
      spawnBurst(e.clientX, e.clientY);
      stateRef.current.shipVY = -14;
    };

    const onEnter = () => { ship.style.opacity = '1'; };
    const onLeave = () => { ship.style.opacity = '0'; };

    const animate = () => {
      const s = stateRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth rotation toward target
      s.rotation = lerpAngle(s.rotation, s.targetRotation, 0.18);

      // Shoot-up physics
      if (s.shipVY !== 0 || s.shipY !== 0) {
        s.shipY += s.shipVY;
        s.shipVY += 1.0;
        if (s.shipY >= 0 && s.shipVY > 0) {
          s.shipY = 0;
          s.shipVY = 0;
        }
      }

      // Update ship DOM transform (center the 32×32 SVG on the cursor point)
      ship.style.transform = `translate(${s.mouse.x - 16}px, ${s.mouse.y - 16 + s.shipY}px) rotate(${s.rotation}deg)`;

      // Draw particles
      particlesRef.current = particlesRef.current.filter(p => p.life > 0);
      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.10;   // gentle gravity
        p.vx *= 0.97;
        p.life -= p.decay;

        const alpha = Math.max(0, p.life);
        const radius = p.size * alpha + 0.3;

        ctx.save();
        ctx.globalAlpha = alpha * 0.88;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.burst ? 14 : 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.restore();
      }

      raf.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('click', onClick);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseleave', onLeave);
    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('click', onClick);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 99997,
        }}
      />
      <div
        ref={shipRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 32,
          height: 32,
          pointerEvents: 'none',
          zIndex: 99999,
          opacity: 0,
          willChange: 'transform',
          transformOrigin: '16px 16px',
          filter: 'drop-shadow(0 0 4px #4361EE)',
        }}
        dangerouslySetInnerHTML={{ __html: SHIP_SVG }}
      />
    </>
  );
}
