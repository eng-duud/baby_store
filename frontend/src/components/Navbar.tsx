import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Moon, Sun, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar({ totalItems }: { totalItems: number }) {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const location = useLocation();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const navLinks = [
    { name: 'الرئيسية', path: '/' },
    { name: 'المنتجات', path: '/products' },
    { name: 'الباقات', path: '/bundles' },
    { name: 'تواصل معنا', path: '/contact' },
  ];

  return (
    <header className="header" style={{ top: '1.5rem', pointerEvents: 'none' }}>
      <div className="container" style={{ 
        maxWidth: '1400px', 
        display: 'grid', 
        gridTemplateColumns: '1fr auto 1fr', 
        alignItems: 'center', 
        gap: '1rem',
        pointerEvents: 'auto'
      }}>
        
        {/* Left Side (Empty for balancing) */}
        <div className="desktop-only" />

        {/* Actions & Links Unified Bar (Center) */}
        <div style={{ 
          background: 'var(--card)', 
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-full)',
          padding: '0.6rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: 'var(--shadow-lg)',
          width: 'fit-content',
          margin: '0 auto'
        }}>
          {/* Navigation Links */}
          <nav style={{ display: 'flex', gap: '0.25rem' }} className="desktop-only">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path}
                style={{ 
                  padding: '0.6rem 1.1rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                  color: location.pathname === link.path ? 'white' : 'var(--text)',
                  background: location.pathname === link.path ? 'var(--primary)' : 'transparent',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: location.pathname === link.path ? '0 4px 12px rgba(255,123,156,0.3)' : 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div style={{ width: '1px', height: '20px', background: 'var(--border)' }} className="desktop-only" />

          {/* Actions Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button 
              onClick={() => setIsDark(!isDark)}
              className="btn" 
              style={{ 
                width: '38px',
                height: '38px',
                borderRadius: '50%', 
                background: 'var(--background)', 
                color: isDark ? '#FBBF24' : 'var(--text)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0
              }}
            >
              {isDark ? <Sun size={18} fill="currentColor" /> : <Moon size={18} />}
            </button>

            <Link 
              to="/cart" 
              style={{ 
                position: 'relative', 
                width: '38px',
                height: '38px',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderRadius: '50%', 
                background: location.pathname === '/cart' ? 'var(--primary)' : 'var(--background)',
                color: location.pathname === '/cart' ? 'white' : 'var(--text)',
                border: '1px solid var(--border)'
              }}
            >
              <ShoppingCart size={18} />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      background: 'var(--secondary)',
                      color: 'white',
                      borderRadius: '50%',
                      width: '18px',
                      height: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.65rem',
                      fontWeight: 'bold',
                      border: '2px solid var(--card)'
                    }}
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>
        </div>

        {/* Logo Section (Right Side) */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', background: 'var(--card)', borderRadius: '1.25rem', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <span className="logo-text logo-text-desktop" style={{ fontSize: '1.25rem', fontWeight: '900' }}>بيبي ستور</span>
            <div className="logo-icon-wrapper" style={{ width: '40px', height: '40px', borderRadius: '12px' }}>
              <Moon size={22} className="logo-icon-moon" />
              <div className="logo-icon-star" />
            </div>
          </Link>
        </div>

      </div>
    </header>
  );
}
