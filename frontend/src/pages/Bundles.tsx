import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Zap, Heart, ArrowLeft } from 'lucide-react';
import { useCart } from '../store/cartStore';
import { API_URL } from '../config';

export function Bundles({ addToCart }: { addToCart: ReturnType<typeof useCart>['addToCart'] }) {
  const [bundles, setBundles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBundles() {
      try {
        const res = await fetch(`${API_URL}/bundles`);
        const data = await res.json();
        setBundles(data);
      } catch (e) {
        console.error("Failed to fetch bundles", e);
      } finally {
        setLoading(false);
      }
    }
    fetchBundles();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ padding: 'var(--space-xxl) var(--space-md)', textAlign: 'center' }}>
        <div className="skeleton" style={{ width: '250px', height: '40px', margin: '0 auto 3rem', borderRadius: 'var(--radius-md)' }} />
        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '2rem' }}>
          {[1,2,3,4].map(i => (
            <div key={i} className="skeleton" style={{ height: '450px', borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page-transition section">
      <div className="container">
        <header style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--secondary-light)', color: 'var(--secondary)', padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-full)', marginBottom: '1.5rem', fontWeight: '800', fontSize: '0.9rem' }}>
            <Zap size={18} />
            باقات توفير حصرية
          </div>
          <h1 className="gradient-text" style={{ marginBottom: '1.5rem' }}>باقاتنا المتكاملة</h1>
          <p className="text-muted" style={{ maxWidth: '700px', margin: '0 auto' }}>
            نوفر لكِ الجهد والمال مع باقاتنا المختارة بعناية لتشمل كل ما يحتاجه صغيرك في حقيبة واحدة.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '2rem' }}>
          {bundles.map(bundle => (
            <motion.div 
              key={bundle.id} 
              className="card"
              whileHover={{ y: -10 }}
              style={{ borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column' }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 0 }}>
                <div style={{ height: '350px', position: 'relative' }}>
                  <img 
                    src={bundle.image} 
                    alt={bundle.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}>
                    <span style={{ background: 'var(--primary)', color: 'white', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Star size={14} fill="currentColor" />
                      باقة مميزة
                    </span>
                  </div>
                </div>
                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ marginBottom: '1rem' }}>{bundle.name}</h3>
                  <p className="text-muted" style={{ marginBottom: '2rem', fontSize: '0.95rem', flex: 1 }}>
                    {bundle.description}
                  </p>
                  
                  <div style={{ background: 'var(--background)', padding: '1.5rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div className="text-muted" style={{ fontSize: '0.75rem', fontWeight: '700', marginBottom: '0.25rem' }}>سعر الباقة</div>
                      <div className="price-tag">{bundle.price} <small style={{ fontSize: '0.8rem' }}>ر.ي</small></div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <Link to={`/bundle/${bundle.id}`} className="btn btn-outline" style={{ width: '42px', height: '42px', padding: 0, borderRadius: '12px' }}>
                        <ArrowLeft size={20} />
                      </Link>
                      <button 
                        className="btn btn-primary" 
                        style={{ width: '42px', height: '42px', padding: 0, borderRadius: '12px' }}
                        onClick={() => addToCart({ type: 'bundle', dbId: bundle.id, name: bundle.name, price: Number(bundle.price), image: bundle.image })}
                      >
                        <ShoppingCart size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {bundles.length === 0 && (
          <div style={{ textAlign: 'center', padding: 'var(--space-xxl) 0' }}>
            <h3 className="text-muted">لا توجد باقات متوفرة حالياً.</h3>
          </div>
        )}
      </div>
    </div>
  );
}

