import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const EXPERIENCES = [
  {
    role: 'Data Analytics Intern',
    company: 'NASA Armstrong Flight Research Center',
    dates: 'Jun 2026 – Aug 2026',
    type: 'Upcoming Internship',
    tags: ['Power BI', 'MS Project', 'SharePoint', 'Python', 'AI Summarization', 'Data Analytics'],
    bullets: [
    ],
  },
  {
    role: 'IT / GCP Engineer Intern',
    company: 'CypherShield',
    dates: 'Jan 2026 – Present',
    type: 'Internship',
    tags: ['GCP', 'OAuth 2.0', 'Microsoft Graph API', 'M365', 'Azure AD'],
    bullets: [
      'Registered Microsoft Entra ID (Azure AD) application with OAuth 2.0 client credentials; configured Graph API permissions, token scopes, and RBAC for enterprise M365 workflows.',
      'Built automated data pipelines processing high-volume M365 and Google Workspace API event data; surfaced real-time risk indicators on enterprise dashboards.',
      'Architected a company-wide SharePoint knowledge base integrated with Slack automations — delivered centralized documentation and access-controlled repositories.',
    ],
  },
  {
    role: 'Program Operations Associate',
    company: 'GEAR UP CSUF',
    dates: 'Sep 2025 – Present',
    type: 'Part-time',
    tags: ['Google Apps Script', 'Excel', 'Data Automation', 'Operations'],
    bullets: [
      'Maintained and updated 10,000+ student records in participant and staff databases with full data integrity.',
      'Built Google Apps Script automation tools: duplicate detection, cross-sheet validation rules, and auto-flag logic, reducing manual review time by 15%.',
      'Applied Excel (Pivot Tables, VLOOKUP, conditional formulas) to clean and reconcile gradebook data.',
      'Coordinated family engagement outreach campaigns and designed Canva materials for school-age and family audiences.',
    ],
  },
  {
    role: 'Instructional Lab Assistant',
    company: 'California State University, Fullerton',
    dates: 'Sep 2025 – Present',
    type: 'Part-time',
    tags: ['C++', 'OOP', 'Algorithms', 'Debugging', 'Git'],
    bullets: [
      'Lead 1:1 debugging sessions for 120+ students covering memory management, pointer arithmetic, CLI workflows, Git, and OOP design patterns.',
      'Developed reusable reference handouts for syntax, debugging workflows, and common CLI patterns, enabling 50%+ of students to complete programs within lab time.',
      'Significantly reduced class-wide repetitive questions by standardizing instruction on algorithmic complexity and OOP fundamentals.',
    ],
  },
  {
    role: 'Web Development Intern',
    company: 'Psynautics',
    dates: 'Jun 2025 – Sep 2025',
    type: 'Internship',
    tags: ['Figma', 'UX Research', 'REST API', 'MERN', 'System Design'],
    bullets: [
      'Conducted a full UX audit of a live mental wellness platform, identifying 10+ friction points; presented findings directly to CEO and COO.',
      'Created Figma wireframes, interactive prototypes, and redesigned user flow maps that provided technical foundation for Squarespace → MERN migration.',
      'Defined REST API contracts, data models, and component architecture to guide the full-stack rebuild.',
    ],
  },
  {
    role: 'Research Assistant',
    company: 'CSUF Auxiliary Services Corp',
    dates: 'Apr 2025 – Oct 2025',
    type: 'Research',
    tags: ['Python', 'Pandas', 'ETL', 'Data Validation', 'SEC Filings'],
    bullets: [
      'Wrote Python (Pandas) scripts to scrape, merge, and reconcile CEO compensation data across 3,000+ records from SEC filings and public datasets.',
      'Enforced consistent schema and implemented rule-based validation: range checks, null detection, and cross-field consistency for analysis-ready datasets.',
      'Flagged anomalous entries via statistical thresholds; managed sensitive institutional data with full confidentiality under Dr. David Weng (Management Dept.).',
    ],
  },
];

function ExperienceCard({ exp, index }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      className="timeline-item"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
    >
      <div className="timeline-gutter">
        <div className={`timeline-dot${open ? ' open' : ''}`} />
        {index < EXPERIENCES.length - 1 && <div className="timeline-line" />}
      </div>

      <div className="card timeline-card" onClick={() => setOpen((v) => !v)}>
        <div className="exp-header">
          <div className="exp-meta">
            <span className="exp-type-badge">{exp.type}</span>
            <h3 className="exp-role">{exp.role}</h3>
            <div className="exp-company-row">
              <span className="exp-company">{exp.company}</span>
              <span className="exp-sep">·</span>
              <span className="exp-dates">{exp.dates}</span>
            </div>
          </div>
          <ChevronDown
            size={18}
            className={`chevron-icon${open ? ' open' : ''}`}
            style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}
          />
        </div>

        <div className="exp-tags">
          {exp.tags.map((tag) => (
            <span key={tag} className="badge badge-gray" style={{ fontSize: '0.6rem' }}>{tag}</span>
          ))}
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
            >
              <div className="exp-expanded">
                {exp.bullets.map((b, i) => (
                  <div key={i} className="exp-bullet">
                    <span className="exp-bullet-arrow">▸</span>
                    <p className="exp-bullet-text">{b}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="section" style={{ background: 'var(--bg-section-alt)' }}>
      <div className="section-inner">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
        >
          <p className="section-label">02 — Experience</p>
          <h2 className="section-heading">Where I've worked.</h2>
          <div className="divider" />
        </motion.div>

        <div className="timeline">
          {EXPERIENCES.map((exp, i) => (
            <ExperienceCard key={exp.role} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
