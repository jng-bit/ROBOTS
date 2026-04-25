import { motion } from 'framer-motion';
import { Cpu, Zap, Radio, Shield, Database, Cloud } from 'lucide-react';

const TechCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-8 rounded-[2rem] hover:border-primary/30 transition-all duration-300 group"
  >
    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
      <Icon size={28} />
    </div>
    <h3 className="text-xl font-bold text-[var(--text-main)] mb-3 font-display">{title}</h3>
    <p className="text-[var(--text-muted)] text-sm leading-relaxed">{description}</p>
  </motion.div>
);

export default function TechStack() {
  return (
    <section className="relative w-full bg-[var(--bg-primary)] py-32 px-6 overflow-hidden transition-colors duration-400">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-primary font-bold tracking-[0.2em] uppercase text-xs mb-4 block"
            >
              The Core Architecture
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold font-display text-[var(--text-main)] leading-tight"
            >
              Precision <span className="text-primary">Neural</span> Architecture
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[var(--text-muted)] max-w-sm text-sm leading-relaxed mb-4"
          >
            Our ecosystem is built on a custom-designed neural architecture that bridges the gap between software precision and hardware performance.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TechCard 
            icon={Cpu} 
            title="Bisonix-Core v2" 
            description="Custom 5nm silicon designed for real-time robotic kinematics and neural processing at the edge."
            delay={0.1}
          />
          <TechCard 
            icon={Radio} 
            title="Mesh-Link Protocol" 
            description="Ultra-low latency communication protocol for synchronized swarm operations and remote control."
            delay={0.2}
          />
          <TechCard 
            icon={Shield} 
            title="Fail-Safe Systems" 
            description="Triple-redundant sensor arrays and hardware-level security to prevent interference and data loss."
            delay={0.3}
          />
          <TechCard 
            icon={Database} 
            title="Neural Training" 
            description="Continuously evolving AI models trained on millions of flight hours for superior navigation."
            delay={0.4}
          />
          <TechCard 
            icon={Cloud} 
            title="Cloud Integration" 
            description="Real-time data logging and OTA updates to keep your hardware at the cutting edge."
            delay={0.5}
          />
          <TechCard 
            icon={Zap} 
            title="Rapid Response" 
            description="High-frequency motor controllers reacting at 0.001s to maintain stability in any condition."
            delay={0.6}
          />
        </div>
      </div>
    </section>
  );
}
