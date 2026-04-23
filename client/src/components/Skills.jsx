import { useState } from 'react';
import { motion } from 'framer-motion';

const DEV = (name, file) =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${name}/${file}`;
const SI  = (slug) => `https://cdn.simpleicons.org/${slug}`;

// url: logo image URL | mono: true = CSS-invert needed in dark mode
// Skills with NO entry render as text-only tiles
const TECH_LOGOS = {
  // Languages
  'Python':             { url: DEV('python',     'python-original.svg') },
  'JavaScript':         { url: DEV('javascript', 'javascript-original.svg') },
  'TypeScript':         { url: DEV('typescript', 'typescript-original.svg') },
  'Java':               { url: DEV('java',       'java-original.svg') },
  'C++':                { url: DEV('cplusplus',  'cplusplus-original.svg') },
  'Shell Scripting':    { url: SI('gnubash'),     mono: true },

  // ML & AI
  'TensorFlow':         { url: DEV('tensorflow', 'tensorflow-original.svg') },
  'Keras':              { url: DEV('keras',      'keras-original.svg') },
  'scikit-learn':       { url: DEV('scikitlearn','scikitlearn-original.svg') },
  'PyTorch':            { url: DEV('pytorch',    'pytorch-original.svg') },
  'OpenAI API':         { url: SI('openai'),      mono: true },
  'Pandas':             { url: DEV('pandas',     'pandas-original.svg') },
  'NumPy':              { url: DEV('numpy',      'numpy-original.svg') },
  'YOLO':               { url: SI('yolo'),        mono: true },
  'LLM Prompt Engineering': { url: SI('langchain'), mono: true },

  // Full-Stack
  'React':              { url: DEV('react',      'react-original.svg') },
  'Node.js':            { url: DEV('nodejs',     'nodejs-original.svg') },
  'Express':            { url: DEV('express',    'express-original.svg'), mono: true },
  'MongoDB':            { url: DEV('mongodb',    'mongodb-original.svg') },
  'Redux':              { url: DEV('redux',      'redux-original.svg') },
  'Flask':              { url: DEV('flask',      'flask-original.svg'), mono: true },
  'HTML5':              { url: DEV('html5',      'html5-original.svg') },
  'CSS3':               { url: DEV('css3',       'css3-original.svg') },

  // Cloud & DevOps
  'GCP':                { url: DEV('googlecloud','googlecloud-original.svg') },
  'AWS (IAM, EC2, S3)': { url: DEV('amazonwebservices','amazonwebservices-original-wordmark.svg') },
  'Microsoft Entra ID': { url: DEV('azure',     'azure-original.svg') },
  'Microsoft Graph API':{ url: SI('microsoftgraph'), mono: true },
  'Docker':             { url: DEV('docker',     'docker-original.svg') },
  'CI/CD':              { url: SI('githubactions') },
  'Linux':              { url: DEV('linux',      'linux-original.svg') },
  'Git':                { url: DEV('git',        'git-original.svg') },

  // Data & Analytics
  'Apache Spark':       { url: DEV('apachespark','apachespark-original.svg') },
  'ETL Pipelines':      { url: SI('apacheairflow') },
  'Tableau':            { url: '/tableau-logo.jpg' },

  // Databases
  'Neo4j':              { url: DEV('neo4j',      'neo4j-original.svg') },
  'MySQL':              { url: DEV('mysql',      'mysql-original.svg') },
  'PostgreSQL':         { url: DEV('postgresql', 'postgresql-original.svg') },

  // Testing & QA
  'Jest':               { url: DEV('jest',       'jest-plain.svg') },
  'E2E Testing':        { url: SI('playwright') },

  // Tools & Design
  'Figma':              { url: DEV('figma',      'figma-original.svg') },
  'Jira':               { url: DEV('jira',       'jira-original.svg') },
  'Postman':            { url: DEV('postman',    'postman-original.svg') },
  'Google Apps Script': { url: DEV('google',     'google-original.svg') },
  'SharePoint':         { url: SI('microsoftsharepoint'), mono: true },
  'Canva':              { url: SI('canva') },
};

// These render with a custom inline SVG instead of a CDN URL
const CUSTOM_SVG = new Set(['SQL']);

