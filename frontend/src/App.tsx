import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { Bundles } from './pages/Bundles';
import { Contact } from './pages/Contact';
import { Cart } from './pages/Cart';
import { Admin } from './pages/Admin';
import { BundleDetail } from './pages/BundleDetail';
import { Footer } from './components/Footer';
import { useCart } from './store/cartStore';

function App() {
  const cartStore = useCart();

  return (
    <>
      <Navbar totalItems={cartStore.totalItems} />
      <main style={{ minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products addToCart={cartStore.addToCart} />} />
          <Route path="/bundles" element={<Bundles addToCart={cartStore.addToCart} />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart {...cartStore} />} />
          <Route path="/portal-access-9x2v" element={<Admin />} />
          <Route path="/bundle/:id" element={<BundleDetail addToCart={cartStore.addToCart} />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
