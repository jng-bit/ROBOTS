import { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';
import { Search, ChevronRight, Filter, Grid, List as ListIcon, ArrowLeft, Heart, Plane } from 'lucide-react';


interface CategoryViewProps {
  category: string;
  onBack: () => void;
  onProductClick?: (product: Product) => void;
}




interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: { _id: string, name: string } | string;
  stock: number;
  rating?: number;
  numReviews?: number;
}

export default function CategoryView({ category: initialCategory, onBack, onProductClick }: CategoryViewProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  
  const handleWishlistClick = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    if (!user) {
      showToast('Please sign in to add items to your wishlist', 'info');
      return;
    }

    const isWishlisted = wishlistIds.includes(productId);

    try {
      const token = localStorage.getItem('insforgeToken');
      const method = isWishlisted ? 'DELETE' : 'POST';
      const url = isWishlisted 
        ? `${API_URL}/api/wishlist/${productId}`
        : `${API_URL}/api/wishlist`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: isWishlisted ? null : JSON.stringify({ productId })
      });

      if (response.ok) {
        if (isWishlisted) {
          setWishlistIds(prev => prev.filter(id => id !== productId));
          showToast('Removed from wishlist', 'success');
        } else {
          setWishlistIds(prev => [...prev, productId]);
          showToast('Added to wishlist', 'success');
        }
      }
    } catch (error) {
      console.error('Wishlist error:', error);
    }
  };

  const [currentCategory, setCurrentCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        try {
          const token = localStorage.getItem('insforgeToken');
          const res = await fetch(`${API_URL}/api/wishlist`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          if (res.ok) setWishlistIds(data.products?.map((p: Product) => p._id) || []);
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchWishlist();
  }, [user]);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/products`);
        const data = await response.json();
        if (response.ok) {
          setAllProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const products = allProducts.filter(p => {
    const catName = typeof p.category === 'object' ? p.category.name : p.category;
    const categoryMatch = currentCategory === 'All' || catName === currentCategory;
    const searchMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });



  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-[var(--bg-primary)] pt-32 pb-20 px-4 sm:px-8 transition-colors duration-400"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header / Breadcrumbs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm mb-2">
              <button onClick={onBack} className="hover:text-primary transition-colors flex items-center gap-1">
                <ArrowLeft size={14} /> Home
              </button>
              <ChevronRight size={12} />
              <span className="text-[var(--text-main)] font-bold">{currentCategory}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-display text-[var(--text-main)]">
              Explore {currentCategory}
            </h1>
          </div>

          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search in ${currentCategory}...`}
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] focus:border-primary px-12 py-4 rounded-2xl text-[var(--text-main)] placeholder-[var(--text-muted)] outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 space-y-8">
            <div className="space-y-4">
              <h3 className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                <Filter size={14} /> Categories
              </h3>
              <div className="space-y-1">
                {['All', 'Robo Toys', 'Drones', 'RC Vehicles', '3D Models'].map((cat) => (
                  <button 
                    key={cat}
                    onClick={() => setCurrentCategory(cat)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all flex justify-between items-center group ${
                      currentCategory === cat ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    <span className="font-semibold text-sm">{cat}</span>
                    <ChevronRight size={14} className={currentCategory === cat ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 transition-opacity'} />
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/10 to-blue-500/10 border border-primary/20">
              <h4 className="text-[var(--text-main)] font-bold mb-2">Need Custom Support?</h4>
              <p className="text-[var(--text-muted)] text-xs leading-relaxed mb-4">Our engineers can help you build custom drones and robotics systems.</p>
              <button className="text-primary text-xs font-bold hover:underline">Contact Expert</button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <p className="text-[var(--text-muted)] text-sm">Showing {products.length} results</p>
              <div className="flex items-center gap-2 p-1 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-subtle)]">
                <button className="p-2 bg-[var(--bg-primary)] rounded-md text-primary shadow-sm"><Grid size={16} /></button>
                <button className="p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"><ListIcon size={16} /></button>
              </div>
            </div>

            {/* Product Grid / Empty State */}
            {loading ? (
              <div className="flex justify-center py-24"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {products.map((product) => (
                  <motion.div 
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-[var(--bg-primary)] rounded-[2.5rem] border border-[var(--border-subtle)] overflow-hidden shadow-[var(--card-shadow)] hover:shadow-2xl transition-all duration-500 group flex flex-col card-premium"
                  >
                    <div className="relative aspect-[1920/1080] bg-[var(--bg-secondary)]/30 overflow-hidden flex items-center justify-center">
                      <img 
                        src={product.images[0] || ''} 
                        alt={product.name} 
                        onClick={() => onProductClick?.(product)}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 cursor-pointer"
                      />
                      <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full border border-primary/10">
                        <p className="text-[8px] font-black text-primary uppercase tracking-tighter">Pro Grade</p>
                      </div>
                    </div>

                    <div className="p-6 sm:p-8 flex-1 flex flex-col space-y-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-bold uppercase tracking-widest border border-blue-100">
                            {typeof product.category === 'object' ? product.category.name : product.category}
                          </span>
                          <span className="flex items-center gap-1 text-green-500 text-[9px] font-bold uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            In Stock
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-[var(--text-main)] group-hover:text-primary transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex items-baseline gap-2 mt-4">
                          <span className="text-2xl font-black text-[var(--text-main)] font-display tracking-tight">₹{product.price}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-[var(--text-muted)] line-through opacity-50 font-display">
                              ₹{product.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button 
                          onClick={(e) => handleWishlistClick(e, product._id)}
                          className="flex-1 py-3.5 rounded-2xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-main)] font-black text-[10px] transition-all active:scale-95 uppercase tracking-widest btn-premium flex items-center justify-center gap-2"
                        >
                          <Heart size={14} className={wishlistIds.includes(product._id) ? "text-red-500 fill-red-500" : "text-red-500"} />
                          Wishlist
                        </button>
                        <button 
                          onClick={() => onProductClick?.(product)}
                          className="flex-[1.5] py-3.5 rounded-2xl bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-orange-500 text-white font-black text-[10px] shadow-lg shadow-primary/20 transition-all active:scale-95 uppercase tracking-widest btn-premium"
                        >
                          View more
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                {currentCategory === 'Drones' ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md"
                  >
                    <div className="w-64 h-64 mb-8 mx-auto relative group">
                      <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-50 group-hover:scale-75 transition-transform duration-700" />
                      <div className="relative w-full h-full flex items-center justify-center opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700">
                        <Plane size={120} className="text-primary rotate-45" />
                      </div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <span className="bg-primary text-white font-black px-4 py-1 rounded-full text-[10px] uppercase tracking-widest shadow-xl shadow-primary/40 whitespace-nowrap">
                          Coming Soon
                        </span>
                      </div>
                    </div>
                    <h2 className="text-3xl font-black text-[var(--text-main)] mb-4 font-display">Aerial Innovation</h2>
                    <p className="text-[var(--text-muted)] text-sm leading-relaxed">Our next generation of high-performance drones is currently in production. Stay tuned for the launch event.</p>
                  </motion.div>
                ) : (
                  <p className="text-[var(--text-muted)]">No products found in this category.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
