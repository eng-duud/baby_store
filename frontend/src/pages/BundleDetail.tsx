import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ShoppingCart, Package, ShieldCheck, Truck, Sparkles, ArrowRight } from 'lucide-react';

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
      <div className="container" style={{ padding: 'var(--space-xxl) var(--space-md)', textAlign: 'center' }}>
        <div className="skeleton" style={{ width: '100%', height: '500px', borderRadius: 'var(--radius-lg)' }} />
      </div>
    );
  }

  if (!bundle) return (
    <div className="container" style={{ padding: 'var(--space-xxl) var(--space-md)', textAlign: 'center' }}>
      <h2>عذراً، الباقة غير موجودة.</h2>
      <Link to="/" className="btn btn-primary" style={{ marginTop: '2rem' }}>العودة للرئيسية</Link>
    </div>
  );

  return (
    <div className="page-transition section" style={{ minHeight: '100vh' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
          <Link to="/bundles" className="btn-outline" style={{ width: '40px', height: '40px', padding: 0, borderRadius: '50%' }}>
            <ArrowRight size={20} />
          </Link>
          <span className="text-muted" style={{ fontWeight: '700' }}>تفاصيل الباقة</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '4rem', alignItems: 'flex-start' }}>
          {/* Bundle Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
              <img 
                src={bundle.image} 
                alt={bundle.name} 
                style={{ width: '100%', display: 'block', aspectRatio: '1/1', objectFit: 'cover' }} 
              />
              <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}>
                <span style={{ background: 'white', color: 'var(--text)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: 'var(--shadow-md)' }}>
                  <Sparkles size={18} className="text-accent" />
                  باقة حصرية
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
            <h1 style={{ marginBottom: '1.5rem' }}>{bundle.name}</h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
              <div className="price-tag" style={{ fontSize: '2.5rem' }}>
                {bundle.price} <small style={{ fontSize: '1rem' }}>ر.ي</small>
              </div>
              <div style={{ padding: '0.4rem 1rem', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 'var(--radius-full)', fontWeight: '800', fontSize: '0.9rem' }}>
                أفضل سعر
              </div>
            </div>

            <p className="text-muted" style={{ fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '2.5rem' }}>
              {bundle.description}
            </p>

            <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
              <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem' }}>
                <div style={{ padding: '0.5rem', background: 'var(--secondary-light)', color: 'var(--secondary)', borderRadius: '0.75rem', display: 'flex' }}>
                  <Package size={22} />
                </div>
                محتويات الباقة
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {bundle.items?.map((item: any) => (
                  <div key={item.id} style={{ padding: '0.75rem 1rem', background: 'var(--background)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img src={item.product.image} style={{ width: '45px', height: '45px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                      <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>{item.product.name}</span>
                    </div>
                    <span style={{ fontWeight: '800', color: 'var(--primary)', background: 'white', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '1px solid var(--border)', fontSize: '0.85rem' }}>
                      {item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>
                <Truck size={18} />
                <span>توصيل سريع وآمن لجميع المدن</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>
                <ShieldCheck size={18} />
                <span>ضمان جودة المنتجات بنسبة 100%</span>
              </div>
            </div>

            <button 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '1.25rem' }}
              onClick={() => addToCart({ type: 'bundle', dbId: bundle.id, name: bundle.name, price: Number(bundle.price), image: bundle.image })}
            >
              <ShoppingCart size={22} />
              إضافة الباقة للسلة
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

