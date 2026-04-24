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
    <header className="header">
      <div className="container" style={{ pointerEvents: 'none' }}>
        
        {/* Actions Section (Left on RTL) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', pointerEvents: 'auto' }} className="navbar-actions">
          {/* Cart with Badge */}
          <Link 
            to="/cart" 
            style={{ 
              position: 'relative', 
              width: '42px',
              height: '42px',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              borderRadius: '50%', 
              background: location.pathname === '/cart' ? 'var(--primary)' : 'var(--background)',
              color: location.pathname === '/cart' ? 'white' : 'var(--text)',
              border: '1px solid var(--border)'
            }}
          >
            <ShoppingCart size={20} />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    background: 'var(--secondary)',
                    color: 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    border: '2px solid var(--card)'
                  }}
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {/* Theme Toggle */}
          <button 
            onClick={() => setIsDark(!isDark)}
            style={{ 
              width: '42px',
              height: '42px',
              borderRadius: '50%', 
              background: 'var(--background)', 
              color: isDark ? '#FBBF24' : 'var(--text)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isDark ? <Sun size={20} fill="currentColor" /> : <Moon size={20} />}
          </button>

          {/* Desktop Navigation Links */}
          <div style={{ width: '1px', height: '24px', background: 'var(--border)', margin: '0 0.5rem' }} className="desktop-only" />
          
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
                  transition: 'all 0.3s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Logo Section (Right on RTL) */}
        <div style={{ pointerEvents: 'auto' }}>
          <Link to="/" className="navbar-logo" style={{ gap: '0.75rem', textDecoration: 'none' }}>
            <span className="logo-text desktop-only" style={{ fontSize: '1.25rem', fontWeight: '900' }}>بيبي ستور</span>
            <div className="logo-icon-wrapper" style={{ width: '42px', height: '42px', borderRadius: '12px' }}>
              <Moon size={24} className="logo-icon-moon" />
              <div className="logo-icon-star" />
            </div>
          </Link>
        </div>

      </div>

      {/* Mobile Bottom Navigation (Optional but good for mobile UX) */}
      <nav className="mobile-only" style={{ 
        position: 'fixed', 
        bottom: '1rem', 
        left: '50%', 
        transform: 'translateX(-50%)',
        background: 'var(--card)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        padding: '0.5rem',
        borderRadius: 'var(--radius-full)',
        border: '1px solid var(--border)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        zIndex: 1000,
        gap: '0.5rem',
        width: '90%',
        maxWidth: '400px',
        justifyContent: 'space-around'
      }}>
        {navLinks.map((link) => (
          <Link 
            key={link.path}
            to={link.path}
            style={{ 
              padding: '0.6rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: '700',
              fontSize: '0.85rem',
              color: location.pathname === link.path ? 'white' : 'var(--text)',
              background: location.pathname === link.path ? 'var(--primary)' : 'transparent',
              transition: 'all 0.3s ease',
              textAlign: 'center',
              flex: 1
            }}
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </header>
  );
}
