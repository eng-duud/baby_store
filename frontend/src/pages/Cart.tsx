import React, { useState } from 'react';
import { useCart } from '../store/cartStore';
import { Trash2, Minus, Plus, MessageCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { API_URL } from '../config';
const STORE_PHONE = '967776626456'; 

export function Cart({ 
  cart, 
  updateQuantity, 
  totalPrice,
  clearCart
}: ReturnType<typeof useCart>) {
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: 'var(--space-xxl) var(--space-md)', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div style={{ 
            width: '100px', 
            height: '100px', 
            background: 'var(--primary-light)', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 2rem',
            color: 'var(--primary)'
          }}>
            <ShoppingBag size={50} />
          </div>
          <h2 style={{ marginBottom: '1rem' }}>سلة التسوق فارغة</h2>
          <p className="text-muted" style={{ maxWidth: '500px', margin: '0 auto 2.5rem' }}>
            سلة تسوقك فارغة حالياً.. ولكنها تنتظر أن تمتلئ بكل ما هو مميز لصغيرك! <br />
            صغيرك يستحق الأفضل، ابدأ برحلة تسوق ممتعة الآن.
          </p>
          <Link to="/products" className="btn btn-primary">
            تصفح المنتجات الآن
          </Link>
        </motion.div>
      </div>
    );
  }

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      setError('يرجى ملء جميع الحقول المطلوبة.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.name,
          phone: formData.phone,
          address: formData.address,
          totalPrice,
          items: cart.map(item => ({
            productId: item.type === 'product' ? item.dbId : null,
            bundleId: item.type === 'bundle' ? item.dbId : null,
            quantity: item.quantity,
            price: item.price
          }))
        })
      });
      const data = await response.json();
      
      if (!data.success) throw new Error(data.error);

      const orderId = data.orderId;
      let text = `*طلب جديد (#${orderId})*%0A%0A`;
      text += `*تفاصيل العميل:*%0A`;
      text += `الاسم: ${formData.name}%0A`;
      text += `الجوال: ${formData.phone}%0A`;
      text += `العنوان: ${formData.address}%0A%0A`;
      text += `*المنتجات:*%0A`;
      
      cart.forEach(item => {
        text += `- ${item.quantity}x ${item.name} (${item.price} ر.ي)%0A`;
      });
      
      text += `%0A*الإجمالي: ${totalPrice.toFixed(2)} ر.ي*`;

      clearCart();
      window.location.href = `https://wa.me/${STORE_PHONE}?text=${text}`;
    } catch (err: any) {
      setError(err.message || 'فشل إرسال الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-transition section">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
          <Link to="/products" className="btn-outline" style={{ width: '40px', height: '40px', padding: 0, borderRadius: '50%' }}>
            <ArrowRight size={20} />
          </Link>
          <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' }}>سلة التسوق</h1>
        </div>
      
        <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: '2.5rem', alignItems: 'flex-start' }}>
          {/* Cart Items */}
          <div className="lg:grid-cols-2" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', gridColumn: 'span 2' }}>
            {cart.map(item => (
              <motion.div 
                key={item.id} 
                className="card"
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ display: 'flex', gap: '1.25rem', padding: '1rem', alignItems: 'center' }}
              >
                <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{item.name}</h4>
                  <div className="price-tag" style={{ fontSize: '1.1rem' }}>{item.price} <small style={{ fontSize: '0.7rem' }}>ر.ي</small></div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--border)', borderRadius: 'var(--radius-full)', padding: '0.3rem' }}>
                  <button 
                    className="btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    style={{ padding: '0.25rem', width: '28px', height: '28px', background: 'white', borderRadius: '50%', boxShadow: 'var(--shadow-sm)' }}
                  >
                    <Minus size={14} />
                  </button>
                  <span style={{ width: '24px', textAlign: 'center', fontWeight: '800', fontSize: '0.9rem' }}>{item.quantity}</span>
                  <button 
                    className="btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    style={{ padding: '0.25rem', width: '28px', height: '28px', background: 'white', borderRadius: '50%', boxShadow: 'var(--shadow-sm)' }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <button 
                  onClick={() => updateQuantity(item.id, 0)}
                  style={{ padding: '0.5rem', color: 'var(--text-muted)' }}
                  className="btn-outline"
                >
                  <Trash2 size={18} />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Checkout Form */}
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>ملخص الطلب</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', alignItems: 'center' }}>
              <span className="text-muted" style={{ fontWeight: '700' }}>الإجمالي</span>
              <span className="price-tag" style={{ fontSize: '1.8rem' }}>{totalPrice.toFixed(2)} <small style={{ fontSize: '0.9rem' }}>ر.ي</small></span>
            </div>

            <form onSubmit={handleOrder} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {error && (
                <div style={{ padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', fontWeight: '600' }}>
                  {error}
                </div>
              )}
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.9rem' }}>الاسم الكامل *</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="أدخل اسمك الكامل"
                  required
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.9rem' }}>رقم الجوال *</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="7xxxxxxxx"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.9rem' }}>عنوان التوصيل *</label>
                <textarea 
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  placeholder="المدينة، الحي، الشارع..."
                  required
                  style={{ minHeight: '100px' }}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '1rem' }}
                disabled={loading}
              >
                {loading ? 'جاري المعالجة...' : (
                  <>
                    <MessageCircle size={20} />
                    إتمام الطلب عبر واتساب
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

