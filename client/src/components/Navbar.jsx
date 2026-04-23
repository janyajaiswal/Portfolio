import { useState, useEffect } from 'react';
import { Moon, Sun, Download, Menu, X } from 'lucide-react';
import useTheme from '../hooks/useTheme';
import useScrollSpy from '../hooks/useScrollSpy';
import { NAV_LINKS } from '../constants';

export default function Navbar() {
  const { isDark, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useScrollSpy(NAV_LINKS.map((l) => l.id));

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className={`nav-header${scrolled ? ' scrolled' : ''}`}>
      <nav className="nav-inner">
        <button
          className="nav-logo"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          JJ
        </button>

        <div className="nav-links hidden md:flex">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`nav-link${active === link.id ? ' active' : ''}`}
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="nav-controls">
          <button onClick={toggle} aria-label="Toggle theme" className="nav-icon-btn">
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <a
            href="/Janya_Resume.pdf"
            download="Janya_Jaiswal_Resume.pdf"
            className="btn-outline hidden md:inline-flex"
            style={{ padding: '0.45rem 1rem', fontSize: '0.7rem' }}
          >
            <Download size={13} />
            Resume
          </a>

          <button
            className="nav-icon-btn md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="nav-mobile-menu">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`nav-mobile-link${active === link.id ? ' active' : ''}`}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
