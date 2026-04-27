import { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { motion } from 'framer-motion';
import { ChevronRight, Zap, Battery, Cpu, Radio, Scale, ShieldCheck, Box } from 'lucide-react';

interface CompareViewProps {
  onBack: () => void;
}

export default function CompareView({ onBack }: CompareViewProps) {
  const [battle, setBattle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBattle = async () => {
      try {
        const res = await fetch(`${API_URL}/api/battle`);
        const data = await res.json();
        if (res.ok) setBattle(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBattle();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!battle || !battle.product1 || !battle.product2) return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-32 px-8">
       <button onClick={onBack} className="text-primary font-bold mb-8 flex items-center gap-2"><ChevronRight size={16} className="rotate-180" /> Back</button>
       <div className="text-center py-20">
         <Box size={64} className="mx-auto text-[var(--text-muted)] opacity-20 mb-6" />
         <h2 className="text-2xl font-bold text-[var(--text-main)] mb-2">No Battle Scheduled</h2>
         <p className="text-[var(--text-muted)]">Check back later for new product comparisons.</p>
       </div>
    </div>
  );

  const products = [battle.product1, battle.product2];

  const specItems = [
    { label: 'Max Velocity', icon: <Zap size={14} />, key: 'speed' },
    { label: 'Endurance', icon: <Battery size={14} />, key: 'battery' },
    { label: 'Neural Core', icon: <Cpu size={14} />, key: 'cpu' },
    { label: 'Signal Range', icon: <Radio size={14} />, key: 'range' },
    { label: 'Payload Weight', icon: <Scale size={14} />, key: 'weight' },
    { label: 'AI Autonomy', icon: <ShieldCheck size={14} />, key: 'ai' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-20 px-4 sm:px-8 transition-colors duration-400"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm mb-8">
          <button onClick={onBack} className="hover:text-primary transition-colors flex items-center gap-1">
            Home
          </button>
          <ChevronRight size={12} />
          <span className="text-[var(--text-main)] font-bold">Comparison Tool</span>
        </div>

        <div className="mb-10">
          <h1 className="text-3xl md:text-5xl font-black font-display text-[var(--text-main)] mb-2 tracking-tighter leading-none">
            Battle of the <span className="text-primary italic">Bots</span>.
          </h1>
          <p className="text-[var(--text-muted)] text-sm max-w-xl">
            Side-by-side technical specification breakdown of our flagship models.
          </p>
        </div>

        <div className="overflow-x-auto pb-8">
          <div className="min-w-[800px] grid grid-cols-3 gap-6">
            {/* Specs Header */}
            <div className="pt-[200px] space-y-12 pr-8 border-r border-[var(--border-subtle)]">
              {specItems.map((spec, i) => (
                <div key={i} className="flex items-center gap-3 text-[var(--text-muted)] font-bold uppercase tracking-widest text-[10px]">
                  <div className="w-8 h-8 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center border border-[var(--border-subtle)]">
                    {spec.icon}
                  </div>
                  {spec.label}
                </div>
              ))}
            </div>

            {/* Products */}
            {products.map((product, idx) => (
              <motion.div 
                key={product._id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                className={`bg-[var(--bg-secondary)] border ${idx === 0 ? 'border-primary/20' : 'border-[var(--border-subtle)]'} rounded-[3rem] p-8 flex flex-col items-center`}
              >
                <div className="aspect-square w-48 rounded-2xl overflow-hidden mb-6 shadow-2xl bg-[var(--bg-primary)]">
                  <img src={product.images?.[0] || ''} className="w-full h-full object-cover" alt={product.name} />
                </div>
                <h3 className="text-2xl font-black text-[var(--text-main)] font-display mb-2 text-center">{product.name}</h3>
                <p className="text-primary font-bold text-xs mb-8">₹{product.price.toLocaleString()}</p>
                
                <div className="w-full space-y-12">
                  {specItems.map((item, i) => (
                    <div key={i} className="text-center font-bold text-[var(--text-main)] text-sm py-1">
                      {product.specs?.[item.key] || '---'}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
