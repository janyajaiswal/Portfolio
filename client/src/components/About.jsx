import { motion } from 'framer-motion';

const TRAITS = [
  'Distributed Systems', 'Machine Learning', 'Computer Vision',
  'Full-Stack MERN', 'GCP / AWS', 'C++ & Python',
  'Research-Driven', 'Agile', 'Open Source',
];

const CURRENTLY = [
  { icon: '🛰️', text: 'Upcoming Intern @ NASA' },
  { icon: '🎓', text: 'MS CS @ CSUF' },
  { icon: '☁️', text: 'Intern @ CypherShield' },
  { icon: '📚', text: 'Success Ambassador @ GEAR UP' },
  { icon: '📖', text: 'C++ Instructor @ CSUF' },
  { icon: '📍', text: 'Fullerton, Orange County, CA' },
];

export default function About() {
  return (
    <section id="about" className="section">
      <div className="orb orb-purple" style={{ width: 400, height: 400, top: '0%', right: '-5%', opacity: 0.6 }} />

      <div className="section-inner" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
        >
          <p className="section-label">01 — About</p>
          <h2 className="section-heading">A bit about me.</h2>
          <div className="divider" />
        </motion.div>

        <div className="about-grid">
          <motion.div
            className="about-text-col"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, delay: 0.1, ease: 'easeOut' }}
          >
            <p className="about-body">
              I'm a graduate student in Computer Science at{' '}
              <span className="about-highlight">Cal State Fullerton with a 3.93 GPA</span>. I completed my Bachelor's in Computer Science &amp; Engineering at VIT-AP, India in 2024. My experiences gave
              me a global foundation on how systems are built, why they fail, and how design decisions can be improved.
            </p>
            <p className="about-body">
              My work spans distributed ML pipelines, full-stack web applications, and
              cloud-native infrastructure. I've built systems that process image
              samples in parallel, diagnosed medical records with 95% accuracy, and
              architected enterprise M365 workflows from scratch. I've also shared my knowledge and taught C++ to 120+ freshmen. I don't just write code, I understand why it needs to exist, and how LLMs can be used in parallel to improve efficiency. Being a jack of all trades is something I take pride in.
            </p>
            <p className="about-body">
              Outside of my tech world, I've volunteered for the underprivileged,
              student outreach programs and have had the experience of working all-around jobs, from being a Cashier to a Martial Arts attendant.
            </p>
            <span className="fun-fact">
              A fun fact: I was born with blue-grey eyes but they changed color to hazel.
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, delay: 0.2, ease: 'easeOut' }}
          >
            <div className="traits-box">
              <p className="traits-label">// areas of focus</p>
              <div className="traits-pills">
                {TRAITS.map((trait, i) => (
                  <span
                    key={trait}
                    className="skill-pill"
                    style={{
                      animationDelay: `${i * 0.05}s`,
                      color: i % 3 === 0 ? 'var(--teal-primary)' : undefined,
                      borderColor: i % 3 === 0 ? 'rgba(45,212,191,0.3)' : undefined,
                    }}
                  >
                    {trait}
                  </span>
                ))}
              </div>

              <div className="traits-divider">
                <p className="traits-label">// currently</p>
                <div className="currently-list">
                  {CURRENTLY.map((item) => (
                    <div key={item.text} className="currently-item">
                      <span className="currently-icon">{item.icon}</span>
                      <span className="currently-text">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
