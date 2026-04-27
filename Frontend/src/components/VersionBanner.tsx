import { motion } from 'framer-motion';

export default function VersionBanner() {
  return (
    <section className="relative py-24 px-6 overflow-hidden bg-[var(--bg-primary)]">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <span className="text-primary font-bold tracking-[0.4em] uppercase text-xs">Innovation Unleashed</span>
          
          <h2 className="text-6xl md:text-9xl font-black font-display text-[var(--text-main)] leading-none tracking-tighter">
            THE ROBOT <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-primary">
              VERSION-1.O
            </span>
          </h2>

          <div className="pt-12">
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-px w-32 bg-primary/30 mx-auto mb-8" 
            />
            <p className="text-3xl md:text-5xl font-bold font-display text-[var(--text-main)]/80 tracking-widest uppercase italic">
              BISONIX-1.O
            </p>
          </div>

          <p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto font-medium leading-relaxed pt-8">
            Defining the new standard in autonomous intelligence. Precision engineered for the creators of tomorrow.
          </p>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-10 text-[10vw] font-black text-white/5 select-none">1.O</div>
        <div className="absolute bottom-1/4 right-10 text-[10vw] font-black text-white/5 select-none">BISONIX</div>
      </div>
    </section>
  );
}
