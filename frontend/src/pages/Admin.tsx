import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Package, ShoppingBag, RefreshCw, CheckCircle } from 'lucide-react';
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
  const [orderFilter, setOrderFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Bundle form state
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

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      showError('حجم الصورة كبير جداً (الحد الأقصى 10MB)');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, image: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleBundleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setBundleForm({ ...bundleForm, image: reader.result as string });
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

  const handleCancelBundleEdit = () => {
    setEditingBundleId(null);
    setBundleForm({ name: '', price: '', image: '', description: '', items: [] });
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

  const handleDeleteBundle = async (id: number, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف الباقة "${name}"؟`)) return;
    try {
      await fetch(`${API_URL}/bundles/${id}`, { method: 'DELETE' });
      showSuccess(`تم حذف الباقة.`);
      fetchAll();
    } catch { showError('فشل حذف الباقة.'); }
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
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category || !form.image) {
      showError('يرجى ملء الحقول المطلوبة (الاسم، السعر، الفئة، والصورة).');
      return;
    }
    setSubmitting(true);
    try {
      const url = editingId ? `${API_URL}/products/${editingId}` : `${API_URL}/products`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, price: parseFloat(form.price) })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      
      setForm(emptyForm);
      setEditingId(null);
      showSuccess(editingId ? 'تم تحديث المنتج بنجاح!' : `تمت إضافة المنتج "${data.product.name}" بنجاح!`);
      fetchAll();
    } catch (err: any) { showError(err.message || 'فشلت العملية.'); }
    finally { setSubmitting(false); }
  };

  const handleDeleteProduct = async (id: number, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف "${name}"؟`)) return;
    try {
      await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
      showSuccess(`تم حذف "${name}".`);
      fetchAll();
    } catch { showError('فشل حذف المنتج.'); }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await fetch(`${API_URL}/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchAll();
    } catch (e) { console.error(e); }
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

    const handleLogin = () => {
      if (isLocked) return;

      if (passwordInput === 'admin123') {
        setIsAuthorized(true);
        setAttempts(0);
        setLockUntil(null);
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        if (newAttempts >= 3) {
          const lockoutTime = Date.now() + 15 * 60 * 1000; // 15 minutes
          setLockUntil(lockoutTime);
          showError(`تم إدخال كلمة المرور بشكل خاطئ 3 مرات. تم قفل المحاولة لمدة 15 دقيقة.`);
        } else {
          showError(`كلمة المرور غير صحيحة. المحاولات المتبقية: ${3 - newAttempts}`);
        }
      }
    };

    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', direction: 'rtl' }}>
        <div className="card" style={{ padding: '2.5rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>🔐 دخول لوحة التحكم</h2>
          
          {isLocked ? (
            <div style={{ color: '#991b1b', background: '#fef2f2', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
              ⚠️ تم قفل الوصول مؤقتاً. 
              <br />
              يرجى المحاولة بعد <b>{remainingTime} دقيقة</b>.
            </div>
          ) : (
            <>
              <input 
                type="password" 
                placeholder="أدخل كلمة المرور" 
                style={{ ...inputStyle, marginBottom: '1.5rem', textAlign: 'center' }}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
              <button 
                className="btn btn-primary" 
                style={{ width: '100%' }}
                onClick={handleLogin}
              >
                دخول
              </button>
            </>
          )}
          
          {errorMsg && <p style={{ color: 'red', marginTop: '1rem', fontSize: '0.85rem' }}>{errorMsg}</p>}
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh', direction: 'rtl' }}>
      <div className="container" style={{ padding: '2rem 1.5rem 4rem' }}>
        {/* Header */}
        <div className="flex items-center justify-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h1 style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            لوحة التحكم
          </h1>
          <div className="flex" style={{ gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="btn btn-outline"
              style={{ gap: '0.5rem' }}
            >
              <RefreshCw size={16} style={{ animation: seeding ? 'spin 1s linear infinite' : 'none' }} />
              {seeding ? 'جاري التحميل...' : 'تحميل منتجات تجريبية'}
            </button>
            <button onClick={fetchAll} className="btn btn-outline">تحديث</button>
          </div>
        </div>

        {/* Toast messages */}
        <AnimatePresence>
          {successMsg && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ background: '#dcfce7', color: '#166534', padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={18} /> {successMsg}
            </motion.div>
          )}
          {errorMsg && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ background: '#fee2e2', color: '#991b1b', padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
              ⚠️ {errorMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          {[
            { label: 'إجمالي المنتجات', value: products.length, icon: <Package size={24} color="var(--primary)" />, onClick: () => setTab('products') },
            { label: 'إجمالي الباقات', value: bundles.length, icon: <Package size={24} color="#8b5cf6" />, onClick: () => setTab('bundles') },
            { label: 'إجمالي الطلبات', value: orders.length, icon: <ShoppingBag size={24} color="var(--secondary)" />, onClick: () => setTab('orders') },
            { label: 'إجمالي المبيعات', value: orders.filter(o => o.status !== 'cancelled').reduce((acc, o) => acc + Number(o.totalPrice), 0).toFixed(0) + ' ر.ي', icon: <CheckCircle size={24} color="#10b981" />, onClick: () => setTab('orders') },
          ].map(stat => (
            <div 
              key={stat.label} 
              className="card" 
              onClick={stat.onClick}
              style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}
            >
              {stat.icon}
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '800', lineHeight: 1 }}>{stat.value}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex" style={{ gap: '0.5rem', marginBottom: '2rem', borderBottom: '2px solid var(--border)', paddingBottom: '0' }}>
          {[
            { key: 'products', label: 'إدارة المنتجات' }, 
            { key: 'bundles', label: 'إدارة الباقات' }, 
            { key: 'orders', label: 'الطلبات' }
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as any)}
              style={{
                padding: '0.75rem 1.5rem', fontWeight: '600', fontSize: '1rem', cursor: 'pointer',
                background: 'none', border: 'none', borderBottom: tab === t.key ? '3px solid var(--primary)' : '3px solid transparent',
                color: tab === t.key ? 'var(--primary)' : 'var(--text-muted)', marginBottom: '-2px',
                transition: 'all 0.2s', fontFamily: 'inherit'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* PRODUCTS TAB */}
        {tab === 'products' && (
          <div>
            {/* Add Product Form */}
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem', border: editingId ? '2px solid var(--primary)' : '1px solid var(--border)' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                {editingId ? '📝 تعديل المنتج' : '➕ إضافة منتج جديد'}
              </h2>
              <form onSubmit={handleSubmitProduct}>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  {/* Name */}
                  <div>
                    <label style={labelStyle}>اسم المنتج *</label>
                    <input style={inputStyle} placeholder="مثال: حفاضات نيوبورن" value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>
                  {/* Price */}
                  <div>
                    <label style={labelStyle}>السعر (ر.ي) *</label>
                    <input style={inputStyle} type="number" step="0.01" min="0" placeholder="25.00" value={form.price}
                      onChange={e => setForm({ ...form, price: e.target.value })} />
                  </div>
                  {/* Category */}
                  <div>
                    <label style={labelStyle}>الفئة *</label>
                    <select style={inputStyle} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  {/* Age Group */}
                  <div>
                    <label style={labelStyle}>الفئة العمرية</label>
                    <select style={inputStyle} value={form.ageGroup} onChange={e => setForm({ ...form, ageGroup: e.target.value })}>
                      {AGE_GROUPS.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  {/* Image Upload */}
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={labelStyle}>صورة المنتج *</label>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        style={{ ...inputStyle, width: 'auto', flex: 1 }} 
                      />
                      {form.image && (
                        <div style={{ position: 'relative' }}>
                          <img 
                            src={form.image} 
                            alt="Preview" 
                            style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }} 
                          />
                          <button 
                            type="button"
                            onClick={() => setForm({ ...form, image: '' })}
                            style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', borderRadius: '50%', width: '20px', height: '20px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Description */}
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={labelStyle}>وصف المنتج</label>
                    <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} placeholder="وصف مختصر للمنتج..."
                      value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                  </div>
                </div>
                <div className="flex" style={{ gap: '1rem' }}>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {editingId ? <RefreshCw size={18} /> : <Plus size={18} />}
                    {submitting ? 'جاري الحفظ...' : (editingId ? 'تحديث المنتج' : 'إضافة المنتج')}
                  </button>
                  {editingId && (
                    <button type="button" className="btn btn-outline" onClick={handleCancelEdit}>
                      إلغاء التعديل
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Products List */}
            <div className="card" style={{ padding: '2rem', overflowX: 'auto' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>📦 المنتجات ({products.length})</h2>
              {loading ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>جاري التحميل...</p>
              ) : products.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  <Package size={48} style={{ marginBottom: '1rem', opacity: 0.4 }} />
                  <p>لا توجد منتجات. أضف منتجاً أو اضغط "تحميل منتجات تجريبية".</p>
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)' }}>
                      {['الصورة', 'الاسم', 'الفئة', 'الفئة العمرية', 'السعر', 'إجراءات'].map(h => (
                        <th key={h} style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: '600', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <img src={p.image} alt={p.name} style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: '600', maxWidth: '200px' }}>{p.name}</td>
                        <td style={{ padding: '0.75rem 1rem' }}><span style={badgeStyle}>{p.category}</span></td>
                        <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{p.ageGroup}</td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 'bold', color: 'var(--primary)' }}>{p.price} ر.ي</td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <div className="flex" style={{ gap: '0.5rem' }}>
                            <button onClick={() => handleEditClick(p)}
                              style={{ background: '#e0f2fe', color: '#0369a1', border: 'none', borderRadius: 'var(--radius-sm)', padding: '0.4rem 0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              تعديل
                            </button>
                            <button onClick={() => handleDeleteProduct(p.id, p.name)}
                              style={{ background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: 'var(--radius-sm)', padding: '0.4rem 0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              حذف
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* BUNDLES TAB */}
        {tab === 'bundles' && (
          <div>
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem', border: editingBundleId ? '2px solid var(--primary)' : '1px solid var(--border)' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                {editingBundleId ? '📝 تعديل الباقة' : '🎁 إضافة باقة جديدة'}
              </h2>
              <form onSubmit={handleSubmitBundle}>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={labelStyle}>اسم الباقة *</label>
                    <input style={inputStyle} value={bundleForm.name} onChange={e => setBundleForm({ ...bundleForm, name: e.target.value })} />
                  </div>
                  <div>
                    <label style={labelStyle}>السعر (ر.ي) *</label>
                    <input style={inputStyle} type="number" value={bundleForm.price} onChange={e => setBundleForm({ ...bundleForm, price: e.target.value })} />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={labelStyle}>صورة الباقة *</label>
                    <input type="file" accept="image/*" onChange={handleBundleFileChange} style={inputStyle} />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={labelStyle}>وصف الباقة</label>
                    <textarea style={{ ...inputStyle, minHeight: '60px' }} value={bundleForm.description} onChange={e => setBundleForm({ ...bundleForm, description: e.target.value })} />
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={labelStyle}>اختر المنتجات المشمولة في الباقة *</label>
                  <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                    {products.map(p => {
                      const isSelected = bundleForm.items.find(i => i.productId === p.id);
                      return (
                        <div key={p.id} className="flex items-center gap-2" style={{ padding: '0.5rem', background: isSelected ? 'var(--background)' : 'transparent', borderRadius: 'var(--radius-sm)' }}>
                          <input 
                            type="checkbox" 
                            checked={!!isSelected} 
                            onChange={(e) => {
                              if (e.target.checked) {
                                setBundleForm({ ...bundleForm, items: [...bundleForm.items, { productId: p.id, quantity: 1 }] });
                              } else {
                                setBundleForm({ ...bundleForm, items: bundleForm.items.filter(i => i.productId !== p.id) });
                              }
                            }} 
                          />
                          <span style={{ fontSize: '0.9rem' }}>{p.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex" style={{ gap: '1rem' }}>
                  <button type="submit" className="btn btn-primary" disabled={bundleSubmitting}>
                    {bundleSubmitting ? 'جاري الحفظ...' : (editingBundleId ? 'تحديث الباقة' : 'إضافة الباقة')}
                  </button>
                  {editingBundleId && (
                    <button type="button" className="btn btn-outline" onClick={handleCancelBundleEdit}>
                      إلغاء التعديل
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>📦 الباقات الحالية ({bundles.length})</h2>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                {bundles.map(b => (
                  <div key={b.id} className="card" style={{ padding: '1rem', border: '1px solid var(--border)' }}>
                    <img src={b.image} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '0.5rem' }} />
                    <h3 style={{ fontSize: '1rem' }}>{b.name}</h3>
                    <div style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{b.price} ر.ي</div>
                    <div className="flex" style={{ gap: '0.5rem', marginTop: '1rem' }}>
                      <button onClick={() => handleBundleEditClick(b)} style={{ color: 'var(--primary)', fontSize: '0.8rem', background: 'none', border: 'none', cursor: 'pointer' }}>تعديل</button>
                      <button onClick={() => handleDeleteBundle(b.id, b.name)} style={{ color: 'red', fontSize: '0.8rem', background: 'none', border: 'none', cursor: 'pointer' }}>حذف</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {tab === 'orders' && (
          <div className="card" style={{ padding: '2rem' }}>
            <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 style={{ fontSize: '1.5rem' }}>🛒 الطلبات ({orders.length})</h2>
              <div className="flex" style={{ gap: '0.5rem', flexWrap: 'wrap' }}>
                {['all', 'new', 'processing', 'paid', 'delivered', 'cancelled'].map(f => (
                  <button 
                    key={f}
                    onClick={() => setOrderFilter(f)}
                    className="btn btn-outline"
                    style={{ 
                      padding: '0.4rem 0.8rem', 
                      fontSize: '0.85rem',
                      background: orderFilter === f ? 'var(--primary)' : 'transparent',
                      color: orderFilter === f ? 'white' : 'var(--text)',
                      borderColor: orderFilter === f ? 'var(--primary)' : 'var(--border)'
                    }}
                  >
                    {f === 'all' ? 'الكل' : 
                     f === 'new' ? 'جديد' : 
                     f === 'processing' ? 'قيد المعالجة' : 
                     f === 'paid' ? 'تم الدفع' : 
                     f === 'delivered' ? 'تم التوصيل' : 'ملغي'}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>جاري التحميل...</p>
            ) : orders.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>لا توجد طلبات بعد.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)' }}>
                      {['', 'رقم الطلب', 'العميل', 'العنوان', 'الإجمالي', 'التاريخ', 'الحالة'].map(h => (
                        <th key={h} style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: '600', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders
                      .filter(o => orderFilter === 'all' || o.status === orderFilter)
                      .map(order => (
                      <React.Fragment key={order.id}>
                        <tr style={{ borderBottom: '1px solid var(--border)', background: expandedOrder === order.id ? 'rgba(255,123,156,0.05)' : 'transparent' }}>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <button 
                              onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontWeight: 'bold' }}
                            >
                              {expandedOrder === order.id ? '▼' : '▶'}
                            </button>
                          </td>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: 'bold' }}>#{order.id}</td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <div style={{ fontWeight: '600' }}>{order.customerName}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.phone}</div>
                          </td>
                          <td style={{ padding: '0.75rem 1rem', maxWidth: '180px', fontSize: '0.9rem' }}>{order.address}</td>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: 'bold', color: 'var(--primary)' }}>{order.totalPrice} ر.ي</td>
                          <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            <div>{new Date(order.createdAt).toLocaleDateString('ar-EG')}</div>
                            <div style={{ fontSize: '0.75rem' }}>{new Date(order.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</div>
                          </td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <select 
                              value={order.status} 
                              onChange={(e) => updateStatus(order.id, e.target.value)}
                              style={{ 
                                padding: '0.4rem 0.75rem', 
                                borderRadius: 'var(--radius-sm)', 
                                border: '1px solid var(--border)', 
                                background: order.status === 'new' ? '#fffbeb' : 
                                            order.status === 'delivered' ? '#f0fdf4' : 
                                            order.status === 'cancelled' ? '#fef2f2' : 'var(--background)',
                                fontFamily: 'inherit', 
                                cursor: 'pointer', 
                                color: 'var(--text)',
                                fontSize: '0.85rem'
                              }}
                            >
                              <option value="new">🆕 جديد</option>
                              <option value="processing">⚙️ قيد المعالجة</option>
                              <option value="paid">💳 تم الدفع</option>
                              <option value="delivered">✅ تم التوصيل</option>
                              <option value="cancelled">❌ ملغي</option>
                            </select>
                          </td>
                        </tr>
                        {expandedOrder === order.id && (
                          <tr>
                            <td colSpan={7} style={{ padding: '1rem', background: 'rgba(0,0,0,0.02)' }}>
                              <div style={{ padding: '1rem', background: 'var(--card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                                <h4 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>تفاصيل المنتجات:</h4>
                                <div className="grid" style={{ gap: '0.5rem' }}>
                                  {order.items?.map((item: any, idx: number) => (
                                    <div key={idx} className="flex justify-between items-center" style={{ padding: '0.5rem', borderBottom: '1px dashed var(--border)' }}>
                                      <div className="flex items-center gap-3">
                                        <img src={item.product?.image || item.bundle?.image} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                                        <div>
                                          <div style={{ fontWeight: '600' }}>{item.product?.name || item.bundle?.name}</div>
                                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.product ? 'منتج منفرد' : 'باقة'}</div>
                                        </div>
                                      </div>
                                      <div style={{ fontWeight: 'bold' }}>
                                        {item.quantity} × {item.price} ر.ي
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block', marginBottom: '0.4rem', fontWeight: '600', fontSize: '0.9rem'
};
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.65rem 0.9rem', borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border)', fontFamily: 'inherit', fontSize: '0.95rem',
  background: 'var(--background)', color: 'var(--text)', direction: 'rtl'
};
const badgeStyle: React.CSSProperties = {
  background: 'rgba(255,123,156,0.1)', color: 'var(--primary)',
  padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)',
  fontSize: '0.8rem', fontWeight: '600', whiteSpace: 'nowrap' as const
};
