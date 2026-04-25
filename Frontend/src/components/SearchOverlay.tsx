import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, ArrowRight, TrendingUp } from 'lucide-react';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const suggestions = [
    'Spectra-X Flagship',
    'AI Autonomous Rover',
    '3D Printable Drone Parts',
    'Titan Series RC'
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-[var(--bg-primary)]/95 backdrop-blur-xl flex flex-col items-center pt-[15vh] px-6 transition-colors duration-400"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 p-3 hover:bg-[var(--text-main)]/5 rounded-full transition-colors text-[var(--text-muted)] hover:text-[var(--text-main)]"
          >
            <X size={32} />
          </button>

          <div className="w-full max-w-3xl space-y-12">
            {/* Search Input Container */}
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-primary transition-colors" size={32} />
              <input 
                autoFocus
                type="text" 
                placeholder="Search for drones, RC cars, or 3D models..."
                className="w-full bg-[var(--bg-secondary)] border-2 border-[var(--border-subtle)] focus:border-primary px-20 py-8 rounded-3xl text-2xl font-medium text-[var(--text-main)] placeholder-[var(--text-muted)] outline-none transition-all shadow-2xl focus:shadow-primary/10"
              />
              <button className="absolute right-6 top-1/2 -translate-y-1/2 bg-primary p-3 rounded-2xl text-white hover:bg-orange-600 transition-colors shadow-lg shadow-primary/20">
                <ArrowRight size={24} />
              </button>
            </div>

            {/* Suggestions */}
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="text-[var(--text-muted)] text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp size={16} className="text-primary" />
                  Trending Searches
                </h3>
                <div className="space-y-3">
                  {suggestions.map((item) => (
                    <button 
                      key={item}
                      className="w-full text-left p-4 rounded-2xl hover:bg-[var(--text-main)]/5 text-[var(--text-main)] font-semibold transition-all hover:translate-x-2 flex justify-between items-center group"
                    >
                      {item}
                      <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-[var(--text-muted)] text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                  Quick Links
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {['New Arrivals', 'Best Sellers', 'Support', 'Custom Builds'].map((link) => (
                    <button key={link} className="p-6 rounded-2xl border border-[var(--border-subtle)] hover:border-primary hover:bg-primary/5 text-[var(--text-main)] font-bold text-center transition-all">
                      {link}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
