import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronRight, Filter, Grid, List as ListIcon, ShoppingCart, ArrowLeft } from 'lucide-react';

interface CategoryViewProps {
  category: string;
  onBack: () => void;
  setCartItems: (items: any) => void;
}

export default function CategoryView({ category: initialCategory, onBack, setCartItems }: CategoryViewProps) {
  const [currentCategory, setCurrentCategory] = useState(initialCategory);

  // Mock products based on category
  const products = [
    { id: 101, name: 'Spectra-X Ultra 4K', price: 1599, category: 'Drones', image: 'https://images.unsplash.com/photo-1473963484295-11f8cdb29479?auto=format&fit=crop&q=80&w=1920&h=1080' },
    { id: 102, name: 'Swift-Blade Racer', price: 899, category: 'Drones', image: 'https://images.unsplash.com/photo-1524143924104-58682054b8d7?auto=format&fit=crop&q=80&w=1920&h=1080' },
    { id: 103, name: 'Vortex Motor Kit', price: 299, category: 'Robo Toys', image: 'https://images.unsplash.com/photo-1558444479-2706fa58b8c6?auto=format&fit=crop&q=80&w=1920&h=1080' },
    { id: 104, name: 'Titan 4WD Rover', price: 1299, category: 'RC Cars', image: 'https://images.unsplash.com/photo-1531693251400-38df35776dc7?auto=format&fit=crop&q=80&w=1920&h=1080' },
    { id: 105, name: 'B12-X Neural Core', price: 499, category: '3D Models', image: 'https://images.unsplash.com/photo-1581092334651-ddf26d9a1930?auto=format&fit=crop&q=80&w=1920&h=1080' },
    { id: 106, name: 'Alpha-Bot Chassis', price: 199, category: 'Robo Toys', image: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&q=80&w=1920&h=1080' },
  ].filter(p => currentCategory === 'All' || p.category === currentCategory);

  const addToCart = (product: any) => {
    setCartItems((prev: any) => {
      const existing = prev.find((item: any) => item.id === product.id);
      if (existing) {
        return prev.map((item: any) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

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
                {['All', 'Robo Toys', 'Drones', 'RC Cars', '3D Models'].map((cat) => (
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

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {products.map((product) => (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-[var(--bg-primary)] rounded-[2.5rem] border border-[var(--border-subtle)] overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-2xl transition-all duration-500 group flex flex-col"
                >
                  {/* Image Section - 1920x1080 Aspect Ratio */}
                  <div className="relative aspect-[1920/1080] bg-[var(--bg-secondary)]/30 overflow-hidden flex items-center justify-center">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Floating Level Badge */}
                    <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full border border-primary/10">
                      <p className="text-[8px] font-black text-primary uppercase tracking-tighter">Pro Grade</p>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 sm:p-8 flex-1 flex flex-col space-y-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-bold uppercase tracking-widest border border-blue-100">
                          {product.category}
                        </span>
                        <span className="w-1 h-1 bg-[var(--text-muted)] rounded-full opacity-30" />
                        <span className="text-[var(--text-muted)] text-[9px] font-bold uppercase tracking-widest">In Stock</span>
                      </div>
                      <h3 className="text-xl font-bold text-[var(--text-main)] font-display leading-tight group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-end gap-3">
                        <span className="text-2xl font-black text-[var(--text-main)] font-display tracking-tight">${product.price}</span>
                        <span className="text-[var(--text-muted)] line-through text-xs font-medium mb-1">${(product.price * 1.4).toFixed(0)}</span>
                        <span className="text-green-500 text-[10px] font-bold mb-1 ml-auto">Free Shipping</span>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button className="flex-1 py-3.5 rounded-2xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-main)] font-bold text-xs transition-all active:scale-95">
                          Details
                        </button>
                        <button 
                          onClick={() => addToCart(product)}
                          className="flex-[1.5] py-3.5 rounded-2xl bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-primary/20 transition-all active:scale-95"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
