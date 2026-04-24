import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, MapPin, Sparkles } from 'lucide-react';

const PHOTO = '/images/image1.jpeg';

const STAT_CHIPS = [
  { label: '3.93 GPA', sub: 'MS CS @ CSUF' },
  { label: 'Software', sub: 'Engineer' },
  { label: 'MERN', sub: 'Full-Stack' },
  { label: 'Data', sub: 'Analytics' },
  { label: 'AI/ML', sub: 'Systems' },
];

function Photo() {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (imgRef.current?.complete && !imgRef.current.naturalWidth === false) {
      setLoaded(true);
    }
  }, []);

  if (error) {
    return (
      <div className="photo-placeholder">
        <div className="photo-placeholder-icon">📸</div>
        <p className="font-mono-custom" style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Photos coming soon
        </p>
        <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>Drop into client/public/images/</p>
      </div>
    );
  }

  return (
    <div className="photo-carousel">
      <img
        ref={imgRef}
        src={PHOTO}
        alt="Janya Jaiswal"
        className="photo-carousel-img"
        style={{ opacity: loaded ? 1 : 0 }}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </div>
  );
}

function ScrollIndicator() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handler = () => { if (window.scrollY > 40) setVisible(false); };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <motion.div
      className="scroll-indicator"
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ opacity: { delay: visible ? 1.2 : 0, duration: visible ? 0.6 : 0.4 } }}
      style={{ pointerEvents: 'none' }}
    >
      <span className="scroll-indicator-label">scroll</span>
      <motion.div
        animate={{ y: [0, 7, 0], opacity: [1, 0.4, 1] }}
        transition={{ duration: 1.2, ease: 'easeInOut', repeat: Infinity }}
      >
        <ChevronDown size={16} />
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section id="hero" className="hero-section">
      <div className="orb orb-teal" style={{ width: 600, height: 600, top: '-10%', left: '-15%' }} />
      <div className="orb orb-purple" style={{ width: 500, height: 500, bottom: '0%', right: '-10%' }} />

      <div className="section-inner" style={{ width: '100%', position: 'relative', zIndex: 1 }}>
        <div className="hero-grid">

          {/* Left — Text */}
          <motion.div
            className="hero-text-col"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="hero-status">
              <span className="hero-status-dot animate-status-blink" />
              <span className="hero-status-text">Actively seeking opportunities</span>
            </div>

            <div className="hero-location">
              <MapPin size={12} />
              Open to Relocation across US
            </div>

            <div>
              <h1 className="hero-name" style={{ fontFamily: "'Space-Theme', cursive" }}>Janya</h1>
              <h1 className="hero-name-gradient" style={{ fontFamily: "'Space-Theme', cursive" }}>Jaiswal</h1>
            </div>

            <p className="hero-bio">
            Born in the USA, raised between cultures. That's shaped how I bring about a diverse mindset.

            <br /><br />

            I've always loved building bridges:
            <br />
            - Between the engineers and the non-technical staff. through translation of concepts.
            <br />
            - Between a complex data pipeline and a stakeholder who needs to know the numbers, through dashboards.
            <br />
            - Between an idea on a whiteboard and a system that ships, through scalable and reliable software implementation.
            </p>

            <div className="hero-chips">
              {STAT_CHIPS.map((chip) => (
                <div key={chip.label} className="stat-chip">
                  <span className="stat-chip-label">{chip.label}</span>
                  <span className="stat-chip-sub">{chip.sub}</span>
                </div>
              ))}
            </div>

            <div className="hero-ctas">
              <button
                className="btn-primary"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Sparkles size={14} />
                Get in Touch
              </button>
              <button
                className="btn-outline"
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Projects
              </button>
            </div>
          </motion.div>

          {/* Right — Photo */}
          <motion.div
            className="hero-photo-wrap"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
          >
            <div className="hero-photo-ring" />
            <div className="hero-photo-inner">
              <Photo />
            </div>
          </motion.div>
        </div>

        <ScrollIndicator />
      </div>

    </section>
  );
}