const SKILL_GROUPS = [
  { label: 'Languages',        color: 'teal',   skills: ['Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'SQL', 'Shell Scripting'] },
  { label: 'ML & AI',          color: 'purple', skills: ['TensorFlow', 'Keras', 'scikit-learn', 'PyTorch', 'OpenAI API', 'Pandas', 'NumPy', 'YOLO', 'CNN', 'NER', 'LLM Prompt Engineering'] },
  { label: 'Full-Stack',       color: 'teal',   skills: ['React', 'Node.js', 'Express', 'MongoDB', 'Redux', 'REST APIs', 'Flask', 'HTML5', 'CSS3', 'JWT', 'Multer / GridFS'] },
  { label: 'Cloud & DevOps',   color: 'purple', skills: ['GCP', 'AWS (IAM, EC2, S3)', 'Microsoft Entra ID', 'OAuth 2.0', 'Microsoft Graph API', 'Docker', 'CI/CD', 'Linux', 'Git'] },
  { label: 'Data & Analytics', color: 'teal',   skills: ['Apache Spark', 'ETL Pipelines', 'Feature Engineering', 'Data Mining', 'Statistical Validation', 'Anomaly Detection', 'Tableau'] },
  { label: 'Databases',        color: 'purple', skills: ['Neo4j', 'MongoDB', 'MySQL', 'PostgreSQL', 'Graph Databases'] },
  { label: 'Testing & QA',     color: 'teal',   skills: ['Jest', 'Unit Testing', 'Integration Testing', 'E2E Testing', 'Data Validation', 'Defect Documentation'] },
  { label: 'Tools & Design',   color: 'purple', skills: ['Figma', 'Jira', 'Agile / Scrum', 'Postman', 'Google Apps Script', 'SharePoint', 'Canva'] },
];

// ─── Tile size rules ───────────────────────────────────────────────────────
// Logo tiles are always 1× (square).
// For text-only tiles: check the longest individual word against the
// available text width per column (~6 chars in 1×, ~22 chars in 2×).
// This way text wraps within a square whenever all words fit on their own
// line — only expands to a rectangle when a single word would mid-break.
function getTileSize(name, hasLogo) {
  if (hasLogo) return '1x';
  const words   = name.split(/[\s/]+/).filter(Boolean);
  const maxWord = Math.max(...words.map(w => w.length));
  if (maxWord <= 7)  return '1x';  // all words fit on one line in 84px at 0.6rem
  if (maxWord <= 22) return '2x';  // all words fit on one line in 142px
  return '3x';
}

// ─── Inline DB stack SVG for "SQL" ─────────────────────────────────────────
function DBStackIcon({ color }) {
  const stroke = color === 'teal' ? 'var(--teal-primary)' : 'var(--purple-soft)';
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="5.5" rx="8" ry="2.5" stroke={stroke} strokeWidth="1.5"/>
      <path d="M4 5.5v5c0 1.38 3.582 2.5 8 2.5s8-1.12 8-2.5v-5"  stroke={stroke} strokeWidth="1.5"/>
      <path d="M4 10.5v5c0 1.38 3.582 2.5 8 2.5s8-1.12 8-2.5v-5" stroke={stroke} strokeWidth="1.5"/>
    </svg>
  );
}

// Short label shown below logo images
function shortLabel(name) {
  return name
    .replace('LLM Prompt Engineering', 'LLM Prompt')
    .replace('AWS (IAM, EC2, S3)',      'AWS')
    .replace('Microsoft Entra ID',      'Entra ID')
    .replace('Microsoft Graph API',     'Graph API')
    .replace('Google Apps Script',      'Apps Script')
    .replace('ETL Pipelines',           'Airflow/ETL')
    .replace('E2E Testing',             'Playwright')
    .replace('CI/CD',                   'GH Actions')
    .replace('Multer / GridFS',         'Multer/GridFS');
}

// ─── Tile component ─────────────────────────────────────────────────────────
function SkillTile({ name, color, animDelay }) {
  const [imgFailed, setImgFailed] = useState(false);

  const meta      = TECH_LOGOS[name];
  const isCustom  = CUSTOM_SVG.has(name);
  const hasLogo   = isCustom || (meta?.url && !imgFailed);
  const size      = getTileSize(name, hasLogo);
  const isTextOnly = !hasLogo;

  return (
    <motion.div
      className={`skill-tile tile-${size} ${color}${isTextOnly ? ' text-only' : ''}`}
      initial={{ opacity: 0, scale: 0.88 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.28, delay: animDelay, ease: 'easeOut' }}
    >
      {isTextOnly ? (
        <span className={`skill-tile-fullname ${color}`}>{name}</span>
      ) : isCustom ? (
        <>
          <DBStackIcon color={color} />
          <span className="skill-tile-name">SQL</span>
        </>
      ) : (
        <>
          <img
            src={meta.url}
            alt={name}
            className={`skill-tile-logo${meta.mono ? ' mono' : ''}`}
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
          <span className="skill-tile-name">{shortLabel(name)}</span>
        </>
      )}
    </motion.div>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────
export default function Skills() {
  return (
    <section id="skills" className="section skills-alt-bg">
      <div className="orb orb-purple skills-orb" />

      <div className="section-inner skills-inner">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
        >
          <p className="section-label">04 — Skills</p>
          <h2 className="section-heading">Tools of the trade.</h2>
          <div className="divider" />
        </motion.div>

        <div className="skills-grid">
          {SKILL_GROUPS.map((group, gi) => (
            <motion.div
              key={group.label}
              className="card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: gi * 0.07, ease: 'easeOut' }}
            >
              <div className="skill-group-header">
                <div className={`skill-group-dot ${group.color}`} />
                <span className={`skill-group-name ${group.color}`}>{group.label}</span>
              </div>
              <div className="skill-tiles-wrap">
                {group.skills.map((skill, si) => (
                  <SkillTile
                    key={skill}
                    name={skill}
                    color={group.color}
                    animDelay={gi * 0.05 + si * 0.03}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
