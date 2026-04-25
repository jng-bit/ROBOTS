import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import herosectionImage from '../assets/herosection.png';

export default function Hero() {

  return (
    <section className="relative min-h-screen pt-24 pb-10 flex flex-col items-center justify-start overflow-hidden">
      
      {/* CURVED BACKGROUND */}
      <div className="absolute top-0 left-0 w-full h-[55vh] sm:h-[60vh] bg-[var(--bg-secondary)] z-10 transition-colors duration-400">
        <svg 
          className="absolute top-full left-0 w-full h-12 sm:h-20 md:h-28 lg:h-36 -mt-[1px] text-[var(--bg-secondary)] transition-colors duration-400" 
          viewBox="0 0 1440 100" 
          preserveAspectRatio="none"
        >
          <path fill="currentColor" d="M0,0 Q720,100 1440,0 Z" />
        </svg>
      </div>

      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Content Container */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 text-center mt-4">
        
        {/* Main Heading */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="font-sans text-4xl sm:text-6xl md:text-[5.5rem] font-bold tracking-tight leading-[1.1] mb-6 text-[var(--text-main)]"
        >
          Next-Gen Robotics Ecosystem <br />
          <span className="text-primary">
            The Future is Here.
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="max-w-2xl mx-auto text-[var(--text-muted)] text-sm sm:text-base md:text-lg font-normal mb-8 leading-relaxed"
        >
          Experience <span className="font-medium">high-performance drones</span>, <span className="font-medium">AI-powered RC cars</span>, and premium 3D models engineered for enthusiasts and professionals.
        </motion.p>

        {/* CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-6"
        >
          <button className="w-full sm:w-auto px-6 py-3 rounded-full bg-[var(--text-main)]/5 hover:bg-[var(--text-main)]/10 text-[var(--text-main)] font-medium text-sm sm:text-base transition-colors flex items-center justify-center cursor-none border border-[var(--text-main)]/10">
            Watch Video
          </button>
          
          <button className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-primary to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-medium text-sm sm:text-base transition-colors shadow-[0_4px_14px_0_rgba(255,106,0,0.39)] flex items-center justify-center gap-2 cursor-none">
            Explore Collection
            <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>

      {/* End Content Container */}

      {/* Hero Image */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        className="relative z-0 w-full max-w-[1920px] mx-auto mt-12 sm:mt-20 px-4 sm:px-8 pb-20"
      >
        <div className="relative w-full rounded-2xl sm:rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] border border-white/10 group">
          <img 
            src={herosectionImage} 
            alt="Bisonix Platform" 
            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        </div>
      </motion.div>

    </section>
  );
}
