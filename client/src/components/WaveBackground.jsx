import { useEffect, useRef } from 'react';

const ANGLE      = -Math.PI / 4; // -45° — stripes run top-right → bottom-left
const STEP       = 6;
const DRIFT_RATE = 28;           // px/s — stripes drift top-left → bottom-right

// Craters: fixed positions relative to moon center, stored as [dx, dy, r] fractions of moon radius
const CRATER_SETS = [
  [[ 0.30,  0.20, 0.18], [-0.40, -0.15, 0.12], [ 0.05, -0.35, 0.22], [-0.20,  0.38, 0.10]],
  [[-0.25,  0.30, 0.20], [ 0.38, -0.22, 0.15], [-0.10, -0.40, 0.12], [ 0.22,  0.35, 0.09]],
  [[ 0.18, -0.28, 0.16], [-0.35,  0.18, 0.20], [ 0.40,  0.10, 0.11], [-0.12,  0.40, 0.14]],
  [[-0.30, -0.20, 0.22], [ 0.22,  0.32, 0.13], [-0.42,  0.05, 0.10], [ 0.12, -0.38, 0.18]],
  [[ 0.35,  0.25, 0.14], [-0.18, -0.38, 0.20], [ 0.08,  0.42, 0.11], [-0.38, -0.10, 0.16]],
  [[-0.28,  0.22, 0.18], [ 0.40, -0.15, 0.12], [ 0.15,  0.38, 0.15], [-0.10, -0.42, 0.10]],
  [[ 0.22, -0.35, 0.20], [-0.38,  0.28, 0.13], [ 0.38,  0.18, 0.16], [-0.15, -0.30, 0.11]],
  [[-0.32, -0.28, 0.15], [ 0.28,  0.38, 0.19], [ 0.10, -0.40, 0.13], [-0.40,  0.12, 0.10]],
  [[ 0.40,  0.08, 0.17], [-0.20,  0.35, 0.12], [ 0.18, -0.38, 0.20], [-0.38, -0.22, 0.10]],
];

// moonScheme: 'default' (yellow-grey), 'red', 'blue-green', 'dark-yellow'
const WAVES = [
  { pos: 0.05, amp: 22, freq: 0.9,  thick: 24, color: [67,  97,  238], speed: 0.55, phase: 0.0, moon: { r: 11, speed: 52, startU: 0.85, scheme: 'default'     } },
  { pos: 0.14, amp: 40, freq: 0.45, thick: 58, color: [192, 132, 252], speed: 0.50, phase: 1.4, moon: { r: 19, speed: 28, startU: 0.20, scheme: 'red'          } },
  { pos: 0.25, amp: 16, freq: 1.4,  thick: 14, color: [67,  97,  238], speed: 0.40, phase: 2.7, moon: { r:  8, speed: 65, startU: 0.60, scheme: 'default'     } },
  { pos: 0.36, amp: 50, freq: 0.38, thick: 70, color: [192, 132, 252], speed: 0.22, phase: 0.6, moon: { r: 24, speed: 20, startU: 0.40, scheme: 'blue-green'  } },
  { pos: 0.48, amp: 26, freq: 0.80, thick: 24, color: [67,  97,  238], speed: 0.52, phase: 2.9, moon: { r: 13, speed: 48, startU: 0.70, scheme: 'default'     } },
  { pos: 0.58, amp: 14, freq: 1.20, thick: 12, color: [192, 132, 252], speed: 0.34, phase: 1.9, moon: { r:  7, speed: 58, startU: 0.15, scheme: 'default'     } },
  { pos: 0.68, amp: 44, freq: 0.55, thick: 52, color: [67,  97,  238], speed: 0.48, phase: 2.5, moon: { r: 17, speed: 35, startU: 0.50, scheme: 'dark-yellow' } },
  { pos: 0.79, amp: 22, freq: 0.90, thick: 18, color: [192, 132, 252], speed: 0.24, phase: 2.2, moon: { r:  9, speed: 55, startU: 0.90, scheme: 'default'     } },
  { pos: 0.90, amp: 32, freq: 0.70, thick: 30, color: [67,  97,  238], speed: 0.38, phase: 1.1, moon: { r: 15, speed: 30, startU: 0.30, scheme: 'default'     } },
];

// Color palette per scheme: [highlight, mid, limb, craterShadow, craterRim, glow]
const MOON_PALETTES = {
  'default':    ['240,236,210', '210,205,175', '150,145,120', '90,85,65',    '255,252,235', '230,225,180'],
  'red':        ['255,210,200', '220,120,100', '140,50,40',   '80,20,15',    '255,230,225', '220,100,80' ],
  'blue-green': ['200,240,230', '80,190,170',  '30,110,100',  '15,60,55',    '220,255,245', '60,200,180' ],
  'dark-yellow':['210,175,60',  '170,130,30',  '100,75,10',   '60,40,5',     '240,210,120', '180,140,40' ],
};

