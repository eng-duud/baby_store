import { motion } from 'framer-motion';
import { Sparkles, Package, Star, ArrowLeft, Heart, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className="page-transition">
      {/* Hero Section */}
      <section className="section" style={{ 
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(255,123,156,0.08) 0%, rgba(96,165,250,0.08) 100%)',
        textAlign: 'center',
        paddingTop: 'clamp(4rem, 15vh, 8rem)'
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
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary)', color: 'white', padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-full)', marginBottom: '2rem', fontWeight: '700', fontSize: '0.9rem' }}>
              <Sparkles size={18} />
              مرحباً بكم في بيبي ستور
            </div>
            <h1 className="gradient-text" style={{ marginBottom: '1.5rem' }}>
              نعتني بأدق تفاصيل <br /> سعادة طفلك
            </h1>
            <p className="text-muted" style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)', maxWidth: '700px', margin: '0 auto 3rem', lineHeight: 1.8 }}>
              في بيبي ستور، نؤمن أن كل طفل يستحق الأفضل. قمنا باختيار أجود المستلزمات وأجمل الباقات لترافقكم في رحلة الأمومة بكل حب وسهولة.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/products" className="btn btn-primary" style={{ padding: '1rem 2.5rem' }}>
                اكتشفي منتجاتنا
              </Link>
              <Link to="/bundles" className="btn btn-outline" style={{ padding: '1rem 2.5rem' }}>
                عرض باقات التوفير
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About / Features Section */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '2rem' }}>
            <motion.div 
              whileHover={{ y: -10 }}
              className="card"
              style={{ padding: '2.5rem', textAlign: 'center' }}
            >
              <div style={{ width: '70px', height: '70px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <Heart size={32} fill="currentColor" />
              </div>
              <h3 style={{ marginBottom: '1rem' }}>مُختارة بكل حب</h3>
              <p className="text-muted">كل قطعة في متجرنا تمر باختبارات جودة صارمة لضمان سلامة وراحة طفلك.</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="card"
              style={{ padding: '2.5rem', textAlign: 'center' }}
            >
              <div style={{ width: '70px', height: '70px', background: 'var(--secondary-light)', color: 'var(--secondary)', borderRadius: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <Package size={32} />
              </div>
              <h3 style={{ marginBottom: '1rem' }}>باقات توفيرية</h3>
              <p className="text-muted">صممنا باقات متكاملة تجمع لكِ أهم الاحتياجات بأسعار أوفر بكثير من الشراء المنفرد.</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="card"
              style={{ padding: '2.5rem', textAlign: 'center' }}
            >
              <div style={{ width: '70px', height: '70px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <ShieldCheck size={32} />
              </div>
              <h3 style={{ marginBottom: '1rem' }}>تسوق آمن</h3>
              <p className="text-muted">خدمة توصيل سريعة ودفع آمن، مع إمكانية التواصل المباشر عبر الواتساب لأي استفسار.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Banner Section */}
      <section className="container" style={{ marginBottom: 'var(--space-xl)' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', 
          borderRadius: 'var(--radius-lg)', 
          padding: 'clamp(2.5rem, 8vw, 5rem)', 
          textAlign: 'center', 
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ marginBottom: '1.5rem', color: 'white' }}>جاهزة لتبدأي رحلة التسوق؟</h2>
            <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
              انضمي إلى مئات الأمهات السعيدات اللواتي وثقن بمنتجاتنا.
            </p>
            <Link to="/products" className="btn" style={{ background: 'white', color: 'var(--primary)', padding: '0.8rem 2.5rem', fontWeight: '800' }}>
              تصفحي المنتجات الآن
              <ArrowLeft size={20} />
            </Link>
          </div>
          {/* Decorative shapes */}
          <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: '-50px', right: '-50px', width: '150px', height: '150px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
        </div>
      </section>
    </div>
  );
}

