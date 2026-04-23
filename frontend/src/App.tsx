
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Cart } from './pages/Cart';
import { Admin } from './pages/Admin';
import { BundleDetail } from './pages/BundleDetail';
import { useCart } from './store/cartStore';

function App() {
  const cartStore = useCart();

  return (
    <>
      <Navbar totalItems={cartStore.totalItems} />
      <main>
        <Routes>
          <Route path="/" element={<Home addToCart={cartStore.addToCart} />} />
          <Route path="/cart" element={<Cart {...cartStore} />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/bundle/:id" element={<BundleDetail addToCart={cartStore.addToCart} />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
