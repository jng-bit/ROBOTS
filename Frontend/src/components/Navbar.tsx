import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, Sun, Moon, ChevronDown, ChevronRight, X } from 'lucide-react';
import logo from '../assets/logo.png';
import AuthModal from './AuthModal';
import CartDrawer from './CartDrawer';
import SearchOverlay from './SearchOverlay';

export default function Navbar({ cartItems, setCartItems, setActiveCategory }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false); // Default to Light Mode
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Robo Toys', href: '#' },
    { name: 'Drones', href: '#' },
    { name: 'RC Cars', href: '#' },
    { name: '3D Models', href: '#' },
    { name: 'Services', href: '#', hasDropdown: true },
  ];

  const megaMenuContent = {
    'Robo Toys': [
      { name: 'Alpha-Bot', image: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&q=80&w=200' },
      { name: 'Vortex Motor', image: 'https://images.unsplash.com/photo-1558444479-2706fa58b8c6?auto=format&fit=crop&q=80&w=200' },
      { name: 'B12-X Core', image: 'https://images.unsplash.com/photo-1581092334651-ddf26d9a1930?auto=format&fit=crop&q=80&w=200' },
    ],
    'Drones': [
      { name: 'Spectra-X', image: 'https://images.unsplash.com/photo-1473963484295-11f8cdb29479?auto=format&fit=crop&q=80&w=200' },
      { name: 'Swift-Blade', image: 'https://images.unsplash.com/photo-1524143924104-58682054b8d7?auto=format&fit=crop&q=80&w=200' },
      { name: 'Nano Racer', image: 'https://images.unsplash.com/photo-1506941433945-99a2aa4bd50a?auto=format&fit=crop&q=80&w=200' },
    ],
    'RC Cars': [
      { name: 'Titan Rover', image: 'https://images.unsplash.com/photo-1531693251400-38df35776dc7?auto=format&fit=crop&q=80&w=200' },
      { name: 'Drift King', image: 'https://images.unsplash.com/photo-1594731826601-3827494a8c5f?auto=format&fit=crop&q=80&w=200' },
    ],
    '3D Models': [
      { name: 'Chassis V2', image: 'https://images.unsplash.com/photo-1581092334651-ddf26d9a1930?auto=format&fit=crop&q=80&w=200' },
      { name: 'Propeller Set', image: 'https://images.unsplash.com/photo-1558444479-2706fa58b8c6?auto=format&fit=crop&q=80&w=200' },
    ],
    'Services': []
  };

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'py-4' : 'py-6'
        } px-4 sm:px-8`}
      >
        <div className={`absolute inset-0 bg-gradient-to-b ${isDark ? 'from-black/60' : 'from-[var(--bg-primary)]/80'} to-transparent pointer-events-none transition-all duration-500`} />

        <div className={`relative z-10 max-w-7xl mx-auto w-full flex justify-between items-center transition-all duration-500 ${
          isScrolled 
            ? 'bg-[var(--bg-secondary)]/80 backdrop-blur-xl border border-[var(--border-subtle)] px-6 py-3 rounded-2xl shadow-[var(--card-shadow)]' 
            : 'bg-transparent border border-transparent px-2'
        }`}>
          <div 
            onClick={() => {
              setActiveCategory(null);
              setActiveItem(null);
              setIsMobileMenuOpen(false);
            }}
            className="relative flex items-center cursor-pointer group"
          >
            <div className="absolute -inset-2 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <img src={logo} alt="BISONIX Logo" className="h-12 sm:h-14 md:h-16 lg:h-20 w-auto relative z-10 transition-all duration-300" />
          </div>

          <ul className="hidden lg:flex items-center gap-1 text-sm font-medium text-[var(--text-muted)] relative z-10">
            {navLinks.map((item) => (
              <li 
                key={item.name} 
                onMouseEnter={() => setHoveredLink(item.name)}
                onMouseLeave={() => setHoveredLink(null)}
                onClick={() => {
                  if (item.name !== 'Services') {
                    setActiveCategory(item.name);
                    setActiveItem(item.name);
                  }
                }}
                className="relative px-4 py-6 cursor-pointer group flex items-center gap-1"
              >
                <span className={`relative z-10 group-hover:text-primary transition-colors duration-300 ${activeItem === item.name ? 'text-primary font-bold' : ''}`}>
                  {item.name}
                </span>
                {item.hasDropdown && <ChevronDown size={14} className="relative z-10 group-hover:text-primary transition-colors" />}
                
                <AnimatePresence>
                  {hoveredLink === item.name && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-0 cursor-default"
                    >
                      <div className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-3xl shadow-2xl overflow-hidden flex min-w-[700px] backdrop-blur-xl mt-2">
                        <div className="w-56 bg-[var(--bg-secondary)]/50 p-8 border-r border-[var(--border-subtle)] space-y-6">
                          <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4">Explore Series</p>
                          {['New Arrivals', 'Best Sellers', 'Custom Pro', 'Accessories'].map(link => (
                            <div key={link} className="text-xs font-bold text-[var(--text-main)] hover:text-primary transition-colors cursor-pointer flex justify-between items-center group/link">
                              {link}
                              <ChevronRight size={12} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                            </div>
                          ))}
                          <div className="pt-6 mt-6 border-t border-[var(--border-subtle)]">
                            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                              <p className="text-[10px] font-bold text-[var(--text-main)]">Flash Sale!</p>
                              <p className="text-[9px] text-[var(--text-muted)]">Up to 40% off on Robo Kits</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex-1 p-8 bg-[var(--bg-primary)]/80">
                          <div className="grid grid-cols-3 gap-8">
                            {megaMenuContent[item.name]?.map((prod, idx) => (
                              <div key={idx} className="group/item cursor-pointer">
                                <div className="aspect-square rounded-2xl bg-[var(--bg-secondary)] overflow-hidden mb-3 border border-[var(--border-subtle)] shadow-sm">
                                  <img src={prod.image} className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110" />
                                </div>
                                <p className="text-[10px] font-bold text-[var(--text-main)] text-center group-hover/item:text-primary transition-colors">{prod.name}</p>
                              </div>
                            ))}
                            {item.name === 'Services' && (
                              <div className="col-span-3 space-y-6">
                                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors">
                                  <p className="text-sm font-bold text-[var(--text-main)] mb-1">College Projects</p>
                                  <p className="text-[10px] text-[var(--text-muted)]">Custom robotics support and components for engineering students.</p>
                                </div>
                                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors">
                                  <p className="text-sm font-bold text-[var(--text-main)] mb-1">Rapid Prototyping</p>
                                  <p className="text-[10px] text-[var(--text-muted)]">Fast manufacturing and 3D printing for custom robotic parts.</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>

          <div className="relative z-10 flex items-center gap-2 sm:gap-4 text-[var(--text-main)]">
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-2 hover:bg-[var(--text-main)]/10 rounded-full transition-all duration-300 relative overflow-hidden"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isDark ? 'dark' : 'light'}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDark ? <Moon size={20} className="text-blue-400" /> : <Sun size={20} className="text-orange-500" />}
                </motion.div>
              </AnimatePresence>
            </button>

            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-[var(--text-main)]/10 rounded-full transition-colors group"
            >
              <ShoppingCart size={20} className="text-[var(--text-muted)] group-hover:text-primary transition-colors" />
              {cartItems.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full border-2 border-[var(--bg-primary)] flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>

            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="ml-1 sm:ml-2 relative overflow-hidden group bg-[var(--text-main)]/5 hover:bg-[var(--text-main)]/10 border border-[var(--border-subtle)] px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/80 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 group-hover:text-white text-[var(--text-main)] transition-colors duration-300">Sign In</span>
            </button>
            
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-[var(--text-main)]/10 rounded-full transition-colors relative z-[60]"
            >
              {isMobileMenuOpen ? <X size={24} className="text-primary" /> : <Menu size={24} className="text-[var(--text-muted)]" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden"
              />
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 h-full w-full max-w-xs bg-[var(--bg-primary)] border-l border-[var(--border-subtle)] z-[56] lg:hidden p-8 pt-24 space-y-8 shadow-2xl"
              >
                <div className="space-y-2">
                  <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Navigation</p>
                  {navLinks.map((item) => (
                    <button 
                      key={item.name} 
                      onClick={() => {
                        if (item.name !== 'Services') {
                          setActiveCategory(item.name);
                          setActiveItem(item.name);
                          setIsMobileMenuOpen(false);
                        }
                      }}
                      className="w-full text-left py-4 border-b border-[var(--border-subtle)] flex justify-between items-center group"
                    >
                      <span className={`text-xl font-bold font-display transition-colors ${activeItem === item.name ? 'text-primary' : 'text-[var(--text-main)]'}`}>
                        {item.name}
                      </span>
                      <ChevronRight size={18} className="text-[var(--text-muted)] group-hover:text-primary transition-transform group-hover:translate-x-1" />
                    </button>
                  ))}
                </div>
                <div className="pt-8">
                  <button 
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20"
                  >
                    Account Access
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cartItems} setCartItems={setCartItems} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
