import { motion } from 'framer-motion';
import { MessageCircle, HelpCircle, ShoppingBag, Truck, CreditCard, ChevronLeft } from 'lucide-react';

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
      description: 'قومي بتعبئة بيانات التوصيل (الاسم، العنوان، الهاتف) ثم النقر على "إتمام الطلب عبر واتساب".'
    },
    {
      icon: <Truck size={24} />,
      title: 'التوصيل',
      description: 'بعد إرسال الرسالة للواتساب، سنتواصل معكِ لتأكيد الموعد وتوصيل طلبك لباب البيت.'
    }
  ];

  return (
    <div className="page-transition" style={{ padding: '6rem 0' }}>
      <div className="container">
        <header style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>تواصل معنا</h1>
          <p className="text-muted" style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
            نحن هنا لمساعدتكِ! إذا كان لديكِ أي استفسار أو ترغبين في طلب خاص، لا تترددي في مراسلتنا.
          </p>
        </header>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
          {/* User Guide */}
          <div>
            <h2 style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ padding: '0.5rem', background: 'var(--primary-light)', borderRadius: '1rem', color: 'var(--primary)' }}>
                <HelpCircle size={24} />
              </div>
              دليل الاستخدام (كيفية الطلب)
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {steps.map((step, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
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
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{step.title}</h3>
                    <p className="text-muted">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contact Methods */}
          <div style={{ background: 'var(--card)', padding: '3rem', borderRadius: '3rem', border: '1px solid var(--border)', height: 'fit-content', boxShadow: 'var(--shadow-lg)' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>ابدأ المحادثة الآن</h2>
            <p className="text-muted" style={{ marginBottom: '2.5rem' }}>
              انقر على الزر أدناه ليتم تحويلك مباشرة إلى الواتساب الخاص بنا. سنرد على جميع استفساراتكِ في أسرع وقت.
            </p>
            
            <a 
              href={`https://wa.me/${STORE_PHONE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{ 
                width: '100%', 
                padding: '1.5rem', 
                background: '#25D366', 
                color: 'white', 
                fontSize: '1.4rem', 
                gap: '1rem',
                boxShadow: '0 10px 20px rgba(37, 211, 102, 0.3)',
                borderRadius: '2rem'
              }}
            >
              <MessageCircle size={32} />
              تحدثي معنا عبر واتساب
            </a>

            <div style={{ marginTop: '3rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
              <h4 style={{ marginBottom: '1rem' }}>ساعات العمل:</h4>
              <p className="text-muted">يومياً من الساعة 9:00 صباحاً حتى 10:00 مساءً</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
