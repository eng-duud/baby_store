import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus, Package, Heart } from 'lucide-react';
import { useCart } from '../store/cartStore';
import { API_URL } from '../config';

export function Products({ addToCart }: { addToCart: ReturnType<typeof useCart>['addToCart'] }) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAge, setSelectedAge] = useState('all');

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${API_URL}/products`);
        const data = await res.json();
        setProducts(data);
      } catch (e) {
        console.error("Failed to fetch products", e);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filteredProducts = selectedAge === 'all' 
    ? products 
    : products.filter(p => p.ageGroup === selectedAge);

  const AGE_LABELS: Record<string, string> = {
    'all': 'كل المنتجات',
    '0-6 months': '0-6 أشهر',
    '6-12 months': '6-12 أشهر',
    '1-2 years': '1-2 سنوات'
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '8rem 1.5rem', textAlign: 'center' }}>
        <div className="skeleton" style={{ width: '200px', height: '40px', margin: '0 auto 2rem', borderRadius: 'var(--radius-md)' }} />
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="skeleton" style={{ height: '350px', borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page-transition" style={{ padding: '6rem 0' }}>
      <div className="container">
        <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>منتجاتنا المختارة</h1>
          <p className="text-muted" style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            تصفحي مجموعتنا الواسعة من مستلزمات الأطفال بجودة عالية وأسعار منافسة.
          </p>
        </header>

        {/* Filter Tabs */}
        <div className="tab-container" style={{ marginBottom: '3rem', maxWidth: '100%', overflowX: 'auto', padding: '0.5rem', WebkitOverflowScrolling: 'touch' }}>
          {Object.keys(AGE_LABELS).map(age => (
            <button
              key={age}
              onClick={() => setSelectedAge(age)}
              className={`tab-item ${selectedAge === age ? 'active' : ''}`}
              style={{ padding: '0.8rem 2rem', fontSize: '1.1rem' }}
            >
              {AGE_LABELS[age]}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div style={{ minHeight: '400px' }}>
          <motion.div 
            layout
            className="grid" 
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map(product => (
                <motion.div 
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="card"
                  style={{ position: 'relative' }}
                >
                  <div style={{ height: '260px', overflow: 'hidden', position: 'relative' }}>
                    <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button 
                      style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'rgba(255,255,255,0.8)', padding: '0.5rem', borderRadius: '50%', color: 'var(--text-muted)' }}
                    >
                      <Heart size={18} />
                    </button>
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <span className="category-chip" style={{ fontSize: '0.75rem' }}>
                        {product.category}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', height: '1.4em', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                      {product.name}
                    </h3>
                    <div className="flex justify-between items-center">
                      <span style={{ fontWeight: '900', fontSize: '1.4rem', color: 'var(--primary)' }}>
                        {product.price} <small style={{ fontSize: '0.8rem' }}>ر.ي</small>
                      </span>
                      <button 
                        className="btn btn-primary" 
                        style={{ padding: '0.6rem', borderRadius: '1rem' }}
                        onClick={() => addToCart({ type: 'product', dbId: product.id, name: product.name, price: Number(product.price), image: product.image })}
                      >
                        <Plus size={24} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          
          <AnimatePresence>
            {filteredProducts.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ textAlign: 'center', padding: '6rem 2rem' }}
              >
                <div style={{ background: 'var(--border)', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', color: 'var(--text-muted)' }}>
                  <Package size={50} />
                </div>
                <h2 className="text-muted">لا توجد منتجات حالياً</h2>
                <p className="text-muted">نعمل على توفير المزيد من المنتجات الرائعة لكِ.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
