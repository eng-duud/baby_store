import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Package, ShoppingBag, RefreshCw, CheckCircle, Lock, LayoutDashboard, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { API_URL } from '../config';

const AGE_GROUPS = ['0-6 أشهر', '6-12 أشهر', '0-12 أشهر', '1-2 سنوات'];
const CATEGORIES = [
  'مستلزمات المولود', 'ملابس', 'الرضاعة', 'العناية بالطفل',
  'ألعاب', 'الأمهات', 'أثاث الأطفال', 'أمان الطفل', 'أخرى'
];

const emptyForm = {
  name: '', price: '', image: '', category: CATEGORIES[0], ageGroup: AGE_GROUPS[0], description: ''
};

export function Admin() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [lockUntil, setLockUntil] = useState<number | null>(null);
  const [tab, setTab] = useState<'products' | 'orders' | 'bundles'>('products');
  const [products, setProducts] = useState<any[]>([]);
  const [bundles, setBundles] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [bundleForm, setBundleForm] = useState({
    name: '', price: '', image: '', description: '', items: [] as { productId: number, quantity: number }[]
  });
  const [bundleSubmitting, setBundleSubmitting] = useState(false);
  const [editingBundleId, setEditingBundleId] = useState<number | null>(null);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [pRes, bRes, oRes] = await Promise.all([
        fetch(`${API_URL}/products`),
        fetch(`${API_URL}/bundles`),
        fetch(`${API_URL}/orders`)
      ]);
      setProducts(await pRes.json());
      setBundles(await bRes.json());
      setOrders(await oRes.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await fetch(`${API_URL}/seed`, { method: 'POST' });
      const data = await res.json();
      showSuccess(data.message || 'تمت إضافة المنتجات التجريبية!');
      fetchAll();
    } catch { showError('فشل تحميل البيانات التجريبية.'); }
    finally { setSeeding(false); }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setForm(prev => ({ ...prev, image: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleBundleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setBundleForm(prev => ({ ...prev, image: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleBundleEditClick = (bundle: any) => {
    setEditingBundleId(bundle.id);
    setBundleForm({
      name: bundle.name,
      price: bundle.price.toString(),
      image: bundle.image,
      description: bundle.description || '',
      items: bundle.items.map((i: any) => ({ productId: i.productId, quantity: i.quantity }))
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitBundle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bundleForm.name || !bundleForm.price || !bundleForm.image || bundleForm.items.length === 0) {
      showError('يرجى ملء كافة الحقول واختيار منتج واحد على الأقل.');
      return;
    }
    setBundleSubmitting(true);
    try {
      const url = editingBundleId ? `${API_URL}/bundles/${editingBundleId}` : `${API_URL}/bundles`;
      const method = editingBundleId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...bundleForm, price: parseFloat(bundleForm.price) })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setBundleForm({ name: '', price: '', image: '', description: '', items: [] });
      setEditingBundleId(null);
      showSuccess(editingBundleId ? 'تم تحديث الباقة بنجاح!' : 'تمت إضافة الباقة بنجاح!');
      fetchAll();
    } catch (err: any) { showError(err.message || 'فشلت العملية.'); }
    finally { setBundleSubmitting(false); }
  };

  const handleEditClick = (product: any) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: product.price.toString(),
      image: product.image,
      category: product.category,
      ageGroup: product.ageGroup,
      description: product.description || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(form.price.toString());
    if (!form.name || isNaN(priceNum) || !form.category || !form.image) {
      showError('يرجى ملء الحقول المطلوبة بشكل صحيح.');
      return;
    }
    setSubmitting(true);
    try {
      const url = editingId ? `${API_URL}/products/${editingId}` : `${API_URL}/products`;
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, price: priceNum })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      setForm(emptyForm);
      setEditingId(null);
      showSuccess(editingId ? 'تم تحديث المنتج بنجاح!' : 'تمت إضافة المنتج بنجاح!');
      fetchAll();
    } catch (err: any) { showError(err.message || 'فشلت العملية.'); }
    finally { setSubmitting(false); }
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg); setErrorMsg('');
    setTimeout(() => setSuccessMsg(''), 4000);
  };
  const showError = (msg: string) => {
    setErrorMsg(msg); setSuccessMsg('');
    setTimeout(() => setErrorMsg(''), 5000);
  };

  if (!isAuthorized) {
    const isLocked = lockUntil && Date.now() < lockUntil;
    const remainingTime = lockUntil ? Math.ceil((lockUntil - Date.now()) / 1000 / 60) : 0;
    return (
      <div className="section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container" style={{ maxWidth: '450px' }}>
          <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Lock size={32} />
            </div>
            <h2 style={{ marginBottom: '1rem' }}>لوحة التحكم</h2>
            <p className="text-muted" style={{ marginBottom: '2rem' }}>يرجى إدخال كلمة المرور للمتابعة</p>
            
            {isLocked ? (
              <div style={{ padding: '1rem', background: 'var(--secondary-light)', color: 'var(--secondary)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: '700' }}>
                ⚠️ الوصول مقفل. حاول بعد {remainingTime} دقيقة.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input 
                  type="password" 
                  placeholder="كلمة المرور" 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (passwordInput === 'admin123' ? setIsAuthorized(true) : showError('كلمة المرور خاطئة'))}
                  style={{ textAlign: 'center' }}
                />
                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%' }}
                  onClick={() => passwordInput === 'admin123' ? setIsAuthorized(true) : showError('كلمة المرور خاطئة')}
                >
                  دخول آمن
                </button>
              </div>
            )}
            {errorMsg && <p style={{ color: 'red', marginTop: '1rem', fontSize: '0.85rem' }}>{errorMsg}</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-transition section">
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', background: 'var(--primary)', color: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LayoutDashboard size={24} />
            </div>
            <h1 className="gradient-text">الإدارة</h1>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={handleSeed} disabled={seeding} className="btn btn-outline" style={{ padding: '0.6rem 1.25rem' }}>
              <RefreshCw size={18} className={seeding ? 'spin' : ''} />
              <span className="desktop-only">منتجات تجريبية</span>
            </button>
            <button onClick={fetchAll} className="btn btn-outline" style={{ padding: '0.6rem 1.25rem' }}>
              تحديث البيانات
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{ gap: '1.5rem', marginBottom: '3rem' }}>
          {[
            { label: 'المنتجات', value: products.length, icon: <Package />, color: 'var(--primary)' },
            { label: 'الباقات', value: bundles.length, icon: <ShoppingBag />, color: 'var(--secondary)' },
            { label: 'الطلبات', value: orders.length, icon: <ShoppingCart />, color: '#10b981' },
            { label: 'المبيعات', value: orders.filter(o => o.status !== 'cancelled').reduce((acc, o) => acc + Number(o.totalPrice), 0).toFixed(0), icon: <CheckCircle />, color: 'var(--accent)' }
          ].map((stat, i) => (
            <div key={i} className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ color: stat.color }}>{stat.icon}</div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{stat.value}</div>
                <div className="text-muted" style={{ fontSize: '0.85rem' }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border)', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          <button onClick={() => setTab('products')} style={{ padding: '0.75rem 1.5rem', border: 'none', background: tab === 'products' ? 'var(--primary-light)' : 'transparent', color: tab === 'products' ? 'var(--primary)' : 'var(--text-muted)', borderRadius: 'var(--radius-md)', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' }}>المنتجات</button>
          <button onClick={() => setTab('bundles')} style={{ padding: '0.75rem 1.5rem', border: 'none', background: tab === 'bundles' ? 'var(--primary-light)' : 'transparent', color: tab === 'bundles' ? 'var(--primary)' : 'var(--text-muted)', borderRadius: 'var(--radius-md)', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' }}>الباقات</button>
          <button onClick={() => setTab('orders')} style={{ padding: '0.75rem 1.5rem', border: 'none', background: tab === 'orders' ? 'var(--primary-light)' : 'transparent', color: tab === 'orders' ? 'var(--primary)' : 'var(--text-muted)', borderRadius: 'var(--radius-md)', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' }}>الطلبات</button>
        </div>

        {/* Content Tabs */}
        <AnimatePresence mode="wait">
          {tab === 'products' && (
            <motion.div key="products" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>{editingId ? 'تعديل المنتج' : 'إضافة منتج'}</h3>
                <form onSubmit={handleSubmitProduct} className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '1.25rem' }}>
                  <input placeholder="اسم المنتج" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                  <input type="number" placeholder="السعر" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select value={form.ageGroup} onChange={e => setForm({ ...form, ageGroup: e.target.value })}>
                    {AGE_GROUPS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                  <div style={{ gridColumn: 'span 1' }}>
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                  </div>
                  <textarea placeholder="وصف المنتج" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ gridColumn: 'span 1', minHeight: '100px' }} />
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                      {submitting ? 'جاري الحفظ...' : (editingId ? 'تحديث المنتج' : 'إضافة للمتجر')}
                    </button>
                    {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="btn btn-outline">إلغاء</button>}
                  </div>
                </form>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" style={{ gap: '1rem' }}>
                {products.map(p => (
                  <div key={p.id} className="card" style={{ padding: '0.75rem' }}>
                    <img src={p.image} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem' }} />
                    <h4 style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>{p.name}</h4>
                    <div style={{ fontWeight: '700', color: 'var(--primary)', marginBottom: '0.75rem' }}>{p.price} ر.ي</div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleEditClick(p)} className="btn btn-outline" style={{ padding: '0.4rem', flex: 1, fontSize: '0.8rem' }}>تعديل</button>
                      <button onClick={async () => { if(confirm('حذف؟')) { await fetch(`${API_URL}/products/${p.id}`, {method: 'DELETE'}); fetchAll(); } }} className="btn btn-outline" style={{ padding: '0.4rem', flex: 1, fontSize: '0.8rem', color: 'red' }}>حذف</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {tab === 'orders' && (
            <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="card" style={{ padding: '1rem', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)' }}>
                      <th style={{ padding: '1rem' }}>الطلب</th>
                      <th style={{ padding: '1rem' }}>العميل</th>
                      <th style={{ padding: '1rem' }}>الإجمالي</th>
                      <th style={{ padding: '1rem' }}>الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '1rem' }}>#{order.id}</td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ fontWeight: '700' }}>{order.customerName}</div>
                          <div className="text-muted" style={{ fontSize: '0.8rem' }}>{order.phone}</div>
                        </td>
                        <td style={{ padding: '1rem', fontWeight: '700' }}>{order.totalPrice} ر.ي</td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{ padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)', background: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: '700' }}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
