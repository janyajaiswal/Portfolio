import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Award, Users, ChevronDown, Play } from 'lucide-react';

const AWARDS = [
  {
    icon: Trophy,
    color: 'teal',
    stat: '$1,000',
    label: 'ASI Pathway to Success Scholarship',
    org: 'Associated Students Inc., CSUF · Spring 2026',
    description: 'Merit award recognizing academic achievement, student success, campus involvement, and personal resilience.',
    expandable: false,
  },
  {
    icon: Award,
    color: 'purple',
    stat: '7th / 550',
    label: 'Engineering Clinics Expo — Top 1.3%',
    org: 'VIT-AP University · May 2023',
    description: 'Unmanned reconnaissance drone with YOLO-based threat detection. Externally judged by ECS Department panel out of 550 competing teams.',
    expandable: true,
    videoSrc: '/videos/drone-demo.mp4',
    videoPlaceholder: false,
  },
  {
    icon: Users,
    color: 'teal',
    stat: '3',
    statSub: 'corporate sponsors',
    label: 'VTAPP Tech Fest — Highest-Grossing Event',
    org: 'VIT-AP University · Dec 2022',
    description: "Secured 3 corporate sponsorships (incl. Domino's), led Laser Tag logistics with 3rd-party vendors, and managed the highest-grossing event in Tech Fest history.",
    expandable: false,
  },
];

function AwardCard({ award, index }) {
  const [open, setOpen] = useState(false);
  const accent = award.color;
  const Icon = award.icon;

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: 'easeOut' }}
      style={{
        display: 'flex', flexDirection: 'column', gap: '1rem',
        borderColor: open ? (accent === 'teal' ? 'rgba(45,212,191,0.4)' : 'rgba(192,132,252,0.4)') : undefined,
        transition: 'border-color 0.25s ease, box-shadow 0.2s ease',
      }}
      onClick={() => award.expandable && setOpen((v) => !v)}
    >
      <div className="award-card-header">
        <div className={`award-icon-box ${accent}`}>
          <Icon size={22} style={{ color: accent === 'teal' ? 'var(--teal-primary)' : 'var(--purple-soft)' }} />
        </div>
        {award.expandable && (
          <ChevronDown size={18} className={`award-chevron ${accent}${open ? ' open' : ''}`} />
        )}
      </div>

      <div>
        <div className={`award-stat ${accent}`}>{award.stat}</div>
        {award.statSub && <div className="award-stat-sub">{award.statSub}</div>}
      </div>

      <div>
        <h3 className="award-label">{award.label}</h3>
        <p className="award-org">{award.org}</p>
        <p className="award-desc">{award.description}</p>
        {award.expandable && (
          <p className={`award-toggle-hint ${accent}`}>
            {open ? '▲ collapse' : '▼ watch demo'}
          </p>
        )}
      </div>

      <AnimatePresence>
        {open && award.expandable && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="award-video-panel">
              {award.videoPlaceholder ? (
                <div className="award-video-placeholder">
                  <div className="award-play-btn">
                    <Play size={22} style={{ color: 'var(--purple-soft)', marginLeft: 2 }} />
                  </div>
                  <p className="award-video-label">Video coming soon</p>
                  <p className="award-video-sub">Drop into client/public/videos/drone-demo.mp4</p>
                </div>
              ) : (
                <video src={award.videoSrc} controls className="award-video-player" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Awards() {
  return (
    <section id="awards" className="section" style={{ background: 'var(--bg-section-alt)' }}>
      <div className="section-inner">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
        >
          <p className="section-label">06 — Honors</p>
          <h2 className="section-heading">Recognition.</h2>
          <div className="divider" />
        </motion.div>

        <div className="awards-grid">
          {AWARDS.map((award, i) => (
            <AwardCard key={award.label} award={award} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