function drawMoon(ctx, u, v, r, craters, alpha, scheme = 'default') {
  const [hi, mid, limb, crShadow, crRim, glowC] = MOON_PALETTES[scheme];

  ctx.save();
  ctx.translate(u, v);

  // Base sphere — radial gradient for faint 3-D look
  const grad = ctx.createRadialGradient(-r * 0.28, -r * 0.28, r * 0.05, 0, 0, r);
  grad.addColorStop(0.0,  `rgba(${hi},   ${alpha * 1.0})`);
  grad.addColorStop(0.45, `rgba(${mid},  ${alpha * 0.85})`);
  grad.addColorStop(1.0,  `rgba(${limb}, ${alpha * 0.55})`);

  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  // Craters
  for (const [dx, dy, cr] of craters) {
    const cx = dx * r;
    const cy = dy * r;
    const cR = cr * r;
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.clip();

    ctx.beginPath();
    ctx.arc(cx, cy, cR, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${crShadow}, ${alpha * 0.55})`;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx - cR * 0.25, cy - cR * 0.25, cR * 0.55, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${crRim}, ${alpha * 0.30})`;
    ctx.fill();

    ctx.restore();
  }

  // Soft outer glow
  const glow = ctx.createRadialGradient(0, 0, r * 0.7, 0, 0, r * 1.6);
  glow.addColorStop(0.0, `rgba(${glowC}, ${alpha * 0.18})`);
  glow.addColorStop(1.0, `rgba(${glowC}, 0)`);
  ctx.beginPath();
  ctx.arc(0, 0, r * 1.6, 0, Math.PI * 2);
  ctx.fillStyle = glow;
  ctx.fill();

  ctx.restore();
}

// Sparkle colors — dark mode: bright whites/yellows/blues; light mode: dark tones visible on pale bg
const SP_COLORS_DARK  = [[255, 255, 255], [255, 248, 190], [185, 220, 255]];
const SP_COLORS_LIGHT = [[ 55,  60, 140], [130,  85,  10], [ 15,  90, 155]];

// Pre-defined sparkle layout: clusters + isolated
// Positions are fractions of screen (0–1). Generated once deterministically.
function buildSparkles() {
  const out = [];

  // Clusters — tighter groupings
  const clusters = [
    { cx: 0.12, cy: 0.18, n: 4, spread: 0.035 },
    { cx: 0.78, cy: 0.10, n: 3, spread: 0.025 },
    { cx: 0.88, cy: 0.58, n: 5, spread: 0.045 },
    { cx: 0.25, cy: 0.82, n: 3, spread: 0.030 },
    { cx: 0.55, cy: 0.38, n: 4, spread: 0.038 },
    { cx: 0.42, cy: 0.65, n: 3, spread: 0.028 },
  ];

  // Tiny seeded offsets so layout is consistent across renders
  const seed = [
    [ 0.012, -0.018],[-0.022,  0.008],[ 0.030,  0.020],[-0.010,  0.030],[ 0.025, -0.010],
    [-0.015,  0.022],[ 0.010, -0.028],[-0.030,  0.015],[ 0.020,  0.025],[-0.025, -0.012],
    [ 0.018,  0.032],[-0.032, -0.020],[ 0.028, -0.022],[-0.008,  0.035],[ 0.035,  0.010],
    [-0.018, -0.035],[ 0.005,  0.042],[-0.040,  0.005],[ 0.038, -0.018],[-0.022,  0.038],
  ];

  let si = 0;
  clusters.forEach(({ cx, cy, n }, ci) => {
    for (let j = 0; j < n; j++) {
      const [ox, oy] = seed[si++ % seed.length];
      out.push({
        x: cx + ox * (ci % 2 === 0 ? 1 : -1),
        y: cy + oy,
        r: 0.6 + (si % 3) * 0.5,
        colorIdx: si % 3,
        phase: (si * 1.37) % (Math.PI * 2),
        freq: 0.35 + (si % 7) * 0.12,
        arms: si % 4 < 2, // some get cross-arms, some are plain dots
      });
    }
  });

  // Isolated singles scattered sparsely
  const singles = [
    [0.04, 0.45], [0.20, 0.05], [0.35, 0.28], [0.50, 0.90], [0.65, 0.12],
    [0.72, 0.75], [0.93, 0.30], [0.08, 0.70], [0.48, 0.55], [0.82, 0.88],
    [0.30, 0.50], [0.60, 0.22], [0.15, 0.95], [0.90, 0.45], [0.40, 0.08],
    [0.70, 0.50], [0.55, 0.78], [0.22, 0.38], [0.85, 0.20], [0.47, 0.42],
  ];
  singles.forEach(([x, y], k) => {
    out.push({
      x, y,
      r: 0.5 + (k % 4) * 0.35,
      colorIdx: k % 3,
      phase: (k * 2.19) % (Math.PI * 2),
      freq: 0.28 + (k % 5) * 0.10,
      arms: k % 3 === 0,
    });
  });

  return out;
}

