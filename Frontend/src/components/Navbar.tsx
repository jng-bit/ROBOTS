import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Sun, Moon, ChevronDown, ChevronRight, X, LogOut, Settings, User as UserIcon, Bell, Ticket, MoreVertical } from 'lucide-react';
const logo = "https://res.cloudinary.com/dqp0zkagb/image/upload/f_auto,q_auto/v1777282208/bisonix_assets/logo.png";
import AuthModal from './AuthModal';
import CartDrawer from './CartDrawer';
import SearchOverlay from './SearchOverlay';
const dronesImg = "https://res.cloudinary.com/dqp0zkagb/image/upload/f_auto,q_auto/v1777282210/bisonix_assets/Drones.jpg";
const carsImg = "https://res.cloudinary.com/dqp0zkagb/image/upload/f_auto,q_auto/v1777282211/bisonix_assets/Cars.jpg";
const robotsImg = "https://res.cloudinary.com/dqp0zkagb/image/upload/f_auto,q_auto/v1777282212/bisonix_assets/Robots.jpg";
const collegeProjectsImg = "https://res.cloudinary.com/dqp0zkagb/image/upload/f_auto,q_auto/v1777282213/bisonix_assets/College-Projects.jpg";
const customBuildsImg = "https://res.cloudinary.com/dqp0zkagb/image/upload/f_auto,q_auto/v1777282214/bisonix_assets/Custom%20Builds.jpg";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

interface NavbarProps {
  cartItems: any[];
  setCartItems: (items: any[]) => void;
  setActiveCategory: (cat: string | null) => void;
  setSelectedProduct: (product: any) => void;
}

