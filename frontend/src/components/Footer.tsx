
import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Facebook, Twitter, ShoppingBag, Moon } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer style={{ background: 'var(--card)', borderTop: '1px solid var(--border)', padding: '4rem 0 2rem', direction: 'rtl' }}>
      <div className="container">
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-3" style={{ marginBottom: '1.5rem' }}>
              <div className="logo-icon-wrapper" style={{ width: '40px', height: '40px', borderRadius: '10px' }}>
                <Moon size={22} className="logo-icon-moon" />
              </div>
              <h2 className="logo-text" style={{ fontSize: '1.4rem' }}>
                بيبي ستور
              </h2>
            </div>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '0.95rem' }}>
              وجهتكم الأولى لكل ما يحتاجه طفلكم من ملابس، مستلزمات، وألعاب بجودة عالية وأسعار منافسة. نحن هنا لنهتم بكل تفاصيل راحة طفلكم.
            </p>
            <div className="flex" style={{ gap: '1rem', marginTop: '1.5rem' }}>
              {[Instagram, Facebook, Twitter].map((Icon, idx) => (
                <a key={idx} href="#" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: '700' }}>روابط سريعة</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {[
                { name: 'الرئيسية', path: '/' },
                { name: 'سلة المشتريات', path: '/cart' }
              ].map(link => (
                <li key={link.path} style={{ marginBottom: '0.75rem' }}>
                  <Link to={link.path} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.95rem', transition: 'padding 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.paddingRight = '8px'} onMouseLeave={(e) => e.currentTarget.style.paddingRight = '0'}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: '700' }}>تواصل معنا</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>
                <Phone size={18} color="var(--primary)" />
                <span dir="ltr">+967 776 626 456</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>
                <Mail size={18} color="var(--primary)" />
                <span>info@babystore.ye</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                <MapPin size={18} color="var(--primary)" />
                <span>اليمن - صنعاء - شارع الستين</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{ paddingTop: '2rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            جميع الحقوق محفوظة © {currentYear} متجر بيبي. تم التطوير بكل ❤️
          </p>
        </div>
      </div>
    </footer>
  );
}