const SPARKLES = buildSparkles();

function drawSparkle(ctx, x, y, r, color, alpha, arms) {
  const [rc, gc, bc] = color;

  // Tiny glow
  const g = ctx.createRadialGradient(x, y, 0, x, y, r * 3.5);
  g.addColorStop(0,   `rgba(${rc},${gc},${bc},${alpha * 0.55})`);
  g.addColorStop(1,   `rgba(${rc},${gc},${bc},0)`);
  ctx.beginPath();
  ctx.arc(x, y, r * 3.5, 0, Math.PI * 2);
  ctx.fillStyle = g;
  ctx.fill();

  // Center dot
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(${rc},${gc},${bc},${alpha})`;
  ctx.fill();

  // Cross arms (for starred sparkles)
  if (arms) {
    const len = r * 3.2;
    ctx.save();
    ctx.strokeStyle = `rgba(${rc},${gc},${bc},${alpha * 0.55})`;
    ctx.lineWidth = Math.max(0.4, r * 0.4);
    ctx.lineCap = 'round';
    for (let a = 0; a < 4; a++) {
      const angle = (a * Math.PI) / 2;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(angle) * r * 1.2, y + Math.sin(angle) * r * 1.2);
      ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
      ctx.stroke();
    }
    ctx.restore();
  }
}

export default function WaveBackground() {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const tRef      = useRef(0);
  const lastRef   = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const frame = (ts) => {
      if (lastRef.current === null) lastRef.current = ts;
      const dt = Math.min((ts - lastRef.current) / 1000, 0.05);
      lastRef.current = ts;
      tRef.current += dt;
      const t = tRef.current;

      const w    = canvas.width;
      const h    = canvas.height;
      const diag = Math.sqrt(w * w + h * h);
      const half = diag / 2;

      const isDark    = document.documentElement.classList.contains('dark');
      const baseAlpha = isDark ? 0.10 : 0.06;

      ctx.clearRect(0, 0, w, h);

      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate(ANGLE);

      for (let i = 0; i < WAVES.length; i++) {
        const wave = WAVES[i];

        // Stripe drifts top-left → bottom-right
        const drift   = (wave.speed * DRIFT_RATE * t) % diag;
        const vCenter = ((wave.pos * diag + drift) % diag) - diag * 0.5;
        const k       = (2 * Math.PI * wave.freq) / diag;
        const phi     = wave.phase + wave.speed * t;

        // --- Draw stripe ---
        ctx.beginPath();
        for (let u = -half; u <= half + STEP; u += STEP) {
          const v = vCenter + wave.amp * Math.sin(k * u + phi);
          u <= -half ? ctx.moveTo(u, v) : ctx.lineTo(u, v);
        }
        for (let u = half; u >= -half - STEP; u -= STEP) {
          ctx.lineTo(u, vCenter + wave.thick + wave.amp * Math.sin(k * u + phi));
        }
        ctx.closePath();

        const alpha = baseAlpha * (0.65 + 0.45 * Math.sin(0.18 * t + wave.phase));
        const [r, g, b] = wave.color;
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();

        // --- Draw moon on this stripe ---
        const moon  = wave.moon;
        const span  = diag + moon.r * 4; // total travel distance with overshoot
        // u travels from +half (right) to -half (left), wrapping
        const moonU = half + moon.r * 2 - ((moon.speed * t + moon.startU * span) % span);
        // v follows the top edge of the stripe at moonU
        const moonV = vCenter + wave.amp * Math.sin(k * moonU + phi) + wave.thick * 0.5;

        // Moon fades in/out gently at edges
        const edgeFade = Math.min(1, Math.min(moonU + half, half - moonU) / (moon.r * 3));
        const moonAlpha = 0.55 * edgeFade * (isDark ? 1.0 : 0.75);

        if (moonAlpha > 0.01) {
          drawMoon(ctx, moonU, moonV, moon.r, CRATER_SETS[i], moonAlpha, moon.scheme);
        }
      }

      ctx.restore();

      // --- Draw sparkles in screen space (fixed, not rotated) ---
      for (const sp of SPARKLES) {
        const sx = sp.x * w;
        const sy = sp.y * h;
        // Each sparkle twinkles independently
        const brightness = 0.5 + 0.5 * Math.sin(sp.freq * Math.PI * 2 * t + sp.phase);
        const palette  = isDark ? SP_COLORS_DARK : SP_COLORS_LIGHT;
        const spColor  = palette[sp.colorIdx];
        const spAlpha  = brightness * brightness * (isDark ? 0.75 : 0.55);
        if (spAlpha > 0.02) drawSparkle(ctx, sx, sy, sp.r, spColor, spAlpha, sp.arms);
      }

      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
