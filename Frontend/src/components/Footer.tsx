import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Smartphone, SquarePlay, SquareCode, X, Target, Users, Zap, Shield } from 'lucide-react';
import logo from '../assets/logo.png';

export default function Footer() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  const toggleAbout = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAboutOpen(!isAboutOpen);
  };

  return (
    <footer className="relative w-full bg-[var(--bg-primary)] border-t border-[var(--border-subtle)] pt-24 pb-12 px-6 overflow-hidden transition-colors duration-400">
      {/* Background Gradient */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          {/* Brand Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img src={logo} alt="Bisonix Logo" className="h-12 w-auto" />
            </div>
            <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-8 max-w-xs">
              Engineering the next generation of autonomous robotics. Redefining speed, control, and precision for enthusiasts and professionals.
            </p>
            <div className="flex gap-4">
              {[Globe, Smartphone, SquarePlay, SquareCode].map((Icon, i) => (
                <motion.a 
                  key={i}
                  href="#"
                  whileHover={{ y: -5, color: '#FF6A00' }}
                  className="w-10 h-10 rounded-xl bg-[var(--text-main)]/5 flex items-center justify-center text-[var(--text-muted)] transition-colors border border-[var(--border-subtle)]"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[var(--text-main)] font-bold font-display mb-6">Ecosystem</h4>
            <ul className="space-y-4">
              {['Drones', 'RC Vehicles', '3D Models', 'Software', 'Accessories'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-[var(--text-muted)] text-sm hover:text-primary transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[var(--text-main)] font-bold font-display mb-6">Company</h4>
            <ul className="space-y-4">
              <li>
                <a href="#about" onClick={toggleAbout} className="text-[var(--text-muted)] text-sm hover:text-primary transition-colors">About Us</a>
              </li>
              {['Technology', 'Sustainability', 'Careers', 'Contact'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-[var(--text-muted)] text-sm hover:text-primary transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-[var(--text-main)] font-bold font-display mb-6">Join the Future</h4>
            <p className="text-[var(--text-muted)] text-sm mb-6 leading-relaxed">
              Subscribe for early access to new releases and technical updates.
            </p>
            <div className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="email@example.com" 
                className="w-full bg-[var(--text-main)]/5 border border-[var(--border-subtle)] rounded-xl py-3 px-4 text-[var(--text-main)] text-sm focus:outline-none focus:border-primary transition-colors"
              />
              <button className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[var(--border-subtle)] pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[var(--text-muted)] text-xs">
            © {currentYear} Bisonix Robotics Ecosystem. All rights reserved.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-[var(--text-muted)] text-xs hover:text-[var(--text-main)] transition-colors">Privacy Policy</a>
            <a href="#" className="text-[var(--text-muted)] text-xs hover:text-[var(--text-main)] transition-colors">Terms of Service</a>
            <a href="#" className="text-[var(--text-muted)] text-xs hover:text-[var(--text-main)] transition-colors">Cookies</a>
          </div>
        </div>
      </div>

      {/* About Section Overlay */}
      <AnimatePresence>
        {isAboutOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[var(--bg-primary)] overflow-y-auto px-6 md:px-12"
          >
            {/* Background Accent */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

            <button 
              onClick={() => setIsAboutOpen(false)}
              className="fixed top-6 right-6 md:top-8 md:right-8 w-12 h-12 rounded-full bg-[var(--text-main)]/10 backdrop-blur-md flex items-center justify-center text-[var(--text-main)] hover:bg-primary hover:text-white transition-all z-[110]"
            >
              <X size={24} />
            </button>

            <div className="max-w-4xl mx-auto w-full pt-24 pb-20 relative z-[105]">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="space-y-16"
              >
                <div className="text-center pt-8">
                  <span className="text-primary font-bold tracking-[0.4em] uppercase text-[10px] mb-6 block">Our Story</span>
                  <h2 className="text-5xl md:text-8xl font-black font-display text-[var(--text-main)] leading-[0.9] tracking-tighter">
                    Engineering <br /> the <span className="text-orange-500">Impossible.</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 pt-8 md:pt-12">
                  <div className="space-y-4 md:space-y-6">
                    <h3 className="text-xl md:text-2xl font-bold text-[var(--text-main)]">Who We Are</h3>
                    <p className="text-[var(--text-muted)] leading-relaxed text-base md:text-lg">
                      Founded in 2024, Bisonix was born out of a passion for pushing the boundaries of what's possible in the world of autonomous robotics. We specialize in high-performance drones and intelligent vehicles.
                    </p>
                  </div>
                  <div className="space-y-4 md:space-y-6">
                    <h3 className="text-xl md:text-2xl font-bold text-[var(--text-main)]">Our Mission</h3>
                    <p className="text-[var(--text-muted)] leading-relaxed text-base md:text-lg">
                      To empower enthusiasts and professionals with cutting-edge technology that bridges the gap between hardware precision and artificial intelligence.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 pt-8 md:pt-12">
                  {[
                    { icon: Target, label: 'Precision', value: '0.001s' },
                    { icon: Users, label: 'Engineers', value: '50+' },
                    { icon: Zap, label: 'Performance', value: '100%' },
                    { icon: Shield, label: 'Security', value: 'Triple' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-[var(--bg-secondary)] p-6 rounded-3xl border border-[var(--border-subtle)] text-center">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                        <stat.icon size={20} />
                      </div>
                      <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                      <p className="text-[var(--text-main)] text-xl font-black">{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-12 text-center">
                  <button 
                    onClick={() => setIsAboutOpen(false)}
                    className="px-12 py-5 bg-primary text-white font-bold rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-primary/20"
                  >
                    Back to Ecosystem
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
