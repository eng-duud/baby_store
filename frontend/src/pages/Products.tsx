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
    'all': 'الكل',
    '0-6 months': '0-6 أشهر',
    '6-12 months': '6-12 أشهر',
    '1-2 years': '1-2 سنوات'
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: 'var(--space-xxl) var(--space-md)', textAlign: 'center' }}>
        <div className="skeleton" style={{ width: '200px', height: '40px', margin: '0 auto 2rem', borderRadius: 'var(--radius-md)' }} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" style={{ gap: '1.5rem' }}>
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="skeleton" style={{ height: '380px', borderRadius: 'var(--radius-md)' }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page-transition section">
      <div className="container">
        <header style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <h1 className="gradient-text" style={{ marginBottom: '1rem' }}>منتجاتنا المختارة</h1>
          <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
            تصفحي مجموعتنا الواسعة من مستلزمات الأطفال بجودة عالية وأسعار منافسة.
          </p>
        </header>

        {/* Filter Tabs */}
        <div className="tab-container">
          {Object.keys(AGE_LABELS).map(age => (
            <button
              key={age}
              onClick={() => setSelectedAge(age)}
              className={`tab-item ${selectedAge === age ? 'active' : ''}`}
            >
              {AGE_LABELS[age]}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div style={{ minHeight: '400px' }}>
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
            style={{ gap: '1.5rem' }}
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map(product => (
                <motion.div 
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="card product-card"
                >
                  <div className="product-image-wrapper">
                    <img src={product.image} alt={product.name} className="product-image" />
                    <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                      <span style={{ background: 'white', color: 'var(--text)', padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: '800', boxShadow: 'var(--shadow-sm)' }}>
                        {product.category}
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: '700' }}>
                      {product.name}
                    </h3>
                    <div className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1.5rem', flex: 1 }}>
                      {product.ageGroup ? `عمر ${AGE_LABELS[product.ageGroup]}` : ''}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div className="price-tag">
                        {product.price} <small style={{ fontSize: '0.7rem', verticalAlign: 'middle', fontWeight: '700' }}>ر.ي</small>
                      </div>
                      <button 
                        className="btn btn-primary" 
                        style={{ width: '42px', height: '42px', padding: 0, borderRadius: '12px' }}
                        onClick={() => addToCart({ type: 'product', dbId: product.id, name: product.name, price: Number(product.price), image: product.image })}
                      >
                        <Plus size={22} />
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
                style={{ textAlign: 'center', padding: 'var(--space-xxl) 0' }}
              >
                <div style={{ background: 'var(--border)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--text-muted)' }}>
                  <Package size={40} />
                </div>
                <h3>لا توجد منتجات حالياً</h3>
                <p className="text-muted">نعمل على توفير المزيد من المنتجات الرائعة لكِ.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

