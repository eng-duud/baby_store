import { motion } from 'framer-motion';
import { Sparkles, Package, Star, ArrowLeft, Heart, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className="page-transition">
      {/* Hero Section */}
      <section style={{ 
        position: 'relative',
        padding: '8rem 1rem 6rem', 
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(255,123,156,0.08) 0%, rgba(96,165,250,0.08) 100%)',
        textAlign: 'center'
      }}>
        {/* Animated Orbs */}
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'var(--primary-light)', borderRadius: '50%', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '300px', height: '300px', background: 'var(--secondary-light)', borderRadius: '50%', filter: 'blur(80px)' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="category-chip" style={{ marginBottom: '2rem', padding: '0.6rem 1.5rem', background: 'var(--primary)', color: 'white', border: 'none' }}>
              <Sparkles size={18} />
              مرحباً بكم في بيبي ستور
            </div>
            <h1 style={{ fontSize: 'clamp(3rem, 10vw, 5rem)', marginBottom: '2rem', lineHeight: 1, fontWeight: '900' }} className="gradient-text">
              نعتني بأدق تفاصيل <br /> سعادة طفلك
            </h1>
            <p className="text-muted" style={{ fontSize: '1.4rem', maxWidth: '800px', margin: '0 auto 3.5rem', lineHeight: 1.8 }}>
              في بيبي ستور، نؤمن أن كل طفل يستحق الأفضل. قمنا باختيار أجود المستلزمات وأجمل الباقات لترافقكم في رحلة الأمومة بكل حب وسهولة.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/products" className="btn btn-primary" style={{ padding: '1.25rem 3rem', fontSize: '1.2rem', borderRadius: '2rem' }}>
                اكتشفي منتجاتنا
              </Link>
              <Link to="/bundles" className="btn" style={{ padding: '1.25rem 3rem', fontSize: '1.2rem', background: 'var(--card)', color: 'var(--text)', boxShadow: 'var(--shadow-md)', borderRadius: '2rem' }}>
                عرض باقات التوفير
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About / Features Section */}
      <section style={{ padding: '8rem 0' }}>
        <div className="container">
          <motion.div 
            layout
            className="grid" 
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}
          >
            <motion.div 
              whileHover={{ y: -10 }}
              style={{ padding: '3rem', background: 'var(--card)', borderRadius: '2.5rem', border: '1px solid var(--border)', textAlign: 'center' }}
            >
              <div style={{ width: '80px', height: '80px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                <Heart size={40} fill="currentColor" />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>مُختارة بكل حب</h3>
              <p className="text-muted">كل قطعة في متجرنا تمر باختبارات جودة صارمة لضمان سلامة وراحة طفلك.</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              style={{ padding: '3rem', background: 'var(--card)', borderRadius: '2.5rem', border: '1px solid var(--border)', textAlign: 'center' }}
            >
              <div style={{ width: '80px', height: '80px', background: 'var(--secondary-light)', color: 'var(--secondary)', borderRadius: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                <Package size={40} />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>باقات توفيرية</h3>
              <p className="text-muted">صممنا باقات متكاملة تجمع لكِ أهم الاحتياجات بأسعار أوفر بكثير من الشراء المنفرد.</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              style={{ padding: '3rem', background: 'var(--card)', borderRadius: '2.5rem', border: '1px solid var(--border)', textAlign: 'center' }}
            >
              <div style={{ width: '80px', height: '80px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                <ShieldCheck size={40} />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>تسوق آمن</h3>
              <p className="text-muted">خدمة توصيل سريعة ودفع آمن، مع إمكانية التواصل المباشر عبر الواتساب لأي استفسار.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Banner Section */}
      <section className="container" style={{ marginBottom: '8rem' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', 
          borderRadius: '3rem', 
          padding: '4rem', 
          textAlign: 'center', 
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>جاهزة لتبدأي رحلة التسوق؟</h2>
            <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
              انضمي إلى مئات الأمهات السعيدات اللواتي وثقن بمنتجاتنا.
            </p>
            <Link to="/products" className="btn" style={{ background: 'white', color: 'var(--primary)', padding: '1rem 3rem', fontSize: '1.2rem', fontWeight: '800' }}>
              تصفحي المنتجات الآن
              <ArrowLeft size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
