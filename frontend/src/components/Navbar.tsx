
import { Link } from 'react-router-dom';
import { ShoppingCart, Settings } from 'lucide-react';

export function Navbar({ totalItems }: { totalItems: number }) {
  return (
    <header className="header">
      <div className="container">
        {/* Actions on the left (RTL) */}
        <nav className="navbar-actions">
          <Link to="/cart" className="btn btn-outline" style={{ position: 'relative', border: 'none', padding: '0.5rem' }}>
            <ShoppingCart size={24} />
            {totalItems > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                left: '-5px',
                background: 'var(--primary)',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
                fontWeight: 'bold'
              }}>
                {totalItems}
              </span>
            )}
          </Link>
          <Link to="/admin" className="btn btn-outline" title="لوحة التحكم" style={{ border: 'none', padding: '0.5rem' }}>
            <Settings size={24} />
          </Link>
        </nav>

        {/* Logo on the right (RTL) */}
        <div className="navbar-logo">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
            <img src="/logo.png" alt="بيبي ستور" style={{ height: '70px', width: 'auto', objectFit: 'contain' }} />
          </Link>
        </div>
      </div>
    </header>
  );
}
