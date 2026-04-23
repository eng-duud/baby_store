import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Plus, Package } from 'lucide-react';
import { useCart } from '../store/cartStore';
import { API_URL } from '../config';

export function Home({ addToCart }: { addToCart: ReturnType<typeof useCart>['addToCart'] }) {
  const [products, setProducts] = useState<any[]>([]);
  const [bundles, setBundles] = useState<any[]>([]);
  const [selectedAge, setSelectedAge] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [prodRes, bundleRes] = await Promise.all([
          fetch(`${API_URL}/products`),
          fetch(`${API_URL}/bundles`)
        ]);
        const pData = await prodRes.json();
        const bData = await bundleRes.json();
        setProducts(pData);
        setBundles(bData);
      } catch (e) {
        console.error("Failed to fetch data", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
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

  if (loading) return <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>جاري تحميل منتجات رائعة...</div>;

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section style={{ 
        padding: '4rem 1.5rem', 
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(255,123,156,0.1) 0%, rgba(96,165,250,0.1) 100%)',
        marginBottom: '3rem'
      }}>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '1rem' }}
          className="gradient-text"
        >
          مُختارة بكل حب لأطفالكم الصغار
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted"
          style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 2rem' }}
        >
          اكتشفوا باقات متميزة ومستلزمات مختارة بعناية لتناسب كل مرحلة من مراحل نمو طفلك.
        </motion.p>
      </section>

      <div className="container">
        {/* Featured Bundles */}
        {bundles.length > 0 && (
          <section style={{ marginBottom: '4rem' }}>
            <div className="flex items-center gap-4" style={{ marginBottom: '2rem' }}>
              <Star color="var(--primary)" fill="var(--primary)" />
              <h2>باقات مختارة</h2>
            </div>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
              {bundles.map(bundle => (
                <motion.div 
                  key={bundle.id} 
                  className="card"
                  whileHover={{ y: -8 }}
                >
                  <Link to={`/bundle/${bundle.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <img 
                      src={bundle.image} 
                      alt={bundle.name} 
                      style={{ width: '100%', height: '250px', objectFit: 'cover' }} 
                    />
                    <div style={{ padding: '1.5rem' }}>
                      <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1.25rem' }}>{bundle.name}</h3>
                        <span style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.25rem' }}>{bundle.price} ر.ي</span>
                      </div>
                      <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>{bundle.description}</p>
                    </div>
                  </Link>
                  <div style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
                    <button 
                      className="btn btn-primary" 
                      style={{ width: '100%', gap: '0.5rem' }}
                      onClick={() => addToCart({ type: 'bundle', dbId: bundle.id, name: bundle.name, price: Number(bundle.price), image: bundle.image })}
                    >
                      <ShoppingCart size={20} />
                      إضافة الباقة للسلة
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Shop by Age Filter */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2>اختر عمر طفلك</h2>
            <p className="text-muted">سنعرض لك المستلزمات الأكثر ملاءمة لكل مرحلة.</p>
          </div>
          <div className="flex" style={{ justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {['all', '0-6 months', '6-12 months', '1-2 years'].map(age => (
              <button
                key={age}
                onClick={() => setSelectedAge(age)}
                className={`btn ${selectedAge === age ? 'btn-primary' : 'btn-outline'}`}
              >
                {AGE_LABELS[age]}
              </button>
            ))}
          </div>
        </section>

        {/* Products */}
        <section>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
            {filteredProducts.map(product => (
              <motion.div key={product.id} className="card" whileHover={{ y: -5 }}>
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--secondary)', fontWeight: 'bold' }}>
                    {product.category}
                  </span>
                  <h3 style={{ fontSize: '1.1rem', margin: '0.5rem 0' }}>{product.name}</h3>
                  <div className="flex justify-between items-center" style={{ marginTop: '1rem' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{product.price} ر.ي</span>
                    <button 
                      className="btn" 
                      style={{ padding: '0.5rem', background: 'var(--primary)', color: 'white', borderRadius: 'var(--radius-full)' }}
                      onClick={() => addToCart({ type: 'product', dbId: product.id, name: product.name, price: Number(product.price), image: product.image })}
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            {filteredProducts.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                لا توجد منتجات لهذه الفئة العمرية حالياً.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
