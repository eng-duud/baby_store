import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Moon, Sun, Home as HomeIcon, Package, Layers, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar({ totalItems }: { totalItems: number }) {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    { name: 'الرئيسية', path: '/', icon: <HomeIcon size={20} /> },
    { name: 'المنتجات', path: '/products', icon: <Package size={20} /> },
    { name: 'الباقات', path: '/bundles', icon: <Layers size={20} /> },
    { name: 'تواصل معنا', path: '/contact', icon: <MessageCircle size={20} /> },
  ];

  return (
    <>
      <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          {/* Right: Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="logo-icon-wrapper" style={{ 
              width: '40px', 
              height: '40px', 
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 4px 12px rgba(255, 123, 156, 0.3)',
              transform: 'rotate(-5deg)'
            }}>
              <Moon size={22} className="logo-icon-moon" />
            </div>
            <span className="gradient-text" style={{ fontSize: '1.2rem', fontWeight: '900' }}>بيبي ستور</span>
          </Link>

          {/* Center: Desktop Nav */}
          <nav className="desktop-only" style={{ display: 'flex', gap: '0.5rem', background: 'var(--border)', padding: '0.3rem', borderRadius: 'var(--radius-full)' }}>
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path}
                style={{ 
                  padding: '0.5rem 1.25rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                  color: location.pathname === link.path ? 'var(--primary)' : 'var(--text-muted)',
                  background: location.pathname === link.path ? 'white' : 'transparent',
                  boxShadow: location.pathname === link.path ? 'var(--shadow-sm)' : 'none'
                }}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Left: Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button 
              onClick={() => setIsDark(!isDark)}
              className="btn-outline"
              style={{ 
                width: '40px', 
                height: '40px', 
                padding: 0, 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isDark ? <Sun size={20} fill="currentColor" className="text-accent" /> : <Moon size={20} />}
            </button>

            <Link 
              to="/cart" 
              className="btn-primary"
              style={{ 
                position: 'relative', 
                width: '40px', 
                height: '40px', 
                padding: 0, 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: location.pathname === '/cart' ? 'var(--primary)' : 'var(--card)',
                color: location.pathname === '/cart' ? 'white' : 'var(--text)',
                border: location.pathname === '/cart' ? 'none' : '1px solid var(--border)',
                boxShadow: location.pathname === '/cart' ? '0 4px 12px rgba(255,123,156,0.3)' : 'none'
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
                      top: '-5px',
                      right: '-5px',
                      background: 'var(--secondary)',
                      color: 'white',
                      borderRadius: '50%',
                      width: '18px',
                      height: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.65rem',
                      fontWeight: '800',
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
      </header>

    </>
  );
}

