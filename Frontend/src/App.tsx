import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';
import Hero from './components/Hero';
import Features from './components/Features';
import Showcase from './components/Showcase';
import TechStack from './components/TechStack';
import Stats from './components/Stats';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';
import CategoryView from './components/CategoryView';
import './index.css';

function App() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Spectra-X Pro Drone', price: 1299, qty: 1, image: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&q=80&w=200' },
    { id: 2, name: 'Titan Rover RC', price: 599, qty: 1, image: 'https://images.unsplash.com/photo-1531693251400-38df35776dc7?auto=format&fit=crop&q=80&w=200' }
  ]);

  // Scroll to top when category changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)] selection:bg-primary/30 selection:text-[var(--text-main)] transition-colors duration-400">
      <CustomCursor />
      <Navbar cartItems={cartItems} setCartItems={setCartItems} setActiveCategory={setActiveCategory} />
      
      <AnimatePresence mode="wait">
        {!activeCategory ? (
          <main key="home">
            <Hero />
            <Features />
            <Showcase />
            <TechStack />
            <Stats />
            <ProductGrid setCartItems={setCartItems} setActiveCategory={setActiveCategory} />
          </main>
        ) : (
          <CategoryView 
            key="category"
            category={activeCategory} 
            onBack={() => setActiveCategory(null)} 
            setCartItems={setCartItems}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

export default App;
