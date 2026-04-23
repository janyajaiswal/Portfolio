import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ExternalLink, Code2 } from 'lucide-react';

const PROJECTS = [
  {
    name: 'MoodSync',
    subtitle: 'Affect Recognition & LLM Response Pipeline',
    stack: ['TensorFlow', 'Apache Spark', 'OpenAI API', 'React', 'Docker', 'CNN'],
    color: 'teal',
    summary: 'Distributed multimodal emotion recognition system that classifies facial affect in real time and chains CNN output into LLM-generated, mood-aware chatbot responses.',
    metrics: ['35,887 FER2013 samples', '7 emotion classes', 'Distributed Spark pipeline', 'Dockerized CI/CD'],
    description: [
      'Fine-tuned a CNN on FER2013 (35,887 labeled grayscale facial images across 7 emotion categories) using TensorFlow/Keras. Evaluated per-class F1, precision, and recall metrics; iterated on architecture and hyperparameters to optimize accuracy vs. inference speed.',
      'Designed a distributed Apache Spark pipeline for high-throughput parallel image batch inference — self-taught Spark to build this from scratch.',
      'Chained CNN emotion output into OpenAI API calls with prompt engineering to generate context-sensitive chatbot responses from unstructured emotional state signals.',
      'Containerized with Docker following CI/CD and production-grade deployment patterns; React frontend with simulated streaming input.',
    ],
    github: 'https://github.com/janyajaiswal/MoodSync-01',
    demo: null,
  },
  {
    name: 'Spendemic (In progress)',
    subtitle: 'AI-Powered Financial Planner for International Students',
    stack: ['TypeScript', 'AI/ML', 'React', 'Node.js', 'MongoDB'],
    color: 'purple',
    summary: 'AI-driven financial planning application designed specifically for international students navigating foreign currencies, tuition deadlines, and cross-border money management.',
    metrics: ['TypeScript full-stack', 'AI-powered recommendations', 'Mar 2026'],
    description: [
      'Built an AI-powered financial planner tailored to the unique challenges international students face — foreign currency exchange, tuition payment deadlines, living expense tracking across countries, and limited US credit history.',
      'Leveraged AI/ML to surface personalized budget recommendations and spending insights based on student financial patterns.',
      'Full-stack TypeScript implementation with a focus on clean architecture and type safety across both client and server layers.',
    ],
    github: 'https://github.com/janyajaiswal/Spendemic',
    demo: null,
  },
  {
    name: 'Doc-Aid',
    subtitle: 'Clinical Risk Stratification Engine',
    stack: ['Neo4j', 'NER', 'Naive Bayes', 'TensorFlow', 'Flask', 'MySQL'],
    color: 'purple',
    summary: 'Medical recommendation system that processes unstructured clinical notes via NER, builds a Neo4j knowledge graph, and predicts diagnoses with 95.2% accuracy.',
    metrics: ['95.2% diagnostic accuracy', 'Neo4j knowledge graph', 'Hybrid Naive Bayes + ANN', 'REST API (Flask)'],
    description: [
      'Applied Named Entity Recognition (NER) to extract biological entities from raw clinical text — diseases, symptoms, medications, body parts — and built structured entity relationships.',
      'Constructed a custom Neo4j weighted knowledge graph from extracted entities. Nodes = biological entities; edges = weighted clinical relationships enabling graph traversal for diagnostic reasoning.',
      'Hybrid classifier: Naive Bayes + ANN (TensorFlow). Achieved 95.2% diagnostic accuracy. Conducted feature ablation study to evaluate NER contribution; compared classical vs. deep learning performance tradeoffs.',
      'Flask REST API serving prediction engine. PHP + MySQL backend for patient data management. Patient-facing health risk dashboards via Google Charts API.',
    ],
    github: 'https://github.com/janyajaiswal/Doc-Aid',
    demo: null,
  },
  {
    name: 'Unmanned Reconnaissance Drone',
    subtitle: 'Real-Time CV Threat Detection System',
    stack: ['YOLO', 'Python', 'OpenCV', 'Arduino', 'C++', 'IMU'],
    color: 'teal',
    summary: 'Custom-built fixed-wing drone with embedded Arduino flight control and a real-time YOLO-based threat detection system. 7th of 550 teams at VIT-AP Engineering Clinics Expo.',
    metrics: ['93% detection accuracy', '7th / 550 teams (top 1.3%)', 'Custom threat dataset', 'Real-time aerial inference'],
    description: [
      'Built the airframe from scratch using EP foam. Integrated servo motors, ESCs, motors, and power systems; wired and configured all hardware components.',
      'Arduino microcontroller with gyro sensor (IMU) for real-time flight stabilization — firmware written in C++/Arduino.',
      'Fine-tuned YOLO on a custom threat detection dataset (guns, weapons). 93% accuracy. Also integrated facial detection alongside threat classification.',
      'Onboard camera → real-time Python/OpenCV inference → alert generation during flight. Externally judged panel at ECS Department Expo — top 1.3% finish of 550 competing teams.',
    ],
    github: null,
    demo: null,
  },
  {
    name: 'Curry Cares',
    subtitle: 'Surplus Food Marketplace — MERN Stack',
    stack: ['MongoDB', 'Express', 'React', 'Node.js', 'Redux', 'Jest'],
    color: 'purple',
    summary: 'Full-stack MERN platform enabling users to purchase surplus food from local businesses at discounted prices. JWT auth, geolocation matching, distributed file storage.',
    metrics: ['30% simulated food waste reduction', 'JWT + bcryptjs auth', 'Geolocation matching', 'Jest unit & integration tests'],
    description: [
      'MERN stack with RESTful API design and modular Express.js middleware. JWT + bcryptjs authentication and authorization; express-validator for input sanitization.',
      'Redux for global state management. Multer + GridFS for binary image file storage distributed across MongoDB.',
      'Geolocation APIs for proximity-based matching between surplus food providers and buyers — supply chain logistics modeling.',
      'Jest unit and integration tests written for: authentication flows, product listing validation, geolocation API responses, and Redux state management.',
    ],
    github: 'https://github.com/janyajaiswal/currycares',
    demo: null,
  },
];