export default function Navbar({ cartItems, setCartItems, setActiveCategory, setSelectedProduct }: NavbarProps) {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const { user, logout } = useAuth();

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem('insforgeToken');
      const res = await fetch(`${API_URL}/api/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setNotifications(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const markNotificationAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem('insforgeToken');
      await fetch(`${API_URL}/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (err) { console.error(err); }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

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

  const [dynamic3DProducts, setDynamic3DProducts] = useState<any[]>([]);

  const fetch3D = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products`);
      const data = await res.json();
      if (res.ok) {
        const filtered = data.filter((p: any) => {
          const catName = typeof p.category === 'object' ? p.category.name : p.category;
          return catName?.toLowerCase().includes('3d');
        });
        setDynamic3DProducts(filtered.map((p: any) => ({
          name: p.name,
          image: p.images?.[0] || '',
          view: 'product-detail',
          product: p,
          category: typeof p.category === 'object' ? p.category.name : p.category
        })));
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetch3D();
  }, []);

  const sidebarLinks: Record<string, any[]> = {
    'Products': [
      { name: 'New Arrivals', view: 'category', cat: 'Robo Toys' },
      { name: 'Best Sellers', view: 'category', cat: 'Drones' },
      { name: 'Support', view: 'contact' }
    ],
    '3D Solutions': [
      { name: '3D Models', view: 'category', cat: '3D Models' },
      { name: 'Comparison Tool', view: 'compare' },
      { name: 'Custom Prints', view: 'model-upload' }
    ],
    'Services': [
      { name: 'Project Support', view: 'college-projects' },
      { name: 'Custom Hardware', view: 'contact' },
      { name: 'Technical Docs', view: 'home' },
      { name: 'Consultation', view: 'contact' }
    ],
    'Default': [
      { name: 'Comparison Tool', view: 'compare' },
      { name: 'Support', view: 'contact' }
    ]
  };

  const megaMenuContent: Record<string, any[]> = {
    'Products': [
      { name: 'Robots', image: robotsImg, view: 'category', category: 'Robo Toys' },
      { name: 'Drones', image: dronesImg, view: 'category', category: 'Drones' },
      { name: 'RC Vehicles', image: carsImg, view: 'category', category: 'RC Vehicles' },
    ],
    '3D Solutions': dynamic3DProducts,
    'Services': [
      { name: 'College Projects', image: collegeProjectsImg, view: 'college-projects', category: null },
      { name: 'Custom Builds', image: customBuildsImg, view: 'model-upload', category: null },
    ]
  };

  const navLinks: { name: string; href?: string; hasDropdown?: boolean }[] = [
    { name: 'Products', hasDropdown: true },
    ...(dynamic3DProducts.length > 0 ? [{ name: '3D Solutions', hasDropdown: true }] : []),
    { name: 'Services', hasDropdown: true },
    { name: 'Comparison', href: '#' },
    { name: 'Contact', href: '#' },
  ];

  if (user?.role === 'admin') {
    navLinks.push({ name: 'Admin Panel', href: '#', hasDropdown: false });
  }

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
            className="flex items-center cursor-pointer group"
            onClick={() => {
              navigate('/');
              setActiveCategory(null);
              setSelectedProduct(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <img src={logo} alt="BISONIX Logo" className="h-12 sm:h-14 md:h-16 lg:h-20 w-auto relative z-10 transition-all duration-300" />
          </div>

          <ul className="hidden lg:flex items-center gap-1 text-sm font-medium text-[var(--text-muted)] relative z-10">
            {navLinks.map((item) => (
              <li 
                key={item.name} 
                onMouseEnter={() => {
                  setHoveredLink(item.name);
                  if (item.name === '3D Solutions') fetch3D();
                }}
                onMouseLeave={() => setHoveredLink(null)}
                onClick={() => {
                  if (item.name === 'Contact') {
                    navigate('/contact');
                    setActiveItem('Contact');
                  } else if (item.name === 'Comparison') {
                    navigate('/compare');
                    setActiveItem('Comparison');
                  } else if (item.name === 'Admin Panel') {
                    navigate('/admin');
                    setActiveItem('Admin Panel');
                  }
                }}
                className="relative px-4 py-6 cursor-pointer group flex items-center gap-1"
              >
                <span className={`relative z-10 group-hover:text-primary transition-colors duration-300 ${activeItem === item.name ? 'text-primary font-bold' : ''}`}>
                  {item.name}
                </span>
                {item.hasDropdown && <ChevronDown size={14} className="relative z-10 group-hover:text-primary transition-colors" />}
                
                <AnimatePresence>
                  {hoveredLink === item.name && item.hasDropdown && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-0 cursor-default"
                    >
                      <div className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-3xl shadow-2xl overflow-hidden flex min-w-[750px] backdrop-blur-xl mt-2">
                        <div className="w-56 bg-[var(--bg-secondary)]/50 p-8 border-r border-[var(--border-subtle)] space-y-6">
                          <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4">Quick Access</p>
                          {(sidebarLinks[item.name] || sidebarLinks['Default']).map((link: any) => (
                            <div 
                              key={link.name} 
                              onClick={() => { 
                                navigate(`/${link.view === 'home' ? '' : link.view}`); 
                                if (link.cat) setActiveCategory(link.cat);
                                setHoveredLink(null); 
                              }}
                              className="text-xs font-bold text-[var(--text-main)] hover:text-primary transition-colors cursor-pointer flex justify-between items-center group/link"
                            >
                              {link.name}
                              <ChevronRight size={12} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex-1 p-8 bg-[var(--bg-primary)]/80">
                          <div className="grid grid-cols-3 gap-8">
                            {megaMenuContent[item.name]?.map((subItem: any, idx: number) => (
                              <div 
                                key={idx} 
                                onClick={() => {
                                  navigate(`/${subItem.view}`);
                                  if (subItem.category) setActiveCategory(subItem.category);
                                  if (subItem.product) setSelectedProduct(subItem.product);
                                  setHoveredLink(null);
                                }}
                                className="group/card cursor-pointer"
                              >
                                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3 bg-[var(--bg-secondary)]">
                                  <img 
                                    src={subItem.image} 
                                    alt={subItem.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                                  />
                                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center">
                                    <ChevronRight className="text-white" size={24} />
                                  </div>
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-main)] group-hover/card:text-primary transition-colors">
                                  {subItem.name}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 sm:gap-4 relative z-10">
            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-2 sm:gap-4">
              <button 
                onClick={() => setIsDark(!isDark)}
                className="p-2 sm:p-3 rounded-xl bg-[var(--bg-secondary)]/50 border border-[var(--border-subtle)] text-[var(--text-main)] hover:text-primary transition-all active:scale-95"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button 
                className="p-2 sm:p-3 rounded-xl bg-[var(--bg-secondary)]/50 border border-[var(--border-subtle)] text-[var(--text-main)] hover:text-primary transition-all active:scale-95 relative"
                onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setIsProfileOpen(false); }}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(255,106,0,0.8)]" />
                )}
              </button>

              <button 
                onClick={() => { setIsCartOpen(true); setIsProfileOpen(false); }}
                className="p-2 sm:p-3 rounded-xl bg-[var(--bg-secondary)]/50 border border-[var(--border-subtle)] text-[var(--text-main)] hover:text-primary transition-all active:scale-95 relative"
              >
                <ShoppingCart size={18} />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FF6A00] text-black dark:text-white text-[10px] font-black w-5 h-5 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20">
                    {cartItems.length}
                  </span>
                )}
              </button>

              {user ? (
                <div className="relative">
                  <button 
                    onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotificationsOpen(false); }}
                    className={`flex items-center gap-2 p-1 pr-3 rounded-xl bg-[var(--bg-secondary)]/50 border transition-all active:scale-95 ${isProfileOpen ? 'border-primary' : 'border-[var(--border-subtle)]'}`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-inner overflow-hidden">
                      {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : (user.name?.[0] || user.email?.[0]?.toUpperCase() || 'U')}
                    </div>
                    <span className="hidden md:block text-xs font-bold text-[var(--text-main)]">{user.name?.split(' ')[0] || user.email?.split('@')[0]}</span>
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full right-0 mt-2 w-64 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
                      >
                        <div className="p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50">
                          <p className="text-xs font-black text-primary uppercase tracking-widest mb-1">Authenticated</p>
                          <p className="text-sm font-bold text-[var(--text-main)] truncate">{user.email}</p>
                        </div>
                        <div className="p-2">
                          <button 
                            onClick={() => { navigate('/profile'); setIsProfileOpen(false); }}
                            className="w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold text-[var(--text-main)] hover:bg-[var(--bg-secondary)] transition-colors"
                          >
                            <UserIcon size={16} className="text-primary" /> Profile Settings
                          </button>
                          <button 
                            className="w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold text-[var(--text-main)] hover:bg-[var(--bg-secondary)] transition-colors"
                            onClick={() => { navigate('/track-order'); setIsProfileOpen(false); }}
                          >
                            <Ticket size={16} className="text-primary" /> My Orders
                          </button>
                          <div className="h-px bg-[var(--border-subtle)] my-2" />
                          <button 
                            onClick={() => { logout(); setIsProfileOpen(false); }}
                            className="w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/10 transition-colors"
                          >
                            <LogOut size={16} /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                >
                  Access
                </button>
              )}
            </div>

            {/* Mobile Actions (Three Dots) */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 sm:p-3 rounded-xl bg-[var(--bg-secondary)]/50 border border-[var(--border-subtle)] text-[var(--text-main)] hover:text-primary transition-all active:scale-95"
            >
              <MoreVertical size={18} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isNotificationsOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full right-8 mt-2 w-80 max-h-[400px] overflow-y-auto bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl z-[60]"
            >
              <div className="p-4 border-b border-[var(--border-subtle)] flex justify-between items-center">
                <h3 className="font-bold text-sm">Notifications</h3>
                <button className="text-[10px] text-primary font-bold uppercase">Clear All</button>
              </div>
              <div className="divide-y divide-[var(--border-subtle)]">
                {notifications.length > 0 ? notifications.map((notif: any) => (
                  <div 
                    key={notif._id} 
                    className={`p-4 hover:bg-[var(--bg-secondary)] cursor-pointer transition-colors ${!notif.isRead ? 'bg-primary/5' : ''}`}
                    onClick={() => markNotificationAsRead(notif._id)}
                  >
                    <p className="text-xs font-bold mb-1">{notif.title}</p>
                    <p className="text-[10px] text-[var(--text-muted)] line-clamp-2">{notif.message}</p>
                    <p className="text-[8px] text-[var(--text-muted)] mt-2 uppercase">{new Date(notif.createdAt).toLocaleDateString()}</p>
                  </div>
                )) : (
                  <div className="p-8 text-center text-[var(--text-muted)] text-xs">No new notifications</div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
              />
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-[var(--bg-primary)] z-[100] shadow-2xl p-8 flex flex-col overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-12">
                  <img src={logo} alt="BISONIX" className="h-10 w-auto" />
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                    <X size={20} />
                  </button>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-8">
                    <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-[0.2em]">Quick Actions</p>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setIsDark(!isDark)}
                        className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-main)]"
                      >
                        {isDark ? <Sun size={18} /> : <Moon size={18} />}
                      </button>
                      <button 
                        onClick={() => { setIsCartOpen(true); setIsMobileMenuOpen(false); }}
                        className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-main)] relative"
                      >
                        <ShoppingCart size={18} />
                        {cartItems.length > 0 && (
                          <span className="absolute -top-1 -right-1 bg-[#FF6A00] text-black dark:text-white text-[10px] font-black w-5 h-5 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20">
                            {cartItems.length}
                          </span>
                        )}
                      </button>
                      <button 
                        onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setIsMobileMenuOpen(false); }}
                        className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-main)] relative"
                      >
                        <Bell size={18} />
                        {unreadCount > 0 && (
                          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Navigation</p>
                  {navLinks.map((item) => (
                    <div key={item.name}>
                      <button 
                        onClick={() => {
                          if (item.name === 'Contact') {
                            navigate('/contact');
                            setActiveItem('Contact');
                            setIsMobileMenuOpen(false);
                          } else if (item.name === 'Comparison') {
                            navigate('/compare');
                            setActiveItem('Comparison');
                            setIsMobileMenuOpen(false);
                          } else if (item.name === 'Admin Panel') {
                            navigate('/admin');
                            setActiveItem('Admin Panel');
                            setIsMobileMenuOpen(false);
                          } else if (item.hasDropdown) {
                            setActiveItem(activeItem === item.name ? null : item.name);
                          } else {
                            setIsMobileMenuOpen(false);
                          }
                        }}
                        className="w-full text-left py-4 border-b border-[var(--border-subtle)] flex justify-between items-center group"
                      >
                        <span className={`text-xl font-bold font-display transition-colors ${activeItem === item.name ? 'text-primary' : 'text-[var(--text-main)]'}`}>
                          {item.name}
                        </span>
                        {item.hasDropdown && (
                          <ChevronRight size={18} className={`text-[var(--text-muted)] transition-transform ${activeItem === item.name ? 'rotate-90' : ''}`} />
                        )}
                      </button>
                      
                      {item.hasDropdown && activeItem === item.name && (
                        <div className="pl-4 py-4 space-y-4">
                          {megaMenuContent[item.name]?.map((subItem: any, idx: number) => (
                            <button 
                              key={idx}
                              onClick={() => { 
                                navigate(`/${subItem.view}`); 
                                if (subItem.category) setActiveCategory(subItem.category);
                                if (subItem.product) setSelectedProduct(subItem.product);
                                setIsMobileMenuOpen(false); 
                              }}
                              className="w-full text-left py-2 text-sm font-bold text-[var(--text-muted)] hover:text-primary transition-colors flex justify-between items-center"
                            >
                              {subItem.name}
                              <ChevronRight size={14} className="opacity-30" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-8 space-y-4">
                  {user ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-4 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-subtle)]">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20 overflow-hidden">
                          {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : (user.name?.[0] || user.email?.[0]?.toUpperCase() || 'U')}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[var(--text-main)]">{user.name || user.email?.split('@')[0]}</p>
                          <p className="text-[10px] text-[var(--text-muted)] uppercase font-black tracking-widest">{user.role || 'user'}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => { navigate('/profile'); setIsMobileMenuOpen(false); }}
                        className="w-full flex items-center gap-3 p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-sm font-bold text-[var(--text-main)]"
                      >
                        <Settings size={18} className="text-primary" /> Profile Settings
                      </button>
                      <button 
                        onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                        className="w-full py-4 rounded-2xl bg-red-500/10 text-red-500 font-bold text-sm"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => {
                        setIsAuthModalOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20"
                    >
                      Account Access
                    </button>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cartItems} setCartItems={setCartItems} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <motion.a
        href="https://wa.me/7995232673"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-8 right-8 z-[100] w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.4)] transition-all cursor-pointer group"
      >
        <div className="absolute -top-12 right-0 bg-white text-black text-[10px] font-bold px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
          Chat with Experts
        </div>
        <svg className="w-8 h-8 text-white fill-current" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.412.001 12.04c0 2.123.554 4.197 1.606 6.034L0 24l6.135-1.61a11.803 11.803 0 005.912 1.586h.005c6.637 0 12.048-5.413 12.052-12.041a11.83 11.83 0 00-3.526-8.511z" />
        </svg>
      </motion.a>
    </>
  );
}
