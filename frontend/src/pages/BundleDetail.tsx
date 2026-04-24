import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ShoppingCart, Package, ShieldCheck, Truck, Sparkles } from 'lucide-react';

import { API_URL } from '../config';

export function BundleDetail({ addToCart }: { addToCart: (item: any) => void }) {
  const { id } = useParams();
  const [bundle, setBundle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBundle = async () => {
      try {
        const res = await fetch(`${API_URL}/bundles/${id}`);
        const data = await res.json();
        setBundle(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchBundle();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '8rem 1.5rem', textAlign: 'center' }}>
        <div className="skeleton" style={{ width: '100%', height: '500px', borderRadius: 'var(--radius-lg)' }} />
      </div>
    );
  }

  if (!bundle) return (
    <div className="container" style={{ padding: '8rem 1.5rem', textAlign: 'center' }}>
      <h2>عذراً، الباقة غير موجودة.</h2>
      <Link to="/" className="btn btn-primary" style={{ marginTop: '2rem' }}>العودة للرئيسية</Link>
    </div>
  );

  return (
    <div className="page-transition" style={{ background: 'var(--background)', minHeight: '100vh', direction: 'rtl', paddingBottom: '6rem' }}>
      <div className="container" style={{ padding: '6rem 1.5rem 2rem' }}>
        <Link to="/" className="flex items-center gap-1" style={{ color: 'var(--text-muted)', marginBottom: '3rem', textDecoration: 'none', fontWeight: '600' }}>
          <ChevronRight size={20} />
          <span>الرئيسية</span>
          <ChevronRight size={20} />
          <span style={{ color: 'var(--text)' }}>تفاصيل الباقة</span>
        </Link>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem' }}>
          {/* Bundle Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div style={{ position: 'relative' }}>
              <img 
                src={bundle.image} 
                alt={bundle.name} 
                style={{ width: '100%', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', objectFit: 'cover', aspectRatio: '1/1' }} 
              />
              <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
                <span className="category-chip" style={{ background: 'white', fontSize: '1rem', padding: '0.6rem 1.2rem', boxShadow: 'var(--shadow-md)' }}>
                  <Sparkles size={18} />
                  باقة مميزة
                </span>
              </div>
            </div>
          </motion.div>

          {/* Bundle Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '1rem', lineHeight: 1.1 }}>{bundle.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary)' }}>
                {bundle.price} <small style={{ fontSize: '1rem' }}>ر.ي</small>
              </div>
              <div style={{ padding: '0.4rem 0.8rem', background: 'var(--secondary-light)', color: 'var(--secondary)', borderRadius: 'var(--radius-sm)', fontWeight: '700' }}>
                توفير مميز
              </div>
            </div>

            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '2.5rem' }}>
              {bundle.description}
            </p>

            <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem', border: '1px solid var(--border)' }}>
              <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.4rem' }}>
                <div style={{ padding: '0.5rem', background: 'var(--primary-light)', borderRadius: '0.75rem', color: 'var(--primary)' }}>
                  <Package size={22} />
                </div>
                محتويات هذه الباقة:
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {bundle.items?.map((item: any) => (
                  <div key={item.id} style={{ padding: '1rem', background: 'var(--background)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-4">
                      <img src={item.product.image} style={{ width: '50px', height: '50px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                      <span style={{ fontWeight: '600' }}>{item.product.name}</span>
                    </div>
                    <span style={{ fontWeight: '800', color: 'var(--primary)', background: 'white', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '1px solid var(--border)' }}>
                      {item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
              <div className="flex items-center gap-3" style={{ color: 'var(--text-muted)' }}>
                <Truck size={20} />
                <span>توصيل سريع وآمن لجميع المدن</span>
              </div>
              <div className="flex items-center gap-3" style={{ color: 'var(--text-muted)' }}>
                <ShieldCheck size={20} />
                <span>ضمان جودة المنتجات بنسبة 100%</span>
              </div>
            </div>

            <button 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '1.25rem', fontSize: '1.2rem', gap: '1rem', borderRadius: 'var(--radius-md)' }}
              onClick={() => addToCart({ type: 'bundle', dbId: bundle.id, name: bundle.name, price: Number(bundle.price), image: bundle.image })}
            >
              <ShoppingCart size={24} />
              إضافة الباقة للسلة
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