function ProjectCard({ project, index }) {
  const [open, setOpen] = useState(false);
  const accent = project.color;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: 'easeOut' }}
    >
      <div
        className={`card project-card${open ? ` open-${accent}` : ''}`}
        onClick={() => setOpen((v) => !v)}
      >
        <div className={`project-accent ${accent}`} />

        <div className="project-header">
          <div className="project-title-group">
            <h3 className="project-name">{project.name}</h3>
            <p className={`project-subtitle ${accent}`}>{project.subtitle}</p>
          </div>
          <ChevronDown size={18} className={`chevron-icon ${accent}${open ? ' open' : ''}`} />
        </div>

        <p className="project-summary">{project.summary}</p>

        <div className="project-chips">
          {project.metrics.map((m) => (
            <span key={m} className={`badge badge-${accent}`} style={{ fontSize: '0.6rem' }}>{m}</span>
          ))}
        </div>

        <div className="project-stack">
          {project.stack.map((s) => (
            <span key={s} className="badge badge-gray" style={{ fontSize: '0.6rem' }}>{s}</span>
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
              onClick={(e) => e.stopPropagation()}
            >
              <div className="project-expanded">
                {project.description.map((d, i) => (
                  <div key={i} className="project-bullet">
                    <span className={`project-bullet-num ${accent}`}>{String(i + 1).padStart(2, '0')}.</span>
                    <p className="project-bullet-text">{d}</p>
                  </div>
                ))}

                <div className="project-links" onClick={(e) => e.stopPropagation()}>
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer"
                      className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.65rem' }}>
                      <Code2 size={12} /> GitHub
                    </a>
                  )}
                  {project.demo && (
                    <a href={project.demo} target="_blank" rel="noopener noreferrer"
                      className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.65rem' }}>
                      <ExternalLink size={12} /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="section">
      <div className="orb orb-teal" style={{ width: 450, height: 450, bottom: '-5%', left: '-8%', opacity: 0.5 }} />

      <div className="section-inner" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
        >
          <p className="section-label">03 — Projects</p>
          <h2 className="section-heading">Things I've built.</h2>
          <div className="divider" />
        </motion.div>

        <div className="projects-grid">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.name} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
