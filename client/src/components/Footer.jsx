import { Code2, Linkedin, Mail } from 'lucide-react';
import { NAV_LINKS } from '../constants';

const SOCIALS = [
  { icon: Code2,    href: 'https://github.com/janyajaiswal',          label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com/in/janya-jaiswal',    label: 'LinkedIn' },
  { icon: Mail,     href: 'mailto:jaiswaljanya@gmail.com',            label: 'Email' },
];

export default function Footer() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <button className="footer-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Janya Jaiswal
          </button>

          <nav className="footer-nav">
            {NAV_LINKS.map((link) => (
              <button key={link.id} className="footer-nav-link" onClick={() => scrollTo(link.id)}>
                {link.label}
              </button>
            ))}
          </nav>

          <div className="footer-socials">
            {SOCIALS.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.label !== 'Email' ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="footer-social-icon"
                >
                  <Icon size={15} />
                </a>
              );
            })}
          </div>
        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <span className="footer-copy">© {new Date().getFullYear()} Janya Jaiswal. All rights reserved.</span>
          <span className="footer-copy">Built by Janya Jaiswal — React · MongoDB · Framer Motion</span>
        </div>
      </div>
    </footer>
  );
}
