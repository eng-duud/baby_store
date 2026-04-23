
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ShoppingCart, Package } from 'lucide-react';

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

  if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>جاري التحميل...</div>;
  if (!bundle) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>الباقة غير موجودة.</div>;

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh', direction: 'rtl', paddingBottom: '4rem' }}>
      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        <Link to="/" className="flex items-center gap-1" style={{ color: 'var(--text-muted)', marginBottom: '2rem', textDecoration: 'none' }}>
          <ChevronRight size={20} />
          <span>العودة للرئيسية</span>
        </Link>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
          {/* Bundle Image */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <img 
              src={bundle.image} 
              alt={bundle.name} 
              style={{ width: '100%', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', objectFit: 'cover', aspectRatio: '1/1' }} 
            />
          </motion.div>

          {/* Bundle Info */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{bundle.name}</h1>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '1.5rem' }}>
              {bundle.price} ر.ي
            </div>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
              {bundle.description}
            </p>

            <div style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Package size={20} color="var(--primary)" />
                محتويات هذه الباقة:
              </h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {bundle.items?.map((item: any) => (
                  <li key={item.id} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="flex items-center gap-3">
                      <img src={item.product.image} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                      <span>{item.product.name}</span>
                    </div>
                    <span style={{ fontWeight: 'bold' }}>x{item.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', gap: '0.75rem' }}
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
