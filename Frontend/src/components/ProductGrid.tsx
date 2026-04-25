import { motion } from 'framer-motion';
import { ShoppingCart, ArrowRight, Star } from 'lucide-react';
import prodDrone from '../assets/prod_drone.png';
import prodCar from '../assets/prod_car.png';
import prodMotor from '../assets/prod_motor.png';
import prodKit from '../assets/prod_kit.png';

const ProductCard = ({ image, name, category, price, delay, setCartItems }) => {
  const addToCart = () => {
    setCartItems((prev: any) => {
      const existing = prev.find((item: any) => item.name === name);
      if (existing) {
        return prev.map((item: any) => item.name === name ? { ...item, qty: item.qty + 1 } : item);
      }
      const numericPrice = parseFloat(price.replace(/,/g, ''));
      return [...prev, { name, price: numericPrice, qty: 1, image }];
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="bg-[var(--bg-primary)] rounded-[2.5rem] border border-[var(--border-subtle)] overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-2xl transition-all duration-500 group flex flex-col"
    >
      {/* Image Section - 1920x1080 Aspect Ratio */}
      <div className="relative aspect-[1920/1080] bg-[var(--bg-secondary)]/30 overflow-hidden flex items-center justify-center">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Floating Level Badge */}
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full border border-primary/10 flex items-center gap-1">
          <Star size={10} className="text-orange-500 fill-orange-500" />
          <p className="text-[8px] font-black text-primary uppercase tracking-tighter">Bestseller</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 sm:p-8 flex-1 flex flex-col space-y-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 bg-primary/5 text-primary rounded text-[9px] font-bold uppercase tracking-widest border border-primary/10">
              {category}
            </span>
            <span className="w-1 h-1 bg-[var(--text-muted)] rounded-full opacity-30" />
            <span className="text-[var(--text-muted)] text-[9px] font-bold uppercase tracking-widest">In Stock</span>
          </div>
          <h3 className="text-xl font-bold text-[var(--text-main)] font-display leading-tight group-hover:text-primary transition-colors">
            {name}
          </h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-end gap-3">
            <span className="text-2xl font-black text-[var(--text-main)] font-display tracking-tight">${price}</span>
            <span className="text-[var(--text-muted)] line-through text-xs font-medium mb-1">${(parseFloat(price.replace(/,/g, '')) * 1.4).toFixed(0)}</span>
          </div>

          <div className="flex gap-3 pt-2">
            <button className="flex-1 py-3.5 rounded-2xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-main)] font-bold text-xs transition-all active:scale-95">
              Explore
            </button>
            <button 
              onClick={addToCart}
              className="flex-[1.5] py-3.5 rounded-2xl bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <ShoppingCart size={14} /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function ProductGrid({ setCartItems, setActiveCategory }) {
  const products = [
    { image: prodDrone, name: 'Swift-Blade Z1', category: 'Racing Drone', price: '899' },
    { image: prodCar, name: 'Titan-Rover X', category: 'All-Terrain', price: '1249' },
    { image: prodMotor, name: 'Vortex Core M1', category: 'Propulsion', price: '299' },
    { image: prodKit, name: 'Bison-Part Kit', category: 'Customization', price: '149' },
  ];

  return (
    <section className="relative w-full bg-[var(--bg-primary)] py-32 px-6 transition-colors duration-400">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold font-display text-[var(--text-main)] mb-6"
          >
            The <span className="text-primary italic">Bisonix</span> Collection
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-[var(--text-muted)] max-w-xl mx-auto text-lg"
          >
            Explore our curated selection of high-performance robotics and precision-engineered modules. Built for speed, durability, and total control.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {products.map((product, i) => (
            <ProductCard 
              key={i} 
              {...product} 
              delay={i * 0.1} 
              setCartItems={setCartItems}
            />
          ))}
        </div>

        <div className="mt-20 text-center">
          <motion.button 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            onClick={() => setActiveCategory('Robo Toys')}
            className="px-12 py-5 rounded-2xl border border-[var(--border-subtle)] text-[var(--text-main)] font-bold hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
          >
            Browse Full Collection
          </motion.button>
        </div>
      </div>
    </section>
  );
}
