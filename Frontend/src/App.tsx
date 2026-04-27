import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Stats from './components/Stats';
import VersionBanner from './components/VersionBanner';
import NeuralArchitecture from './components/NeuralArchitecture';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';
import Testimonials from './components/Testimonials';
import Newsletter from './components/Newsletter';
import TrustSection from './components/TrustSection';
import FAQ from './components/FAQ';
import SoundEffects from './components/SoundEffects';
import './index.css';

// Lazy load sub-views
const CategoryView = lazy(() => import('./components/CategoryView'));
const CollegeProjectsView = lazy(() => import('./components/CollegeProjectsView'));
const ModelUploadView = lazy(() => import('./components/ModelUploadView'));
const ContactView = lazy(() => import('./components/ContactView'));
const TrackOrderView = lazy(() => import('./components/TrackOrderView'));
const CompareView = lazy(() => import('./components/CompareView'));
const ProductDetailView = lazy(() => import('./components/ProductDetailView'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const CollegeProjectDetail = lazy(() => import('./components/CollegeProjectDetail'));
const ProfileView = lazy(() => import('./components/ProfileView'));
const CheckoutView = lazy(() => import('./components/CheckoutView'));


import { useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

type View = 'home' | 'category' | 'college-projects' | 'college-project-detail' | 'model-upload' | 'contact' | 'track-order' | 'compare' | 'product-detail' | 'admin' | 'profile' | 'checkout';

function App() {
  // Initialize state from localStorage
  const getInitialView = (): View => {
    const saved = localStorage.getItem('currentView') as View;
    const validViews: View[] = ['home', 'category', 'college-projects', 'college-project-detail', 'model-upload', 'contact', 'track-order', 'compare', 'product-detail', 'admin', 'profile', 'checkout'];
    return validViews.includes(saved) ? saved : 'home';
  };

  const getInitialCategory = () => {
    return localStorage.getItem('activeCategory') || null;
  };

  const [currentView, setCurrentView] = useState<View>(getInitialView());


  const [activeCategory, setActiveCategory] = useState<string | null>(getInitialCategory());
  const [selectedProduct, setSelectedProduct] = useState<null | {
    _id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    images: string[];
    category: any;
    stock: number;
  }>(null);
  const [selectedCollegeProject, setSelectedCollegeProject] = useState<any>(null);

  const { user, loading } = useAuth();
  
  const [cartItems, setCartItems] = useState<any[]>([]);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('currentView', currentView);
    if (activeCategory) {
      localStorage.setItem('activeCategory', activeCategory);
    } else {
      localStorage.removeItem('activeCategory');
    }
  }, [currentView, activeCategory]);

  // Guard Admin Access on load
  useEffect(() => {
    if (!loading && currentView === 'admin' && user?.role !== 'admin') {
      setCurrentView('home');
    }
  }, [user, loading, currentView]);

  // Handle Category Changes - only navigate to category if user explicitly sets one
  // (removed auto-select to avoid unintended navigation)

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView, activeCategory]);

  return (
    <ToastProvider>
      <div className="relative min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)] selection:bg-primary/30 selection:text-[var(--text-main)] transition-colors duration-400">
      <SoundEffects />
      <Navbar 
        cartItems={cartItems} 
        setCartItems={setCartItems} 
        setActiveCategory={setActiveCategory} 
        setCurrentView={setCurrentView}
        setSelectedProduct={setSelectedProduct}
      />
      
      <Suspense fallback={
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-[var(--bg-primary)] z-[1000]">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
          <p className="text-xs font-bold text-primary animate-pulse tracking-widest uppercase">Initializing Core...</p>
        </div>
      }>
      <AnimatePresence mode="wait">
        {currentView === 'home' && (
          <motion.main 
            key="home"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <Hero setCurrentView={setCurrentView} setActiveCategory={setActiveCategory} />
            <Features />
            <TrustSection />
            <VersionBanner />
            <NeuralArchitecture />
            <Stats />
            <ProductGrid 
              setActiveCategory={setActiveCategory} 
              onProductClick={(product) => {
                setSelectedProduct(product);
                setCurrentView('product-detail');
              }}
            />
            <Testimonials />
            <FAQ />
            <Newsletter />
          </motion.main>
        )}

        {currentView === 'category' && activeCategory && (
          <motion.div
            key="category"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <CategoryView 
              category={activeCategory} 
              onBack={() => { setActiveCategory(null); setCurrentView('home'); }} 
              onProductClick={(product) => {

                setSelectedProduct(product);
                setCurrentView('product-detail');
              }}
            />
          </motion.div>
        )}

        {currentView === 'college-projects' && (
          <motion.div
            key="college-projects"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
          >
            <CollegeProjectsView 
              onBack={() => { setActiveCategory(null); setCurrentView('home'); }} 
              onProjectClick={(project) => {

                setSelectedCollegeProject(project);
                setCurrentView('college-project-detail');
              }}
            />

          </motion.div>
        )}

        {currentView === 'model-upload' && (
          <motion.div
            key="model-upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
          >
            <ModelUploadView onBack={() => { setActiveCategory(null); setCurrentView('home'); }} />
          </motion.div>
        )}

        {currentView === 'contact' && (
          <motion.div
            key="contact"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
          >
            <ContactView onBack={() => { setActiveCategory(null); setCurrentView('home'); }} />
          </motion.div>
        )}

        {currentView === 'track-order' && (
          <motion.div
            key="track-order"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
          >
            <TrackOrderView onBack={() => { setActiveCategory(null); setCurrentView('home'); }} />
          </motion.div>
        )}

        {currentView === 'college-project-detail' && selectedCollegeProject && (
          <motion.div
            key="college-project-detail"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <CollegeProjectDetail 
              project={selectedCollegeProject}
              onBack={() => setCurrentView('college-projects')}
              setCartItems={setCartItems}
            />
          </motion.div>
        )}

        {currentView === 'compare' && (

          <motion.div
            key="compare"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
          >
            <CompareView onBack={() => { setActiveCategory(null); setCurrentView('home'); }} />
          </motion.div>
        )}

        {currentView === 'product-detail' && selectedProduct && (
          <motion.div
            key="product-detail"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <ProductDetailView 
              product={selectedProduct}
              onBack={() => {
                if (activeCategory) setCurrentView('category');
                else setCurrentView('home');
              }}
              setCartItems={setCartItems}
              onProductClick={(p) => {
                setSelectedProduct(p);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </motion.div>
        )}

        {currentView === 'admin' && user?.role === 'admin' && (
          <motion.div
            key="admin"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
          >
            <AdminPanel />
          </motion.div>
        )}

        {currentView === 'profile' && user && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            <ProfileView setCartItems={setCartItems} />
          </motion.div>
        )}

        {currentView === 'checkout' && (
          <motion.div
            key="checkout"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
          >
            {user ? (
              <CheckoutView 
                cartItems={cartItems}
                user={user}
                onBack={() => setCurrentView('home')}
                onSuccess={() => {
                  setCartItems([]);
                  setCurrentView('profile');
                }}
              />
            ) : (
              <div className="max-w-4xl mx-auto py-32 text-center">
                <h2 className="text-3xl font-bold mb-4">Authentication Required</h2>
                <p className="text-[var(--text-muted)] mb-8">Please login to proceed with your order.</p>
                <button 
                  onClick={() => setCurrentView('home')}
                  className="bg-primary text-white px-8 py-4 rounded-2xl font-bold"
                >
                  Back to Home
                </button>
              </div>
            )}
          </motion.div>
        )}

      </AnimatePresence>
      </Suspense>

      <Footer setCurrentView={setCurrentView} setActiveCategory={setActiveCategory} />
      </div>
    </ToastProvider>
  );
}

export default App;
