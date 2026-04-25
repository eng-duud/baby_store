import { motion } from 'framer-motion';
import { MessageCircle, HelpCircle, ShoppingBag, Truck, CreditCard } from 'lucide-react';

const STORE_PHONE = '967776626456';

export function Contact() {
  const steps = [
    {
      icon: <ShoppingBag size={24} />,
      title: 'تصفح المنتجات',
      description: 'اختاري ما يناسب طفلك من مجموعتنا الواسعة من المنتجات أو الباقات المختارة.'
    },
    {
      icon: <HelpCircle size={24} />,
      title: 'إضافة للسلة',
      description: 'أضيفي المنتجات إلى سلة التسوق، يمكنك مراجعة طلبك في أي وقت.'
    },
    {
      icon: <CreditCard size={24} />,
      title: 'تأكيد الطلب',
      description: 'قومي بتعبئة بيانات التوصيل ثم النقر على "إتمام الطلب عبر واتساب".'
    },
    {
      icon: <Truck size={24} />,
      title: 'التوصيل',
      description: 'سنتواصل معكِ لتأكيد الموعد وتوصيل طلبك لباب البيت بكل حب.'
    }
  ];

  return (
    <div className="page-transition section">
      <div className="container">
        <header style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <h1 className="gradient-text" style={{ marginBottom: '1rem', fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>تواصل معنا</h1>
          <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
            نحن هنا لمساعدتكِ! إذا كان لديكِ أي استفسار أو ترغبين في طلب خاص، لا تترددي في مراسلتنا.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: 'clamp(2rem, 5vw, 4rem)', alignItems: 'flex-start' }}>
          {/* User Guide */}
          <div>
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: 'clamp(1.4rem, 4vw, 2rem)' }}>
              <div style={{ padding: '0.4rem', background: 'var(--primary-light)', borderRadius: '0.75rem', color: 'var(--primary)', display: 'flex' }}>
                <HelpCircle size={20} />
              </div>
              دليل الطلب السهل
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {steps.map((step, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  style={{ display: 'flex', gap: '1.5rem' }}
                >
                  <div style={{ 
                    minWidth: '50px', 
                    height: '50px', 
                    background: 'var(--card)', 
                    border: '1px solid var(--border)', 
                    borderRadius: '1.25rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'var(--primary)',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    {step.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>{step.title}</h3>
                    <p className="text-muted" style={{ fontSize: '0.95rem' }}>{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contact Card */}
          <div className="card" style={{ padding: 'clamp(1.5rem, 5vw, 2.5rem)', borderRadius: 'var(--radius-lg)' }}>
            <h2 style={{ marginBottom: '1rem', fontSize: 'clamp(1.3rem, 4vw, 1.8rem)' }}>ابدأ المحادثة الآن</h2>
            <p className="text-muted" style={{ marginBottom: '2.5rem' }}>
              انقر على الزر أدناه ليتم تحويلك مباشرة إلى الواتساب الخاص بنا. سنرد على جميع استفساراتكِ في أسرع وقت.
            </p>
            
            <a 
              href={`https://wa.me/${STORE_PHONE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ 
                width: '100%', 
                padding: '1rem', 
                background: '#25D366', 
                color: 'white', 
                fontSize: 'clamp(1rem, 3vw, 1.25rem)', 
                gap: '0.75rem',
                boxShadow: '0 10px 20px rgba(37, 211, 102, 0.2)',
                border: 'none'
              }}
            >
              <MessageCircle size={24} />
              تحدثي معنا عبر واتساب
            </a>

            <div style={{ marginTop: '2.5rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>ساعات العمل</h4>
                  <div style={{ fontWeight: '700' }}>9:00 ص - 10:00 م</div>
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>موقعنا</h4>
                  <div style={{ fontWeight: '700' }}>اليمن - صنعاء</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

