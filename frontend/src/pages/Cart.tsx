import React, { useState } from 'react';
import { useCart } from '../store/cartStore';
import { Trash2, Minus, Plus, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

import { API_URL } from '../config';
const STORE_PHONE = '967776626456'; // Updated phone number

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
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem' }}>سلة التسوق فارغة</h2>
        <p className="text-muted">يبدو أنك لم تضف أي شيء إلى السلة بعد.</p>
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
      // 1. Save to backend
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

      // 2. Generate WhatsApp message
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

      // Clear cart
      clearCart();

      // 3. Redirect to WhatsApp
      window.location.href = `https://wa.me/${STORE_PHONE}?text=${text}`;
    } catch (err: any) {
      setError(err.message || 'فشل إرسال الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 4rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>سلة التسوق</h1>
      
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
        {/* Cart Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cart.map(item => (
            <motion.div 
              key={item.id} 
              className="card"
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', gap: '1rem', padding: '1rem', alignItems: 'center' }}
            >
              <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
              <div style={{ flex: 1 }}>
                <h4 style={{ marginBottom: '0.25rem' }}>{item.name}</h4>
                <div style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{item.price} ر.ي</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--background)', borderRadius: 'var(--radius-full)', padding: '0.25rem' }}>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  style={{ padding: '0.25rem', display: 'flex', alignItems: 'center' }}
                >
                  <Minus size={16} />
                </button>
                <span style={{ width: '20px', textAlign: 'center', fontWeight: '500' }}>{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  style={{ padding: '0.25rem', display: 'flex', alignItems: 'center' }}
                >
                  <Plus size={16} />
                </button>
              </div>
              <button 
                onClick={() => updateQuantity(item.id, 0)}
                style={{ padding: '0.5rem', color: 'var(--text-muted)' }}
              >
                <Trash2 size={20} />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Checkout Form */}
        <div className="card" style={{ padding: '2rem', height: 'fit-content' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>ملخص الطلب</h2>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
            <span>الإجمالي</span>
            <span style={{ color: 'var(--primary)' }}>{totalPrice.toFixed(2)} ر.ي</span>
          </div>

          <form onSubmit={handleOrder} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {error && (
              <div style={{ padding: '1rem', background: '#fee2e2', color: '#b91c1c', borderRadius: 'var(--radius-md)' }}>
                {error}
              </div>
            )}
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>الاسم الكامل *</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontFamily: 'inherit', background: 'var(--background)', color: 'var(--text)' }}
                placeholder="أدخل اسمك الكامل"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>رقم الجوال *</label>
              <input 
                type="tel" 
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontFamily: 'inherit', background: 'var(--background)', color: 'var(--text)' }}
                placeholder="05xxxxxxxx"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>عنوان التوصيل *</label>
              <textarea 
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontFamily: 'inherit', minHeight: '100px', resize: 'vertical', background: 'var(--background)', color: 'var(--text)' }}
                placeholder="المدينة، الحي، الشارع، رقم المنزل"
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '1rem', fontSize: '1.1rem' }}
              disabled={loading}
            >
              <MessageCircle size={20} />
              {loading ? 'جاري المعالجة...' : 'إتمام الطلب عبر واتساب'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
