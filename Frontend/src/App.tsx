import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence, LazyMotion, domMax } from 'framer-motion';
import { useSEO } from './hooks/useSEO';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Stats from './components/Stats';
import VersionBanner from './components/VersionBanner';
import ProductGrid from './components/ProductGrid';
const Footer = lazy(() => import('./components/Footer'));

// Lazy load non-critical home components
const NeuralArchitecture = lazy(() => import('./components/NeuralArchitecture'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const Newsletter = lazy(() => import('./components/Newsletter'));
const TrustSection = lazy(() => import('./components/TrustSection'));
const FAQ = lazy(() => import('./components/FAQ'));
import SoundEffects from './components/SoundEffects';
import CustomCursor from './components/CustomCursor';
import ScrollToTop from './components/ScrollToTop';
import ReactGA from 'react-ga4';
import { useLocation } from 'react-router-dom';
import './index.css';

// Initialize Google Analytics 4
// Replace 'G-XXXXXXXXXX' with your actual Measurement ID
ReactGA.initialize('G-6NE8X14MF9');

// Custom hook for tracking page views
function usePageTracking() {
  const location = useLocation();
  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search });
  }, [location]);
}

function RouteTracker({ children }: { children: React.ReactNode }) {
  usePageTracking();
  return <>{children}</>;
}

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
import { useCartStore } from './lib/store';

const logo = "https://res.cloudinary.com/dqp0zkagb/image/upload/f_auto,q_auto/v1777282208/bisonix_assets/logo.png";

function Home({ setCurrentView, setActiveCategory, setSelectedProduct }: any) {
  useSEO({
    title: 'Home',
    description: 'Discover BISONIX for high-performance robotics, advanced drones, RC vehicles, custom 3D models, and college tech projects. Next-gen engineering at your fingertips.',
    keywords: 'BISONIX, Binox, robotics, drones, RC vehicles, 3D printing, 3D models, college projects, tech shop, custom robots'
  });

  return (
    <motion.main 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
    >
      <Hero setActiveCategory={setActiveCategory} />
      <Features />
      <Suspense fallback={<div className="h-40 animate-pulse bg-primary/5 rounded-3xl" />}>
        <TrustSection />
        <VersionBanner />
        <NeuralArchitecture />
        <Stats />
      </Suspense>
      <ProductGrid 
        setActiveCategory={setActiveCategory} 
        onProductClick={(product) => {
          setSelectedProduct(product);
          setCurrentView('product-detail');
        }}
      />
      <Suspense fallback={<div className="h-40 animate-pulse bg-primary/5 rounded-3xl" />}>
        <Testimonials />
        <FAQ />
        <Newsletter />
      </Suspense>
    </motion.main>
  );
}

function App() {
  const { user, loading } = useAuth();
  const { items: cartItems } = useCartStore();
  
  // These are kept for legacy compatibility during transition, but will be phased out
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedCollegeProject, setSelectedCollegeProject] = useState<any>(null);
  
  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[var(--bg-primary)] z-[1000]">
        <img src={logo} alt="Loading" className="h-24 w-auto animate-pulse mb-6 drop-shadow-[0_0_20px_rgba(255,106,0,0.4)]" />
        <p className="text-xs font-bold text-primary animate-pulse tracking-widest uppercase">Initializing Core...</p>
      </div>
    );
  }

  return (
    <ToastProvider>
      <Router>
        <ScrollToTop />
        <RouteTracker>
        <LazyMotion features={domMax}>
          <div className="relative min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)] selection:bg-primary/30 selection:text-[var(--text-main)] transition-colors duration-400">
            <SoundEffects />
            <CustomCursor />
            <Navbar 
              cartItems={cartItems} 
              setCartItems={() => {}} 
              setActiveCategory={setActiveCategory} 
              setSelectedProduct={setSelectedProduct}
            />
            
            <Suspense fallback={
              <div className="fixed inset-0 flex flex-col items-center justify-center bg-[var(--bg-primary)] z-[1000]">
                <img src={logo} alt="Loading" className="h-24 w-auto animate-pulse mb-6 drop-shadow-[0_0_20px_rgba(255,106,0,0.4)]" />
                <p className="text-xs font-bold text-primary animate-pulse tracking-widest uppercase">Loading Interface...</p>
              </div>
            }>
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Home setCurrentView={() => {}} setActiveCategory={setActiveCategory} setSelectedProduct={setSelectedProduct} />} />
                  
                  <Route path="/category" element={
                    activeCategory ? (
                      <CategoryView 
                        category={activeCategory} 
                        onBack={() => window.history.back()} 
                        onProductClick={(product) => {
                          setSelectedProduct(product);
                          // This would ideally be /product/:id
                        }}
                      />
                    ) : <Navigate to="/" />
                  } />

                  <Route path="/college-projects" element={
                    <CollegeProjectsView 
                      onBack={() => window.history.back()} 
                      onProjectClick={(project) => setSelectedCollegeProject(project)}
                    />
                  } />

                  <Route path="/model-upload" element={<ModelUploadView onBack={() => window.history.back()} />} />
                  <Route path="/contact" element={<ContactView onBack={() => window.history.back()} />} />
                  <Route path="/track-order" element={<TrackOrderView onBack={() => window.history.back()} />} />
                  <Route path="/compare" element={<CompareView onBack={() => window.history.back()} />} />
                  
                  <Route path="/product-detail" element={
                    selectedProduct ? (
                      <ProductDetailView 
                        product={selectedProduct}
                        onBack={() => window.history.back()}
                        onProductClick={setSelectedProduct}
                      />
                    ) : <Navigate to="/" />
                  } />

                  <Route path="/college-project-detail" element={
                    selectedCollegeProject ? (
                      <CollegeProjectDetail 
                        project={selectedCollegeProject}
                        onBack={() => window.history.back()}
                      />
                    ) : <Navigate to="/college-projects" />
                  } />

                  <Route path="/admin" element={
                    user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />
                  } />

                  <Route path="/profile" element={
                    user ? <ProfileView setCartItems={() => {}} /> : <Navigate to="/" />
                  } />

                  <Route path="/checkout" element={
                    user ? (
                      <CheckoutView 
                        cartItems={cartItems}
                        user={user}
                        onBack={() => window.history.back()}
                        onSuccess={() => {}}
                      />
                    ) : <Navigate to="/" />
                  } />

                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </AnimatePresence>
            </Suspense>

            <Suspense fallback={<div className="h-20 animate-pulse bg-primary/5" />}>
              <Footer setActiveCategory={setActiveCategory} />
            </Suspense>
          </div>
        </LazyMotion>
        </RouteTracker>
      </Router>
    </ToastProvider>
  );
}

export default App;

