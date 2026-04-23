import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

const EDUCATION = [
  {
    degree: 'M.S. Computer Science',
    school: 'California State University, Fullerton',
    abbr: 'CSUF',
    dates: 'Aug 2024 – Present',
    gpa: '3.93 / 4.0',
    color: 'teal',
    coursework: [
      'Advanced Database Management', 'Web Backend Engineering', 'Agile Software Processes',
      'Advanced Blockchain', 'Machine Learning Systems', 'Big Data & Distributed Computing', 'Software Architecture',
    ],
    activities: [
      'Volunteer — Fall in Love with Cal State Fullerton 2025',
      'Martial Arts Studio Attendant @ Titan SRC',
      'Society of Women Engineers OC (Orange County) Member',
    ],
  },
  {
    degree: 'B.Tech Computer Science & Engineering',
    school: 'Vellore Institute of Technology – AP',
    abbr: 'VIT-AP',
    dates: 'Sep 2020 – May 2024',
    gpa: '8.65 / 10',
    color: 'purple',
    coursework: [
      'Data Structures & Algorithms', 'Operating Systems', 'Computer Networks',
      'Machine Learning', 'Database Management Systems', 'Software Engineering', 'Engineering Clinics (Capstone)',
    ],
    activities: [
      "University Women's Basketball Team",
      'Peer Mentoring Committee',
      'Ladies Hostel Committee',
      'VTAPP Tech Fest Core Team',
      'Open Source Contribution Club',
    ],
  },
];

export default function Education() {
  return (
    <section id="education" className="section">
      <div className="section-inner">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
        >
          <p className="section-label">05 — Education</p>
          <h2 className="section-heading">Academic background.</h2>
          <div className="divider" />
        </motion.div>

        <div className="edu-grid">
          {EDUCATION.map((edu, i) => {
            const accent = edu.color;
            return (
              <motion.div
                key={edu.abbr}
                className="card edu-card-body"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: 'easeOut' }}
              >
                <div>
                  <div className={`edu-icon-box ${accent}`}>
                    <GraduationCap size={20} style={{ color: accent === 'teal' ? 'var(--teal-primary)' : 'var(--purple-soft)' }} />
                  </div>
                  <h3 className="edu-degree">{edu.degree}</h3>
                  <p className={`edu-school ${accent}`}>{edu.school}</p>
                  <div className="edu-meta-row">
                    <span className="edu-dates">{edu.dates}</span>
                    <span className="edu-gpa">GPA: {edu.gpa}</span>
                  </div>
                </div>

                <div className="edu-section">
                  <p className="edu-section-label">Coursework</p>
                  <div className="edu-pills">
                    {edu.coursework.map((c) => (
                      <span key={c} className={`skill-pill${accent === 'purple' ? ' purple' : ''}`} style={{ fontSize: '0.65rem' }}>{c}</span>
                    ))}
                  </div>
                </div>

                <div className="edu-section">
                  <p className="edu-section-label">Activities</p>
                  <div className="edu-activities">
                    {edu.activities.map((a) => (
                      <div key={a} className="edu-activity-item">
                        <span className={`edu-activity-arrow ${accent}`}>▸</span>
                        <span className="edu-activity-text">{a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
