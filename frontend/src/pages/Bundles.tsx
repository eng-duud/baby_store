import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Zap, Heart } from 'lucide-react';
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
      <div className="container" style={{ padding: '8rem 1.5rem', textAlign: 'center' }}>
        <div className="skeleton" style={{ width: '100%', height: '400px', borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }} />
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
          {[1,2,3].map(i => (
            <div key={i} className="skeleton" style={{ height: '450px', borderRadius: '2.5rem' }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page-transition" style={{ padding: '6rem 0' }}>
      <div className="container">
        <header style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <div className="category-chip" style={{ background: 'var(--secondary-light)', color: 'var(--secondary)', marginBottom: '1.5rem', padding: '0.6rem 1.5rem' }}>
            <Zap size={20} />
            باقات توفير حصرية
          </div>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>باقاتنا المتكاملة</h1>
          <p className="text-muted" style={{ fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto' }}>
            نوفر لكِ الجهد والمال مع باقاتنا المختارة بعناية لتشمل كل ما يحتاجه صغيرك في حقيبة واحدة.
          </p>
        </header>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
          {bundles.map(bundle => (
            <motion.div 
              key={bundle.id} 
              className="card"
              whileHover={{ y: -15, boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.18)' }}
              style={{ border: '1px solid var(--border)', background: 'var(--card)', padding: '1.25rem', borderRadius: '3rem' }}
            >
              <Link to={`/bundle/${bundle.id}`} style={{ display: 'block', position: 'relative', borderRadius: '2.2rem', overflow: 'hidden' }}>
                <img 
                  src={bundle.image} 
                  alt={bundle.name} 
                  style={{ width: '100%', height: '350px', objectFit: 'cover' }} 
                />
                <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', right: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span className="category-chip" style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.5rem 1.2rem' }}>
                    <Star size={16} fill="currentColor" />
                    عرض خاص
                  </span>
                </div>
              </Link>
              <div style={{ padding: '2.5rem 1.5rem 1rem' }}>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>{bundle.name}</h3>
                <p className="text-muted" style={{ marginBottom: '2.5rem', fontSize: '1.1rem', lineHeight: 1.6 }}>
                  {bundle.description}
                </p>
                <div className="flex justify-between items-center" style={{ background: 'var(--background)', padding: '1.25rem', borderRadius: '2rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}>سعر الباقة</span>
                    <span style={{ fontWeight: '900', color: 'var(--primary)', fontSize: '2rem' }}>{bundle.price} <small style={{ fontSize: '1rem' }}>ر.ي</small></span>
                  </div>
                  <button 
                    className="btn btn-primary" 
                    style={{ width: '70px', height: '70px', borderRadius: '1.5rem' }}
                    onClick={() => addToCart({ type: 'bundle', dbId: bundle.id, name: bundle.name, price: Number(bundle.price), image: bundle.image })}
                  >
                    <ShoppingCart size={28} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {bundles.length === 0 && (
          <div style={{ textAlign: 'center', padding: '8rem 2rem' }}>
            <h2 className="text-muted">لا توجد باقات متوفرة حالياً.</h2>
          </div>
        )}
      </div>
    </div>
  );
}
