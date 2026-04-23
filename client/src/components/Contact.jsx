import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Code2, Linkedin, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { sendContactMessage } from '../utils/api';

const SOCIALS = [
  { label: 'GitHub',   href: 'https://github.com/janyajaiswal',       icon: Code2,    color: 'var(--text-secondary)' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/janya-jaiswal', icon: Linkedin, color: '#0A66C2' },
  { label: 'Email',    href: 'mailto:jaiswaljanya@gmail.com',         icon: Mail,     color: 'var(--teal-primary)' },
];

const SOCIAL_HANDLES = {
  GitHub:   'github.com/janyajaiswal',
  LinkedIn: 'linkedin.com/in/janya-jaiswal',
  Email:    'jaiswaljanya@gmail.com',
};

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      await sendContactMessage(form);
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <section id="contact" className="section">
      <div className="orb orb-teal"   style={{ width: 500, height: 500, top: '-10%',  left: '-10%', opacity: 0.4 }} />
      <div className="orb orb-purple" style={{ width: 400, height: 400, bottom: '-5%', right: '-8%', opacity: 0.4 }} />

      <div className="section-inner" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
        >
          <p className="section-label">07 — Contact</p>
          <h2 className="section-heading">Tune in with me.</h2>
          <div className="divider" />
        </motion.div>

        <div className="contact-grid">
          {/* Left — Copy */}
          <motion.div
            className="contact-copy"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <p className="contact-body">
              Whether it's a role, a project, or just a conversation, please feel free to reach out.
            </p>

            <div className="contact-socials">
              {SOCIALS.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.label !== 'Email' ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="social-link"
                  >
                    <Icon size={18} style={{ color: s.color, flexShrink: 0 }} />
                    <div className="social-link-info">
                      <div className="social-link-label">{s.label}</div>
                      <div className="social-link-sub">{SOCIAL_HANDLES[s.label]}</div>
                    </div>
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          >
            {status === 'success' ? (
              <div className="contact-success">
                <CheckCircle size={48} style={{ color: 'var(--teal-primary)' }} />
                <h3 className="contact-success-title">Message sent!</h3>
                <p className="contact-success-body">Thanks for reaching out. I'll get back to you soon.</p>
                <button className="btn-outline" onClick={() => setStatus('idle')} style={{ marginTop: '0.5rem' }}>
                  Send another
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    id="name" name="name" type="text"
                    value={form.name} onChange={handleChange}
                    placeholder="Your name" required
                    className="form-input"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    id="email" name="email" type="email"
                    value={form.email} onChange={handleChange}
                    placeholder="your@email.com" required
                    className="form-input"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea
                    id="message" name="message"
                    value={form.message} onChange={handleChange}
                    placeholder="What's on your mind?" required rows={5}
                    className="form-input form-textarea"
                  />
                </div>

                {status === 'error' && (
                  <div className="form-error">
                    <AlertCircle size={16} />
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={status === 'loading'}
                  style={{ justifyContent: 'center', opacity: status === 'loading' ? 0.7 : 1 }}
                >
                  <Send size={14} />
                  {status === 'loading' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
